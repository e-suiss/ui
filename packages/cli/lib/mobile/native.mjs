import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs"
import path from "node:path"
import { CliError, list, note, step } from "../output.mjs"
import { choose, isInteractive } from "../prompt.mjs"
import { fetchThemes } from "../registry.mjs"
import { printDiff, reportFiles, writeFiles } from "../shared/files.mjs"
import { chooseNames } from "../shared/select.mjs"
import { fetchFiles, scopeOf } from "./add.mjs"
import { applyFonts, assetName, downloadFaces, presetFonts } from "./fonts.mjs"
import {
  iconLibraryFor,
  isPhosphorRequirement,
  usesCustomIcons,
  withIcons,
} from "./icons.mjs"
import { fetchRegistry, fetchText, presetFile } from "./registry.mjs"
import { themed, themeOptionsFor } from "./theme.mjs"

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

async function swiftRoot(cwd, project, options) {
  if (options.path) return path.resolve(cwd, options.path)
  const targets = directories(path.join(cwd, "Sources"))
  if (project || !targets.length) return path.join(cwd, "EsuissUI")
  const rootOf = (target) => path.join(cwd, "Sources", target, "EsuissUI")
  if (targets.length === 1) return rootOf(targets[0])
  const used = targets.filter((target) => existsSync(rootOf(target)))
  if (used.length === 1) return rootOf(used[0])
  if (options.yes || !isInteractive()) {
    throw new CliError(
      `This Swift package has ${targets.length} targets: ${targets.join(", ")}. Pick one with --path Sources/<target>/EsuissUI.`
    )
  }
  return rootOf(
    await choose(
      "Which target should get the SwiftUI files?",
      targets.map((target) => ({ value: target, label: target }))
    )
  )
}

async function detectXcode(cwd, options) {
  const { project, manifest } = xcodeEntries(cwd)
  if (!project && !manifest) {
    throw new CliError(
      `No Xcode project or Package.swift found in ${cwd}. Run this in your app folder or pass --cwd.`
    )
  }
  return {
    cwd,
    root: await swiftRoot(cwd, project, options),
    xcode: Boolean(project),
    settings: [
      readText(path.join(cwd, "Package.swift")),
      project ? readText(path.join(cwd, project, "project.pbxproj")) : "",
    ].join("\n"),
  }
}

function detectGradle(cwd, { path: target }) {
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
  const project = await platform.detect(options.cwd, options)
  const registry = await fetchRegistry()
  const spec = registry.platforms?.[options.platform]
  if (!spec) {
    throw new CliError(`The registry has no ${platform.title} files.`)
  }
  const tokens = presetFile(registry, options.platform, options.style)
  const entries = (files) =>
    files.map((file) => ({
      file,
      source:
        tokens && path.posix.basename(file).startsWith("Tokens.")
          ? tokens
          : `${spec.directory}/${file}`,
    }))
  step(
    `${platform.title} files go to ${path.relative(project.cwd, project.root) || "."}`
  )
  const library = iconLibraryFor(options.platform, project.root, options)
  const download = async (files) =>
    withIcons(
      {
        platform: options.platform,
        root: project.root,
        registry,
        library,
        fetchText,
      },
      await fetchFiles(project.root, entries(files))
    )
  return { platform, project, registry, spec, download, library }
}

function requirementsFor(spec, library) {
  if (!usesCustomIcons(library)) return spec.requirements
  const { packages, dependencies, ...rest } = spec.requirements
  return {
    ...rest,
    ...(packages && {
      packages: packages.filter((entry) => !isPhosphorRequirement(entry)),
    }),
    ...(dependencies && {
      dependencies: dependencies.filter(
        (entry) => !isPhosphorRequirement(entry)
      ),
    }),
  }
}

function printRequirements({ platform, project, spec, library }) {
  const { title, missing } = platform.requirements(
    project,
    requirementsFor(spec, library)
  )
  if (!missing.length) return
  note(title)
  list(missing)
}

function fontDirectory(project, platform) {
  if (platform === "swift") return path.join(project.root, "Fonts")
  const main = `${path.sep}src${path.sep}main${path.sep}`
  const index = project.root.indexOf(main)
  if (index === -1) return null
  return path.join(
    project.root.slice(0, index + main.length),
    "assets",
    "fonts"
  )
}

function writeFonts(project, platform, faces) {
  const directory = fontDirectory(project, platform)
  if (!directory) {
    note(
      "Copy the font files into src/main/assets/fonts of your app module so Compose can load them."
    )
    return
  }
  mkdirSync(directory, { recursive: true })
  for (const face of faces) {
    const name = platform === "swift" ? face.file : assetName(face)
    writeFileSync(path.join(directory, name), face.bytes)
  }
  step(
    `Added ${faces.length} font file${faces.length === 1 ? "" : "s"} to ${path.relative(project.cwd, directory)}`
  )
  if (platform === "swift") {
    note(
      `Make sure ${path.relative(project.cwd, directory)} is part of your app target so the fonts are copied into the app.`
    )
  }
}

export async function initNative(options) {
  const context = await setup(options)
  const { project, registry, spec, download } = context
  const button = registry.items.find((item) => item.name === "button")
  const files = [
    ...new Set([...spec.base, ...(button?.[options.platform] ?? [])]),
  ]

  const theme = await themeOptionsFor(
    options,
    fetchThemes,
    context.registry.colors
  )
  const fonts = presetFonts(options)
  const faces = fonts ? await downloadFaces(fonts) : []
  const downloaded = (await download(files)).map((file) => {
    if (!path.basename(file.target).startsWith("Tokens.")) return file
    const content = themed(file.content, options.platform, theme)
    return {
      ...file,
      content: fonts
        ? applyFonts(content, options.platform, fonts, faces)
        : content,
    }
  })
  reportFiles(writeFiles(project.cwd, downloaded, options.overwrite))
  if (faces.length) writeFonts(project, options.platform, faces)
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
  const { platform, project, registry, spec, download } = context
  const relativeRoot = path.relative(project.cwd, project.root) || "."
  if (!spec.base.every((file) => existsSync(path.join(project.root, file)))) {
    throw new CliError(
      `No ${platform.title} theme found in ${relativeRoot}. Run \`npx @esuiss/ui init --platform ${options.platform}${options.path ? ` --path ${options.path}` : ""}\` first.`
    )
  }

  const byName = new Map(registry.items.map((item) => [item.name, item]))
  const platformItems = registry.items.filter((item) => item[options.platform])
  const unavailable = names.filter(
    (name) => byName.has(name) && !byName.get(name)[options.platform]
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

  const selected = await chooseNames(registry.items, names, options, {
    scopeOf,
    pickFrom: platformItems,
    include: (item) => item[options.platform],
    suffix: ` --platform ${options.platform}`,
    title: platform.title,
  })

  const files = [
    ...new Set(selected.flatMap((name) => byName.get(name)[options.platform])),
  ]
  const downloaded = await download(files)
  if (options.diff) {
    printDiff(project.cwd, downloaded)
    return
  }
  reportFiles(writeFiles(project.cwd, downloaded, options.overwrite))
  printRequirements(context)
}
