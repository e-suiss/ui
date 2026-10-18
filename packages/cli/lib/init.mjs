import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"

import { addStyles, installedItems, installItems } from "./add.mjs"
import {
  configureNextFont,
  NEXT_LAYOUTS,
  NEXT_PAGES_APPS,
  presetWebFont,
  withFont,
} from "./fonts.mjs"
import { CliError, confirm, note, step } from "./output.mjs"
import { decodePreset } from "./preset.mjs"
import {
  configuredStylesheet,
  detectBase,
  detectIcons,
  detectMenuAccent,
  detectMenuColor,
  detectProject,
  detectStyle,
  findAliasRoot,
  findStylesheet,
  install,
  saveBase,
  VITE_STYLESHEET,
} from "./project.mjs"
import { fetchRegistry, fetchStylesheet } from "./registry.mjs"
import { assertPackageNames, ensureAlias, relative } from "./shared/project.mjs"
import { DEFAULT_STYLE } from "./styles.mjs"
import { applyPreset, presetPalette, withPointer } from "./theme.mjs"

export { POINTER_CSS } from "./theme.mjs"

const NEXT_APP_DIRS = ["src/app", "app"]
const VITE_CONFIGS = [
  "vite.config.ts",
  "vite.config.mts",
  "vite.config.js",
  "vite.config.mjs",
]
const POSTCSS_CONFIGS = [
  "postcss.config.mjs",
  "postcss.config.js",
  "postcss.config.cjs",
  "postcss.config.ts",
]
const POSTCSS_CONFIG = `const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
}

export default config
`
const TOOLING = {
  next: ["tailwindcss", "@tailwindcss/postcss"],
  vite: ["tailwindcss", "@tailwindcss/vite", "@types/node"],
}
const MINIMUM_TAILWIND = [4, 2]

const VERSION_NUMBER = /(\d+)(?:\.(\d+))?/
const OPEN_RANGE = /^\s*(\^|>=?)/
const VITE_PLUGINS = /plugins\s*:\s*\[/
const VITE_ALIAS = /["']@["']\s*:/
const VITE_DEFINE_CONFIG = /defineConfig\(\{/
const VITE_RESOLVE = /\bresolve\s*:/
const TURBOPACK_TAILWIND = /@tailwindcss\/turbopack/
const NEXT_CONFIGS = ["next.config.ts", "next.config.mjs", "next.config.js"]

const VITE_ENTRIES = [
  "src/main.tsx",
  "src/main.jsx",
  "src/main.ts",
  "src/main.js",
]
const REGEXP_SPECIAL = /[.*+?^${}()|[\]\\]/g

export const RTL_NOTE =
  'suiss/ui components use logical properties, so they already work right to left. Set dir="rtl" on <html> for a right-to-left app.'

function stylesheetPath(project) {
  const configured = configuredStylesheet(project.cwd)
  if (configured) return configured
  if (project.framework === "vite")
    return path.join(project.cwd, VITE_STYLESHEET)
  const existing = findStylesheet(project)
  if (existing) return existing
  const appDir = NEXT_APP_DIRS.map((dir) => path.join(project.cwd, dir)).find(
    existsSync
  )
  if (!appDir)
    throw new CliError("Could not find the app directory (app/ or src/app/).")
  return path.join(appDir, "globals.css")
}

function installedVersion(project, name) {
  const manifest = path.join(project.cwd, "node_modules", name, "package.json")
  if (existsSync(manifest)) {
    return {
      version: JSON.parse(readFileSync(manifest, "utf8")).version,
      installed: true,
    }
  }
  return { version: project.packages[name], installed: false }
}

function assertTailwindVersion(project) {
  const { version, installed } = installedVersion(project, "tailwindcss")
  const match = version?.match(VERSION_NUMBER)
  if (!match) return
  const major = Number(match[1])
  const minor = match[2] === undefined ? undefined : Number(match[2])
  const [requiredMajor, requiredMinor] = MINIMUM_TAILWIND
  const open = !installed && OPEN_RANGE.test(version)
  const tooOld =
    major < requiredMajor ||
    (!open &&
      major === requiredMajor &&
      minor !== undefined &&
      minor < requiredMinor)
  if (tooOld) {
    throw new CliError(
      `Tailwind CSS ${requiredMajor}.${requiredMinor} or later is required, this project uses ${version}. Upgrade tailwindcss and run init again.`
    )
  }
}

export function stylesheetPackages(css) {
  return [...css.matchAll(/@import\s+["']([^"']+)["']/g)]
    .map(([, specifier]) => specifier)
    .filter(
      (specifier) =>
        !specifier.startsWith(".") &&
        !specifier.startsWith("/") &&
        specifier !== "tailwindcss"
    )
    .map((specifier) => {
      const parts = specifier.split("/")
      return specifier.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0]
    })
}

function configureVite(project) {
  const file = VITE_CONFIGS.map((name) => path.join(project.cwd, name)).find(
    existsSync
  )
  if (!file)
    return [
      "Create a vite.config.ts with the tailwindcss() plugin and an @ alias to ./src.",
    ]

  let text = readFileSync(file, "utf8")
  const original = text
  const manual = []

  if (!text.includes("@tailwindcss/vite")) {
    if (VITE_PLUGINS.test(text)) {
      text = text.replace(VITE_PLUGINS, (match) => `${match}tailwindcss(), `)
      text = `import tailwindcss from "@tailwindcss/vite"\n${text}`
    } else {
      manual.push(
        `Add tailwindcss() from "@tailwindcss/vite" to the plugins in ${relative(project, file)}.`
      )
    }
  }

  if (!VITE_ALIAS.test(text)) {
    if (VITE_DEFINE_CONFIG.test(text) && !VITE_RESOLVE.test(text)) {
      text = text.replace(
        VITE_DEFINE_CONFIG,
        (match) =>
          `${match}\n  resolve: {\n    alias: {\n      "@": fileURLToPath(new URL("./src", import.meta.url)),\n    },\n  },`
      )
      text = `import { fileURLToPath } from "node:url"\n${text}`
    } else {
      manual.push(
        `Add an "@" alias pointing to ./src in ${relative(project, file)}.`
      )
    }
  }

  if (text !== original) {
    writeFileSync(file, text)
    step(`Configured ${relative(project, file)}`)
  }
  return manual
}

function usesTurbopackTailwind(project) {
  return NEXT_CONFIGS.map((name) => path.join(project.cwd, name)).some(
    (file) =>
      existsSync(file) && TURBOPACK_TAILWIND.test(readFileSync(file, "utf8"))
  )
}

function toolingFor(project) {
  if (project.framework === "next" && usesTurbopackTailwind(project)) {
    return ["tailwindcss"]
  }
  return TOOLING[project.framework]
}

function configureNext(project) {
  if (usesTurbopackTailwind(project)) return []
  const existing = POSTCSS_CONFIGS.map((name) =>
    path.join(project.cwd, name)
  ).find(existsSync)
  if (!existing) {
    writeFileSync(path.join(project.cwd, "postcss.config.mjs"), POSTCSS_CONFIG)
    step("Created postcss.config.mjs")
    return []
  }
  if (!readFileSync(existing, "utf8").includes("@tailwindcss/postcss")) {
    return [
      `Add "@tailwindcss/postcss" to the plugins in ${relative(project, existing)}.`,
    ]
  }
  return []
}

function importsStylesheet(project, stylesheet) {
  const name = path.basename(stylesheet).replace(REGEXP_SPECIAL, "\\$&")
  const statement = new RegExp(`import\\s+["'][^"']*\\b${name}["']`)
  const entries =
    project.framework === "next"
      ? [...NEXT_LAYOUTS, ...NEXT_PAGES_APPS]
      : VITE_ENTRIES
  return entries
    .map((file) => path.join(project.cwd, file))
    .some(
      (file) => existsSync(file) && statement.test(readFileSync(file, "utf8"))
    )
}

function entryName(project) {
  if (project.framework !== "next") return "src/main.tsx"
  const pages = NEXT_PAGES_APPS.find((file) =>
    existsSync(path.join(project.cwd, file))
  )
  const app = NEXT_LAYOUTS.find((file) =>
    existsSync(path.join(project.cwd, file))
  )
  return !app && pages ? pages : "your root layout"
}

export function presetFont(preset) {
  return preset ? presetWebFont(preset) : null
}

export function configureFont(project, font) {
  return project.framework === "next" ? configureNextFont(project, font) : []
}

function rememberBase(project, base, stylesheet, style, extra) {
  const saved = saveBase(project, base, stylesheet, style, extra)
  if (!saved) return []
  if (saved.invalid) {
    return [
      `Could not read ${relative(project, saved.file)}. Set its style to ${base}-${style ?? DEFAULT_STYLE} so add keeps using the ${base} base.`,
    ]
  }
  step(
    `${saved.created ? "Created" : "Updated"} ${relative(project, saved.file)} with the ${saved.style} style`
  )
  return []
}

function stylingOf(cwd) {
  return {
    base: detectBase(cwd),
    style: detectStyle(cwd),
    icons: detectIcons(cwd),
    menuColor: detectMenuColor(cwd),
    menuAccent: detectMenuAccent(cwd),
  }
}

export function styleWarning(options, preset) {
  if (
    preset &&
    options.style &&
    options.style !== DEFAULT_STYLE &&
    options.style !== preset.style
  ) {
    note(
      `The preset uses the ${preset.style} style, --style ${options.style} replaces it.`
    )
  }
}

export async function init(options) {
  const project = detectProject(options.cwd)
  assertTailwindVersion(project)

  const sourceRoot = existsSync(path.join(project.cwd, "src"))
    ? path.join(project.cwd, "src")
    : project.cwd
  if (project.framework === "vite" && sourceRoot === project.cwd) {
    throw new CliError("Expected a src/ directory in this Vite project.")
  }

  const stylesheet = stylesheetPath(project)
  const stylesheetExists = existsSync(stylesheet)
  if (
    stylesheetExists &&
    readFileSync(stylesheet, "utf8").trim() &&
    !options.yes
  ) {
    const replace = await confirm(
      `Replace ${relative(project, stylesheet)} with the suiss/ui stylesheet?`
    )
    if (!replace) {
      throw new CliError(
        "Cancelled. Run again with --yes to replace the stylesheet."
      )
    }
  }

  const preset = options.preset ? decodePreset(options.preset) : null
  styleWarning(options, preset)
  const previous = stylingOf(project.cwd)
  const base = options.base ?? previous.base
  const style = options.style ?? preset?.style ?? previous.style
  const styling = {
    base,
    style,
    icons: preset?.iconLibrary ?? previous.icons,
    menuColor: preset?.menuColor ?? previous.menuColor,
    menuAccent: preset?.menuAccent ?? previous.menuAccent,
  }
  const registry = await fetchRegistry(base)
  const palette = await presetPalette(options, preset)
  const font = presetFont(preset)
  const stylesheetCss = withFont(
    await fetchStylesheet(),
    project.framework,
    font
  )
  const themedCss =
    preset || palette
      ? applyPreset(stylesheetCss, preset, palette)
      : stylesheetCss
  const css = options.pointer ? withPointer(themedCss) : themedCss

  const packages = stylesheetPackages(css)
  assertPackageNames([...toolingFor(project), ...packages])

  const root = findAliasRoot(project.cwd) ?? sourceRoot
  const installed = installedItems(registry, root)
  const restyled = Object.keys(styling).some(
    (key) => styling[key] !== previous[key]
  )
  let names = ["button"]
  let overwrite = options.overwrite
  if (restyled && installed.length) {
    if (!options.yes && !process.stdin.isTTY) {
      throw new CliError(
        `This changes the style of the ${installed.length} installed components. Run again with --yes to restyle them, nothing was changed.`
      )
    }
    const restyle =
      options.yes ||
      (await confirm(
        `Restyle the ${installed.length} installed components? Local changes to them are replaced.`
      ))
    if (!restyle) {
      throw new CliError(
        "Cancelled, nothing was changed. The new style needs the installed components restyled."
      )
    }
    names = [...new Set(["button", ...installed])]
    overwrite = true
  }

  const tsconfigs =
    project.framework === "vite"
      ? ["tsconfig.json", "tsconfig.app.json"]
      : ["tsconfig.json"]
  if (ensureAlias(project, sourceRoot, tsconfigs))
    step("Added the @/* import alias to tsconfig")

  install(project, toolingFor(project), { dev: true })
  install(project, packages)

  const manual =
    project.framework === "vite"
      ? configureVite(project)
      : [...configureNext(project), ...configureFont(project, font)]

  mkdirSync(path.dirname(stylesheet), { recursive: true })
  writeFileSync(stylesheet, css)
  step(`Wrote ${relative(project, stylesheet)}`)
  manual.push(
    ...rememberBase(
      project,
      base,
      stylesheet,
      options.style ?? preset?.style,
      preset
        ? {
            iconLibrary: styling.icons,
            menuColor: styling.menuColor,
            menuAccent: styling.menuAccent,
            baseColor: preset.baseColor,
          }
        : {}
    )
  )
  if (!importsStylesheet(project, stylesheet)) {
    manual.push(
      `Import ${relative(project, stylesheet)} in ${entryName(project)}.`
    )
  }

  addStyles(
    project,
    registry.items.filter((item) => item.css && installed.includes(item.name))
  )

  await installItems(project, root, registry, names, { overwrite, ...styling })

  if (options.rtl) manual.push(RTL_NOTE)
  for (const message of manual) note(message)
  step("Ready. Add components with npx @esuiss/ui add <name>")
}
