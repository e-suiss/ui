import { readFileSync } from "node:fs"
import path from "node:path"

import { PACKAGE_MANAGERS, TEMPLATES } from "../packages/cli/lib/create.mjs"
import { ICON_LIBRARY_NAMES as WEB_ICONS } from "../packages/cli/lib/icons.mjs"
import { ICON_LIBRARY_NAMES as MOBILE_ICONS } from "../packages/cli/lib/mobile/icons.mjs"
import { STYLINGS } from "../packages/cli/lib/mobile/project.mjs"
import { BASES } from "../packages/cli/lib/registry.mjs"
import { PRESET_VALUES, STYLES } from "../packages/cli/lib/shared/style.mjs"

const ROOT = path.resolve(import.meta.dirname, "..")
const BOOLEAN = [true, false]
const CLIS = ["esuiss", "shadcn"]
const PREFIXES = ["", "tw"]
const ALIASES = ["default", "custom"]
const THEMES = ["light", "dark"]

const REGISTRIES = {
  base: "packages/web/registry/registry.json",
  radix: "packages/web/registry/radix/registry.json",
  aria: "packages/web/registry/aria/registry.json",
  ...Object.fromEntries(
    STYLINGS.map((styling) => [
      `rn-${styling}`,
      `packages/mobile/registry/${styling}/registry.json`,
    ])
  ),
  swift: "packages/mobile/registry/swift/registry.json",
  kotlin: "packages/mobile/registry/kotlin/registry.json",
}

const templatesOf = (platform) =>
  Object.entries(TEMPLATES)
    .filter(([, template]) => template.platform === platform)
    .map(([name]) => name)

const WEB_FRAMEWORKS = templatesOf("web")
const RN_TEMPLATES = templatesOf("rn")

function product(dimensions) {
  return Object.entries(dimensions).reduce(
    (rows, [key, values]) =>
      rows.flatMap((row) => values.map((value) => ({ ...row, [key]: value }))),
    [{}]
  )
}

function pairKey(a, valueA, b, valueB) {
  return `${a}=${JSON.stringify(valueA)}&${b}=${JSON.stringify(valueB)}`
}

function requiredPairs(dimensions, allowed) {
  const keys = Object.keys(dimensions)
  const pairs = new Map()
  keys.forEach((a, index) => {
    for (const b of keys.slice(index + 1)) {
      for (const valueA of dimensions[a]) {
        for (const valueB of dimensions[b]) {
          if (allowed({ [a]: valueA, [b]: valueB })) {
            pairs.set(pairKey(a, valueA, b, valueB), [a, valueA, b, valueB])
          }
        }
      }
    }
  })
  return pairs
}

function pairsOf(row) {
  const keys = Object.keys(row)
  return keys.flatMap((a, index) =>
    keys.slice(index + 1).map((b) => pairKey(a, row[a], b, row[b]))
  )
}

function pairwise(dimensions, allowed = () => true) {
  const keys = Object.keys(dimensions)
  const uncovered = requiredPairs(dimensions, allowed)
  const rows = []
  while (uncovered.size > 0) {
    const [a, valueA, b, valueB] = uncovered.values().next().value
    const row = { [a]: valueA, [b]: valueB }
    for (const key of keys) {
      if (key in row) continue
      let best
      let bestScore = -1
      for (const value of dimensions[key]) {
        const candidate = { ...row, [key]: value }
        if (!allowed(candidate)) continue
        const score = Object.keys(row).filter((other) =>
          uncovered.has(
            keys.indexOf(other) < keys.indexOf(key)
              ? pairKey(other, row[other], key, value)
              : pairKey(key, value, other, row[other])
          )
        ).length
        if (score > bestScore) {
          best = value
          bestScore = score
        }
      }
      if (bestScore < 0) {
        throw new Error(`No allowed value for ${key} in ${JSON.stringify(row)}`)
      }
      row[key] = best
    }
    const ordered = Object.fromEntries(keys.map((key) => [key, row[key]]))
    for (const pair of pairsOf(ordered)) uncovered.delete(pair)
    rows.push(ordered)
  }
  return rows
}

function eachOnce(rows, dimensions) {
  const size = Math.max(
    rows.length,
    ...Object.values(dimensions).map((values) => values.length)
  )
  return Array.from({ length: size }, (_, index) => ({
    ...rows[index % rows.length],
    ...Object.fromEntries(
      Object.entries(dimensions).map(([key, values]) => [
        key,
        values[index % values.length],
      ])
    ),
  }))
}

const TOKENS = {
  baseColor: PRESET_VALUES.baseColor,
  theme: PRESET_VALUES.theme,
  font: PRESET_VALUES.font,
  radius: PRESET_VALUES.radius,
  menuAccent: PRESET_VALUES.menuAccent,
  menuColor: PRESET_VALUES.menuColor,
}

const webOnly = (row) =>
  row.framework !== "vite" || (row.tsx !== false && row.rsc !== true)

const WEB_OPTIONS = {
  base: BASES,
  framework: WEB_FRAMEWORKS,
  style: STYLES,
  icons: WEB_ICONS,
  packageManager: PACKAGE_MANAGERS,
  cli: CLIS,
  rtl: BOOLEAN,
  prefix: PREFIXES,
  cssVariables: BOOLEAN,
  tsx: BOOLEAN,
  rsc: BOOLEAN,
  aliases: ALIASES,
}

const RN_OPTIONS = {
  template: RN_TEMPLATES,
  styling: STYLINGS,
  packageManager: PACKAGE_MANAGERS,
  cli: CLIS,
}

const PAIRWISE = {
  "web-options": { dimensions: WEB_OPTIONS, allowed: webOnly, tokens: TOKENS },
  "rn-options": { dimensions: RN_OPTIONS, allowed: () => true, tokens: {} },
}

const SUITES = {
  "web-install": () =>
    product({
      base: BASES,
      style: STYLES,
      icons: WEB_ICONS,
      framework: WEB_FRAMEWORKS,
      cli: CLIS,
    }),
  "web-options": () => eachOnce(pairwise(WEB_OPTIONS, webOnly), TOKENS),
  "web-visual": () =>
    product({ base: BASES, style: STYLES, theme: THEMES, rtl: BOOLEAN }),
  "web-icons": () => product({ base: BASES, icons: WEB_ICONS }),
  "rn-install": () =>
    product({
      template: RN_TEMPLATES,
      styling: STYLINGS,
      style: STYLES,
      icons: MOBILE_ICONS,
      cli: CLIS,
    }),
  "rn-options": () => pairwise(RN_OPTIONS),
  "rn-visual": () =>
    product({
      os: ["ios", "android"],
      styling: STYLINGS,
      style: STYLES,
      theme: THEMES,
    }),
  "swift-install": () =>
    product({ style: STYLES, icons: MOBILE_ICONS, cli: CLIS }),
  "swift-visual": () => product({ style: STYLES, theme: THEMES }),
  "kotlin-install": () =>
    product({ style: STYLES, icons: MOBILE_ICONS, cli: CLIS }),
  "kotlin-visual": () => product({ style: STYLES, theme: THEMES }),
}

function items(target) {
  const file = REGISTRIES[target]
  if (!file) throw new Error(`Unknown registry ${target}`)
  return JSON.parse(readFileSync(path.join(ROOT, file), "utf8")).items.map(
    (item) => item.name
  )
}

function suite(name) {
  const build = SUITES[name]
  if (!build) throw new Error(`Unknown suite ${name}`)
  return build()
}

const nameOf = (row) =>
  Object.entries(row)
    .map(([key, value]) =>
      typeof value === "boolean" ? `${key}=${value}` : value || `${key}=none`
    )
    .join(" · ")

function sameItems(targets) {
  const [first, ...rest] = targets
  const expected = items(first).toSorted()
  for (const target of rest) {
    const found = items(target).toSorted()
    const missing = expected.filter((name) => !found.includes(name))
    const extra = found.filter((name) => !expected.includes(name))
    if (missing.length || extra.length) {
      throw new Error(
        `${target} differs from ${first}: missing ${missing.join(", ") || "none"}, extra ${extra.join(", ") || "none"}`
      )
    }
  }
}

function check() {
  sameItems(BASES)
  sameItems(STYLINGS.map((styling) => `rn-${styling}`))
  for (const target of Object.keys(REGISTRIES)) {
    if (items(target).length === 0) throw new Error(`${target} has no items`)
  }
  for (const name of Object.keys(SUITES)) {
    const rows = suite(name)
    if (rows.length === 0) throw new Error(`${name} is empty`)
    const names = new Set(rows.map(nameOf))
    if (names.size !== rows.length) throw new Error(`${name} repeats a row`)
  }
  for (const [name, { dimensions, allowed, tokens }] of Object.entries(
    PAIRWISE
  )) {
    const rows = suite(name)
    const covered = new Set(
      rows.flatMap((row) =>
        pairsOf(
          Object.fromEntries(
            Object.keys(dimensions).map((key) => [key, row[key]])
          )
        )
      )
    )
    for (const [key, [a, valueA, b, valueB]] of requiredPairs(
      dimensions,
      allowed
    )) {
      if (!covered.has(key)) {
        throw new Error(`${name} misses ${a}=${valueA} with ${b}=${valueB}`)
      }
    }
    for (const row of rows) {
      if (!allowed(row)) throw new Error(`${name} has ${nameOf(row)}`)
    }
    for (const [key, values] of Object.entries(tokens)) {
      const missing = values.filter(
        (value) => !rows.some((row) => row[key] === value)
      )
      if (missing.length) {
        throw new Error(`${name} never sets ${key} to ${missing.join(", ")}`)
      }
    }
  }
}

function summary() {
  const lines = Object.keys(SUITES).map(
    (name) => `${name.padEnd(16)} ${String(suite(name).length).padStart(5)}`
  )
  const counts = Object.keys(REGISTRIES).map(
    (target) =>
      `${target.padEnd(16)} ${String(items(target).length).padStart(5)}`
  )
  return ["suites", ...lines, "", "items", ...counts].join("\n")
}

const USAGE = `Usage:
  node scripts/matrix.mjs <suite>      GitHub Actions matrix for a suite
  node scripts/matrix.mjs items <name> item names of a registry
  node scripts/matrix.mjs --summary    row and item counts
  node scripts/matrix.mjs --check      verify the matrices and registries

Suites: ${Object.keys(SUITES).join(", ")}
Registries: ${Object.keys(REGISTRIES).join(", ")}`

if (import.meta.main) {
  const [command, argument] = process.argv.slice(2)
  if (command === "--check") {
    check()
    console.log("The matrices and registries are consistent.")
  } else if (command === "--summary") {
    console.log(summary())
  } else if (command === "items" && argument) {
    console.log(JSON.stringify(items(argument)))
  } else if (command && command in SUITES) {
    console.log(
      JSON.stringify({
        include: suite(command).map((row) => ({ name: nameOf(row), ...row })),
      })
    )
  } else {
    console.error(USAGE)
    process.exit(1)
  }
}
