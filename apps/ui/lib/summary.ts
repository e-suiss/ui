import { strings } from "@/lib/strings"

const kinds: Record<string, string> = {
  Component: "component",
  Pattern: "pattern",
  Interaction: "interaction",
  Chart: "chart",
  Block: "block",
}

const platformNames: Record<string, string> = {
  web: "React",
  rn: "React Native",
  swift: "SwiftUI",
  kotlin: "Jetpack Compose",
}

function list(items: string[]) {
  if (items.length < 2) return items.join("")
  return `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`
}

export function pageSummary(
  title: string,
  eyebrow: string | undefined,
  platforms: string[] = []
) {
  const kind = eyebrow ? kinds[eyebrow] : undefined
  if (!kind) return undefined
  const names = platforms
    .map((platform) => platformNames[platform])
    .filter(Boolean)
  const target = names.length ? ` for ${list(names)}` : ""
  return `${title} is an open-source ${kind} from suiss/ui${target}. The @esuiss/ui CLI copies its source into your project, so you own the code.`
}

const MAX_TITLE = 60
const CHART_TITLE = /^(.+ Chart)(?: (.+))?$/

const titleKinds: Record<string, string> = {
  Component: "Component",
  Pattern: "Pattern",
  Interaction: "Interaction",
  Block: "Block",
  AI: "Component",
}

function platformLabel(platforms: string[]) {
  const set = new Set(platforms)
  const mobile = set.has("rn") && set.has("swift") && set.has("kotlin")
  if (set.has("web") && mobile) return "React, SwiftUI & Compose"
  if (mobile) return "React Native, SwiftUI & Compose"
  if (set.size === 1 && set.has("web")) return "React"
  return undefined
}

function fit(candidates: string[]) {
  return (
    candidates.find((title) => title.length <= MAX_TITLE) ??
    candidates.at(-1) ??
    ""
  )
}

export function pageTitle(
  title: string,
  eyebrow: string | undefined,
  platforms: string[] = [],
  seoTitle?: string
) {
  const brand = ` – ${strings.brand}`
  if (seoTitle) return fit([`${seoTitle}${brand}`, seoTitle])
  const target = platformLabel(platforms)
  if (!eyebrow || !target) return `${title}${brand}`

  const name = eyebrow === "AI" ? `AI ${title}` : title
  const chart = eyebrow === "Chart" ? title.match(CHART_TITLE) : null

  let heads: string[]
  if (chart) {
    const [, base, variant] = chart
    heads = !variant || variant === "Default" ? [base] : [`${variant} ${base}`]
  } else {
    const kind = titleKinds[eyebrow]
    heads = kind ? [`${name} ${kind}`, name] : [name]
  }

  const candidates =
    target === "React"
      ? heads.flatMap((head) => [`React ${head}${brand}`, `React ${head}`])
      : heads.flatMap((head) => [
          `${head} for ${target}${brand}`,
          `${head} for ${target}`,
        ])
  return fit(candidates)
}
