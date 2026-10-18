import { spawnSync } from "node:child_process"
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"

import { CliError } from "../output.mjs"

const PACKAGE_NAME = /^(@[a-z0-9~][a-z0-9-._~]*\/)?[a-z0-9~][a-z0-9-._~]*$/
const PACKAGE_RANGE = /^[a-z0-9.^~<>=|*+-]+$/i

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

function parseFile(file, parse) {
  const text = readFileSync(file, "utf8")
  try {
    return parse(text)
  } catch (error) {
    throw new CliError(
      `Could not read ${path.basename(file)} in ${path.dirname(file)}: ${error.message}`
    )
  }
}

export function readJson(file) {
  return parseFile(file, JSON.parse)
}

function readJsonc(file) {
  return parseFile(file, (text) =>
    JSON.parse(
      text
        .replace(
          /("(?:\\.|[^"\\])*")|\/\/[^\n]*|\/\*[\s\S]*?\*\//g,
          (_match, string) => string ?? ""
        )
        .replace(/,(\s*[}\]])/g, "$1")
    )
  )
}

function readOptionalJson(file) {
  if (!existsSync(file)) return {}
  try {
    return readJson(file)
  } catch {
    return {}
  }
}

function isBoundary(dir) {
  if (existsSync(path.join(dir, "pnpm-workspace.yaml"))) return true
  if (existsSync(path.join(dir, ".git"))) return true
  return Boolean(readOptionalJson(path.join(dir, "package.json")).workspaces)
}

function searchDirectories(cwd) {
  const dirs = []
  for (let dir = cwd; ; dir = path.dirname(dir)) {
    dirs.push(dir)
    if (isBoundary(dir) || path.dirname(dir) === dir) return dirs
  }
}

function managerOf(spec) {
  const manager = spec?.split("@")[0]
  return INSTALL_ARGS[manager] ? manager : null
}

function declaredPackageManager(dirs) {
  for (const dir of dirs) {
    const manager = managerOf(
      readOptionalJson(path.join(dir, "package.json")).packageManager
    )
    if (manager) return manager
  }
  return null
}

export function agentPackageManager() {
  return managerOf(process.env.npm_config_user_agent?.split("/")[0])
}

function detectPackageManager(cwd) {
  const dirs = searchDirectories(cwd)
  const agent = agentPackageManager()
  return (
    declaredPackageManager(dirs) ??
    (agent && agent !== "npm" ? agent : null) ??
    dirs
      .map((dir) =>
        LOCKFILES.find(([file]) => existsSync(path.join(dir, file)))
      )
      .find(Boolean)?.[1] ??
    "npm"
  )
}

export function detectProject(cwd, { frameworkOf, kind, supported }) {
  const manifestPath = path.join(cwd, "package.json")
  if (!existsSync(manifestPath)) {
    throw new CliError(`No package.json found. Run this inside a ${kind}.`)
  }
  const manifest = readJson(manifestPath)
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

function aliasOptions(file, seen = new Set()) {
  if (seen.has(file) || !existsSync(file)) return {}
  seen.add(file)
  const config = readJsonc(file)
  const dir = path.dirname(file)
  const parents = [config.extends ?? []]
    .flat()
    .filter((parent) => parent.startsWith("."))
    .map((parent) => {
      const resolved = path.resolve(dir, parent)
      return aliasOptions(
        existsSync(resolved) || resolved.endsWith(".json")
          ? resolved
          : `${resolved}.json`,
        seen
      )
    })
  const inherited = Object.assign({}, ...parents)
  const options = config.compilerOptions ?? {}
  return {
    ...inherited,
    ...(options.baseUrl !== undefined && {
      baseUrl: path.resolve(dir, options.baseUrl),
    }),
    ...(options.paths && { paths: options.paths, pathsDir: dir }),
  }
}

export function findAliasRoot(cwd) {
  for (const name of TSCONFIGS) {
    const { baseUrl, paths, pathsDir } = aliasOptions(path.join(cwd, name))
    const target = paths?.["@/*"]?.[0]
    if (target) {
      return path.resolve(
        baseUrl ?? pathsDir,
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
  if (text.includes('"@/*"')) return
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

export function assertPackageSpecs(specs) {
  for (const spec of specs) {
    const at = spec.indexOf("@", 1)
    assertPackageNames([at === -1 ? spec : spec.slice(0, at)])
    if (at !== -1 && !PACKAGE_RANGE.test(spec.slice(at + 1))) {
      throw new CliError(`Refusing to install an invalid package spec: ${spec}`)
    }
  }
}

export function installPackages(project, packages, dev) {
  const { command, dev: devFlag } = INSTALL_ARGS[project.packageManager]
  spawn(project, project.packageManager, [
    command,
    ...(dev ? [devFlag] : []),
    "--",
    ...packages,
  ])
}
