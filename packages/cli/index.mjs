#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs"
import path from "node:path"

import { add } from "./lib/add.mjs"
import { init } from "./lib/init.mjs"
import { add as addMobile } from "./lib/mobile/add.mjs"
import { init as initMobile } from "./lib/mobile/init.mjs"
import {
  addNative,
  detectNativePlatforms,
  initNative,
} from "./lib/mobile/native.mjs"
import { CliError, choose, color, step } from "./lib/output.mjs"
import { BASES } from "./lib/registry.mjs"

const { name, version } = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf8")
)

const usage = `${name} ${version}

Usage:
  npx ${name} init [options]              set up the theme and the button
  npx ${name} add                         pick what to add from a list
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
  -b, --base <base|radix>
                   the primitive base of React components (read from the
                   style in components.json when omitted, otherwise base)
  -p, --platform <web|rn|swift|kotlin>
                   web, React Native, SwiftUI or Jetpack Compose sources
                   (detected from the project when omitted)
  -s, --styling <uniwind|nativewind|stylesheet>
                   React Native styling (detected from the project when omitted)
  --path <dir>     where SwiftUI or Compose files go, relative to --cwd
                   (defaults to EsuissUI/ or src/main/kotlin/com/esuiss/ui/)
  -c, --cwd <dir>  project directory (defaults to the current directory)
  -h, --help       show this help
  -v, --version    show the version

Supports Next.js and React (Vite) projects with TypeScript and Tailwind CSS v4,
React Native and Expo projects with TypeScript, Xcode projects and Swift
packages, and Android Gradle modules.`

const SUBCOMMANDS = {
  patterns: "pattern",
  interactions: "interaction",
  charts: "chart",
  blocks: "block",
}

const PLATFORMS = ["web", "rn", "swift", "kotlin"]
const PLATFORM_TITLES = {
  web: "React",
  rn: "React Native",
  swift: "SwiftUI",
  kotlin: "Jetpack Compose",
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
      case "-s":
      case "--styling": {
        const styling = queue.next().value
        if (!styling) {
          throw new CliError(`${arg} needs uniwind, nativewind or stylesheet.`)
        }
        options.styling = styling
        break
      }
      case "-b":
      case "--base": {
        const base = queue.next().value
        if (!BASES.includes(base)) {
          throw new CliError(`${arg} needs ${BASES.join(" or ")}.`)
        }
        options.base = base
        break
      }
      case "-p":
      case "--platform": {
        const platform = queue.next().value
        if (!PLATFORMS.includes(platform)) {
          throw new CliError(`${arg} needs ${PLATFORMS.join(", ")}.`)
        }
        options.platform = platform
        break
      }
      case "--path": {
        const dir = queue.next().value
        if (!dir) throw new CliError(`${arg} needs a directory.`)
        options.path = dir
        break
      }
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

function packagesOf(cwd) {
  const manifest = path.join(cwd, "package.json")
  if (!existsSync(manifest)) return {}
  const { dependencies, devDependencies } = JSON.parse(
    readFileSync(manifest, "utf8")
  )
  return { ...dependencies, ...devDependencies }
}

function detectPlatforms(cwd) {
  const packages = packagesOf(cwd)
  const found = []
  if (packages.expo || packages["react-native"]) found.push("rn")
  else if (packages.next || packages.react) found.push("web")
  return [...found, ...detectNativePlatforms(cwd)]
}

async function resolvePlatform(options) {
  if (!options.platform) {
    const found = detectPlatforms(options.cwd)
    if (!found.length) {
      throw new CliError(
        `No React, React Native, Xcode or Android Gradle project found in ${options.cwd}. Run this in your project folder, or pass --cwd or --platform.`
      )
    }
    if (found.length === 1) {
      options.platform = found[0]
      if (options.platform === "swift" || options.platform === "kotlin") {
        step(`Found a ${PLATFORM_TITLES[options.platform]} project.`)
      }
    } else if (options.yes || !process.stdin.isTTY) {
      throw new CliError(
        `This folder has ${found.map((platform) => PLATFORM_TITLES[platform]).join(" and ")} projects. Pick one with --platform ${found.join("|")}.`
      )
    } else {
      const answer = await choose(
        "Which project should get the components?",
        found.map((platform) => PLATFORM_TITLES[platform])
      )
      options.platform = found.find(
        (platform) => PLATFORM_TITLES[platform] === answer
      )
    }
  }
  if (options.path && ["web", "rn"].includes(options.platform)) {
    throw new CliError("--path works with --platform swift or kotlin.")
  }
  if (options.base && options.platform !== "web") {
    throw new CliError("--base works with React projects.")
  }
  if (options.styling && options.platform !== "rn") {
    throw new CliError("--styling works with React Native projects.")
  }
  return options
}

async function main() {
  const [command, ...args] = process.argv.slice(2)

  switch (command) {
    case "init": {
      const { options } = parseArgs(args)
      await resolvePlatform(options)
      if (options.platform === "web") await init(options)
      else if (options.platform === "rn") await initMobile(options)
      else await initNative(options)
      break
    }
    case "add": {
      const scope = SUBCOMMANDS[args[0]]
      const { options, names } = parseArgs(scope ? args.slice(1) : args)
      await resolvePlatform(options)
      if (options.platform === "web") await add(names, { ...options, scope })
      else if (options.platform === "rn") await addMobile(names, options)
      else await addNative(names, options)
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
