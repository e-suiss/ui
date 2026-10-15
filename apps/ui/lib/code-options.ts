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

export type CodeOptions = { icons: IconLibrary; base: string }

export const DEFAULT_OPTIONS: CodeOptions = {
  icons: DEFAULT_ICONS,
  base: DEFAULT_BASE,
}

export const isIconLibrary = (value: unknown): value is IconLibrary =>
  ICON_LIBRARIES.includes(value as IconLibrary)

export const isBase = (value: unknown): value is string =>
  BASES.includes(value as string)

export function codeOptions(
  params: URLSearchParams,
  fallback: Partial<CodeOptions> = {}
): CodeOptions {
  const icons = params.get("icons") ?? fallback.icons
  const base = params.get("base") ?? fallback.base
  return {
    icons: isIconLibrary(icons) ? icons : DEFAULT_ICONS,
    base: isBase(base) ? base : DEFAULT_BASE,
  }
}

export function sourceUrl(file: string, options: Partial<CodeOptions> = {}) {
  const params = new URLSearchParams()
  if (options.icons && options.icons !== DEFAULT_ICONS)
    params.set("icons", options.icons)
  if (options.base && options.base !== DEFAULT_BASE)
    params.set("base", options.base)
  const query = params.toString()
  return `/source/${file}${query ? `?${query}` : ""}`
}
