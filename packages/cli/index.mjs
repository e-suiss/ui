#!/usr/bin/env node
import { existsSync } from "node:fs"
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
import { CliError, color, step } from "./lib/output.mjs"
import { decodePreset } from "./lib/preset.mjs"
import { choose, isInteractive } from "./lib/prompt.mjs"
import { BASES } from "./lib/registry.mjs"
import { name, version } from "./lib/shared/package.mjs"
import { readJson } from "./lib/shared/project.mjs"
import { presetProblem, resolveStyle } from "./lib/shared/style.mjs"
import { STYLE_NAMES } from "./lib/styles.mjs"

const OPTIONS = {
  overwrite:
    "  -o, --overwrite  replace local files that differ from the registry",
  diff: "  --diff           show how local files differ from the registry",
  all: `  -a, --all        add every component, or every pattern, interaction,
                   chart or block after "patterns", "interactions",
                   "charts" or "blocks"; theme is only added by name`,
  yes: "  -y, --yes        skip confirmation prompts and the pick list",
  base: `  -b, --base <base|radix|aria>
                   the primitive base of React components (read from the
                   style in components.json when omitted, otherwise base);
                   init saves it as the style in components.json`,
  style: `  --style <name>   the visual style: suiss, vega, nova, maia, lyra, mira,
                   luma, sera or rhea (defaults to suiss); for React it is
                   read from and saved to the style in components.json`,
  preset: `  --preset <code>  apply a preset code from suiss.app/ui/create: style,
                   colors, radius, fonts, icons and menus (init only)`,
  theme: "  --theme suiss    keep the suiss/ui colors when applying a preset",
  platform: `  -p, --platform <web|rn|swift|kotlin>
                   web, React Native, SwiftUI or Jetpack Compose sources
                   (detected from the project when omitted)`,
  styling: `  -s, --styling <uniwind|nativewind|stylesheet>
                   React Native styling (detected from the project when omitted)`,
  path: `  --path <dir>     where SwiftUI or Compose files go, relative to --cwd
                   (defaults to EsuissUI/ or src/main/kotlin/com/esuiss/ui/)`,
  cwd: "  -c, --cwd <dir>  project directory (defaults to the current directory)",
  help: "  -h, --help       show this help",
  version: "  -v, --version    show the version",
}

const SUPPORTED = `Supports Next.js and React (Vite) projects with TypeScript and Tailwind CSS v4,
React Native and Expo projects with TypeScript, Xcode projects and Swift
packages, and Android Gradle modules.`

function optionLines(...keys) {
  return keys.map((key) => OPTIONS[key]).join("\n")
}

const INIT_LINES = `
  npx ${name} init [options]              set up the theme and the button`

const ADD_LINES = `
  npx ${name} add                         pick what to add from a list
  npx ${name} add <component...> [options] add components, e.g. add button sidebar
  npx ${name} add patterns <pattern...>    add patterns, e.g. add patterns date-picker
  npx ${name} add interactions <name...>   add interactions, e.g. add interactions swipe-actions
  npx ${name} add charts <chart...>        add charts, e.g. add charts <name>
  npx ${name} add blocks <block...>        add blocks, e.g. add blocks <name>`

const ADD_OPTIONS = optionLines(
  "overwrite",
  "diff",
  "all",
  "yes",
  "base",
  "style",
  "platform",
  "styling",
  "path",
  "cwd",
  "help",
  "version"
)

const INIT_OPTIONS = optionLines(
  "overwrite",
  "yes",
  "base",
  "style",
  "preset",
  "theme",
  "platform",
  "styling",
  "path",
  "cwd",
  "help",
  "version"
)

function page(lines, list) {
  return `${name} ${version}\n\nUsage:${lines}\n\nOptions:\n${list}\n\n${SUPPORTED}`
}

const usage = page(`${INIT_LINES}${ADD_LINES}`, ADD_OPTIONS)

const COMMAND_USAGE = {
  init: page(INIT_LINES, INIT_OPTIONS),
  add: page(ADD_LINES, ADD_OPTIONS),
}

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
      case "-h":
      case "--help":
        options.help = true
        break
      case "-v":
      case "--version":
        options.version = true
        break
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
          throw new CliError(
            `${arg} needs ${BASES.slice(0, -1).join(", ")} or ${BASES.at(-1)}.`
          )
        }
        options.base = base
        break
      }
      case "--preset": {
        const code = queue.next().value
        const decoded = decodePreset(code)
        if (!decoded) {
          throw new CliError(`${arg} needs a preset code from the create page.`)
        }
        const problem = presetProblem(decoded)
        if (problem) throw new CliError(problem)
        options.preset = code
        break
      }
      case "--theme": {
        const theme = queue.next().value
        if (theme !== "suiss") throw new CliError(`${arg} needs suiss.`)
        options.theme = theme
        break
      }
      case "--style": {
        const style = queue.next().value
        if (!STYLE_NAMES.includes(style)) {
          throw new CliError(
            `${arg} needs ${STYLE_NAMES.slice(0, -1).join(", ")} or ${STYLE_NAMES.at(-1)}.`
          )
        }
        options.style = style
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
  const { dependencies, devDependencies } = readJson(manifest)
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
    } else if (options.yes || !isInteractive()) {
      throw new CliError(
        `This folder has ${found.map((platform) => PLATFORM_TITLES[platform]).join(" and ")} projects. Pick one with --platform ${found.join("|")}.`
      )
    } else {
      options.platform = await choose(
        "Which project should get the components?",
        found.map((platform) => ({
          value: platform,
          label: PLATFORM_TITLES[platform],
        }))
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
  if (options.platform !== "web") options.style = resolveStyle(options)
  return options
}

function parseCommand(command, args) {
  const parsed = parseArgs(args)
  if (parsed.options.version) {
    console.log(version)
    return null
  }
  if (parsed.options.help) {
    console.log(COMMAND_USAGE[command])
    return null
  }
  return parsed
}

async function main() {
  const [command, ...args] = process.argv.slice(2)

  switch (command) {
    case "init": {
      const parsed = parseCommand(command, args)
      if (!parsed) break
      const { options } = parsed
      await resolvePlatform(options)
      if (options.platform === "web") await init(options)
      else if (options.platform === "rn") await initMobile(options)
      else await initNative(options)
      break
    }
    case "add": {
      const scope = SUBCOMMANDS[args[0]]
      const parsed = parseCommand(command, scope ? args.slice(1) : args)
      if (!parsed) break
      const options = { ...parsed.options, scope }
      if (options.style !== undefined || options.preset !== undefined) {
        throw new CliError(
          "--style and --preset work with init; add keeps the style init set up."
        )
      }
      await resolvePlatform(options)
      if (options.platform === "web") await add(parsed.names, options)
      else if (options.platform === "rn") await addMobile(parsed.names, options)
      else await addNative(parsed.names, options)
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
