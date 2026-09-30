#!/usr/bin/env node
import { spawnSync } from "node:child_process"
import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs"
import path from "node:path"

const REGISTRY = "esuiss/esuiss-ui"
const INIT_ITEMS = ["theme", "button"]
const VALUE_FLAGS = new Set(["-c", "--cwd", "-p", "--path", "--diff", "--view"])
const UPSTREAM_CSS_IMPORT =
  /^@import\s+["']shadcn\/tailwind\.css["'];?[^\S\n]*\n?/m
const UPSTREAM_PACKAGE = "shadcn"

const { version } = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf8")
)

const usage = `esuiss ${version}

Usage:
  esuiss init [options]               set up a project with the esuiss-ui theme and button
  esuiss add <component...> [options] add components, e.g. esuiss add button sidebar

Options for add:
  -o, --overwrite    overwrite existing files
  --diff [path]      show changes against the installed file
  --view [path]      show file contents
  -y, --yes          skip confirmation prompt
  -c, --cwd <cwd>    working directory
  -p, --path <path>  install location
  --dry-run          preview changes without writing files

The registry is private: run \`gh auth login\` once or set GH_TOKEN.`

function exec(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit",
    shell: process.platform === "win32",
  })
  if (result.status !== 0) process.exit(result.status ?? 1)
}

function run(args) {
  exec("npx", ["--yes", "shadcn@latest", ...args])
}

function toAddresses(args) {
  return args.map((arg, index) => {
    const previous = args[index - 1]
    const isValue = previous !== undefined && VALUE_FLAGS.has(previous)
    if (arg.startsWith("-") || isValue || arg.includes("/")) return arg
    return `${REGISTRY}/${arg}`
  })
}

function flagValue(args, ...flags) {
  const index = args.findIndex((arg) => flags.includes(arg))
  return index === -1 ? undefined : args[index + 1]
}

function hasFlag(args, ...flags) {
  return args.some((arg) => flags.includes(arg))
}

function isProject(dir) {
  return existsSync(path.join(dir, "components.json"))
}

function findProject(baseDir, name) {
  if (name && isProject(path.resolve(baseDir, name)))
    return path.resolve(baseDir, name)
  if (isProject(baseDir)) return baseDir
  const candidates = readdirSync(baseDir, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() && isProject(path.join(baseDir, entry.name))
    )
    .map((entry) => path.join(baseDir, entry.name))
    .sort(
      (a, b) =>
        statSync(path.join(b, "components.json")).mtimeMs -
        statSync(path.join(a, "components.json")).mtimeMs
    )
  return candidates[0]
}

function packageManager(dir) {
  const lockfiles = [
    ["pnpm-lock.yaml", "pnpm", "remove"],
    ["bun.lock", "bun", "remove"],
    ["bun.lockb", "bun", "remove"],
    ["yarn.lock", "yarn", "remove"],
  ]
  for (let current = dir; ; current = path.dirname(current)) {
    const match = lockfiles.find(([file]) =>
      existsSync(path.join(current, file))
    )
    if (match) return match.slice(1)
    if (path.dirname(current) === current) return ["npm", "uninstall"]
  }
}

function removeUpstreamStyles(projectDir) {
  const config = JSON.parse(
    readFileSync(path.join(projectDir, "components.json"), "utf8")
  )
  const cssFile =
    config.tailwind?.css && path.join(projectDir, config.tailwind.css)
  if (cssFile && existsSync(cssFile)) {
    const css = readFileSync(cssFile, "utf8")
    if (UPSTREAM_CSS_IMPORT.test(css))
      writeFileSync(cssFile, css.replace(UPSTREAM_CSS_IMPORT, ""))
  }

  const manifest = JSON.parse(
    readFileSync(path.join(projectDir, "package.json"), "utf8")
  )
  const installed =
    manifest.dependencies?.[UPSTREAM_PACKAGE] ??
    manifest.devDependencies?.[UPSTREAM_PACKAGE]
  if (installed) {
    const [manager, removeCommand] = packageManager(projectDir)
    exec(manager, [removeCommand, UPSTREAM_PACKAGE], projectDir)
  }
}

function init(args) {
  const baseArgs = hasFlag(args, "-b", "--base") ? [] : ["--base", "base"]
  run(["init", ...baseArgs, ...args])

  const baseDir = path.resolve(flagValue(args, "-c", "--cwd") ?? ".")
  const projectDir = findProject(baseDir, flagValue(args, "-n", "--name"))
  if (!projectDir) {
    console.error(
      "esuiss init: could not find the initialized project (components.json)."
    )
    process.exit(1)
  }

  run([
    "add",
    ...toAddresses(INIT_ITEMS),
    "--overwrite",
    "--yes",
    "--cwd",
    projectDir,
  ])
  removeUpstreamStyles(projectDir)
}

const [command, ...args] = process.argv.slice(2)

switch (command) {
  case "add": {
    const addresses = toAddresses(args)
    if (!addresses.some((arg) => arg.startsWith(`${REGISTRY}/`))) {
      console.error(
        "esuiss add: name at least one component, e.g. esuiss add button"
      )
      process.exit(1)
    }
    run(["add", ...addresses])
    break
  }
  case "init":
    init(args)
    break
  case "-v":
  case "--version":
    console.log(version)
    break
  case undefined:
  case "-h":
  case "--help":
  case "help":
    console.log(usage)
    break
  default:
    console.error(`esuiss: unknown command "${command}"\n\n${usage}`)
    process.exit(1)
}
