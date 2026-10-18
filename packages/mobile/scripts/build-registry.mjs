import { existsSync } from "node:fs"
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import {
  collectImports,
  packageName,
  toTitle,
} from "../../../scripts/lib/registry.mjs"
import { iconLibraries } from "./build-icons.mjs"
import {
  buildNativeGraph,
  nativeFileOf,
  nativeRequirements,
  PLATFORMS,
} from "./native-registry.mjs"
import {
  buildStandardRegistries,
  presetFiles,
  STANDARD_STYLINGS,
  standardProblems,
  UNIWIND_THEME,
  uniwindTheme,
  uniwindThemeFile,
} from "./standard-registry.mjs"
import { DEFAULT_STYLE, loadStyles } from "./theme.mjs"

const SCRIPT_EXTENSION = /\.(tsx?|jsx?)$/

const ROOT = path.resolve(import.meta.dirname, "..")
const TOKENS = path.join(ROOT, "../tokens/tokens.json")
const OUTPUT = path.join(ROOT, "registry.json")
const STYLES = {
  uniwind: { stylesheet: "styles/uniwind.css", directory: "uniwind" },
  nativewind: {
    stylesheet: "styles/nativewind.css",
    config: "styles/nativewind.config.js",
    directory: "nativewind",
  },
  stylesheet: {
    theme: "stylesheet/components/ui/theme.ts",
    directory: "stylesheet",
  },
}
const PROVIDED_BY_INIT = new Set(["theme"])
const IGNORED_PACKAGES = new Set(["react", "react-native"])
const COMPANIONS = {
  "phosphor-react-native": ["react-native-svg"],
  "react-native-reanimated": ["react-native-worklets"],
}
const LOCAL_IMPORT =
  /^@\/(components\/(?:ui|patterns|interactions|blocks|charts)|components\/primitives|hooks)\/([\w-]+)$/
const PRIMITIVES_DIR = "components/primitives"

const sources = [
  { dir: "components/ui", type: "ui" },
  { dir: "components/patterns", type: "pattern" },
  { dir: "components/interactions", type: "interaction" },
  { dir: "components/blocks", type: "block" },
  { dir: "components/charts", type: "chart" },
]

async function analyze(filePath, name) {
  const code = await readFile(path.join(ROOT, filePath), "utf8")
  const dependencies = new Set()
  const requires = new Set()

  for (const specifier of collectImports(code)) {
    const local = specifier.match(LOCAL_IMPORT)
    if (local) {
      const required =
        local[1] === PRIMITIVES_DIR ? `primitives/${local[2]}` : local[2]
      if (required !== name) requires.add(required)
    } else if (
      specifier.startsWith("./") &&
      filePath.startsWith(PRIMITIVES_DIR)
    ) {
      requires.add(`primitives/${path.posix.basename(specifier)}`)
    } else if (specifier.startsWith("@/")) {
      throw new Error(`${filePath}: unsupported local import "${specifier}"`)
    } else if (!specifier.startsWith(".")) {
      const pkg = packageName(specifier)
      if (IGNORED_PACKAGES.has(pkg)) continue
      dependencies.add(pkg)
      for (const companion of COMPANIONS[pkg] ?? []) dependencies.add(companion)
    }
  }
  return { dependencies, requires }
}

async function buildItem(dir, type, file) {
  const filePath = path.posix.join(dir, file)
  const name = path.basename(file, path.extname(file))
  const requires = new Set()
  const dependencies = {}
  const overrides = []
  const styleFiles = {}

  for (const [style, { directory }] of Object.entries(STYLES)) {
    let source = path.posix.join(directory, filePath)
    if (!existsSync(path.join(ROOT, source))) {
      const alternate = filePath.replace(SCRIPT_EXTENSION, (extension) =>
        extension === ".tsx" ? ".ts" : ".tsx"
      )
      const alternateSource = path.posix.join(directory, alternate)
      if (!existsSync(path.join(ROOT, alternateSource))) {
        throw new Error(`missing ${source}`)
      }
      source = alternateSource
      styleFiles[style] = [alternate]
    }
    overrides.push(style)
    const analysis = await analyze(source, name)
    dependencies[style] = [...analysis.dependencies].sort()
    for (const required of analysis.requires) {
      if (!PROVIDED_BY_INIT.has(required)) requires.add(required)
    }
  }

  return {
    name,
    type,
    title: toTitle(name),
    dependencies,
    requires: [...requires].sort(),
    files: [filePath],
    ...(Object.keys(styleFiles).length > 0 && { styleFiles }),
    overrides,
  }
}

async function buildPrimitive(file) {
  const filePath = path.posix.join(PRIMITIVES_DIR, file)
  const name = `primitives/${path.basename(file, path.extname(file))}`
  const analysis = await analyze(filePath, name)
  const dependencies = [...analysis.dependencies].sort()
  return {
    name,
    type: "primitive",
    title: toTitle(path.basename(file, path.extname(file))),
    dependencies: Object.fromEntries(
      Object.keys(STYLES).map((style) => [style, dependencies])
    ),
    requires: [...analysis.requires].sort(),
    files: [filePath],
  }
}

function validate(items) {
  const names = new Set(items.map((item) => item.name))
  const problems = items.flatMap((item) =>
    item.requires
      .filter((required) => !names.has(required))
      .map((required) => `${item.name} requires missing item "${required}"`)
  )
  for (const { stylesheet, config, theme } of Object.values(STYLES)) {
    for (const file of [stylesheet, config, theme].filter(Boolean)) {
      if (!existsSync(path.join(ROOT, file))) problems.push(`missing ${file}`)
    }
  }
  return problems
}

const items = []
for (const { dir, type } of sources) {
  const folder = path.join(ROOT, STYLES.uniwind.directory, dir)
  if (!existsSync(folder)) continue
  const files = (await readdir(folder))
    .filter((file) => SCRIPT_EXTENSION.test(file))
    .sort()
  for (const file of files) items.push(await buildItem(dir, type, file))
}
for (const file of (await readdir(path.join(ROOT, PRIMITIVES_DIR)))
  .filter((entry) => SCRIPT_EXTENSION.test(entry))
  .sort()) {
  items.push(await buildPrimitive(file))
}

const platforms = {}
const problems = validate(items)
for (const [platform, config] of Object.entries(PLATFORMS)) {
  const graph = await buildNativeGraph(ROOT, platform)
  const used = new Set(graph.base)
  for (const [name, file] of Object.entries(config.files)) {
    if (!graph.files.includes(file))
      problems.push(`missing ${config.source}/${file} for ${name}`)
  }
  for (const item of items) {
    const file = nativeFileOf(platform, item, graph.files)
    if (!file) continue
    item[platform] = graph.filesFor(file)
    for (const entry of item[platform]) used.add(entry)
  }
  for (const file of graph.files.filter((entry) => !used.has(entry))) {
    problems.push(`${config.source}/${file} is not used by any item`)
  }
  platforms[platform] = {
    directory: config.source,
    base: graph.base,
    requirements: await nativeRequirements(ROOT, platform),
  }
}

const PRESET_STYLES = Object.keys(loadStyles()).filter(
  (style) => style !== DEFAULT_STYLE
)
for (const style of PRESET_STYLES) {
  for (const file of Object.values(presetFiles(style))) {
    if (!existsSync(path.join(ROOT, file))) problems.push(`missing ${file}`)
  }
}
const standard = await buildStandardRegistries(
  ROOT,
  items,
  STYLES,
  PRESET_STYLES
)
problems.push(
  ...(await standardProblems(standard, {
    schema: process.argv.includes("--schema"),
  }))
)

if (problems.length) {
  console.error(problems.join("\n"))
  process.exit(1)
}

const tokenColors = Object.entries(
  JSON.parse(await readFile(TOKENS, "utf8")).color
)
const registry = {
  name: "esuiss-ui-mobile",
  homepage: "https://suiss.app/ui",
  styles: STYLES,
  defaultStyle: DEFAULT_STYLE,
  colors: Object.fromEntries(
    ["light", "dark"].map((mode) => [
      mode,
      Object.fromEntries(
        tokenColors.map(([name, value]) => [name, value[mode]])
      ),
    ])
  ),
  presets: Object.fromEntries(
    PRESET_STYLES.map((style) => [style, presetFiles(style)])
  ),
  platforms,
  icons: iconLibraries(),
  items,
}
const outputs = [
  [OUTPUT, registry],
  ...STANDARD_STYLINGS.map((styling) => [
    path.join(ROOT, "registry", styling, "registry.json"),
    standard[styling],
  ]),
  [
    path.join(ROOT, UNIWIND_THEME),
    await uniwindTheme(ROOT, STYLES.uniwind.stylesheet),
  ],
  ...(await Promise.all(
    PRESET_STYLES.map(async (style) => [
      path.join(ROOT, uniwindThemeFile(style)),
      await uniwindTheme(ROOT, presetFiles(style).uniwind),
    ])
  )),
]
const serialize = (content) =>
  typeof content === "string"
    ? content
    : `${JSON.stringify(content, null, 2)}\n`

if (process.argv.includes("--check")) {
  const stale = []
  for (const [file, content] of outputs) {
    const current = existsSync(file) ? await readFile(file, "utf8") : ""
    if (current !== serialize(content)) {
      stale.push(path.relative(ROOT, file))
    }
  }
  if (stale.length) {
    console.error(`Out of date: ${stale.join(", ")}. Run \`pnpm registry\`.`)
    process.exit(1)
  }
  console.log(
    `The registries are up to date${process.argv.includes("--schema") ? " and valid" : ""}: ${items.length} items`
  )
} else {
  for (const [file, content] of outputs) {
    await mkdir(path.dirname(file), { recursive: true })
    await writeFile(file, serialize(content))
  }
  console.log(
    `registry.json and the ${STANDARD_STYLINGS.join(", ")} registries: ${items.length} items`
  )
}
