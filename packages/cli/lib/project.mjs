import { spawnSync } from "node:child_process"
import { existsSync, readFileSync } from "node:fs"
import path from "node:path"

import { CliError } from "./output.mjs"

const LOCKFILES = [
  ["pnpm-lock.yaml", "pnpm"],
  ["bun.lock", "bun"],
  ["bun.lockb", "bun"],
  ["yarn.lock", "yarn"],
  ["package-lock.json", "npm"],
]

const INSTALL_ARGS = {
  npm: { command: "install", dev: "--save-dev" },
  pnpm: { command: "add", dev: "--save-dev" },
  yarn: { command: "add", dev: "--dev" },
  bun: { command: "add", dev: "--dev" },
}

export const STYLINGS = ["uniwind", "nativewind"]

const RUNNERS = {
  npm: ["npx"],
  pnpm: ["pnpm", "exec"],
  yarn: ["yarn"],
  bun: ["bunx"],
}

function readJsonc(file) {
  const text = readFileSync(file, "utf8")
  const withoutComments = text.replace(
    /("(?:\\.|[^"\\])*")|\/\/[^\n]*|\/\*[\s\S]*?\*\//g,
    (_match, string) => string ?? ""
  )
  return JSON.parse(withoutComments.replace(/,(\s*[}\]])/g, "$1"))
}

function detectPackageManager(cwd) {
  for (let dir = cwd; ; dir = path.dirname(dir)) {
    const match = LOCKFILES.find(([file]) => existsSync(path.join(dir, file)))
    if (match) return match[1]
    if (path.dirname(dir) === dir) return "npm"
  }
}

export function detectProject(cwd) {
  const manifestPath = path.join(cwd, "package.json")
  if (!existsSync(manifestPath)) {
    throw new CliError(
      "No package.json found. Run this inside a React Native or Expo project."
    )
  }
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"))
  const packages = { ...manifest.dependencies, ...manifest.devDependencies }
  const framework = packages.expo
    ? "expo"
    : packages["react-native"]
      ? "react-native"
      : null
  if (!framework) {
    throw new CliError("Only React Native and Expo projects are supported.")
  }
  if (!existsSync(path.join(cwd, "tsconfig.json"))) {
    throw new CliError(
      "A TypeScript project is required (tsconfig.json not found)."
    )
  }
  return {
    cwd,
    framework,
    packages,
    packageManager: detectPackageManager(cwd),
  }
}

export function findAliasRoot(cwd) {
  const file = path.join(cwd, "tsconfig.json")
  if (!existsSync(file)) return null
  const options = readJsonc(file).compilerOptions ?? {}
  const target = options.paths?.["@/*"]?.[0]
  if (!target) return null
  return path.resolve(cwd, options.baseUrl ?? ".", target.replace(/\/?\*$/, ""))
}

function spawn(project, command, args) {
  const result = spawnSync(command, args, {
    cwd: project.cwd,
    stdio: "inherit",
    shell: process.platform === "win32",
  })
  if (result.status !== 0) {
    throw new CliError(`${command} ${args.join(" ")} failed.`)
  }
}

export function run(project, args) {
  const [command, ...prefix] = RUNNERS[project.packageManager]
  spawn(project, command, [...prefix, ...args])
}

function packageOf(spec) {
  return spec.replace(/(?!^)@.*$/, "")
}

export function detectStyling(project, requested) {
  if (requested) {
    if (!STYLINGS.includes(requested)) {
      throw new CliError(
        `Unknown styling "${requested}". Use ${STYLINGS.join(" or ")}.`
      )
    }
    return requested
  }
  const installed = STYLINGS.filter((name) => project.packages[name])
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
  if (project.framework === "expo" && !dev) {
    run(project, ["expo", "install", ...missing])
  } else {
    const flags = INSTALL_ARGS[project.packageManager]
    spawn(project, project.packageManager, [
      flags.command,
      ...(dev ? [flags.dev] : []),
      ...missing,
    ])
  }
  for (const spec of missing) project.packages[packageOf(spec)] = "*"
  return missing.map(packageOf)
}
