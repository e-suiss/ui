import { execFileSync } from "node:child_process"
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import path from "node:path"
import { parseArgs } from "node:util"

const ROOT = path.resolve(import.meta.dirname, "..")
const MOBILE = "packages/mobile"
const SWIFT_SOURCES = `${MOBILE}/swiftui/Sources/EsuissUI/`
const SWIFT_STORIES = `${MOBILE}/swiftui/Catalog/Catalog/Stories/`
const KOTLIN_SOURCES = `${MOBILE}/kotlin/ui/src/main/kotlin/com/esuiss/ui/`
const KOTLIN_STORIES = `${MOBILE}/kotlin/catalog/src/main/kotlin/com/esuiss/catalog/stories/`
const RN_ROOTS = [`${MOBILE}/uniwind/`, `${MOBILE}/components/`]
const RN_EXAMPLES = `${MOBILE}/examples/`
const RN_EXTENSIONS = ["", ".tsx", ".ts", "/index.tsx", "/index.ts"]
const SWIFT_GROUP = /StoryGroup\(\.(\w+),\s*"([^"]+)"/g
const KOTLIN_GROUP =
  /StoryGroup\(\s*section = Section\.(\w+),\s*title = "([^"]+)"/g
const IMPORT = /(?:from|import)\s+"([^"]+)"/g
const NOT_ALPHANUMERIC = /[^a-z0-9]+/g
const EDGE_DASHES = /^-|-$/g
const ZERO_SHA = /^0+$/
const WEB_ALL = [
  "pnpm-lock.yaml",
  "pnpm-workspace.yaml",
  "scripts/matrix.mjs",
  ".github/workflows/visual.yml",
  "packages/web/package.json",
  "packages/web/vitest.config.ts",
  "packages/web/tests/visual-setup.ts",
  "packages/web/tests/setup.ts",
]

const SHARED = [
  "pnpm-lock.yaml",
  "pnpm-workspace.yaml",
  `${MOBILE}/package.json`,
  `${MOBILE}/scripts/visual-native.mjs`,
]

const PLATFORMS = {
  rn: [
    `${MOBILE}/App.tsx`,
    `${MOBILE}/capture.tsx`,
    `${MOBILE}/global.css`,
    `${MOBILE}/styles/`,
    `${MOBILE}/scripts/visual-android.mjs`,
    `${MOBILE}/scripts/visual-ios.mjs`,
    `${MOBILE}/scripts/simulator.mjs`,
    ".github/workflows/visual-android.yml",
    ".github/workflows/visual-ios.yml",
  ],
  swift: [
    `${MOBILE}/swiftui/`,
    `${MOBILE}/scripts/visual-swiftui.mjs`,
    `${MOBILE}/scripts/simulator.mjs`,
    ".github/workflows/visual-swiftui.yml",
  ],
  kotlin: [`${MOBILE}/kotlin/`, ".github/workflows/visual-compose.yml"],
}

const sanitize = (value) =>
  value.toLowerCase().replace(NOT_ALPHANUMERIC, "-").replace(EDGE_DASHES, "")

function files(dir, extension) {
  const absolute = path.join(ROOT, dir)
  if (!existsSync(absolute)) return []
  return readdirSync(absolute, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(extension))
    .map((entry) =>
      path.relative(ROOT, path.join(entry.parentPath, entry.name))
    )
}

function storyGroups(dir, extension, pattern) {
  return new Map(
    files(dir, extension).map((file) => [
      file,
      [...readFileSync(path.join(ROOT, file), "utf8").matchAll(pattern)].map(
        ([, section, title]) => sanitize(`${section}/${title}`)
      ),
    ])
  )
}

function nativeChanges(changed, { sources, groups, listOf }) {
  const registry = JSON.parse(
    readFileSync(path.join(ROOT, MOBILE, "registry.json"), "utf8")
  ).items
  const known = new Set([...groups.values()].flat())
  const selected = new Set()
  for (const file of changed) {
    if (groups.has(file)) {
      for (const group of groups.get(file)) selected.add(group)
      continue
    }
    if (!file.startsWith(sources)) return "all"
    const relative = file.slice(sources.length)
    const items = registry.filter((item) =>
      (listOf(item) ?? []).includes(relative)
    )
    if (!items.length) return "all"
    for (const item of items) {
      const matches = [...known].filter(
        (group) =>
          group === item.name ||
          group.split("-").slice(1).join("-") === item.name
      )
      if (!matches.length) return "all"
      for (const group of matches) selected.add(group)
    }
  }
  return [...selected]
}

function importBase(specifier, from) {
  if (specifier.startsWith("@/components/primitives/"))
    return `${MOBILE}/components/primitives/${specifier.slice(24)}`
  if (specifier.startsWith("@/components/"))
    return `${MOBILE}/uniwind/components/${specifier.slice(13)}`
  if (specifier.startsWith("@/")) return `${MOBILE}/${specifier.slice(2)}`
  if (specifier.startsWith(".")) return path.join(path.dirname(from), specifier)
  return null
}

function resolveImport(specifier, from) {
  const base = importBase(specifier, from)
  if (!base) return null
  return (
    RN_EXTENSIONS.map((extension) => `${base}${extension}`).find((file) => {
      const absolute = path.join(ROOT, file)
      return existsSync(absolute) && statSync(absolute).isFile()
    }) ?? null
  )
}

function rnChanges(changed) {
  const sources = [
    ...RN_ROOTS.flatMap((root) => [
      ...files(root, ".tsx"),
      ...files(root, ".ts"),
    ]),
    ...files(RN_EXAMPLES, ".tsx"),
  ]
  const imports = new Map(
    sources.map((file) => [
      file,
      [...readFileSync(path.join(ROOT, file), "utf8").matchAll(IMPORT)]
        .map(([, specifier]) => resolveImport(specifier, file))
        .filter(Boolean),
    ])
  )
  const reaches = (file, target, seen = new Set()) => {
    if (file === target) return true
    if (seen.has(file)) return false
    seen.add(file)
    return (imports.get(file) ?? []).some((next) => reaches(next, target, seen))
  }
  const examples = sources.filter((file) => file.startsWith(RN_EXAMPLES))
  const selected = new Set()
  for (const file of changed) {
    if (!imports.has(file)) {
      if (RN_ROOTS.some((root) => file.startsWith(root))) return "all"
      continue
    }
    for (const example of examples) {
      if (reaches(example, file)) selected.add(path.basename(example, ".tsx"))
    }
  }
  return [...selected]
}

export function changes(changed) {
  const touches = (prefixes) =>
    changed.some((file) => prefixes.some((prefix) => file.startsWith(prefix)))
  const shared = touches(SHARED)
  const result = {}
  result.rn = shared || touches(PLATFORMS.rn) ? "all" : rnChanges(changed)
  const swift = changed.filter((file) => file.startsWith(`${MOBILE}/swiftui/`))
  const swiftOther = touches(PLATFORMS.swift.slice(1))
  result.swift =
    shared || swiftOther
      ? "all"
      : nativeChanges(swift, {
          sources: SWIFT_SOURCES,
          groups: storyGroups(SWIFT_STORIES, ".swift", SWIFT_GROUP),
          listOf: (item) => item.swift,
        })
  const kotlin = changed.filter((file) => file.startsWith(`${MOBILE}/kotlin/`))
  const kotlinOther = touches(PLATFORMS.kotlin.slice(1))
  result.kotlin =
    shared || kotlinOther
      ? "all"
      : nativeChanges(kotlin, {
          sources: KOTLIN_SOURCES,
          groups: storyGroups(KOTLIN_STORIES, ".kt", KOTLIN_GROUP),
          listOf: (item) => item.kotlin,
        })
  return result
}

function changedFiles(base, head) {
  try {
    return execFileSync("git", ["diff", "--name-only", `${base}...${head}`], {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    })
      .split("\n")
      .filter(Boolean)
  } catch {
    return null
  }
}

function webChanges(changed) {
  if (changed.some((file) => WEB_ALL.some((prefix) => file.startsWith(prefix))))
    return "all"
  return changed.some((file) => file.startsWith("packages/web/"))
    ? "changed"
    : ""
}

if (import.meta.main) {
  const { values } = parseArgs({
    options: {
      platform: { type: "string" },
      base: { type: "string" },
      only: { type: "string", default: "" },
      head: { type: "string", default: "HEAD" },
      shards: { type: "string", default: "1" },
      "per-shard": { type: "string", default: "20" },
    },
  })
  const base =
    values.base && !ZERO_SHA.test(values.base) ? values.base : undefined
  const changed = base ? changedFiles(base, values.head) : null
  const shards = Number(values.shards)
  const range = (count) =>
    Array.from({ length: count }, (_, index) => index + 1)
  const lines = []
  if (values.platform === "web") {
    const web = changed ? webChanges(changed) : "all"
    lines.push(`run=${Boolean(web)}`, `base=${web === "changed" ? base : ""}`)
  } else {
    const requested = values.only.split(",").filter(Boolean)
    const fromChanges = changed ? changes(changed)[values.platform] : "all"
    const selected = requested.length ? requested : fromChanges
    if (selected === undefined)
      throw new Error(`Unknown platform ${values.platform}`)
    const only = selected === "all" ? [] : selected.sort()
    const count =
      selected === "all"
        ? shards
        : Math.min(shards, Math.ceil(only.length / Number(values["per-shard"])))
    lines.push(
      `run=${selected === "all" || only.length > 0}`,
      `only=${only.join(",")}`,
      `shards=${JSON.stringify(range(Math.max(count, 1)))}`,
      `count=${Math.max(count, 1)}`
    )
  }
  console.log(lines.join("\n"))
}
