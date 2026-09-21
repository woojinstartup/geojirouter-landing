# 거지라우터 — 랜딩 페이지

[거지라우터](https://github.com/effortprogrammer/geojirouter)의 소개 페이지입니다.
배포: **https://geojirouter.vercel.app**

거지라우터는 무료로 쓸 수 있는 AI 경로를 모아 하나의 OpenAI 호환 API로 묶어주는
로컬 게이트웨이입니다. 이 저장소에는 그 소개 페이지만 들어 있습니다.
게이트웨이 본체는 [effortprogrammer/geojirouter](https://github.com/effortprogrammer/geojirouter)에 있습니다.

## 스택

- Vite + React 19 + TypeScript
- Tailwind CSS v4
- shadcn/ui (`base-nova` 스타일, `@base-ui/react` 기반)
- [dither-kit](./src/components/dither-kit) — 1비트 디더 그라데이션
- MagicUI IconCloud
- Gothic A1 / IBM Plex Sans KR / IBM Plex Mono (Google Fonts)

한국어 전용이고 다크 테마 하나만 씁니다.

## 개발

```sh
npm install
npm run dev       # http://localhost:5173
npm run build     # tsc -b && vite build
npm run preview
npm run lint      # oxlint
```

## 배포

Vercel에 붙어 있습니다.

```sh
vercel deploy --prod
```

`vercel.json`이 두 가지를 합니다.

- `/` 와 `/index.html`에 `s-maxage=0`을 걸어 엣지 캐시가 옛 HTML을 물고 있지 않게 합니다.
- `/i` 를 설치 스크립트(`install.sh`의 raw 주소)로 넘깁니다.
  덕분에 설치 한 줄이 `curl -fsSL https://geojirouter.vercel.app/i | sh` 로 짧아집니다.

## 구조

| 경로 | 설명 |
| --- | --- |
| `src/App.tsx` | 페이지 전체. 섹션 4개와 카피가 여기 다 있습니다. |
| `src/logos.ts` | 제공처 로고. 외부 요청 없이 SVG/PNG를 인라인으로 담고 있습니다. |
| `src/index.css` | 디자인 토큰, 디더 마크, 레인보우 테두리 애니메이션 |
| `src/components/ui` | shadcn 컴포넌트 + GitHub 버튼 |
| `src/components/dither-kit` | 디더 렌더러 |

## 라이선스

MIT
