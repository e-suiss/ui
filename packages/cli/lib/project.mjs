import {
  assertPackageNames,
  detectProject as detect,
  installPackages,
} from "./shared/project.mjs"

export { findAliasRoot } from "./shared/project.mjs"

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
