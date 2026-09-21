import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "cn"

const REPO = "effortprogrammer/geojirouter"
const REPO_URL = `https://github.com/${REPO}`

/** 마지막으로 확인한 실제 스타 수. API 가 막히면 이 값으로 그린다. */
const STARS_FALLBACK = 1

function formatStars(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)
}

/**
 * 스타 수는 GitHub 에서 직접 읽어온다. 실패하면 마지막으로 확인한 값을 쓴다.
 * 숫자를 하드코딩하면 금방 거짓말이 된다.
 */
function useStarCount() {
  const [stars, setStars] = useState(STARS_FALLBACK)

  useEffect(() => {
    const controller = new AbortController()
    fetch(`https://api.github.com/repos/${REPO}`, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (typeof data?.stargazers_count === "number") setStars(data.stargazers_count)
      })
      .catch(() => {
        // 레이트리밋이나 오프라인 — fallback 으로 그대로 둔다
      })
    return () => controller.abort()
  }, [])

  return stars
}

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.31.678.921.678 1.856 0 1.339-.012 2.419-.012 2.748 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
  </svg>
)

const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path
      clipRule="evenodd"
      fillRule="evenodd"
      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
    />
  </svg>
)

/**
 * 레인보우 테두리 GitHub 버튼.
 * 세 겹 그라데이션(안쪽 단색 / 상단 하이라이트 / 무지개)을 border-box 에 겹쳐서
 * 테두리만 무지개로 흐르게 하고, before 로 아래쪽에 같은 색 글로우를 깐다.
 */
export default function StarOnGithub({ className }: { className?: string }) {
  const stars = useStarCount()

  return (
    <Button
      nativeButton={false}
      render={<a href={REPO_URL} target="_blank" rel="noreferrer noopener" />}
      aria-label={`GitHub 에서 거지라우터 보기 — 스타 ${stars}개`}
      className={cn(
        "animate-rainbow before:animate-rainbow group relative inline-flex h-10 cursor-pointer items-center justify-center gap-0 rounded-md border-0 px-4 py-2 text-sm font-medium whitespace-nowrap text-white no-underline",
        "bg-[linear-gradient(#121213,#121213),linear-gradient(#121213_50%,rgba(18,18,19,0.6)_80%,rgba(18,18,19,0)),linear-gradient(90deg,hsl(0,100%,63%),hsl(90,100%,63%),hsl(210,100%,63%),hsl(195,100%,63%),hsl(270,100%,63%))]",
        "bg-[length:200%] [background-clip:padding-box,border-box,border-box] [background-origin:border-box] [border:calc(0.08*1rem)_solid_transparent]",
        "before:absolute before:bottom-[-20%] before:left-1/2 before:z-0 before:h-[20%] before:w-[60%] before:-translate-x-1/2 before:bg-[linear-gradient(90deg,hsl(0,100%,63%),hsl(90,100%,63%),hsl(210,100%,63%),hsl(195,100%,63%),hsl(270,100%,63%))] before:bg-[length:200%] before:[filter:blur(calc(0.8*1rem))]",
        "transition-transform duration-200 hover:scale-105 active:scale-95",
        className
      )}
    >
      <span className="flex items-center gap-1.5">
        <GithubIcon className="size-4" />
        <span>GitHub</span>
      </span>
      <span className="ml-2.5 flex items-center gap-1">
        <StarIcon className="size-3.5 text-white/45 transition-colors duration-200 group-hover:text-yellow-300" />
        <span className="display text-[13px] font-medium tracking-wider tabular-nums">
          {formatStars(stars)}
        </span>
      </span>
    </Button>
  )
}

export { REPO_URL }
