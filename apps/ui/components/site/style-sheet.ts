import { DEFAULT_STYLE, STYLES, type StyleName } from "@/lib/code-options"

const sheets: Record<Exclude<StyleName, "suiss">, () => Promise<unknown>> = {
  vega: () => import("./styles/vega"),
  nova: () => import("./styles/nova"),
  maia: () => import("./styles/maia"),
  lyra: () => import("./styles/lyra"),
  mira: () => import("./styles/mira"),
  luma: () => import("./styles/luma"),
  sera: () => import("./styles/sera"),
  rhea: () => import("./styles/rhea"),
}

const CLASSES = STYLES.map((style) => `style-${style}`)

let latest = 0

export async function showStyle(style: StyleName) {
  const request = ++latest
  if (style !== DEFAULT_STYLE) await sheets[style]()
  if (request !== latest) return
  const root = document.documentElement
  root.classList.remove(...CLASSES)
  root.classList.add(`style-${style}`)
}
