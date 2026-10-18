import { withBase } from "@/lib/base-path"
export const ICON_LABELS = {
  lucide: "Lucide",
  tabler: "Tabler",
  hugeicons: "HugeIcons",
  phosphor: "Phosphor",
  remixicon: "Remix Icon",
} as const

export type IconLibrary = keyof typeof ICON_LABELS

export const ICON_PACKAGES: Record<IconLibrary, string> = {
  lucide: "lucide-react",
  tabler: "@tabler/icons-react",
  hugeicons: "@hugeicons/react @hugeicons/core-free-icons",
  phosphor: "@phosphor-icons/react",
  remixicon: "@remixicon/react",
}

export const ICON_LIBRARIES = Object.keys(ICON_LABELS) as IconLibrary[]

export const DEFAULT_ICONS = "phosphor" satisfies IconLibrary

export const DEFAULT_BASE = "base"

export const BASES = [
  DEFAULT_BASE,
  ...(process.env.PRIMITIVE_BASES ?? "").split(",").filter(Boolean),
]

export const PRIMITIVE_BASES = BASES.slice(1)

export const CODE_OPTIONS_KEY = "suiss-code"

export const STYLING_LABELS = {
  uniwind: "Uniwind",
  nativewind: "NativeWind",
  stylesheet: "StyleSheet",
} as const

export type Styling = keyof typeof STYLING_LABELS

export const STYLINGS = Object.keys(STYLING_LABELS) as Styling[]

export const DEFAULT_STYLING = "uniwind" satisfies Styling

export const baseScript = `(()=>{try{const p=new URLSearchParams(location.search),s=JSON.parse(localStorage.getItem("${CODE_OPTIONS_KEY}")||"{}"),r=document.documentElement,b=p.get("base")||s.base,t=p.get("styling")||s.styling;if(${JSON.stringify(BASES)}.includes(b))r.dataset.base=b;if(${JSON.stringify(STYLINGS)}.includes(t))r.dataset.styling=t}catch(e){}})()`

export const STYLE_LABELS = {
  suiss: "Suiss",
  vega: "Vega",
  nova: "Nova",
  maia: "Maia",
  lyra: "Lyra",
  mira: "Mira",
  luma: "Luma",
  sera: "Sera",
  rhea: "Rhea",
} as const

export type StyleName = keyof typeof STYLE_LABELS

export const STYLES = Object.keys(STYLE_LABELS) as StyleName[]

export const DEFAULT_STYLE = "suiss" satisfies StyleName

export type CodeOptions = {
  icons: IconLibrary
  base: string
  style: StyleName
  styling: Styling
}

export const DEFAULT_OPTIONS: CodeOptions = {
  icons: DEFAULT_ICONS,
  base: DEFAULT_BASE,
  style: DEFAULT_STYLE,
  styling: DEFAULT_STYLING,
}

export const isIconLibrary = (value: unknown): value is IconLibrary =>
  ICON_LIBRARIES.includes(value as IconLibrary)

export const isBase = (value: unknown): value is string =>
  BASES.includes(value as string)

export const isStyle = (value: unknown): value is StyleName =>
  STYLES.includes(value as StyleName)

export const isStyling = (value: unknown): value is Styling =>
  STYLINGS.includes(value as Styling)

export function codeOptions(
  params: URLSearchParams,
  fallback: Partial<CodeOptions> = {}
): CodeOptions {
  const icons = params.get("icons") ?? fallback.icons
  const base = params.get("base") ?? fallback.base
  const style = params.get("style") ?? fallback.style
  const styling = params.get("styling") ?? fallback.styling
  return {
    icons: isIconLibrary(icons) ? icons : DEFAULT_ICONS,
    base: isBase(base) ? base : DEFAULT_BASE,
    style: isStyle(style) ? style : DEFAULT_STYLE,
    styling: isStyling(styling) ? styling : DEFAULT_STYLING,
  }
}

export function sourceUrl(file: string, options: Partial<CodeOptions> = {}) {
  const icons = options.icons ?? DEFAULT_ICONS
  const base = options.base ?? DEFAULT_BASE
  return withBase(`/source/${base}/${icons}/${file}`)
}
