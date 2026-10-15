import { spawnSync } from "node:child_process"
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"

import { CliError } from "../output.mjs"

const PACKAGE_NAME = /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/

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

const TRAILING_WILDCARD = /\/?\*$/
const TSCONFIG_PATHS = /"paths"\s*:\s*\{/
const TSCONFIG_COMPILER_OPTIONS = /"compilerOptions"\s*:\s*\{/

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

export function detectProject(cwd, { frameworkOf, kind, supported }) {
  const manifestPath = path.join(cwd, "package.json")
  if (!existsSync(manifestPath)) {
    throw new CliError(`No package.json found. Run this inside a ${kind}.`)
  }
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"))
  const packages = { ...manifest.dependencies, ...manifest.devDependencies }
  const framework = frameworkOf(packages)
  if (!framework) {
    throw new CliError(`Only ${supported} projects are supported.`)
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
        target.replace(TRAILING_WILDCARD, "")
      )
    }
  }
  return null
}

export function relative(project, file) {
  return path.relative(project.cwd, file)
}

function addAliasTo(file, target) {
  let text = readFileSync(file, "utf8")
  const alias = `"@/*": ["${target}"]`
  const paths = text.match(TSCONFIG_PATHS)
  const options = text.match(TSCONFIG_COMPILER_OPTIONS)
  if (paths) {
    text = text.replace(paths[0], `${paths[0]}\n      ${alias},`)
  } else if (options) {
    text = text.replace(
      options[0],
      `${options[0]}\n    "paths": {\n      ${alias}\n    },`
    )
  } else {
    text = text.replace(
      "{",
      `{\n  "compilerOptions": {\n    "paths": {\n      ${alias}\n    }\n  },`
    )
  }
  writeFileSync(file, text)
}

export function ensureAlias(project, sourceRoot, files = ["tsconfig.json"]) {
  if (findAliasRoot(project.cwd)) return false
  const target =
    sourceRoot === project.cwd ? "./*" : `./${relative(project, sourceRoot)}/*`
  for (const name of files) {
    const file = path.join(project.cwd, name)
    if (existsSync(file)) addAliasTo(file, target)
  }
  return true
}

export function spawn(project, command, args) {
  const result = spawnSync(command, args, {
    cwd: project.cwd,
    stdio: "inherit",
    shell: process.platform === "win32",
  })
  if (result.status !== 0) {
    throw new CliError(`${command} ${args.join(" ")} failed.`)
  }
}

export function assertPackageNames(names) {
  const invalid = names.find((name) => !PACKAGE_NAME.test(name))
  if (invalid) {
    throw new CliError(
      `Refusing to install an invalid package name: ${invalid}`
    )
  }
}

export function installPackages(project, packages, dev) {
  const { command, dev: devFlag } = INSTALL_ARGS[project.packageManager]
  spawn(project, project.packageManager, [
    command,
    ...(dev ? [devFlag] : []),
    ...packages,
  ])
}
