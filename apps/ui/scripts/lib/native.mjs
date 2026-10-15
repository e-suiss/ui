import { readdirSync, readFileSync, statSync } from "node:fs"
import path from "node:path"

const LEADING_DASHES = /^-+/
const TRAILING_DASHES = /-+$/
const LEADING_BLANK_LINE = /^\s*\n/
const TRAILING_WHITESPACE = /\s+$/
const LEADING_SPACES = /^ */
const IMPORT_LINE = /^(import|package) /
const TOP_LEVEL_LINE = /^[^\s})\]/]/
const ANNOTATION_LINE = /^@/
const LEADING_ANNOTATION = /^@\w+\s*\n/
const SWIFT_DECLARATION =
  /^(?:(?:private|fileprivate|public)\s+)*(?:struct|enum|class|actor|func|let|var|extension)\s+(\w+)/
const KOTLIN_DECLARATION =
  /^(?:(?:private|internal)\s+)*(?:data class|enum class|sealed class|class|object|fun|val|var)\s+(?:<[^>]+>\s*)?(\w+)/
const OPEN_BRACKET_END = /[[{(]\s*$/
const STATIC_MEMBER = /^(?:private )?static /
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
  },
  kotlin: {
    Components: "Components",
    Patterns: "Patterns",
    Interactions: "Interactions",
    Blocks: "Blocks",
    Charts: "Charts",
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

function dedent(text) {
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

function declarations(source, lang) {
  const lines = source.split("\n")
  const starts = []
  lines.forEach((line, index) => {
    if (!TOP_LEVEL_LINE.test(line) || IMPORT_LINE.test(line)) return
    if (index > 0 && ANNOTATION_LINE.test(lines[index - 1])) return
    starts.push(index)
  })
  return starts.map((start, n) => {
    let end = (starts[n + 1] ?? lines.length) - 1
    while (end > start && !lines[end].trim()) end--
    const text = lines.slice(start, end + 1).join("\n")
    const head = text.replace(LEADING_ANNOTATION, "")
    const name =
      lang === "swift"
        ? head.match(SWIFT_DECLARATION)?.[1]
        : head.match(KOTLIN_DECLARATION)?.[1]
    return { name, text }
  })
}

function members(source) {
  const result = []
  for (const match of source.matchAll(
    /^ {2}(?:private )?static (let|var|func) (\w+)/gm
  )) {
    const start = match.index
    let end = source.indexOf("\n", start)
    const rest = source.slice(start, end)
    const opener = rest.search(OPEN_BRACKET_END)
    if (opener >= 0) end = closing(source, start + opener) + 1
    result.push({
      name: match[2],
      text: dedent(source.slice(start, end)).replace(STATIC_MEMBER, ""),
    })
  }
  return result
}

const words = (text) => new Set(text.match(/\b[A-Za-z_]\w*\b/g) ?? [])

function helpers(seed, pool) {
  const used = new Set()
  const queue = [seed]
  while (queue.length) {
    const found = words(queue.pop())
    for (const declaration of pool) {
      if (
        declaration.name &&
        !used.has(declaration) &&
        found.has(declaration.name)
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

function swiftStories(file) {
  const source = readFileSync(file, "utf8")
  const group = source.match(SWIFT_STORY_GROUP)
  if (!group) return []
  const prefix = sanitize(`${sections.swift[group[1]]}/${group[2]}`)
  const imports = [...source.matchAll(/^import (\w+)$/gm)].map(
    (match) => match[1]
  )
  const pool = [
    ...declarations(source, "swift").filter((d) => !STORIES_ENUM.test(d.text)),
    ...members(source),
  ]
  const result = []
  for (const match of source.matchAll(/Story\(\s*"(\w+)"/g)) {
    const paren = source.indexOf("(", match.index)
    const after = closing(source, paren)
    const brace = source.indexOf("{", after)
    if (brace < 0 || source.slice(after + 1, brace).trim()) continue
    const body = dedent(source.slice(brace + 1, closing(source, brace)))
    const used = helpers(body, pool)
    const direct = body.match(EMPTY_CALL)?.[1]
    const parts = []
    if (
      !(
        direct &&
        used.some(
          (d) => d.name === direct && STRUCT_KEYWORD.test(d.text.split("\n")[0])
        )
      )
    ) {
      parts.push(
        `struct ${exampleName(group[2], match[1])}: View {\n  var body: some View {\n${indentBy(body, 4)}\n  }\n}`
      )
    }
    parts.push(...used.map((d) => publicize(d.text)))
    const code = parts.join("\n\n")
    const header = imports.filter((name) =>
      name === "PhosphorSwift"
        ? PHOSPHOR_REFERENCE.test(code)
        : name !== "Charts" || CHART_REFERENCE.test(code)
    )
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
    const body = dedent(source.slice(brace + 1, closing(source, brace)))
    const used = helpers(body, pool)
    const direct = body.match(EMPTY_CALL)?.[1]
    const parts = []
    if (
      !(
        direct &&
        used.some((d) => d.name === direct && FUN_KEYWORD.test(d.text))
      )
    ) {
      parts.push(
        `@Composable\nfun ${exampleName(group[2], match[1])}() {\n${indentBy(body, 4)}\n}`
      )
    }
    parts.push(...used.map((d) => publicize(d.text)))
    const code = parts.join("\n\n")
    const found = words(code)
    const header = imports.filter((name) => {
      const last = name.split(".").pop()
      if (last === "*") return true
      if (last === "getValue" || last === "setValue")
        return BY_KEYWORD.test(code)
      return found.has(last)
    })
    result.push({
      id: `${prefix}--${sanitize(startCase(match[1]))}`,
      code: `${header.map((name) => `import ${name}`).join("\n")}\n\n${code}`,
    })
  }
  return result
}

export function nativeStories(uimRepo) {
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
    add("swift", swiftStories(file))
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
