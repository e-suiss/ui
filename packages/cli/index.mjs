#!/usr/bin/env node
import { readFileSync } from "node:fs"
import path from "node:path"

import { add } from "./lib/add.mjs"
import { init } from "./lib/init.mjs"
import { CliError, color } from "./lib/output.mjs"

const { name, version } = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf8")
)

const usage = `${name} ${version}

Usage:
  npx ${name} init [options]              set up Tailwind, the theme, and the button
  npx ${name} add <component...> [options] add components, e.g. add button sidebar
  npx ${name} add patterns <pattern...>    add patterns, e.g. add patterns date-picker
  npx ${name} add interactions <name...>   add interactions, e.g. add interactions swipe-actions
  npx ${name} add charts <chart...>        add charts, e.g. add charts <name>
  npx ${name} add blocks <block...>        add blocks, e.g. add blocks <name>

Options:
  -o, --overwrite  replace local files that differ from the registry
  --diff           show how local files differ from the registry
  -a, --all        add every component, or every pattern, interaction,
                   chart or block after "patterns", "interactions",
                   "charts" or "blocks"; theme is only added by name
  -y, --yes        skip confirmation prompts
  -c, --cwd <dir>  project directory (defaults to the current directory)
  -h, --help       show this help
  -v, --version    show the version

Supports Next.js and React (Vite) projects with TypeScript and Tailwind CSS v4.`

const SUBCOMMANDS = {
  patterns: "pattern",
  interactions: "interaction",
  charts: "chart",
  blocks: "block",
}

function parseArgs(args) {
  const options = {
    cwd: process.cwd(),
    yes: false,
    overwrite: false,
    diff: false,
    all: false,
  }
  const names = []

  const queue = args[Symbol.iterator]()
  for (const arg of queue) {
    switch (arg) {
      case "-y":
      case "--yes":
        options.yes = true
        break
      case "-o":
      case "--overwrite":
        options.overwrite = true
        break
      case "--diff":
        options.diff = true
        break
      case "-a":
      case "--all":
        options.all = true
        break
      case "-c":
      case "--cwd": {
        const dir = queue.next().value
        if (!dir) throw new CliError(`${arg} needs a directory.`)
        options.cwd = path.resolve(dir)
        break
      }
      default:
        if (arg.startsWith("-"))
          throw new CliError(`Unknown option ${arg}\n\n${usage}`)
        names.push(arg)
    }
  }
  return { options, names }
}

async function main() {
  const [command, ...args] = process.argv.slice(2)

  switch (command) {
    case "init":
      await init(parseArgs(args).options)
      break
    case "add": {
      const scope = SUBCOMMANDS[args[0]] ?? "ui"
      const { options, names } = parseArgs(
        scope === "ui" ? args : args.slice(1)
      )
      await add(names, { ...options, scope })
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
      throw new CliError(`Unknown command "${command}"\n\n${usage}`)
  }
}

main().catch((error) => {
  if (error instanceof CliError) {
    console.error(color.red(error.message))
    process.exit(1)
  }
  throw error
})
