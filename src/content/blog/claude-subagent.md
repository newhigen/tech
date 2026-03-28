---
title: "Claude Code Subagent: 병렬 작업과 컨텍스트 분리"
description: Claude Code의 Subagent 기능으로 독립적인 작업을 병렬 실행하고 메인 컨텍스트를 보호하는 방법
pubDate: 2024-03-26
category: Agent
tags: [claude, subagent, parallel]
---

Claude Code에서 복잡한 작업을 할 때, Subagent를 활용하면 두 가지 이점이 생긴다.

## 1. 병렬 실행

독립적인 작업은 동시에 실행할 수 있다.

```
# 이렇게 하면 순차 실행 (느림)
1. 파일 A 분석
2. 파일 B 분석
3. 결과 합산

# 이렇게 하면 병렬 실행 (빠름)
[Agent A: 파일 A 분석] + [Agent B: 파일 B 분석] → 결과 합산
```

## 2. 컨텍스트 격리

대규모 코드베이스 탐색, 로그 분석, 외부 API 호출 등 컨텍스트를 많이 소비하는 작업을 Subagent에 위임하면 메인 대화의 컨텍스트 윈도우를 아낄 수 있다.

## 언제 쓰면 좋은가

- 서로 다른 파일/디렉토리를 독립적으로 조사할 때
- 여러 외부 소스를 동시에 검색할 때
- 메인 작업에 영향 없이 실험적인 변경을 시도할 때 (worktree 모드)

Subagent는 별도의 컨텍스트에서 실행되어 결과만 메인으로 반환한다.
