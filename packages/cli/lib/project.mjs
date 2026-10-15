import { existsSync, readFileSync } from "node:fs"
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

function readConfig(cwd) {
  const file = path.join(cwd, "components.json")
  if (!existsSync(file)) return null
  try {
    return JSON.parse(readFileSync(file, "utf8"))
  } catch {
    return null
  }
}

function configuredStylesheet(cwd) {
  const css = readConfig(cwd)?.tailwind?.css
  return typeof css === "string" && css ? path.join(cwd, css) : null
}

export function detectBase(cwd) {
  const style = readConfig(cwd)?.style
  if (typeof style !== "string") return "base"
  if (RADIX_STYLE.test(style)) return "radix"
  if (ARIA_STYLE.test(style)) return "aria"
  return "base"
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
