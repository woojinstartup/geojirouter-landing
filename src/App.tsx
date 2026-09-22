import { useEffect, useState } from "react"
import { DitherGradient } from "@/components/dither-kit"
import { LOGO, LOGO_IMG } from "@/logos"
import { IconCloud } from "@/components/ui/icon-cloud"
import StarOnGithub, { REPO_URL } from "@/components/ui/button-github"

/* ────────────────────────────────────────────────────────────
   거지라우터 — 무료 크레딧 주는 프로바이더를 전부 모아 돌려쓰는
   오픈소스 로컬 게이트웨이.
   ──────────────────────────────────────────────────────────── */

/** 크레딧이 나오는 곳 + 그걸 꽂아 쓰는 툴. ink 는 simple-icons 의 브랜드 hex. */
const PROVIDERS = [
  { name: "SambaNova", key: "sambanova", logo: "sambanova", ink: "#EE7624", kind: "provider", note: "가입 크레딧" },
  { name: "OpenRouter", key: "openrouter", logo: "openrouter", ink: "#94A3B8", kind: "provider", note: "무료 모델 다수" },
  { name: "Requesty", key: "requesty", logo: "requesty", ink: "#2F7BFF", kind: "provider", note: "가입 크레딧" },
  { name: "Groq", key: "groq", logo: "groq", ink: "#F43E01", kind: "provider", note: "일일 무료 한도" },
  { name: "Google Gemini", key: "gemini", logo: "gemini", ink: "#8E75B2", kind: "provider", note: "일일 무료 한도" },
  { name: "Cloudflare Workers AI", key: "cloudflare", logo: "cloudflare", ink: "#F38020", kind: "provider", note: "일일 뉴런 무료분" },
  { name: "Hugging Face", key: "hf", logo: "hf", ink: "#FFD21E", kind: "provider", note: "추론 무료분" },
  { name: "Vercel AI Gateway", key: "vercel", logo: "vercel", ink: "#FFFFFF", kind: "provider", note: "가입 크레딧" },
  { name: "NVIDIA NIM", key: "nim", logo: "nim", ink: "#76B900", kind: "provider", note: "가입 크레딧" },
  { name: "Freebuff", key: "freebuff", logo: "freebuff", ink: "#FFFFFF", kind: "provider", note: "무료 에이전트" },
  { name: "OpenCode", key: "opencode", logo: "opencode", ink: "#FFFFFF", kind: "tool", note: "터미널 에이전트" },
  { name: "Codex", key: "codex", logo: "codex", ink: "#FFFFFF", kind: "tool", note: "터미널 에이전트" },
  { name: "Cursor", key: "cursor", logo: "cursor", ink: "#FFFFFF", kind: "tool", note: "에디터" },
  { name: "Claude Code", key: "claudecode", logo: "claudecode", ink: "#D97757", kind: "tool", note: "터미널 에이전트" },
  { name: "Devin", key: "devin", logo: "devin", ink: "#0294DE", kind: "tool", note: "클라우드 에이전트" },
] as const

/** 에디터 신택스 컬러 — 역할별로 고정해서 세 블록이 같은 규칙으로 읽히게 한다. */
const TOK = {
  dim: "text-white/28",
  plain: "text-white/80",
  punc: "text-white/40",
  cmd: "text-[#FFCB6B]", // 실행 파일
  sub: "text-[#ECECEF]", // 서브커맨드
  flag: "text-[#F78C6C]", // 플래그
  ok: "text-[#C3E88D]", // 성공
  url: "text-[#89DDFF]", // URL
  kw: "text-[#C792EA]", // 키워드
  prop: "text-[#82AAFF]", // 속성명
  str: "text-[#C3E88D]", // 문자열
} as const

type Tok = readonly [string, keyof typeof TOK]
type CodeLine = readonly Tok[]

const STEPS: {
  n: string
  title: string
  body: readonly string[]
  code: readonly CodeLine[]
}[] = [
  {
    n: "01",
    title: "설치하고 실행하세요",
    body: ["로컬에서 OpenAI 호환 API가 바로 열립니다.", "별도 서버도 필요 없습니다."],
    code: [
      [
        ["$ ", "dim"],
        ["curl ", "cmd"],
        ["-fsSL ", "flag"],
        ["https://raw.githubusercontent.com/effortprogrammer/geojirouter/main/install.sh", "url"],
        [" | ", "punc"],
        ["bash", "sub"],
      ],
      [],
      [["거지라우터 실행 중", "dim"]],
      [["→ ", "dim"], ["http://localhost:4141/v1", "url"]],
    ],
  },
  {
    n: "02",
    title: "무료 API를 연결하세요",
    body: [
      "무료 티어를 제공하는 서비스의 API 키를 연결하면 거지라우터가 한곳에서 관리합니다.",
      "키는 내 컴퓨터에 저장됩니다.",
    ],
    code: [
      [["$ ", "dim"], ["geoji ", "cmd"], ["provider add ", "sub"], ["--provider ", "flag"], ["groq", "plain"]],
      [],
      [["✓ ", "ok"], ["Groq", "plain"], ["          연결됨", "dim"]],
      [["✓ ", "ok"], ["Google Gemini", "plain"], [" 연결됨", "dim"]],
      [["✓ ", "ok"], ["SambaNova", "plain"], ["     연결됨", "dim"]],
      [["  키는 로컬에 암호화 저장", "dim"]],
    ],
  },
  {
    n: "03",
    title: "쓰던 코드에 그대로 연결하세요",
    body: ["기존 OpenAI SDK를 쓰고 있다면 baseURL만 바꾸면 됩니다."],
    code: [
      [
        ["const ", "kw"],
        ["client", "plain"],
        [" = ", "punc"],
        ["new ", "kw"],
        ["OpenAI", "cmd"],
        ["({", "punc"],
      ],
      [["  baseURL", "prop"], [": ", "punc"], ['"http://localhost:4141/v1"', "str"], [",", "punc"]],
      [["  apiKey", "prop"], [": ", "punc"], ['"geoji"', "str"], [",", "punc"]],
      [["})", "punc"]],
    ],
  },
]

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#050506]/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center gap-4 px-5 py-3.5">
        <a href="#top" className="mr-auto flex items-center gap-2.5 no-underline">
          <Bucket />
          <span className="display text-[17px] tracking-tight">거지라우터</span>
        </a>
        <nav className="hidden items-center gap-1 sm:flex">
          <a href="#how" className="px-3 py-2 text-sm text-white/55 no-underline transition-colors hover:text-white">
            쓰는 법
          </a>
          <a href="#providers" className="px-3 py-2 text-sm text-white/55 no-underline transition-colors hover:text-white">
            프로바이더
          </a>
        </nav>
        <StarOnGithub className="h-8 px-3 text-[13px]" />
      </div>
    </header>
  )
}

function Bucket({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4.5 8.5h15l-1.6 11a2 2 0 0 1-2 1.7H8.1a2 2 0 0 1-2-1.7l-1.6-11Z" stroke="#ECECEF" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M3 8.5h18" stroke="#ECECEF" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12 6.4V2.8M8.4 6.9 6.6 3.8M15.6 6.9l1.8-3.1" stroke="#ECECEF" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function Terminal({ lines }: { lines: readonly CodeLine[] }) {
  return (
    <div className="mt-5 overflow-hidden rounded-lg border border-white/10 bg-black/70">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
        <span className="size-2 rounded-full bg-white/18" />
        <span className="size-2 rounded-full bg-white/18" />
        <span className="size-2 rounded-full bg-white/18" />
      </div>
      <pre className="mono px-4 py-3.5 text-[11.5px] leading-[1.9] break-all whitespace-pre-wrap">
        {lines.map((toks, i) => (
          <div key={i}>
            {toks.length === 0
              ? "\u00A0"
              : toks.map(([text, kind], j) => (
                  <span key={j} className={TOK[kind]}>
                    {text}
                  </span>
                ))}
          </div>
        ))}
      </pre>
    </div>
  )
}

/**
 * 로고를 1비트 디더로 찍는다. 체커 패턴을 깔고 로고 실루엣으로 오려낸다.
 * 벡터(멀티 path)와 래스터(알파 PNG) 둘 다 마스크로 쓸 수 있다.
 */
function DitherMark({
  logo,
  mark,
  ink = "#FFFFFF",
  size = 22,
}: {
  logo?: string
  mark?: string
  ink?: string
  size?: number
}) {
  const url = maskUrl(logo)
  if (url) {
    return (
      <span
        aria-hidden="true"
        className="dmark dmark--icon shrink-0"
        style={{ width: size, height: size, maskImage: url, WebkitMaskImage: url, ["--dink" as string]: ink }}
      />
    )
  }
  return (
    <span
      aria-hidden="true"
      className="dmark dmark--text display shrink-0 text-center"
      style={{ width: size, height: size, lineHeight: `${size}px`, fontSize: size * 0.95, ["--dink" as string]: ink }}
    >
      {mark}
    </span>
  )
}

/** 로고를 CSS mask 로 쓸 수 있는 URL 로. 벡터면 SVG, 아니면 알파 PNG 를 그대로. */
function maskUrl(logo?: string): string | undefined {
  if (!logo) return undefined
  if (LOGO[logo]) {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='#000'>${LOGO[logo]}</svg>`
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
  }
  if (LOGO_IMG[logo]) return `url("${LOGO_IMG[logo]}")`
  return undefined
}

/** 아이콘 클라우드 — 목록에 있는 15곳 그대로. CDN 안 타고 로컬 에셋을 쓴다. */
const svgIcon = (markup: string, ink: string) =>
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="${ink}">${markup}</svg>`
  )

const CLOUD = PROVIDERS.map((p) =>
  LOGO[p.logo] ? svgIcon(LOGO[p.logo], p.ink) : LOGO_IMG[p.logo]
)

/** 가입 부팅 시퀀스 — 히어로에서 한 줄씩 찍힌다. 크레딧이 나오는 곳만 돈다. */
const CREDIT_SOURCES = PROVIDERS.filter((p) => p.kind === "provider")

const BOOT: readonly CodeLine[] = [
  [["$ ", "dim"], ["geoji ", "cmd"], ["join ", "sub"], ["--all", "flag"]],
  [],
  ...CREDIT_SOURCES.map(
    (p): CodeLine => [
      ["✓ ", "ok"],
      [p.name.padEnd(23), "plain"],
      ["키 발급", "dim"],
    ]
  ),
  [],
  [["→ ", "dim"], ["http://localhost:4141/v1", "url"]],
  [[`  ${CREDIT_SOURCES.length}곳 중 ${CREDIT_SOURCES.length}곳 · 준비 완료`, "dim"]],
]

const STEP_MS = 260
const HOLD_MS = 4200

/**
 * 히어로 비주얼 — 가입이 실제로 돌아가는 화면.
 * 한 줄씩 찍히고, 다 차면 잠깐 머물렀다 처음부터 다시.
 */
const INSTALL = "curl -fsSL https://raw.githubusercontent.com/effortprogrammer/geojirouter/main/install.sh | bash"

/** 설치 한 줄 + 복사. 복사되면 버튼이 잠깐 체크로 바뀐다. */
function InstallCommand() {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const id = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(id)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL)
      setCopied(true)
    } catch {
      // 클립보드를 막아둔 브라우저 — 선택해서 직접 복사하면 된다
    }
  }

  return (
    <div className="mb-6 flex max-w-full items-center gap-3 rounded-lg border border-white/10 bg-black/50 py-2.5 pr-2 pl-4 sm:inline-flex">
      <span className="mono shrink-0 text-[13px] text-white/35">$</span>
      <span className="mono min-w-0 break-all text-[13px] leading-relaxed text-white/85">
        {INSTALL}
      </span>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "복사됨" : "설치 명령어 복사"}
        className="ml-1 flex size-7 items-center justify-center rounded-md text-white/40 transition-colors hover:bg-white/10 hover:text-white"
      >
        {copied ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m4 12.5 5 5L20 6.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="9" y="9" width="11" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.9" />
            <path d="M5.5 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
          </svg>
        )}
      </button>
    </div>
  )
}

function BootTerminal() {
  const [n, setN] = useState(0)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(BOOT.length)
      return
    }
    const done = n >= BOOT.length
    const id = setTimeout(() => setN(done ? 0 : n + 1), done ? HOLD_MS : STEP_MS)
    return () => clearTimeout(id)
  }, [n])

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/70">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-3.5 py-2.5">
        <span className="size-2 rounded-full bg-white/18" />
        <span className="size-2 rounded-full bg-white/18" />
        <span className="size-2 rounded-full bg-white/18" />
        <span className="mono ml-2 text-[10.5px] text-white/28">geoji — zsh</span>
      </div>

      {/* 줄이 늘어나도 카드가 안 흔들리게 높이를 고정한다 */}
      <pre className="mono min-h-[352px] overflow-x-auto px-4 py-3.5 text-[11.5px] leading-[1.9]">
        {BOOT.slice(0, n).map((toks, i) => (
          <div key={i}>
            {toks.length === 0
              ? "\u00A0"
              : toks.map(([text, kind], j) => (
                  <span key={j} className={TOK[kind]}>
                    {text}
                  </span>
                ))}
          </div>
        ))}
        {n < BOOT.length && <span className="caret" aria-hidden="true" />}
      </pre>
    </div>
  )
}

export default function App() {
  return (
    <div className="relative min-h-screen" id="top">
      <Nav />

      {/* ── 히어로 ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="relative mx-auto grid max-w-5xl grid-cols-1 items-center gap-14 px-5 pt-28 pb-16 sm:pt-36 sm:pb-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          {/* 카피 */}
          <div className="min-w-0">
            <p className="mono mb-6 text-[13px] text-white/45">쉬었음 청년들을 위한 모두의 게이트웨이</p>
            <h1 className="display mb-7 text-[clamp(2rem,4.8vw,3.15rem)]">AI에 돈 쓰지 마세요</h1>
            <div className="mb-8 max-w-[30em] space-y-4 text-[15px] leading-[1.8] text-white/65">
              <p>
                무료로 쓸 수 있는 AI는 많습니다.
                <br />
                거지라우터가 한곳에 모아줍니다.
              </p>
            </div>

            <InstallCommand />

            <div className="mb-6 flex flex-wrap gap-2.5">
              <a
                href={REPO_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex h-11 items-center justify-center rounded-md bg-white px-6 text-[14px] font-semibold text-[#050506] no-underline transition-colors hover:bg-white/88"
              >
                GitHub에서 받기
              </a>
              <a
                href="#how"
                className="inline-flex h-11 items-center rounded-md border border-white/20 px-6 text-[14px] font-semibold no-underline transition-colors hover:border-white/35 hover:bg-white/5"
              >
                쓰는 법 보기
              </a>
            </div>

          </div>

          {/* 라이브 게이트웨이 모니터 */}
          <BootTerminal />
        </div>
      </section>

      {/* ── 쓰는 법 ──────────────────────────────────────────── */}
      <section id="how" className="scroll-mt-20 border-t border-white/10">
        <div className="mx-auto max-w-5xl px-5 py-20 sm:py-24">
          <h2 className="display mb-4 text-[clamp(1.4rem,2.6vw,1.95rem)]">한 번 연결하면 끝입니다</h2>
          <div className="mb-12 max-w-[34em] space-y-3 text-[15px] text-white/60">
            <p>서비스마다 API 키를 따로 관리하고 남은 무료 한도를 일일이 확인할 필요 없습니다.</p>
            <p>거지라우터가 하나의 엔드포인트로 묶어줍니다.</p>
          </div>

          <div className="grid gap-12 md:grid-cols-3 md:gap-8">
            {STEPS.map((s) => (
              // min-w-0: 터미널 코드가 길어도 그리드 칸을 밀어내지 않게 한다
              <div key={s.n} className="min-w-0">
                <div className="mono mb-3 text-[12px] text-white/35">{s.n}</div>
                <h3 className="display mb-2 text-[1.0625rem]">{s.title}</h3>
                <div className="md:min-h-[5.5rem]">
                  {s.body.map((line) => (
                    <p key={line} className="mt-1.5 text-[14.5px] text-white/60 first:mt-0">
                      {line}
                    </p>
                  ))}
                </div>
                <Terminal lines={s.code} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 무엇이 물려 있나 ────────────────────────────────── */}
      <section id="providers" className="scroll-mt-20 border-t border-white/10">
        <div className="mx-auto max-w-5xl px-5 py-20 sm:py-24">

          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
            {/* 왼쪽: 붙어 있는 판 전체 */}
            <div className="relative mx-auto aspect-square w-full max-w-[380px]">
              <IconCloud images={CLOUD} showControl={false} />
            </div>

            {/* 오른쪽: 제목 + 설명 + 목록 */}
            <div>
              <h2 className="display mb-4 text-[clamp(1.4rem,2.6vw,1.95rem)]">
                무료 AI들을 한곳에 모았습니다
              </h2>
              <div className="mb-8 max-w-[30em] space-y-3 text-[15px] text-white/60">
                <p>무료 크레딧이나 무료 사용량을 제공하는 AI 서비스를 계속 찾아서 정리하고 있습니다.</p>
                <p>새로운 경로가 확인되면 계속 추가합니다.</p>
              </div>

              <ul className="m-0 grid list-none grid-cols-2 gap-x-8 gap-y-0 p-0">
                {PROVIDERS.map((p) => (
                  <li
                    key={p.key}
                    className="group flex items-center gap-2.5 border-b border-white/10 py-2.5"
                  >
                    <DitherMark
                      logo={p.logo}
                      ink={p.ink}
                      size={18}
                    />
                    <span className="truncate text-[13.5px]">{p.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 마무리 + 푸터 ────────────────────────────────────── */}
      <div className="relative overflow-hidden border-t border-white/10">
        <DitherGradient from="grey" to="transparent" direction="up" cell={6} opacity={0.16} bloom="off" />

        <section className="relative">
          <div className="mx-auto max-w-5xl px-5 py-14 sm:py-16">
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex h-11 items-center justify-center rounded-md bg-white px-6 text-[14px] font-semibold text-[#050506] no-underline transition-colors hover:bg-white/88"
            >
              GitHub에서 받기
            </a>
          </div>
        </section>

        <footer className="relative border-t border-white/10">
          <div className="mono mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-5 py-8 text-[11.5px] text-white/38">
            <span className="mr-auto flex items-center gap-2">
              <Bucket />
              거지라우터
            </span>
            <span>오픈소스</span>
            <span>컨셉 데모</span>
            <span>2026</span>
          </div>
        </footer>
      </div>
    </div>
  )
}
