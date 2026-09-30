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

const TSCONFIGS = ["tsconfig.json", "tsconfig.app.json"]

function readJsonc(file) {
  const text = readFileSync(file, "utf8")
  const withoutComments = text.replace(
    /("(?:\\.|[^"\\])*")|\/\/[^\n]*|\/\*[\s\S]*?\*\//g,
    (match, string) => string ?? ""
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
      "No package.json found. Run this inside a Next.js or React project."
    )
  }
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"))
  const packages = { ...manifest.dependencies, ...manifest.devDependencies }
  const framework = packages.next
    ? "next"
    : packages.vite && packages.react
      ? "vite"
      : null
  if (!framework) {
    throw new CliError("Only Next.js and React (Vite) projects are supported.")
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
  for (const name of TSCONFIGS) {
    const file = path.join(cwd, name)
    if (!existsSync(file)) continue
    const options = readJsonc(file).compilerOptions ?? {}
    const target = options.paths?.["@/*"]?.[0]
    if (target) {
      return path.resolve(
        cwd,
        options.baseUrl ?? ".",
        target.replace(/\/?\*$/, "")
      )
    }
  }
  return null
}

export function install(project, packages, { dev = false } = {}) {
  const missing = [...new Set(packages)].filter(
    (name) => !project.packages[name]
  )
  if (!missing.length) return []
  const { command, dev: devFlag } = INSTALL_ARGS[project.packageManager]
  const args = [command, ...(dev ? [devFlag] : []), ...missing]
  const result = spawnSync(project.packageManager, args, {
    cwd: project.cwd,
    stdio: "inherit",
    shell: process.platform === "win32",
  })
  if (result.status !== 0) {
    throw new CliError(`${project.packageManager} ${args.join(" ")} failed.`)
  }
  for (const name of missing) project.packages[name] = "*"
  return missing
}
