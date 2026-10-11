#!/usr/bin/env node
import { readFileSync } from "node:fs"
import path from "node:path"

import { add } from "./lib/add.mjs"
import { init } from "./lib/init.mjs"
import { addNative, initNative } from "./lib/native.mjs"
import { CliError, color } from "./lib/output.mjs"

const { name, version } = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf8")
)

const usage = `${name} ${version}

Usage:
  npx ${name} init [options]              set up the styling, the theme, and the button
  npx ${name} add <component...> [options] add components, e.g. add button dialog

Options:
  -o, --overwrite  replace local files that differ from the registry
  --diff           show how local files differ from the registry
  -a, --all        add every component
  -y, --yes        skip confirmation prompts
  -s, --styling <uniwind|nativewind|stylesheet>
                   styling to use (detected from the project when omitted)
  -p, --platform <rn|swift|kotlin>
                   React Native (default), SwiftUI or Jetpack Compose sources
  --path <dir>     where SwiftUI or Compose files go, relative to --cwd
                   (defaults to EsuissUI/ or src/main/kotlin/com/esuiss/ui/)
  -c, --cwd <dir>  project directory (defaults to the current directory)
  -h, --help       show this help
  -v, --version    show the version

Supports React Native and Expo projects with TypeScript, Xcode projects and
Swift packages (--platform swift), and Android Gradle modules (--platform kotlin).`

const PLATFORMS = ["rn", "swift", "kotlin"]

function parseArgs(args) {
  const options = {
    cwd: process.cwd(),
    yes: false,
    overwrite: false,
    diff: false,
    all: false,
    platform: "rn",
  }
  const names = []

  for (let index = 0; index < args.length; index++) {
    const arg = args[index]
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
      case "-s":
      case "--styling": {
        const styling = args[++index]
        if (!styling) throw new CliError(`${arg} needs uniwind or nativewind.`)
        options.styling = styling
        break
      }
      case "-p":
      case "--platform": {
        const platform = args[++index]
        if (!PLATFORMS.includes(platform)) {
          throw new CliError(`${arg} needs ${PLATFORMS.join(", ")}.`)
        }
        options.platform = platform
        break
      }
      case "--path": {
        const dir = args[++index]
        if (!dir) throw new CliError(`${arg} needs a directory.`)
        options.path = dir
        break
      }
      case "-c":
      case "--cwd": {
        const dir = args[++index]
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
  if (options.path && options.platform === "rn") {
    throw new CliError("--path works with --platform swift or kotlin.")
  }
  return { options, names }
}

async function main() {
  const [command, ...args] = process.argv.slice(2)

  switch (command) {
    case "init": {
      const { options } = parseArgs(args)
      await (options.platform === "rn" ? init(options) : initNative(options))
      break
    }
    case "add": {
      const { options, names } = parseArgs(args)
      await (options.platform === "rn"
        ? add(names, options)
        : addNative(names, options))
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
