import { execFileSync } from "node:child_process"
import { existsSync, mkdtempSync, rmSync } from "node:fs"
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"

import { loadTokens, toRgb } from "./theme.mjs"

const ROOT = process.cwd()
const SOURCE_ROOT = "uniwind/components"
const OUTPUT_ROOT = "nativewind/components"
const COMPONENT_DIRS = ["ui", "patterns", "interactions", "blocks"]
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
const V3_SCALE = new Set([
  "0",
  "50",
  "75",
  "90",
  "95",
  "100",
  "105",
  "110",
  "125",
  "150",
])
const SPACING_PREFIXES =
  "-?(?:p|px|py|pt|pr|pb|pl|ps|pe|m|mx|my|mt|mr|mb|ml|ms|me|gap|gap-x|gap-y|w|h|size|min-w|min-h|top|right|bottom|left|start|end|inset|inset-x|inset-y|translate-x|translate-y|space-x|space-y)"
const TEXT_INPUT_INTEROP = `declare module "react-native" {
  interface TextInputProps {
    cursorColorClassName?: string
    selectionColorClassName?: string
  }
}

cssInterop(TextInput, {
  className: { target: "style", nativeStyleToProp: { textAlign: true } },
  placeholderClassName: {
    target: false,
    nativeStyleToProp: { color: "placeholderTextColor" },
  },
  cursorColorClassName: {
    target: false,
    nativeStyleToProp: { color: "cursorColor" },
  },
  selectionColorClassName: {
    target: false,
    nativeStyleToProp: { color: "selectionColor" },
  },
})

`
const ACTIVITY_INDICATOR_INTEROP = `cssInterop(ActivityIndicator, {
  className: { target: "style", nativeStyleToProp: { color: true } },
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
  "pull-to-refresh.tsx": (code) =>
    code
      .replace(
        'import { withUniwind } from "uniwind"',
        'import { cssInterop } from "nativewind"'
      )
      .replace(
        "const StyledRefreshIndicator = withUniwind(RefreshIndicator)\n",
        `const StyledRefreshIndicator = cssInterop(RefreshIndicator, {
  colorClassName: { target: false, nativeStyleToProp: { color: true } },
  progressBackgroundColorClassName: {
    target: false,
    nativeStyleToProp: { color: "progressBackgroundColor" },
  },
})
`
      )
      .replace(/"accent-([\w-]+)"/g, '"text-$1"'),
  "theme.tsx": (code) =>
    code
      .replace(
        'import { Uniwind } from "uniwind"',
        'import { colorScheme } from "nativewind"'
      )
      .replaceAll("Uniwind.setTheme(", "colorScheme.set("),
}

function addReactNativeImport(code, name) {
  const block = code.match(/^import \{([^}]*)\} from "react-native"\n/m)
  if (!block) {
    return code.replace(
      /^(import \* as React from "react"\n|import \{ cn \} from "cn"\n)/m,
      `$1import { ${name} } from "react-native"\n`
    )
  }
  const specifiers = block[1]
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
  if (specifiers.some((part) => part.replace(/^type /, "") === name)) {
    return code
  }
  specifiers.push(name)
  specifiers.sort((a, b) =>
    a.replace(/^type /, "").localeCompare(b.replace(/^type /, ""), "en")
  )
  const single = `import { ${specifiers.join(", ")} } from "react-native"\n`
  const replacement =
    single.length > 81
      ? `import {\n${specifiers.map((part) => `  ${part},\n`).join("")}} from "react-native"\n`
      : single
  return code.replace(block[0], replacement)
}

function insertBeforeFirstDeclaration(code, block) {
  const index = code.search(/\n(?:function |const [A-Za-z]|type |interface )/)
  return `${code.slice(0, index + 1)}${block}${code.slice(index + 1)}`
}

function applyColorClassProps(code) {
  const textInput =
    /(?:placeholderTextColor|cursorColor|selectionColor)ClassName=/.test(code)
  const activityIndicator = /<ActivityIndicator[^>]*colorClassName=/.test(code)
  const spinner = /<Spinner[^>]*colorClassName=/.test(code)
  if (!textInput && !activityIndicator && !spinner) return code
  if (!textInput && !activityIndicator) {
    return code.replace(/"accent-([\w-]+)"/g, '"text-$1"')
  }
  let output = code
    .replace(/"accent-([\w-]+)"/g, '"text-$1"')
    .replace(/placeholderTextColorClassName=/g, "placeholderClassName=")
    .replace(/(<ActivityIndicator[^>]*?)colorClassName=/g, "$1className=")
  if (activityIndicator) {
    output = insertBeforeFirstDeclaration(output, ACTIVITY_INDICATOR_INTEROP)
  }
  if (textInput) {
    output = addReactNativeImport(
      insertBeforeFirstDeclaration(output, TEXT_INPUT_INTEROP),
      "TextInput"
    )
  }
  return output.replace(
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
    .replace(
      /(?<![\w-])((?:[\w-]+:)*-?scale(?:-[xy])?)-(\d+)(?![\w./\]])/g,
      (match, utility, value) =>
        V3_SCALE.has(value) ? match : `${utility}-[${Number(value) / 100}]`
    )
    .replace(/(?<![\w-])((?:[\w-]+:)*)shadow-sm(?![\w-])/g, "$1shadow")
    .replace(/(?<![\w-])((?:[\w-]+:)*)shadow-xs(?![\w-])/g, "$1shadow-sm")
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

function solid(colors) {
  return Object.fromEntries(
    Object.entries(colors).map(([name, value]) => [name, toRgb(value)])
  )
}

function buildStylesheet(theme, tokens) {
  const tokenValues = (mode) =>
    Object.fromEntries(
      tokens.map(([name, { color, percent }]) => [
        name,
        toRgb(theme[mode][color], percent / 100),
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
${lines({ ...solid(theme.light), ...tokenValues("light") })}
  }

  .dark:root {
${lines({ ...solid(theme.dark), ...tokenValues("dark") })}
  }
}
`
}

function buildConfig(theme, tokens) {
  const colors = [...Object.keys(theme.light), ...tokens.map(([name]) => name)]
    .map((name) => `        "${name}": "var(--${name})",`)
    .join("\n")
  const radius = Object.entries(theme.radius)
    .map(([name, value]) => `        "${name}": "${value}px",`)
    .join("\n")
  const fontSize = Object.entries(theme.text)
    .map(
      ([name, size]) =>
        `        "${name}": ["${size.fontSize}px", { lineHeight: "${size.lineHeight}px", letterSpacing: "${size.letterSpacing}px" }],`
    )
    .join("\n")
  const boxShadow = Object.entries(theme.shadow)
    .map(([name, value]) => `        "${name}": "${value}",`)
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
      fontSize: {
${fontSize}
      },
      boxShadow: {
${boxShadow}
      },
    },
  },
  plugins: [],
}
`
}

async function generate(target) {
  const theme = loadTokens()
  const colors = new Set(Object.keys(theme.light))
  const pattern = opacityPattern(colors)

  const sources = new Map()
  for (const dir of COMPONENT_DIRS) {
    const source = path.join(ROOT, SOURCE_ROOT, dir)
    if (!existsSync(source)) continue
    const files = (await readdir(source))
      .filter((file) => file.endsWith(".tsx"))
      .sort()
    for (const file of files) {
      sources.set(
        path.posix.join(dir, file),
        await readFile(path.join(source, file), "utf8")
      )
    }
  }

  const tokens = collectTokens(sources.values(), pattern)
  const outputs = new Map()
  for (const [file, code] of sources) {
    const transformed = applyColorClassProps(
      (FILE_TRANSFORMS[path.posix.basename(file)] ?? ((value) => value))(
        toTailwindV3(
          code.replace(
            pattern,
            (_match, utility, _color, percent) => `${utility}-${percent}`
          )
        )
      )
    )
    outputs.set(file, transformed)
  }

  await mkdir(path.join(target, path.dirname(OUTPUT_STYLESHEET)), {
    recursive: true,
  })
  for (const [file, code] of outputs) {
    await mkdir(path.join(target, OUTPUT_ROOT, path.dirname(file)), {
      recursive: true,
    })
    await writeFile(path.join(target, OUTPUT_ROOT, file), code)
  }
  await writeFile(
    path.join(target, OUTPUT_STYLESHEET),
    buildStylesheet(theme, tokens)
  )
  await writeFile(path.join(target, OUTPUT_CONFIG), buildConfig(theme, tokens))

  execFileSync(
    path.join(ROOT, "node_modules/.bin/biome"),
    ["check", "--write", OUTPUT_ROOT, OUTPUT_STYLESHEET, OUTPUT_CONFIG],
    { cwd: target, stdio: "ignore" }
  )
  return { files: [...outputs.keys()], tokens: tokens.length }
}

async function snapshot(base) {
  const entries = []
  for (const dir of COMPONENT_DIRS) {
    const folder = path.join(base, OUTPUT_ROOT, dir)
    if (!existsSync(folder)) continue
    for (const file of (await readdir(folder)).sort()) {
      entries.push([
        path.posix.join(dir, file),
        await readFile(path.join(folder, file), "utf8"),
      ])
    }
  }
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
  for (const dir of COMPONENT_DIRS) {
    rmSync(path.join(ROOT, OUTPUT_ROOT, dir), { recursive: true, force: true })
  }
  const { files, tokens } = await generate(ROOT)
  console.log(
    `NativeWind: ${files.length} component files, ${tokens} color tokens`
  )
}
