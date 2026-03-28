---
title: "SKILL.md: Claude Code에 커스텀 스킬 추가하기"
description: SKILL.md를 활용해 Claude Code에 나만의 slash command를 등록하고 반복 작업을 자동화하는 방법
pubDate: 2024-03-27
category: Agent
tags: [claude, skill, automation]
---

Claude Code는 `SKILL.md` 파일을 통해 커스텀 슬래시 커맨드를 정의할 수 있다. 프로젝트 루트나 `~/.claude/` 아래에 배치하면 된다.

## 기본 구조

```markdown
# skills

## /deploy
프로덕션 배포 전 체크리스트를 실행하고 배포한다.

1. 테스트 실행
2. 빌드 확인
3. 스테이징 배포
4. 프로덕션 배포
```

## 왜 유용한가

반복적으로 설명해야 하는 컨텍스트를 한 번 정의해두면, `/deploy` 한 줄로 전체 플로우를 실행할 수 있다.

팀 공유도 가능하다. 프로젝트 루트의 `SKILL.md`를 git에 올리면 팀원 모두가 동일한 커맨드를 쓸 수 있다.

## 실제 예시

```markdown
## /review-pr
현재 브랜치의 변경사항을 리뷰하고 개선점을 제안한다.
- diff 분석
- 잠재적 버그 탐색
- 코드 품질 피드백
```

스킬은 단순한 프롬프트 템플릿이지만, 일관성과 생산성을 크게 높여준다.
