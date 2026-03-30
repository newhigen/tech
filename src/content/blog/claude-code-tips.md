---
title: Claude Code 사용 팁
description: Claude Code를 더 효율적으로 사용하기 위한 터미널, 알림, 모바일 팁
pubDate: 2026-03-29
category: Agent
tags: [Claude]
---

## 터미널 설정

### cmux — 에이전트 친화적 터미널

Ghostty를 wrapping한 터미널이다. pane 분할이 편하고, 알림이 잘 되어서 에이전트 쓸 때 유용하다.

설정은 Ghostty 설정 파일(`~/.config/ghostty/config`)과 동일하게 사용한다.\n- [cmux 공식 사이트](https://cmux.com/)
- [GitHub](https://github.com/manaflow-ai/cmux)

<div style="border-bottom: 1px dashed var(--border);"></div>

## 알림 및 소리 설정

### peon-ping — 게임 캐릭터 음성 알림

Claude Code 알림은 뜨는데 소리가 없고 밋밋했다. **peon-ping**을 쓰면 게임 캐릭터 음성으로 이벤트를 알려준다.
- [peon-ping 공식 사이트](https://peonping.com/)
- [GitHub](https://github.com/PeonPing/peon-ping)

**설치**

```bash
brew install PeonPing/tap/peon-ping
peon-ping-setup
```

`peon-ping-setup`을 실행하면 Claude Code hook 등록과 사운드팩 다운로드가 자동으로 진행된다.

**SCV 팩으로 변경**

기본은 워크래프트 피온 음성이다.

```bash
peon-ping packs install sc_scv
peon-ping --pack sc_scv
```

**소리만 남기고 데스크탑 알림 끄기**

`~/.claude/hooks/peon-ping/config.json` 수정:

```json
{
  "active_pack": "sc_scv",
  "desktop_notifications": false
}
```

저장하면 바로 적용된다.

<div style="border-bottom: 1px dashed var(--border);"></div>

## 모바일에서 Claude Code 사용

### Remote Control — 모바일 연결

터미널에서 아래 명령어를 실행하면 모바일에서도 Claude Code를 사용할 수 있다. QR코드가 뜨고 Claude 앱으로 스캔하면 연결된다.
```bash
claude remote-control
```

슬립 모드가 되면 연결이 끊기는 점은 주의.

- [공식 문서](https://code.claude.com/docs/en/remote-control)
