import { execFileSync } from "node:child_process"
import { existsSync, mkdtempSync, rmSync } from "node:fs"
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"

const ROOT = process.cwd()
const SOURCE_DIR = "components/ui"
const OUTPUT_DIR = "nativewind/components/ui"
const SOURCE_STYLESHEET = "styles/uniwind.css"
const OUTPUT_STYLESHEET = "styles/nativewind.css"
const OUTPUT_CONFIG = "styles/nativewind.config.js"
const V3_SPACING = new Set([
  "0",
  "0.5",
  "1",
  "1.5",
  "2",
  "2.5",
  "3",
  "3.5",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "14",
  "16",
  "20",
  "24",
  "28",
  "32",
  "36",
  "40",
  "44",
  "48",
  "52",
  "56",
  "60",
  "64",
  "72",
  "80",
  "96",
])
const SPACING_PREFIXES =
  "-?(?:p|px|py|pt|pr|pb|pl|ps|pe|m|mx|my|mt|mr|mb|ml|ms|me|gap|gap-x|gap-y|w|h|size|min-w|min-h|top|right|bottom|left|start|end|inset|inset-x|inset-y|translate-x|translate-y|space-x|space-y)"
const TEXT_INPUT_INTEROP = `cssInterop(TextInput, {
  className: { target: "style", nativeStyleToProp: { textAlign: true } },
  placeholderClassName: {
    target: false,
    nativeStyleToProp: { color: "placeholderTextColor" },
  },
})

`
const UTILITY_PREFIXES =
  "bg|text|border|border-[trblxyse]|ring|outline|divide|fill|stroke|shadow|decoration|placeholder|accent|caret"

const FILE_TRANSFORMS = {
  "icon.tsx": (code) =>
    code
      .replace(
        'import { withUniwind } from "uniwind"',
        'import { cssInterop } from "nativewind"'
      )
      .replace(
        /const StyledIcon = withUniwind\(IconImpl, \{[\s\S]*?\n\}\)\n/,
        `const StyledIcon = cssInterop(IconImpl, {
  className: {
    target: "style",
    nativeStyleToProp: {
      color: true,
      width: "size",
    },
  },
})
`
      ),
  "input.tsx": usePlaceholderClass,
  "textarea.tsx": usePlaceholderClass,
}

function usePlaceholderClass(code) {
  const firstFunction = code.indexOf("\nfunction ")
  return `${code.slice(0, firstFunction + 1)}${TEXT_INPUT_INTEROP}${code.slice(firstFunction + 1)}`
    .replace(
      'placeholderTextColorClassName="accent-muted-foreground"',
      'placeholderClassName="text-muted-foreground"'
    )
    .replace(
      /^import \{ cn \} from "cn"\n/m,
      'import { cn } from "cn"\nimport { cssInterop } from "nativewind"\n'
    )
}

function toTailwindV3(code) {
  return code
    .replace(
      new RegExp(
        `(?<![\\w-])((?:[\\w-]+:)*${SPACING_PREFIXES})-(\\d+(?:\\.\\d+)?)(?![\\w./\\]])`,
        "g"
      ),
      (match, utility, value) =>
        V3_SPACING.has(value)
          ? match
          : `${utility}-[${Number(value) * 0.25}rem]`
    )
    .replace(/(?<![\w-])((?:[\w-]+:)*)shadow-sm(?![\w-])/g, "$1shadow")
    .replace(/(?<![\w-])((?:[\w-]+:)*)shadow-xs(?![\w-])/g, "$1shadow-sm")
}

function parseTheme(css) {
  const block = (name) => {
    const start = css.indexOf(`@variant ${name}`)
    const end = css.indexOf("}", start)
    return Object.fromEntries(
      [...css.slice(start, end).matchAll(/--color-([\w-]+):\s*([^;]+);/g)].map(
        (match) => [match[1], match[2].trim()]
      )
    )
  }
  const radius = css.match(/@theme\s*\{([\s\S]*?)\}/)?.[1].trim() ?? ""
  return { light: block("light"), dark: block("dark"), radius }
}

function parseColor(value) {
  const hex = value.match(/^#([\da-f]{6})$/i)
  if (hex) {
    const channels = hex[1]
      .match(/../g)
      .map((part) => Number.parseInt(part, 16))
    return { channels, alpha: 1 }
  }
  const rgb = value.match(
    /^rgb\(\s*(\d+)\s+(\d+)\s+(\d+)\s*(?:\/\s*([\d.]+))?\s*\)$/
  )
  if (rgb) {
    return {
      channels: rgb.slice(1, 4).map(Number),
      alpha: rgb[4] === undefined ? 1 : Number(rgb[4]),
    }
  }
  throw new Error(`Unsupported color value "${value}"`)
}

function withOpacity(value, percent) {
  const { channels, alpha } = parseColor(value)
  const combined = Math.round(alpha * percent * 10) / 1000
  return `rgb(${channels.join(" ")} / ${combined})`
}

function opacityPattern(colors) {
  const names = [...colors].sort((a, b) => b.length - a.length).join("|")
  return new RegExp(
    `(?<![\\w-])((?:[\\w-]+:)*(?:${UTILITY_PREFIXES})-(${names}))/(\\d{1,3})(?![\\w/])`,
    "g"
  )
}

function collectTokens(sources, pattern) {
  const tokens = new Map()
  for (const code of sources) {
    for (const match of code.matchAll(pattern)) {
      tokens.set(`${match[2]}-${match[3]}`, {
        color: match[2],
        percent: Number(match[3]),
      })
    }
  }
  return [...tokens.entries()].sort(([a], [b]) =>
    a.localeCompare(b, "en", { numeric: true })
  )
}

function buildStylesheet(theme, tokens) {
  const tokenValues = (mode) =>
    Object.fromEntries(
      tokens.map(([name, { color, percent }]) => [
        name,
        withOpacity(theme[mode][color], percent),
      ])
    )
  const lines = (values) =>
    Object.entries(values)
      .map(([name, value]) => `    --${name}: ${value};`)
      .join("\n")

  return `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
${lines({ ...theme.light, ...tokenValues("light") })}
  }

  .dark:root {
${lines({ ...theme.dark, ...tokenValues("dark") })}
  }
}
`
}

function buildConfig(theme, tokens) {
  const colors = [...Object.keys(theme.light), ...tokens.map(([name]) => name)]
    .map((name) => `        "${name}": "var(--${name})",`)
    .join("\n")
  const radius = [...theme.radius.matchAll(/--radius-([\w]+):\s*([^;]+);/g)]
    .map((match) => `        "${match[1]}": "${match[2]}",`)
    .join("\n")

  return `module.exports = {
  darkMode: "class",
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
${colors}
      },
      borderRadius: {
${radius}
      },
    },
  },
  plugins: [],
}
`
}

async function generate(target) {
  const theme = parseTheme(
    await readFile(path.join(ROOT, SOURCE_STYLESHEET), "utf8")
  )
  const colors = new Set(Object.keys(theme.light))
  const pattern = opacityPattern(colors)

  const files = (await readdir(path.join(ROOT, SOURCE_DIR)))
    .filter((file) => file.endsWith(".tsx"))
    .sort()
  const sources = new Map()
  for (const file of files) {
    sources.set(file, await readFile(path.join(ROOT, SOURCE_DIR, file), "utf8"))
  }

  const tokens = collectTokens(sources.values(), pattern)
  const outputs = new Map()
  for (const [file, code] of sources) {
    const transformed = (FILE_TRANSFORMS[file] ?? ((value) => value))(
      toTailwindV3(
        code.replace(
          pattern,
          (_match, utility, _color, percent) => `${utility}-${percent}`
        )
      )
    )
    if (transformed !== code) outputs.set(file, transformed)
  }

  await mkdir(path.join(target, OUTPUT_DIR), { recursive: true })
  await mkdir(path.join(target, path.dirname(OUTPUT_STYLESHEET)), {
    recursive: true,
  })
  for (const [file, code] of outputs) {
    await writeFile(path.join(target, OUTPUT_DIR, file), code)
  }
  await writeFile(
    path.join(target, OUTPUT_STYLESHEET),
    buildStylesheet(theme, tokens)
  )
  await writeFile(path.join(target, OUTPUT_CONFIG), buildConfig(theme, tokens))

  execFileSync(
    path.join(ROOT, "node_modules/.bin/biome"),
    ["check", "--write", OUTPUT_DIR, OUTPUT_STYLESHEET, OUTPUT_CONFIG],
    { cwd: target, stdio: "ignore" }
  )
  return { files: [...outputs.keys()], tokens: tokens.length }
}

async function snapshot(base) {
  const dir = path.join(base, OUTPUT_DIR)
  const files = existsSync(dir) ? (await readdir(dir)).sort() : []
  const entries = await Promise.all(
    files.map(async (file) => [
      file,
      await readFile(path.join(dir, file), "utf8"),
    ])
  )
  const read = async (file) =>
    existsSync(path.join(base, file))
      ? await readFile(path.join(base, file), "utf8")
      : ""
  return JSON.stringify({
    files: entries,
    stylesheet: await read(OUTPUT_STYLESHEET),
    config: await read(OUTPUT_CONFIG),
  })
}

if (process.argv.includes("--check")) {
  const temp = mkdtempSync(path.join(tmpdir(), "esuiss-nativewind-"))
  try {
    const biome = JSON.parse(
      await readFile(path.join(ROOT, "biome.json"), "utf8")
    )
    biome.vcs = { enabled: false }
    await writeFile(path.join(temp, "biome.json"), JSON.stringify(biome))
    const { files } = await generate(temp)
    if ((await snapshot(temp)) !== (await snapshot(ROOT))) {
      console.error(
        "NativeWind components are out of date. Run `pnpm nativewind`."
      )
      process.exit(1)
    }
    console.log(`NativeWind components are up to date: ${files.length} files`)
  } finally {
    rmSync(temp, { recursive: true, force: true })
  }
} else {
  rmSync(path.join(ROOT, OUTPUT_DIR), { recursive: true, force: true })
  const { files, tokens } = await generate(ROOT)
  console.log(
    `NativeWind: ${files.length} component files, ${tokens} color tokens`
  )
}
