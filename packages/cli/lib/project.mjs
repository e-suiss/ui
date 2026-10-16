import { existsSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"

import {
  assertPackageNames,
  detectProject as detect,
  installPackages,
} from "./shared/project.mjs"

export { findAliasRoot } from "./shared/project.mjs"

const NEXT_STYLESHEETS = [
  "src/app/globals.css",
  "app/globals.css",
  "src/styles/globals.css",
  "styles/globals.css",
]
export const VITE_STYLESHEET = "src/index.css"
const RADIX_STYLE = /^(radix-.+|new-york|default)$/
const ARIA_STYLE = /^aria-.+$/
const STYLE_PREFIX = /^(base|radix|aria)-/
const DEFAULT_STYLE = "nova"
const CONFIG_FILE = "components.json"

function readConfig(cwd) {
  const file = path.join(cwd, CONFIG_FILE)
  if (!existsSync(file)) return null
  try {
    return JSON.parse(readFileSync(file, "utf8"))
  } catch {
    return null
  }
}

export function configuredStylesheet(cwd) {
  const css = readConfig(cwd)?.tailwind?.css
  return typeof css === "string" && css ? path.join(cwd, css) : null
}

function baseOf(style) {
  if (typeof style !== "string") return "base"
  if (RADIX_STYLE.test(style)) return "radix"
  if (ARIA_STYLE.test(style)) return "aria"
  return "base"
}

export function detectBase(cwd) {
  return baseOf(readConfig(cwd)?.style)
}

function newConfig(project, style, stylesheet) {
  return {
    $schema: "https://ui.shadcn.com/schema.json",
    style,
    rsc: project.framework === "next",
    tsx: true,
    tailwind: {
      config: "",
      css: path.relative(project.cwd, stylesheet).split(path.sep).join("/"),
      baseColor: "neutral",
      cssVariables: true,
      prefix: "",
    },
    iconLibrary: "phosphor",
    aliases: {
      components: "@/components",
      utils: "@/lib/utils",
      ui: "@/components/ui",
      lib: "@/lib",
      hooks: "@/hooks",
    },
    registries: {
      "@esuiss": "https://ui.suiss.app/r/{style}/{name}.json",
    },
  }
}

export function saveBase(project, base, stylesheet) {
  const file = path.join(project.cwd, CONFIG_FILE)
  const exists = existsSync(file)
  const config = readConfig(project.cwd)
  if (exists && !config) return { file, invalid: true }
  if (baseOf(config?.style) === base) return null
  const style = `${base}-${
    typeof config?.style === "string" && STYLE_PREFIX.test(config.style)
      ? config.style.replace(STYLE_PREFIX, "")
      : DEFAULT_STYLE
  }`
  const next = config
    ? { ...config, style }
    : newConfig(project, style, stylesheet)
  writeFileSync(file, `${JSON.stringify(next, null, 2)}\n`)
  return { file, style, created: !exists }
}

export function findStylesheet(project) {
  const candidates =
    project.framework === "vite" ? [VITE_STYLESHEET] : NEXT_STYLESHEETS
  return (
    [
      configuredStylesheet(project.cwd),
      ...candidates.map((file) => path.join(project.cwd, file)),
    ].find((file) => file && existsSync(file)) ?? null
  )
}

function frameworkOf(packages) {
  if (packages.next) return "next"
  if (packages.vite && packages.react) return "vite"
  return null
}

export function detectProject(cwd) {
  return detect(cwd, {
    frameworkOf,
    kind: "Next.js or React project",
    supported: "Next.js and React (Vite)",
  })
}

export function install(project, packages, { dev = false } = {}) {
  const missing = [...new Set(packages)].filter(
    (name) => !project.packages[name]
  )
  if (!missing.length) return []
  assertPackageNames(missing)
  installPackages(project, missing, dev)
  for (const name of missing) project.packages[name] = "*"
  return missing
}
