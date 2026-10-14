import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { CliError, choose, confirm, note, step } from "../output.mjs"
import { installItems } from "./add.mjs"
import { configureNativewindBabel, ensureBabelPlugin } from "./babel.mjs"
import {
  detectProject,
  detectStyling,
  findAliasRoot,
  install,
  run,
  STYLINGS,
} from "./project.mjs"
import { fetchRegistry, fetchStylesheet, fetchText } from "./registry.mjs"

const METRO_CONFIGS = ["metro.config.js", "metro.config.cjs"]
const ROOT_COMPONENTS = [
  "src/app/_layout.tsx",
  "app/_layout.tsx",
  "src/App.tsx",
  "App.tsx",
]
const STYLING_SETUP = {
  uniwind: {
    runtime: ["uniwind", "tailwindcss"],
    tooling: [],
    tailwindMajor: 4,
    metroImport: 'const { withUniwindConfig } = require("uniwind/metro")',
    metroMarker: "withUniwindConfig",
  },
  stylesheet: {
    runtime: [
      "react-native-reanimated",
      "react-native-worklets",
      "react-native-svg",
    ],
    tooling: [],
    tailwindMajor: null,
    metroImport: "",
    metroMarker: "",
  },
  nativewind: {
    runtime: ["nativewind@^4.2.7", "react-native-css-interop@^0.2.7"],
    tooling: ["tailwindcss@^3.4.17"],
    tailwindMajor: 3,
    metroImport: 'const { withNativeWind } = require("nativewind/metro")',
    metroMarker: "withNativeWind",
  },
}
const TAILWIND_CONFIGS = [
  "tailwind.config.js",
  "tailwind.config.cjs",
  "tailwind.config.ts",
]
const MAJOR_VERSION = /\d+/
const TSCONFIG_PATHS = /"paths"\s*:\s*\{/
const TSCONFIG_COMPILER_OPTIONS = /"compilerOptions"\s*:\s*\{/
const METRO_EXPORT = /module\.exports\s*=\s*([\s\S]+?);?\s*$/
const FIRST_IMPORT = /^import\s/m
const LAST_JSX_CLOSING = /\n(\s*)<\/(\w[\w.]*)>\n\s*\)/
const METRO_DEFAULTS = {
  expo: 'const { getDefaultConfig } = require("expo/metro-config")',
  "react-native":
    'const { getDefaultConfig } = require("@react-native/metro-config")',
}
const PORTAL_IMPORT =
  'import { PortalHost } from "@/components/primitives/portal"'

function relative(project, file) {
  return path.relative(project.cwd, file)
}

function posix(file) {
  return file.split(path.sep).join("/")
}

function majorOf(version) {
  return version ? Number(version.match(MAJOR_VERSION)?.[0]) : null
}

function assertVersions(project) {
  const { tailwindMajor } = STYLING_SETUP[project.styling]
  if (!tailwindMajor) return
  const tailwind = project.packages.tailwindcss
  if (tailwind && majorOf(tailwind) !== tailwindMajor) {
    throw new CliError(
      `${project.styling === "uniwind" ? "Uniwind" : "NativeWind v4"} needs Tailwind CSS v${tailwindMajor}, this project uses ${tailwind}.`
    )
  }
  const nativewind = project.packages.nativewind
  if (
    project.styling === "nativewind" &&
    nativewind &&
    majorOf(nativewind) !== 4
  ) {
    throw new CliError(
      `esuiss supports NativeWind v4, this project uses ${nativewind}.`
    )
  }
}

function addAlias(project, target) {
  const file = path.join(project.cwd, "tsconfig.json")
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

function ensureAlias(project, sourceRoot) {
  if (findAliasRoot(project.cwd)) return false
  addAlias(
    project,
    sourceRoot === project.cwd ? "./*" : `./${relative(project, sourceRoot)}/*`
  )
  return true
}

function metroOptions(project, stylesheet, typesFile) {
  const css = `./${posix(relative(project, stylesheet))}`
  return project.styling === "uniwind"
    ? `{\n  cssEntryFile: "${css}",\n  dtsFile: "./${posix(relative(project, typesFile))}",\n}`
    : `{\n  input: "${css}",\n  inlineRem: 16,\n}`
}

function metroHeader(project) {
  const { metroImport } = STYLING_SETUP[project.styling]
  return metroImport ? `${metroImport}\n` : ""
}

function wrapConfig(project, expression, options) {
  return `module.exports = ${STYLING_SETUP[project.styling].metroMarker}(${expression}, ${options})\n`
}

function configureMetro(project, stylesheet, typesFile) {
  if (project.styling === "stylesheet") return []
  const options = metroOptions(project, stylesheet, typesFile)
  const file = METRO_CONFIGS.map((name) => path.join(project.cwd, name)).find(
    existsSync
  )

  if (!file) {
    writeFileSync(
      path.join(project.cwd, "metro.config.js"),
      `${METRO_DEFAULTS[project.framework]}\n${metroHeader(project)}\nconst config = getDefaultConfig(__dirname)\n\n${wrapConfig(project, "config", options)}`
    )
    step("Created metro.config.js")
    return []
  }

  const text = readFileSync(file, "utf8")
  const { metroMarker, metroImport } = STYLING_SETUP[project.styling]
  if (text.includes(metroMarker)) return []

  const exported = text.match(METRO_EXPORT)
  if (!exported) {
    return [
      `Wrap the exported config in ${relative(project, file)} with ${metroMarker} (${metroImport}).`,
    ]
  }

  writeFileSync(
    file,
    `${metroHeader(project)}${text.slice(0, exported.index)}${wrapConfig(project, exported[1].trim(), options)}`
  )
  step(`Configured ${relative(project, file)}`)
  return []
}

function findRootComponent(project) {
  return ROOT_COMPONENTS.map((name) => path.join(project.cwd, name)).find(
    existsSync
  )
}

function importPath(from, to) {
  const specifier = posix(path.relative(path.dirname(from), to))
  return specifier.startsWith(".") ? specifier : `./${specifier}`
}

function lastImportEnd(text) {
  const imports = [...text.matchAll(/^import[\s\S]*?["'][^"']+["'];?\n/gm)]
  const last = imports.at(-1)
  return last ? last.index + last[0].length : 0
}

function configureRoot(project, stylesheet) {
  const file = findRootComponent(project)
  const cssImport = stylesheet
    ? `import "${importPath(file ?? stylesheet, stylesheet)}"`
    : null
  if (!file) {
    return [
      `${cssImport ? `Add ${cssImport} and render` : "Render"} <PortalHost /> from "@/components/primitives/portal" in your root component.`,
    ]
  }

  let text = readFileSync(file, "utf8")
  const original = text
  const manual = []
  const cssName = stylesheet ? path.basename(stylesheet) : null

  if (
    cssImport &&
    !new RegExp(`import\\s+["'][^"']*${cssName}["']`).test(text)
  ) {
    const firstImport = text.search(FIRST_IMPORT)
    const at = firstImport === -1 ? 0 : firstImport
    text = `${text.slice(0, at)}${cssImport}\n${text.slice(at)}`
  }

  if (!text.includes("<PortalHost")) {
    const closing = text.match(LAST_JSX_CLOSING)
    if (closing) {
      const indent = `${closing[1]}  `
      text = `${text.slice(0, closing.index)}\n${indent}<PortalHost />${text.slice(closing.index)}`
      const end = lastImportEnd(text)
      text = `${text.slice(0, end)}${PORTAL_IMPORT}\n${text.slice(end)}`
    } else {
      manual.push(
        `Render <PortalHost /> from "@/components/primitives/portal" as the last child of your root component in ${relative(project, file)}.`
      )
    }
  }

  if (text !== original) {
    writeFileSync(file, text)
    step(`Configured ${relative(project, file)}`)
  }
  return manual
}

function configureAliasResolver(project, sourceRoot) {
  if (project.framework !== "react-native") return []
  install(project, ["babel-plugin-module-resolver"], { dev: true })
  const aliasRoot = findAliasRoot(project.cwd) ?? sourceRoot
  const target = posix(relative(project, aliasRoot)) || "."
  return ensureBabelPlugin(
    project,
    "module-resolver",
    `["module-resolver", { alias: { "@": "./${target === "." ? "" : target}" } }]`
  )
}

function writeNativewindTypes(project) {
  const file = path.join(project.cwd, "nativewind-env.d.ts")
  if (existsSync(file)) return
  writeFileSync(file, '/// <reference types="nativewind/types" />\n')
  step(`Created ${relative(project, file)}`)
}

async function writeTailwindConfig(project, registry, options) {
  const existing = TAILWIND_CONFIGS.map((name) =>
    path.join(project.cwd, name)
  ).find(existsSync)
  const file = existing ?? path.join(project.cwd, "tailwind.config.js")
  const config = await fetchText(registry.styles.nativewind.config)
  if (existing && readFileSync(existing, "utf8") === config) return
  if (existing && !options.yes) {
    const replace = await confirm(
      `Replace ${relative(project, existing)} with the esuiss Tailwind config?`
    )
    if (!replace) {
      throw new CliError("Cancelled. Run again with --yes to replace it.")
    }
  }
  writeFileSync(file, config)
  step(`Wrote ${relative(project, file)}`)
}

const STYLING_CHOICES = {
  Uniwind: "uniwind",
  "NativeWind v4": "nativewind",
  "React Native StyleSheet": "stylesheet",
}

async function pickStyling(project, options) {
  const detected = detectStyling(project, options.styling)
  if (detected) return detected
  if (options.yes) return STYLINGS[0]
  const answer = await choose(
    "How should components be styled?",
    Object.keys(STYLING_CHOICES)
  )
  return STYLING_CHOICES[answer]
}

async function writeTheme(project, registry, root) {
  const file = path.join(root, "components", "ui", "theme.ts")
  const theme = await fetchText(registry.styles.stylesheet.theme)
  if (existsSync(file)) {
    if (readFileSync(file, "utf8") !== theme) {
      note(
        `Kept ${relative(project, file)}. Compare it with the registry theme if components look off.`
      )
    }
    return
  }
  mkdirSync(path.dirname(file), { recursive: true })
  writeFileSync(file, theme)
  step(`Wrote ${relative(project, file)}`)
}

export async function init(options) {
  const project = detectProject(options.cwd)
  project.styling = await pickStyling(project, options)
  assertVersions(project)
  const setup = STYLING_SETUP[project.styling]

  const sourceRoot = existsSync(path.join(project.cwd, "src"))
    ? path.join(project.cwd, "src")
    : project.cwd
  const stylesheet = path.join(sourceRoot, "global.css")
  const typesFile = path.join(sourceRoot, "uniwind-types.d.ts")

  const usesCss = project.styling !== "stylesheet"
  const stylesheetExists = existsSync(stylesheet)
  if (
    usesCss &&
    stylesheetExists &&
    readFileSync(stylesheet, "utf8").trim() &&
    !options.yes
  ) {
    const replace = await confirm(
      `Replace ${relative(project, stylesheet)} with the esuiss stylesheet?`
    )
    if (!replace) {
      throw new CliError(
        "Cancelled. Run again with --yes to replace the stylesheet."
      )
    }
  }

  const registry = await fetchRegistry()
  const css = usesCss ? await fetchStylesheet(registry, project.styling) : null

  if (ensureAlias(project, sourceRoot))
    step("Added the @/* import alias to tsconfig.json")

  install(project, setup.runtime)
  install(project, setup.tooling, { dev: true })
  const worklets = setup.runtime.includes("react-native-reanimated")
    ? ensureBabelPlugin(
        project,
        "react-native-worklets/plugin",
        '"react-native-worklets/plugin"',
        { last: true }
      )
    : []
  if (project.styling === "nativewind") {
    if (project.framework === "expo") {
      install(project, ["babel-preset-expo", "expo-system-ui"])
    }
    await writeTailwindConfig(project, registry, options)
  }

  if (css) {
    writeFileSync(stylesheet, css)
    step(`Wrote ${relative(project, stylesheet)}`)
  } else {
    await writeTheme(
      project,
      registry,
      findAliasRoot(project.cwd) ?? sourceRoot
    )
  }

  const manual = [
    ...worklets,
    ...configureMetro(project, stylesheet, typesFile),
    ...configureRoot(project, css ? stylesheet : null),
    ...configureAliasResolver(project, sourceRoot),
    ...(project.styling === "nativewind"
      ? configureNativewindBabel(project)
      : []),
  ]

  await installItems(
    project,
    findAliasRoot(project.cwd) ?? sourceRoot,
    registry,
    css
      ? ["button", "primitives/portal"]
      : ["button", "primitives/hooks", "primitives/portal"],
    { styling: project.styling }
  )

  if (project.styling === "uniwind") {
    run(project, [
      "uniwind",
      "generate-artifacts",
      "--css",
      `./${posix(relative(project, stylesheet))}`,
      "--dts",
      `./${posix(relative(project, typesFile))}`,
    ])
    step(`Generated ${relative(project, typesFile)}`)
  } else if (project.styling === "nativewind") {
    writeNativewindTypes(project)
  }

  if (css) {
    const cssTypes = path.join(sourceRoot, "css.d.ts")
    if (!existsSync(cssTypes)) {
      writeFileSync(cssTypes, 'declare module "*.css"\n')
      step(`Created ${relative(project, cssTypes)}`)
    }
  }

  for (const message of manual) note(message)
  step("Ready. Add components with npx @esuiss/ui add <name>")
}
