---
title: 블로그 운영
description: Astro 기반 블로그 두 개를 직접 개발하고 운영한다. 글쓰기 블로그(sungd.uk)와 기술 블로그(tech.sungd.uk).
link: https://sungd.uk
github: https://github.com/newhigen/blog
tags: [Astro, GitHub Pages, Cloudflare, Obsidian, Claude]
period: "2025.07 –"
icon: "¶"
---

글쓰기 블로그 [sungd.uk](https://sungd.uk)와 기술 블로그 [tech.sungd.uk](https://tech.sungd.uk)를 각각 운영한다.

## 스택

두 블로그 모두 [Astro](https://astro.build)로 구성했다. Jekyll, Hugo, Notion, Obsidian Publish 등을 검토했으나 컴포넌트 단위 커스터마이징과 Claude Code와의 작업 흐름을 고려해 Astro를 선택했다.

- **글쓰기 블로그**: Cloudflare Pages 배포. 콘텐츠는 Obsidian에서 작성 후 Obsidian Sync로 동기화한다.
- **기술 블로그**: GitHub Pages 배포. 기술 포스팅과 프로젝트 소개.

코드 수정은 Claude Code로 처리한다.

## Obsidian 글쓰기 팁

### HTML 태그 단축키로 감싸기

`<mark>`나 `<sup>` 같은 HTML 태그를 자주 쓴다. 매번 직접 입력하는 것이 번거롭다. Templater 플러그인을 쓰면 텍스트를 선택하고 단축키 하나로 처리할 수 있다.

**1. Templater 설치**

Settings → Community plugins → Templater 설치 후 활성화

**2. 템플릿 폴더 지정**

Settings → Templater → Template folder location에 `Templates` 입력

**3. 템플릿 파일 생성**

`Templates/wrap-mark.md`
```
<%* tR += `<mark>${tp.file.selection()}</mark>` %>
```

`Templates/wrap-sup.md`
```
<%* tR += `<sup>${tp.file.selection()}</sup>` %>
```

**4. 단축키 지정**

Settings → Templater → Template Hotkeys → `+`
- `wrap-mark.md` → `⌘⇧M`
- `wrap-sup.md` → `⌘⇧U`

감싸고 싶은 텍스트를 드래그 → 단축키 → 완료. 다른 태그도 같은 방식으로 추가할 수 있다.
