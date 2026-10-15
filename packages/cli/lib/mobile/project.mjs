import { CliError } from "../output.mjs"
import {
  assertPackageNames,
  detectProject as detect,
  installPackages,
  spawn,
} from "../shared/project.mjs"

export { findAliasRoot } from "../shared/project.mjs"

export const STYLINGS = ["uniwind", "nativewind", "stylesheet"]

const VERSION_SUFFIX = /(?!^)@.*$/

const STYLING_PACKAGES = ["uniwind", "nativewind"]

const RUNNERS = {
  npm: ["npx"],
  pnpm: ["pnpm", "exec"],
  yarn: ["yarn"],
  bun: ["bunx"],
}

function frameworkOf(packages) {
  if (packages.expo) return "expo"
  if (packages["react-native"]) return "react-native"
  return null
}

export function detectProject(cwd) {
  return detect(cwd, {
    frameworkOf,
    kind: "React Native or Expo project",
    supported: "React Native and Expo",
  })
}

export function run(project, args) {
  const [command, ...prefix] = RUNNERS[project.packageManager]
  spawn(project, command, [...prefix, ...args])
}

function packageOf(spec) {
  return spec.replace(VERSION_SUFFIX, "")
}

export function detectStyling(project, requested) {
  if (requested) {
    if (!STYLINGS.includes(requested)) {
      throw new CliError(
        `Unknown styling "${requested}". Use ${STYLINGS.join(", ")}.`
      )
    }
    return requested
  }
  const installed = STYLING_PACKAGES.filter((name) => project.packages[name])
  if (installed.length > 1) {
    throw new CliError(
      "Both Uniwind and NativeWind are installed. Pick one with --styling uniwind or --styling nativewind."
    )
  }
  return installed[0] ?? null
}

export function install(project, packages, { dev = false } = {}) {
  const missing = [...new Set(packages)].filter(
    (spec) => !project.packages[packageOf(spec)]
  )
  if (!missing.length) return []
  assertPackageNames(missing.map(packageOf))
  if (project.framework === "expo" && !dev) {
    run(project, ["expo", "install", ...missing])
  } else {
    installPackages(project, missing, dev)
  }
  for (const spec of missing) project.packages[packageOf(spec)] = "*"
  return missing.map(packageOf)
}
