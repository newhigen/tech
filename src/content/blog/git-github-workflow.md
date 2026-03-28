---
title: "Git/GitHub 워크플로우: 의도 단위로 커밋하기"
description: 커밋 메시지와 PR 단위를 의도 중심으로 구성하는 실용적인 Git 워크플로우
pubDate: 2024-03-25
category: Software Engineering
tags: [git, github, workflow]
---

좋은 커밋은 코드의 변경이 아니라 **의도**를 기록한다.

## 커밋 단위

한 커밋에는 하나의 의도만 담는다.

```bash
# 나쁜 예
git commit -m "fix stuff and add feature and update deps"

# 좋은 예
git commit -m "fix: null 체크 누락으로 인한 로그인 실패 수정"
git commit -m "feat: 소셜 로그인 추가"
git commit -m "chore: axios 1.6으로 업그레이드"
```

### 커밋 타입

`fix`, `feat`, `refactor`, `chore`, `docs`, `test` 정도면 충분하다. 너무 많은 타입을 두면 오히려 혼란스럽다.

### 커밋 메시지 구조

```
<type>: <제목> (50자 이내)

<본문> — 무엇을, 왜 변경했는지 (선택)
```

제목은 명령형으로 쓴다. "수정한다", "추가한다" 가 아니라 "수정", "추가".

## 브랜치 전략

- `main` — 항상 배포 가능한 상태
- `feat/*`, `fix/*` — 작업 브랜치, 로컬에서 자유롭게 커밋
- PR → **Squash and Merge** — 작업 브랜치의 잡다한 커밋을 하나로 정리

### 브랜치 네이밍

```bash
feat/social-login
fix/login-null-check
refactor/auth-middleware
```

의도가 명확하게 드러나야 한다.

## PR 크기

PR 하나는 리뷰어가 30분 안에 이해할 수 있어야 한다. 기능이 크다면 마일스톤 단위로 쪼갠다.

### 언제 PR을 쪼갤까

- 파일 변경이 20개를 넘을 때
- 서로 다른 목적의 변경이 섞여 있을 때
- 리뷰어가 컨텍스트를 파악하는 데 오래 걸릴 때

## 로컬 커밋 vs 원격 Push

로컬에서는 `WIP`, `fix typo` 같은 작은 커밋을 자유롭게 만들어도 된다. 원격으로 Push하기 전에 `rebase -i`로 정리하거나, PR에서 Squash Merge로 합친다.

```bash
# 마지막 3개 커밋을 하나로 합치기
git rebase -i HEAD~3
```

PR을 squash merge하면 feature 브랜치의 모든 커밋이 main에서 하나로 보인다.
