import { existsSync, readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { CliError, list, note, step } from "../output.mjs"
import { isInteractive } from "../prompt.mjs"
import {
  availableNames,
  fetchFiles,
  pickNames,
  reportFiles,
  showDiff,
  writeFiles,
} from "./add.mjs"
import { fetchRegistry } from "./registry.mjs"

const ANDROID_PLUGIN =
  /com\.android\.(?:application|library)|android[.-](?:application|library)|androidApplication|androidLibrary/
const GIT_SUFFIX = /\.git$/
const MIN_SDK = /minSdk(?:Version)?\s*=?\s*(\d+)/
const COMPOSE_PLUGIN = /plugin\.compose|compose\.compiler|kotlin\.compose/
const COMPOSE_ENABLED = /compose\s*=\s*true|compose\s+true/
const LAST_LIST_SEPARATOR = /, ([^,]+)$/
const GRADLE_FILES = ["build.gradle.kts", "build.gradle"]
const KOTLIN_PACKAGE = path.join("src", "main", "kotlin", "com", "esuiss", "ui")

function directories(dir) {
  return existsSync(dir)
    ? readdirSync(dir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
    : []
}

function readText(file) {
  return existsSync(file) ? readFileSync(file, "utf8") : ""
}

function xcodeEntries(cwd) {
  const entries = existsSync(cwd) ? readdirSync(cwd) : []
  return {
    project: entries.find((entry) => entry.endsWith(".xcodeproj")),
    manifest: entries.includes("Package.swift"),
  }
}

function gradleModule(cwd) {
  return [cwd, path.join(cwd, "app")].find((dir) =>
    GRADLE_FILES.some((file) =>
      ANDROID_PLUGIN.test(
        readText(path.join(dir, file)).replace(/^.*\bapply\s+false.*$/gm, "")
      )
    )
  )
}

export function detectNativePlatforms(cwd) {
  const { project, manifest } = xcodeEntries(cwd)
  return [
    ...(project || manifest ? ["swift"] : []),
    ...(gradleModule(cwd) ? ["kotlin"] : []),
  ]
}

function detectXcode(cwd, target) {
  const { project, manifest } = xcodeEntries(cwd)
  if (!project && !manifest) {
    throw new CliError(
      `No Xcode project or Package.swift found in ${cwd}. Run this in your app folder or pass --cwd.`
    )
  }
  const targets = directories(path.join(cwd, "Sources"))
  const fallback =
    !project && targets.length === 1
      ? path.join("Sources", targets[0], "EsuissUI")
      : "EsuissUI"
  return {
    cwd,
    root: path.resolve(cwd, target ?? fallback),
    xcode: Boolean(project),
    settings: [
      readText(path.join(cwd, "Package.swift")),
      project ? readText(path.join(cwd, project, "project.pbxproj")) : "",
    ].join("\n"),
  }
}

function detectGradle(cwd, target) {
  const module = gradleModule(cwd)
  if (!module) {
    throw new CliError(
      `No Android Gradle module found in ${cwd}. Run this in your app module or pass --cwd.`
    )
  }
  const buildFile = GRADLE_FILES.map((file) => path.join(module, file)).find(
    (file) => existsSync(file)
  )
  return {
    cwd,
    root: target
      ? path.resolve(cwd, target)
      : path.join(module, KOTLIN_PACKAGE),
    buildFile,
    settings: readText(buildFile),
  }
}

function swiftRequirements(project, { ios, packages }) {
  const missing = packages
    .filter(
      ({ url }) =>
        !project.settings.includes(
          new URL(url).pathname.slice(1).replace(GIT_SUFFIX, "")
        )
    )
    .map(
      ({ url, from, products }) =>
        `Swift package ${url} from ${from} (${products.join(", ")})`
    )
  return {
    title: `Add to your app target (iOS ${ios} or later):`,
    missing,
  }
}

function kotlinRequirements(project, { minSdk, bom, dependencies }) {
  const settings = project.settings
  const declared = (coordinate) =>
    settings.includes(coordinate.split(":").slice(0, 2).join(":"))
  const sdk = Number(settings.match(MIN_SDK)?.[1])
  const missing = [
    ...(COMPOSE_PLUGIN.test(settings)
      ? []
      : ['plugins { id("org.jetbrains.kotlin.plugin.compose") }']),
    ...(COMPOSE_ENABLED.test(settings)
      ? []
      : ["android { buildFeatures { compose = true } }"]),
    ...(sdk >= minSdk
      ? []
      : [`android { defaultConfig { minSdk = ${minSdk} } }`]),
    ...(bom && !declared(bom)
      ? [`dependencies { implementation(platform("${bom}")) }`]
      : []),
    ...dependencies
      .filter((dependency) => !declared(dependency))
      .map((dependency) => `dependencies { implementation("${dependency}") }`),
  ]
  return {
    title: `Add to ${path.relative(project.cwd, project.buildFile)}:`,
    missing,
  }
}

const PLATFORMS = {
  swift: {
    title: "SwiftUI",
    detect: detectXcode,
    requirements: swiftRequirements,
  },
  kotlin: {
    title: "Compose",
    detect: detectGradle,
    requirements: kotlinRequirements,
  },
}

async function setup(options) {
  const platform = PLATFORMS[options.platform]
  const project = platform.detect(options.cwd, options.path)
  const registry = await fetchRegistry()
  const spec = registry.platforms?.[options.platform]
  if (!spec) {
    throw new CliError(`The registry has no ${platform.title} files.`)
  }
  const entries = (files) =>
    files.map((file) => ({ file, source: `${spec.directory}/${file}` }))
  return { platform, project, registry, spec, entries }
}

function printRequirements({ platform, project, spec }) {
  const { title, missing } = platform.requirements(project, spec.requirements)
  if (!missing.length) return
  note(title)
  list(missing)
}

export async function initNative(options) {
  const context = await setup(options)
  const { project, registry, spec, entries } = context
  const button = registry.items.find((item) => item.name === "button")
  const files = [
    ...new Set([...spec.base, ...(button?.[options.platform] ?? [])]),
  ]

  reportFiles(
    writeFiles(
      project.cwd,
      project.root,
      await fetchFiles(entries(files)),
      options.overwrite
    )
  )
  printRequirements(context)
  if (project.xcode) {
    note(
      `Make sure ${path.relative(project.cwd, project.root)} is part of your app target in Xcode.`
    )
  }
  step(
    `Ready. Add components with npx @esuiss/ui add <name> --platform ${options.platform}`
  )
}

export async function addNative(names, options) {
  const context = await setup(options)
  const { platform, project, registry, spec, entries } = context
  const relativeRoot = path.relative(project.cwd, project.root) || "."
  if (!spec.base.every((file) => existsSync(path.join(project.root, file)))) {
    throw new CliError(
      `No ${platform.title} theme found in ${relativeRoot}. Run \`npx @esuiss/ui init --platform ${options.platform}${options.path ? ` --path ${options.path}` : ""}\` first.`
    )
  }

  const byName = new Map(registry.items.map((item) => [item.name, item]))
  const platformItems = registry.items.filter((item) => item[options.platform])
  const available = platformItems.map((item) => item.name)
  const picking = !names.length && !options.all && isInteractive()
  const chosen = picking ? await pickNames(platformItems) : names
  const selected = options.all ? available : chosen
  if (!selected.length) {
    throw new CliError(
      `Name at least one component, e.g. npx @esuiss/ui add button --platform ${options.platform}\nAvailable: ${availableNames(platformItems)}`
    )
  }
  const unknown = selected.filter((name) => !byName.has(name))
  if (unknown.length) {
    throw new CliError(
      `Unknown component: ${unknown.join(", ")}.\nAvailable for ${platform.title}: ${available.join(", ")}`
    )
  }
  const unavailable = selected.filter(
    (name) => !byName.get(name)[options.platform]
  )
  if (unavailable.length) {
    const platformsOf = (name) =>
      [
        "React Native",
        ...Object.entries(PLATFORMS)
          .filter(([key]) => byName.get(name)[key])
          .map(([, other]) => other.title),
      ]
        .join(", ")
        .replace(LAST_LIST_SEPARATOR, " and $1")
    throw new CliError(
      unavailable
        .map(
          (name) =>
            `${name} is not available for ${platform.title}, only for ${platformsOf(name)}.`
        )
        .join("\n")
    )
  }

  const items = selected.map((name) => byName.get(name))
  if (options.diff) {
    await showDiff(
      project.cwd,
      project.root,
      entries(items.map((item) => item[options.platform][0]))
    )
    return
  }

  const files = [...new Set(items.flatMap((item) => item[options.platform]))]
  reportFiles(
    writeFiles(
      project.cwd,
      project.root,
      await fetchFiles(entries(files)),
      options.overwrite
    )
  )
  printRequirements(context)
}
