#!/usr/bin/env node
import { spawnSync } from "node:child_process"
import { readFileSync } from "node:fs"

const REGISTRY = "esuiss/esuiss-ui"
const INIT_ITEMS = ["theme", "button"]
const VALUE_FLAGS = new Set(["-c", "--cwd", "-p", "--path", "--diff", "--view"])

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

function run(args) {
  const result = spawnSync("npx", ["--yes", "shadcn@latest", ...args], {
    stdio: "inherit",
    shell: process.platform === "win32",
  })
  if (result.status !== 0) process.exit(result.status ?? 1)
}

function toAddresses(args) {
  return args.map((arg, index) => {
    const previous = args[index - 1]
    const isValue = previous !== undefined && VALUE_FLAGS.has(previous)
    if (arg.startsWith("-") || isValue || arg.includes("/")) return arg
    return `${REGISTRY}/${arg}`
  })
}

function hasFlag(args, ...flags) {
  return args.some((arg) => flags.includes(arg))
}

const [command, ...args] = process.argv.slice(2)

switch (command) {
  case "add": {
    const addresses = toAddresses(args)
    if (!addresses.some((arg) => arg.startsWith(`${REGISTRY}/`))) {
      console.error("esuiss add: name at least one component, e.g. esuiss add button")
      process.exit(1)
    }
    run(["add", ...addresses])
    break
  }
  case "init": {
    const baseArgs = hasFlag(args, "-b", "--base") ? [] : ["--base", "base"]
    run(["init", ...baseArgs, ...args])
    const cwd = args.find((_, index) => hasFlag([args[index - 1]], "-c", "--cwd"))
    const cwdArgs = cwd ? ["--cwd", cwd] : []
    run(["add", ...toAddresses(INIT_ITEMS), "--overwrite", "--yes", ...cwdArgs])
    break
  }
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
