import { readdirSync, readFileSync, statSync } from "node:fs"
import path from "node:path"

const LEADING_SPACES = /^ */

const COMPOSABLE = "androidx.compose.runtime.Composable"
const LIBRARY_MODULE = "EsuissUI"

const LEADING_DASHES = /^-+/
const TRAILING_DASHES = /-+$/
const LEADING_BLANK_LINE = /^\s*\n/
const TRAILING_WHITESPACE = /\s+$/
const IMPORT_LINE = /^(import|package) /
const TOP_LEVEL_LINE = /^[^\s})\]/]/
const ANNOTATION_LINE = /^@/
const LEADING_ANNOTATION = /^@\w+\s*\n/
const SWIFT_DECLARATION =
  /^(?:(?:private|fileprivate|public|nonisolated|final)\s+)*(?:struct|enum|class|actor|func|let|var)\s+(\w+)/
const SWIFT_EXTENSION =
  /^(?:(?:private|fileprivate|public)\s+)*extension\s+[\w.]+(?:<[^>]*>)?/
const SWIFT_EXTENSION_MEMBER =
  /^ {2}(?:(?:private|fileprivate|public|static|mutating)\s+)*(?:func|var|let)\s+(\w+)/gm
const KOTLIN_DECLARATION =
  /^(?:(?:private|internal|const|inline|suspend|data|enum|sealed|value|open|abstract)\s+)*(?:class|object|interface|fun|val|var)\s+(?:<[^>]+>\s*)?(?:[\w.]+(?:<[^>]*>)?\??\.)?(\w+)/
const MULTILINE_STRING = /"""/g
const SWIFT_GLOBAL = /^(?:let|var)\s+\w+(?:\s*:[^=\n]+)?\s*=[^"]*?\b[A-Z]\w*\(/
const SWIFT_GLOBAL_KEYWORD = /^(?=let|var)/
const RAW_STRING = /"""[^$]*?"""/g
const SWIFT_SHARED_DIRECTORIES = ["Catalog/Catalog/Shell", "Catalog/Shared"]
const SWIFT_IMPORT = /^import (\w+)$/gm
const PRIVATE_MODIFIER = /^(@\w+\s*\n)?(?:private |fileprivate )/
const SWIFT_STORY_GROUP = /StoryGroup\(\.(\w+),\s*"([^"]+)"/
const STORIES_ENUM = /^enum \w+Stories\b/
const EMPTY_CALL = /^(\w+)\(\)$/
const STRUCT_KEYWORD = /\bstruct\b/
const PHOSPHOR_REFERENCE = /\bPh\./
const CHART_REFERENCE = /\bChart\b/
const KOTLIN_STORY_GROUP =
  /StoryGroup\(\s*section\s*=\s*Section\.(\w+),\s*title\s*=\s*"([^"]+)"/
const STORY_GROUP_CALL = /StoryGroup\(/
const FUN_KEYWORD = /\bfun\b/
const BY_KEYWORD = /\bby\b/

const sanitize = (text) =>
  text
    .toLowerCase()
    .replace(/[ ’–—―′¿'`~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/]/gi, "-")
    .replace(/-+/g, "-")
    .replace(LEADING_DASHES, "")
    .replace(TRAILING_DASHES, "")
const startCase = (key) =>
  key
    .replace(/_/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")

const exampleName = (title, key) =>
  `${title.replace(/[^A-Za-z0-9]/g, "")}${key === "Default" ? "" : key}Example`

const sections = {
  swift: {
    components: "Components",
    patterns: "Patterns",
    interactions: "Interactions",
    blocks: "Blocks",
    charts: "Charts",
    ai: "AI",
  },
  kotlin: {
    Components: "Components",
    Patterns: "Patterns",
    Interactions: "Interactions",
    Blocks: "Blocks",
    Charts: "Charts",
    AI: "AI",
  },
}

function files(directory, extension) {
  return readdirSync(directory).flatMap((name) => {
    const full = path.join(directory, name)
    if (statSync(full).isDirectory()) return files(full, extension)
    return name.endsWith(extension) ? [full] : []
  })
}

function closing(source, start) {
  const open = source[start]
  const close = { "{": "}", "(": ")", "[": "]" }[open]
  let depth = 0
  for (let i = start; i < source.length; i++) {
    const char = source[i]
    if (char === '"') {
      if (source.startsWith('"""', i)) {
        i = source.indexOf('"""', i + 3) + 2
        continue
      }
      i++
      while (i < source.length && source[i] !== '"') {
        if (source[i] === "\\") i++
        i++
      }
      continue
    }
    if (char === "/" && source[i + 1] === "/") {
      i = source.indexOf("\n", i)
      continue
    }
    if (char === open) depth++
    else if (char === close && --depth === 0) return i
  }
  return -1
}

function dedentBlock(text) {
  const lines = text
    .replace(LEADING_BLANK_LINE, "")
    .replace(TRAILING_WHITESPACE, "")
    .split("\n")
  const indent = Math.min(
    ...lines
      .filter((line) => line.trim())
      .map((line) => line.match(LEADING_SPACES)[0].length)
  )
  return lines.map((line) => line.slice(indent)).join("\n")
}

const indentBy = (text, spaces) =>
  text
    .split("\n")
    .map((line) => (line ? " ".repeat(spaces) + line : line))
    .join("\n")

function declarationNames(head, lang) {
  if (lang === "kotlin") {
    const name = head.match(KOTLIN_DECLARATION)?.[1]
    return name ? [name] : []
  }
  if (SWIFT_EXTENSION.test(head))
    return [...head.matchAll(SWIFT_EXTENSION_MEMBER)].map((match) => match[1])
  const name = head.match(SWIFT_DECLARATION)?.[1]
  return name ? [name] : []
}

function declarations(source, lang, imports = []) {
  const lines = source.split("\n")
  const starts = []
  let literal = false
  lines.forEach((line, index) => {
    const inside = literal
    if ((line.match(MULTILINE_STRING)?.length ?? 0) % 2) literal = !literal
    if (inside) return
    if (!TOP_LEVEL_LINE.test(line) || IMPORT_LINE.test(line)) return
    if (index > 0 && ANNOTATION_LINE.test(lines[index - 1])) return
    starts.push(index)
  })
  return starts.map((start, n) => {
    let end = (starts[n + 1] ?? lines.length) - 1
    while (end > start && !lines[end].trim()) end--
    const text = lines.slice(start, end + 1).join("\n")
    const head = text.replace(LEADING_ANNOTATION, "")
    return { names: declarationNames(head, lang), text, imports }
  })
}

function sharedSwift(uimRepo) {
  return SWIFT_SHARED_DIRECTORIES.flatMap((directory) =>
    files(path.join(uimRepo, "swiftui", directory), ".swift").flatMap(
      (file) => {
        const source = readFileSync(file, "utf8")
        const imports = [...source.matchAll(SWIFT_IMPORT)].map(
          (match) => match[1]
        )
        return declarations(source, "swift", imports)
      }
    )
  )
}

const words = (text) => new Set(text.match(/\b[A-Za-z_]\w*\b/g) ?? [])

function helpers(seed, pool) {
  const used = new Set()
  const queue = [seed]
  while (queue.length) {
    const found = words(queue.pop())
    for (const declaration of pool) {
      if (
        !used.has(declaration) &&
        declaration.names.some((name) => found.has(name))
      ) {
        used.add(declaration)
        queue.push(declaration.text)
      }
    }
  }
  return pool.filter((declaration) => used.has(declaration))
}

const publicize = (text) =>
  text
    .replace(PRIVATE_MODIFIER, "$1")
    .replace(
      /^(\s*)(?:private |fileprivate )(?=(?:struct|enum|func|let|var|class|fun|val)\b)/gm,
      "$1"
    )

const isolate = (text) =>
  SWIFT_GLOBAL.test(text)
    ? text.replace(SWIFT_GLOBAL_KEYWORD, "@MainActor ")
    : text

function swiftStories(file, shared) {
  const source = readFileSync(file, "utf8")
  const group = source.match(SWIFT_STORY_GROUP)
  if (!group) return []
  const prefix = sanitize(`${sections.swift[group[1]]}/${group[2]}`)
  const imports = [...source.matchAll(SWIFT_IMPORT)].map((match) => match[1])
  const own = declarations(source, "swift").filter(
    (d) => !STORIES_ENUM.test(d.text)
  )
  const names = new Set(own.flatMap((d) => d.names))
  const pool = [
    ...own,
    ...shared.filter((d) => !d.names.some((name) => names.has(name))),
  ]
  const result = []
  for (const match of source.matchAll(/Story\(\s*"(\w+)"/g)) {
    const paren = source.indexOf("(", match.index)
    const after = closing(source, paren)
    const brace = source.indexOf("{", after)
    if (brace < 0 || source.slice(after + 1, brace).trim()) continue
    const body = dedentBlock(source.slice(brace + 1, closing(source, brace)))
    const used = helpers(body, pool)
    const direct = body.match(EMPTY_CALL)?.[1]
    const parts = []
    if (
      !(
        direct &&
        used.some(
          (d) =>
            d.names.includes(direct) &&
            STRUCT_KEYWORD.test(d.text.split("\n")[0])
        )
      )
    ) {
      parts.push(
        `struct ${exampleName(group[2], match[1])}: View {\n  var body: some View {\n${indentBy(body, 4)}\n  }\n}`
      )
    }
    parts.push(...used.map((d) => isolate(publicize(d.text))))
    const code = parts.join("\n\n")
    const header = [
      ...new Set([...imports, ...used.flatMap((d) => d.imports)]),
    ].filter((name) => {
      if (name === LIBRARY_MODULE) return false
      if (name === "PhosphorSwift") return PHOSPHOR_REFERENCE.test(code)
      return name !== "Charts" || CHART_REFERENCE.test(code)
    })
    result.push({
      id: `${prefix}--${sanitize(startCase(match[1]))}`,
      code: `${header.map((name) => `import ${name}`).join("\n")}\n\n${code}`,
    })
  }
  return result
}

function kotlinStories(file) {
  const source = readFileSync(file, "utf8")
  const group = source.match(KOTLIN_STORY_GROUP)
  if (!group) return []
  const prefix = sanitize(`${sections.kotlin[group[1]]}/${group[2]}`)
  const imports = [...source.matchAll(/^import ([\w.]+)$/gm)]
    .map((match) => match[1])
    .filter((name) => !name.startsWith("com.esuiss.catalog."))
  const pool = declarations(source, "kotlin").filter(
    (d) => !STORY_GROUP_CALL.test(d.text)
  )
  const result = []
  for (const match of source.matchAll(/Story\(\s*"(\w+)"/g)) {
    const paren = source.indexOf("(", match.index)
    const after = closing(source, paren)
    const brace = source.indexOf("{", after)
    if (brace < 0 || source.slice(after + 1, brace).trim()) continue
    const body = dedentBlock(source.slice(brace + 1, closing(source, brace)))
    const used = helpers(body, pool)
    const direct = body.match(EMPTY_CALL)?.[1]
    const parts = []
    if (
      !(
        direct &&
        used.some((d) => d.names.includes(direct) && FUN_KEYWORD.test(d.text))
      )
    ) {
      parts.push(
        `@Composable\nfun ${exampleName(group[2], match[1])}() {\n${indentBy(body, 4)}\n}`
      )
    }
    parts.push(...used.map((d) => publicize(d.text)))
    const code = parts.join("\n\n")
    const found = words(code.replace(RAW_STRING, '""'))
    const header = imports.filter((name) => {
      const last = name.split(".").pop()
      if (last === "*") return true
      if (last === "getValue" || last === "setValue")
        return BY_KEYWORD.test(code)
      return found.has(last)
    })
    if (found.has("Composable") && !header.includes(COMPOSABLE)) {
      header.push(COMPOSABLE)
      header.sort()
    }
    result.push({
      id: `${prefix}--${sanitize(startCase(match[1]))}`,
      code: `${header.map((name) => `import ${name}`).join("\n")}\n\n${code}`,
    })
  }
  return result
}

function nativeStories(uimRepo) {
  const shared = sharedSwift(uimRepo)
  const map = new Map()
  const add = (platform, list) => {
    for (const story of list) {
      if (!map.has(story.id)) map.set(story.id, {})
      map.get(story.id)[platform] ??= story.code
    }
  }
  for (const file of files(
    path.join(uimRepo, "swiftui/Catalog/Catalog/Stories"),
    ".swift"
  ))
    add("swift", swiftStories(file, shared))
  for (const file of files(
    path.join(
      uimRepo,
      "kotlin/catalog/src/main/kotlin/com/esuiss/catalog/stories"
    ),
    ".kt"
  ))
    add("kotlin", kotlinStories(file))
  return map
}

const EXAMPLE_FILE = /\.tsx$/
const SECTION_PREFIX = /^(components|patterns|interactions|blocks|ai)-/
const CHART_PREFIX = "charts-"
const RENAMED = { "ai-message--default": "message-pattern" }

function nameOf(id) {
  if (RENAMED[id]) return RENAMED[id]
  const [prefix, key] = id.split("--")
  if (prefix.startsWith(CHART_PREFIX))
    return `${prefix.slice(CHART_PREFIX.length)}-chart-${key}`
  return `${prefix.replace(SECTION_PREFIX, "")}-${key === "default" ? "demo" : key}`
}

export function nativeExamples(mobileRoot) {
  const map = new Map()
  for (const [id, code] of nativeStories(mobileRoot)) map.set(nameOf(id), code)
  const directory = path.join(mobileRoot, "examples")
  for (const file of readdirSync(directory)) {
    if (!EXAMPLE_FILE.test(file)) continue
    const name = file.replace(EXAMPLE_FILE, "")
    if (!map.has(name)) map.set(name, {})
    map.get(name).rn = readFileSync(path.join(directory, file), "utf8").trim()
  }
  return map
}
