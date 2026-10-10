import { existsSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"

import { step } from "./output.mjs"

const BABEL_CONFIGS = ["babel.config.js", "babel.config.cjs"]
const DEFAULT_CONFIG = `module.exports = {
  presets: ["module:@react-native/babel-preset"],
  plugins: [],
}
`

function closingBracket(text, open) {
  let depth = 0
  let quote = null
  for (let index = open; index < text.length; index++) {
    const char = text[index]
    if (quote) {
      if (char === "\\") index++
      else if (char === quote) quote = null
    } else if (char === '"' || char === "'" || char === "`") {
      quote = char
    } else if (char === "[") {
      depth++
    } else if (char === "]" && --depth === 0) {
      return index
    }
  }
  return -1
}

function addPlugin(text, entry, { last }) {
  const plugins = text.match(/plugins\s*:\s*\[/)
  if (plugins) {
    const open = plugins.index + plugins[0].length - 1
    const close = closingBracket(text, open)
    if (close === -1) return null
    const body = text.slice(open + 1, close).trim()
    const items = body
      ? last
        ? `${body.replace(/,\s*$/, "")},\n    ${entry},`
        : `${entry},\n    ${body}`
      : `${entry},`
    return `${text.slice(0, open + 1)}\n    ${items}\n  ${text.slice(close)}`
  }
  const presets = text.match(/presets\s*:\s*\[/)
  if (!presets) return null
  const close = closingBracket(text, presets.index + presets[0].length - 1)
  if (close === -1) return null
  const after = text.slice(close + 1).match(/^\s*,/)
  const end = close + 1 + (after ? after[0].length : 0)
  return `${text.slice(0, end)}${after ? "" : ","}\n  plugins: [\n    ${entry},\n  ],${text.slice(end)}`
}

export function ensureBabelPlugin(project, name, entry, { last = false } = {}) {
  if (project.framework !== "react-native") return []
  const existing = BABEL_CONFIGS.map((file) =>
    path.join(project.cwd, file)
  ).find(existsSync)
  const file = existing ?? path.join(project.cwd, "babel.config.js")
  const text = existing ? readFileSync(file, "utf8") : DEFAULT_CONFIG
  if (text.includes(`"${name}"`) || text.includes(`'${name}'`)) return []

  const updated = addPlugin(text, entry, { last })
  const relative = path.relative(project.cwd, file)
  if (!updated) {
    return [`Add ${entry} to the plugins in ${relative}.`]
  }
  writeFileSync(file, updated)
  step(`Added ${name} to ${relative}`)
  return []
}

const EXPO_NATIVEWIND_CONFIG = `module.exports = function (api) {
  api.cache(true)
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  }
}
`

function addPreset(text, entry) {
  const presets = text.match(/presets\s*:\s*\[/)
  if (!presets) return null
  const open = presets.index + presets[0].length - 1
  const close = closingBracket(text, open)
  if (close === -1) return null
  const body = text
    .slice(open + 1, close)
    .trim()
    .replace(/,\s*$/, "")
  return `${text.slice(0, open + 1)}${body ? `${body}, ` : ""}${entry}${text.slice(close)}`
}

export function configureNativewindBabel(project) {
  const existing = BABEL_CONFIGS.map((file) =>
    path.join(project.cwd, file)
  ).find(existsSync)
  if (!existing) {
    const file = path.join(project.cwd, "babel.config.js")
    writeFileSync(
      file,
      project.framework === "expo"
        ? EXPO_NATIVEWIND_CONFIG
        : DEFAULT_CONFIG.replace(
            '"module:@react-native/babel-preset"',
            '"module:@react-native/babel-preset", "nativewind/babel"'
          )
    )
    step("Created babel.config.js")
    return []
  }
  const text = readFileSync(existing, "utf8")
  const relative = path.relative(project.cwd, existing)
  if (text.includes("nativewind/babel")) return []
  if (project.framework === "expo") {
    return [
      `Add jsxImportSource: "nativewind" to babel-preset-expo and "nativewind/babel" to the presets in ${relative}.`,
    ]
  }
  const updated = addPreset(text, '"nativewind/babel"')
  if (!updated) return [`Add "nativewind/babel" to the presets in ${relative}.`]
  writeFileSync(existing, updated)
  step(`Added nativewind/babel to ${relative}`)
  return []
}
