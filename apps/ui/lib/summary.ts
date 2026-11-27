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

function platformLabels(platforms: string[]) {
  const set = new Set(platforms)
  const mobile = set.has("rn") && set.has("swift") && set.has("kotlin")
  if (set.has("web") && mobile)
    return [
      "React, React Native, SwiftUI & Compose",
      "React, SwiftUI & Compose",
    ]
  if (mobile) return ["React Native, SwiftUI & Compose"]
  if (set.size === 1 && set.has("web")) return ["React"]
  return []
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
  const targets = platformLabels(platforms)
  if (!eyebrow || targets.length === 0) return `${title}${brand}`

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

  const candidates = targets.flatMap((target) => {
    const titles = heads.map((head) =>
      target === "React" ? `React ${head}` : `${head} for ${target}`
    )
    return [...titles.map((head) => `${head}${brand}`), ...titles]
  })
  return fit(candidates)
}

const MAX_DESCRIPTION = 160

export function pageDescription(
  description: string,
  eyebrow: string | undefined,
  platforms: string[] = []
) {
  const kind = eyebrow === "AI" ? "component" : eyebrow && kinds[eyebrow]
  if (!kind) return description
  const names = platforms
    .map((platform) => platformNames[platform])
    .filter(Boolean)
  if (names.length === 0) return description
  const web = names.length === 1 && names[0] === "React"
  const targets = web
    ? ["React and Tailwind CSS", "React"]
    : [list(names), list(names.map((name) => name.replace("Jetpack ", "")))]
  const suffixes = [
    ...targets.map((target) => `Open-source suiss/ui ${kind} for ${target}.`),
    ...targets.map((target) => `suiss/ui ${kind} for ${target}.`),
    ...targets.map((target) => `For ${target}.`),
  ]
  return (
    suffixes
      .map((suffix) => `${description} ${suffix}`)
      .find((text) => text.length <= MAX_DESCRIPTION) ?? description
  )
}
