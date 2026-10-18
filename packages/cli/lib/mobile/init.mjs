import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { CliError, confirm, note, step } from "../output.mjs"
import { choose, isInteractive } from "../prompt.mjs"
import { fetchThemes } from "../registry.mjs"
import { ensureAlias, relative } from "../shared/project.mjs"
import { installItems } from "./add.mjs"
import { configureNativewindBabel, ensureBabelPlugin } from "./babel.mjs"
import { expoFontPlugin, fontList, fontModule, presetFonts } from "./fonts.mjs"
import {
  detectProject,
  detectStyling,
  findAliasRoot,
  install,
  run,
  STYLINGS,
} from "./project.mjs"
import {
  fetchRegistry,
  fetchStylesheet,
  fetchText,
  presetFile,
} from "./registry.mjs"
import { themed, themeOptionsFor } from "./theme.mjs"

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

async function writeTailwindConfig(project, registry, options, theme) {
  const existing = TAILWIND_CONFIGS.map((name) =>
    path.join(project.cwd, name)
  ).find(existsSync)
  const file = existing ?? path.join(project.cwd, "tailwind.config.js")
  const config = themed(
    await fetchText(
      presetFile(registry, "nativewind", options.style) ??
        registry.styles.nativewind.config
    ),
    "nativewind-config",
    theme
  )
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

const STYLING_CHOICES = [
  { value: "uniwind", label: "Uniwind" },
  { value: "nativewind", label: "NativeWind v4" },
  { value: "stylesheet", label: "React Native StyleSheet" },
]

function pickStyling(project, options) {
  const detected = detectStyling(project, options.styling)
  if (detected) return detected
  if (options.yes || !isInteractive()) return STYLINGS[0]
  return choose("How should components be styled?", STYLING_CHOICES)
}

async function writeTheme(project, registry, root, style, options) {
  const file = path.join(root, "components", "ui", "theme.ts")
  const theme = themed(
    await fetchText(
      presetFile(registry, "stylesheet", style) ??
        registry.styles.stylesheet.theme
    ),
    "stylesheet",
    options
  )
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

function readJsonFile(file) {
  try {
    return JSON.parse(readFileSync(file, "utf8"))
  } catch {
    return null
  }
}

function configureFonts(project, root, fonts) {
  if (!fonts) return []
  const manual = []
  install(project, [
    ...(project.framework === "expo" ? ["expo-font"] : []),
    ...fontList(fonts).map((font) => font.package),
  ])
  const module = path.join(root, "components", "primitives", "font.ts")
  mkdirSync(path.dirname(module), { recursive: true })
  writeFileSync(module, fontModule(fonts))
  step(`Set the fonts in ${relative(project, module)}`)

  const plugin = expoFontPlugin(project.cwd, fonts)
  const appJson = path.join(project.cwd, "app.json")
  const app = project.framework === "expo" && readJsonFile(appJson)
  if (app?.expo) {
    const plugins = (app.expo.plugins ?? []).filter(
      (entry) => (Array.isArray(entry) ? entry[0] : entry) !== "expo-font"
    )
    app.expo.plugins = [...plugins, plugin]
    writeFileSync(appJson, `${JSON.stringify(app, null, 2)}\n`)
    step("Added the fonts to the expo-font plugin in app.json")
    manual.push(
      "The fonts are embedded at build time. Rebuild the app (npx expo prebuild, then run it again) to see them."
    )
  } else if (project.framework === "expo") {
    manual.push(
      `Add this entry to the plugins of your Expo config, then rebuild the app:\n${JSON.stringify(plugin, null, 2)}`
    )
  } else {
    manual.push(
      `Link the font files from ${fontList(fonts)
        .map((font) => `node_modules/${font.package}`)
        .join(
          " and "
        )} into the native projects (for example with react-native-asset), then rebuild the app.`
    )
  }
  return manual
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
  const theme = await themeOptionsFor(options, fetchThemes, registry.colors)
  const css = usesCss
    ? themed(
        await fetchStylesheet(registry, project.styling, options.style),
        project.styling === "uniwind" ? "uniwind" : "nativewind-css",
        theme
      )
    : null

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
    await writeTailwindConfig(project, registry, options, theme)
  }

  if (css) {
    writeFileSync(stylesheet, css)
    step(`Wrote ${relative(project, stylesheet)}`)
  } else {
    await writeTheme(
      project,
      registry,
      findAliasRoot(project.cwd) ?? sourceRoot,
      options.style,
      theme
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
      : [
          "button",
          "primitives/hooks",
          "primitives/portal",
          "primitives/toggle",
          "primitives/toggle-group",
        ],
    { styling: project.styling, overwrite: options.overwrite }
  )

  manual.push(
    ...configureFonts(
      project,
      findAliasRoot(project.cwd) ?? sourceRoot,
      presetFonts(options)
    )
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
