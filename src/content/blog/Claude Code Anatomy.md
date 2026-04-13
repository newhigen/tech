---
title: Claude Code Anatomy
description: Claude Code 해부하기
pubDate: 2026-04-08
category: Agent
tags:
  - Claude
---

# 'How Claude Code Works' by Anthropic

Official Documentation by Anthropic: [How Claude Code works - Claude Code Docs](https://code.claude.com/docs/en/how-claude-code-works)
## Agentic Loop

3 Phases of Agentic Loop
1. Gather context
2. Take action
3. Verify results

Claude Code = Agentic harness around Claude
1. models: reason
2. tools: act

5 categories of built-in tools.
1. File operations
2. Search
3. Execution
4. Web
5. Code Intelligence (requires plugins)

Extend by skills, MCP, hooks, and subagents.

## Useful Commands

Resume or fork sessions
- `claude --continue` or `claude --resume`
	- full conversation history is restored, 
	  but session-scoped permissions should be reapproved.
- `claude --continue --fork-session`

The context window
- `/compact`: control what's preserved during compaction
	- e.g., `/compact focus on the API changes`
- `/context`: see what's using space
- `/mcp`: check per-server costs

# 'Claude Code 내부 아키텍처 분석' by aldente0630

Blog post by aldente0630 @ AWS
- [Claude Code 내부 아키텍처 분석](https://bits-bytes-nn.github.io/insights/agentic-ai/2026/03/31/claude-code-source-map-leak-analysis.html)
- Also one of the authors of 『데이터 과학자 원칙』

<!-- blog-hide-start -->
## 내용

### 소개
- Claude Code는 API wrapper 수준이 아니다.
- 오픈소스라고 했지만 과연 오픈소스일까?
	- 공식은 파일 279개, 유출은 4600개 이상.
	- 라이선스도 Apache 2.0이 아닌 Anthropic Commercial Terms of Service.
### 프레임워크

- 런타임 번들러는 Node.js가 아닌 Bun으로. 
	- Bun은 Anthropic이 작년 12월경 인수. [Anthropic acquires Bun as Claude Code reaches $1B milestone \ Anthropic](https://www.anthropic.com/news/anthropic-acquires-bun-as-claude-code-reaches-usd1b-milestone)
- 터미널의 복잡한 UI를 React + [Ink]([vadimdemedes/ink: 🌈 React for interactive command-line apps](https://github.com/vadimdemedes/ink))(React for CLI)로 구현.
### Agentic Loop: `query.ts`

- 설계: Async Generator
	- '스트리밍 이벤트 → 정상 종료 → 에러 전파' 흐름을 하나의 함수 시그니처로 표현.
- 패턴: Continue Site - 상태 관리 엄밀성
	- #1 상태 전이가 원자적(Atomic)
	- #2 왜 다음 턴으로 넘어갔는지를 기록 - `transition`
- 턴당 6단계 파이프라인.

### 1단계: Pre-Request Compaction

API를 호출하기 전에 대화 히스토리를 정리. **저렴한 것부터 순서대로.**

|     | Compression Mechanism |                                   |                                |
| --- | --------------------- | --------------------------------- | ------------------------------ |
| 1   | Tool Result Budget    | 도구 실행 결과 크기를 잘라내기.                |                                |
| 2   | Snip Compact          | 오래된 메세지를 통째로 잘라내기.                |                                |
| 3   | Microcompact          | 개별 도구 결과를 선택적으로 비우기. 프롬프트 캐시를 고려. |                                |
| 4   | Context Collapse      | 메세지 블록 단위로 단계적으로 축소된 뷰를 생성.       | 세밀한 Context를 최대한 보존하면서 비용을 아끼기 |
| 5   | Auto-Compact          | 전체 대화를 LLM으로 요약.                  |                                |
### 2단계: API Call & Streaming

- `StreamingToolExecutor`: Claude가 응답을 생성하는 동안 도구를 병렬로 실행. ⇒ 체감 대기시간 감소.
	- e.g., "파일을 읽어볼게요"라고 출력하면서 이미 파일을 읽고 있는 중.
- `isConcurrencySafe`: 실행 중인 도구와 새 도구 모두 동시 실행이 안전할 때만 허용.
- `sibling_error`: 함께 실행 중인 도구들도 취소.
- tombstone message: 도구를 호출했는데 결과가 없으면 히스토리가 꼬임. 빈자리를 채우기 위한 마커.
### 3단계: Error Recover Cascade

- Claude Code는 **저비용에서 고비용 순서**로 API 호출 실패의 복구를 시도.
- Cascade 설계 원익: **첫 번째 시도는 항상 무료(free)**. 비용-효과를 정밀하게 고려한 복구 전략.
- Prompt-tool-long Error
	- #1 Context Collapse (비용: 0)
	- #2 Reactive Compact: 전체 대화를 요약. (비용: API 1회 호출)
	- #3 에러 표출: 모든 시도 실패하면 에러.
- Max-output-tokens Error.
	- #1 토캔 캡 에스컬레이션. `8k` → `64k`. 사용자는 모름. (비용: 0)
	- #2 Resume 메세지 주입. (비용: API 재호출, 최대 3회): 
	- #3 복구 소진: 3회 시도해도 안되면 현재까지 결과로 완료.

### 4단계: Stop Hooks & Token Budget

- Stop hook는 사용자 정의 검증 로직을 실행.
- Token Budget은 **예산이 남아 있어도 진전이 없으면 멈추라는 로직**.
	- 기본적으로 예산의 90% 소진하기 전까지는 계속.
	- 하지만 감소 수직(diminishing returns) 감지: 3회 연속에도 매번 500 토큰도 생성 못하면 "이 이상의 시도는 의미 없다"고 판단하고 중단.

⇒ 무한 루프 방지

### 5단계: Tool 실행

- 2단계에서 시작된 스트리밍 모드와 배치 모드가 공존.
	- 여기서 `StreamingToolExecutor`가 병렬로 실행한 도구들을 결과를 수거하고 나머지 도구들을 순차 실행.
	- `progressAvailableResolve` 신호로 새 진행 상황 발생을 소비자에게 전달.

### 6단계: Post-Tool & 다음 턴 전이

- 다음 턴을 위한 여러 부가 작업을 처리.
- `prefetch` 패턴: 1단계(압축)에서 미리 시작한 느린 작업(스킬 목록 조회, 메모리 로드 등)을 여기 6단계에서 수거.

### 루프가 끝나는 9가지 이유

| 이유                  | 설명                          |
| ------------------- | --------------------------- |
| `completed`         | 정상 완료.                      |
| `blocking_limit`    | 토큰 한도 도달.                   |
| `aborted_streaming` | 스트리밍 중 사용자 중단. (`Ctrl + C`) |
| `aborted_tools`     | 도구 실행 중 사용자 중단.             |
| `prompt_too_long`   | 복구 시도 후에도 프롬프트 초과.          |
| `image_error`       | 이미지 실패. (e.g., 크기 초과)       |
| `model_error`       | 예상치 못한 모델 에러.               |
| `hook_stopped`      | Stop hook이 중단.              |
| `max_turns`         | 최대 턴수 초과. (`maxTurns`)      |
### `QueryEngine.ts`: 세션과 턴의 상위 관리자

- `query.ts`: "한 번의 사용자 입력 → Claude 응답 → 도구 실행 → 다시 Claude" 싸이클을 담당.
- `submitMessage()`로 사용자 입력을 받아 `query()`를 호출하고 결과를 세션에 축적. 턴들의 토큰 사용을 누적해서 세션의 비용을 추적.
- Transcript(대화 기록) 저장은 비대칭 전략으로. i.e., 모든 메세지는 우선순위가 다름. ⇒ **디스크 I/O 대시 시간을 절반 가까이 줄이면서 중요한 데이터는 확실히 보존.**
	- 사용자 메세지는 세션을 이어받을 때(`--resume`) 반드시 있어야하므로 디스크 기록 전까지 기다림.(`await`)
	- 어시스턴트 응답(모델이 생성한 응답)은 없어도 세션 복원이 가능하니 기다리지 않고 다름 작업을 진행.
<!-- blog-hide-end -->

## 개인적인 인상

- 비용 절감.
- 체감 대기시간 감소.
- 상호작용 컨트롤.
- 무한루프 방지.

## 관련 포스팅

- With Animation: [Claude Code Unpacked](https://ccunpacked.dev/)
- As Textbook: [Claude Code from Source — Architecture, Patterns & Internals](https://claude-code-from-source.com/)
	- [Prompt: Turn Any Codebase Into a Technical Book](https://github.com/alejandrobalderas/claude-code-from-source/blob/main/prompts/analyze-codebase-to-book.md)
- As Documentation: [별첨 91. 클로드 코드 소스 코드 분석서 - 클로드 코드 가이드](https://wikidocs.net/338204)
- Blog Post: [Claude Code's Entire Source Code Got Leaked via a Sourcemap in npm, Let's Talk About it](https://kuber.studio/blog/AI/Claude-Code%27s-Entire-Source-Code-Got-Leaked-via-a-Sourcemap-in-npm,-Let%27s-Talk-About-it#undercover-mode---do-not-blow-your-cover "https://kuber.studio/blog/ai/claude-code%27s-entire-source-code-got-leaked-via-a-sourcemap-in-npm,-let%27s-talk-about-it#undercover-mode---do-not-blow-your-cover")
- Blog Post: [Everyone Analyzed Claude Code’s Features. Nobody Analyzed Its Architecture. | by Han HELOIR YAN, Ph…](https://medium.com/data-science-collective/everyone-analyzed-claude-codes-features-nobody-analyzed-its-architecture-1173470ab622 "https://medium.com/data-science-collective/everyone-analyzed-claude-codes-features-nobody-analyzed-its-architecture-1173470ab622")


