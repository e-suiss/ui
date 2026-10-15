export const ICON_PACKAGE = "@phosphor-icons/react"

const LIBRARIES = new Set([
  "lucide",
  "tabler",
  "hugeicons",
  "phosphor",
  "remixicon",
])
const TAG = "<IconPlaceholder"
const NAME_CHAR = /[\w:.-]/
const SPACE = /\s/
const LINE_WIDTH = 80
const PLACEHOLDER_IMPORT =
  /^import\s*\{\s*IconPlaceholder\s*\}\s*from\s*["'][^"']*icon-placeholder["'];?[^\S\n]*\n/m
const IMPORT_START = /^import\b/
const IMPORT_END = /(?:from\s+|^import\s+)["']([^"']+)["'];?\s*$/
const INDENT = /^[^\S\n]*/
const QUOTES = new Set(['"', "'", "`"])

function skipString(code, index) {
  const quote = code[index]
  let i = index + 1
  while (i < code.length && code[i] !== quote) i += code[i] === "\\" ? 2 : 1
  return i + 1
}

function skipBraces(code, index) {
  let depth = 0
  let i = index
  while (i < code.length) {
    const char = code[i]
    if (QUOTES.has(char)) {
      i = skipString(code, i)
      continue
    }
    if (char === "{") depth++
    if (char === "}" && --depth === 0) return i + 1
    i++
  }
  throw new Error("Unbalanced braces in an icon placeholder.")
}

function parseAttributes(code, start) {
  const attributes = []
  let i = start
  while (i < code.length) {
    while (SPACE.test(code[i])) i++
    if (code.startsWith("/>", i)) return { attributes, end: i + 2 }
    if (code[i] === "{") {
      const end = skipBraces(code, i)
      attributes.push({ text: code.slice(i, end) })
      i = end
      continue
    }
    const from = i
    while (NAME_CHAR.test(code[i] ?? "")) i++
    if (i === from) return undefined
    const name = code.slice(from, i)
    let value
    if (code[i] === "=") {
      i++
      if (code[i] === "{") i = skipBraces(code, i)
      else if (code[i] === '"' || code[i] === "'") {
        value = code.slice(i + 1, skipString(code, i) - 1)
        i = skipString(code, i)
      } else return undefined
    }
    attributes.push({ name, value, text: code.slice(from, i) })
  }
  return undefined
}

function lineIndent(code, index) {
  const lineStart = code.lastIndexOf("\n", index - 1) + 1
  return code.slice(lineStart).match(INDENT)[0]
}

function renderElement(name, attributes, indent, column) {
  const inline = `<${name}${attributes.map((text) => ` ${text}`).join("")} />`
  if (
    !attributes.length ||
    (column + inline.length <= LINE_WIDTH && !inline.includes("\n"))
  ) {
    return inline
  }
  const inner = attributes.map((text) => `\n${indent}  ${text}`).join("")
  return `<${name}${inner}\n${indent}/>`
}

function replacePlaceholders(code) {
  const icons = new Set()
  let output = ""
  let index = 0
  for (;;) {
    const start = code.indexOf(TAG, index)
    if (start === -1) break
    const parsed = SPACE.test(code[start + TAG.length] ?? "")
      ? parseAttributes(code, start + TAG.length)
      : undefined
    const icon = parsed?.attributes.find(
      (attribute) => attribute.name === "phosphor"
    )?.value
    if (!(parsed && icon)) {
      output += code.slice(index, start + TAG.length)
      index = start + TAG.length
      continue
    }
    icons.add(icon)
    const rest = parsed.attributes
      .filter((attribute) => !LIBRARIES.has(attribute.name))
      .map((attribute) => attribute.text)
    const lineStart = code.lastIndexOf("\n", start - 1) + 1
    output +=
      code.slice(index, start) +
      renderElement(icon, rest, lineIndent(code, start), start - lineStart)
    index = parsed.end
  }
  return { code: output + code.slice(index), icons: [...icons] }
}

function importStatements(lines) {
  const statements = []
  let open
  for (const [index, line] of lines.entries()) {
    if (open === undefined && IMPORT_START.test(line)) open = index
    if (open === undefined) continue
    const match = line.match(IMPORT_END)
    if (match) {
      statements.push({ start: open, end: index, specifier: match[1] })
      open = undefined
    }
  }
  return statements
}

const isPackage = (specifier) =>
  !(specifier.startsWith("@/") || specifier.startsWith("."))

function importText(names) {
  const inline = `import { ${names.join(", ")} } from "${ICON_PACKAGE}"`
  if (inline.length <= LINE_WIDTH) return [inline]
  return [
    "import {",
    ...names.map((name) => `  ${name},`),
    `} from "${ICON_PACKAGE}"`,
  ]
}

function addImport(code, icons) {
  const lines = code.split("\n")
  const statements = importStatements(lines)
  const text = importText(icons.sort())
  const chunk = []
  for (const statement of statements) {
    const previous = chunk.at(-1)
    if (previous && statement.start !== previous.end + 1) break
    chunk.push(statement)
  }
  if (chunk.length) {
    const before = chunk.find(
      ({ specifier }) => !isPackage(specifier) || specifier > ICON_PACKAGE
    )
    lines.splice(
      before ? before.start : (chunk.at(-1)?.end ?? 0) + 1,
      0,
      ...text
    )
  } else {
    const directive = lines[0]?.startsWith('"use client"') ? 2 : 0
    lines.splice(directive, 0, ...text, "")
  }
  return lines.join("\n")
}

function removePlaceholderImport(code) {
  const match = code.match(PLACEHOLDER_IMPORT)
  if (!match) return code
  const start = match.index
  const end = start + match[0].length
  const blankBefore = start === 0 || code.slice(start - 2, start) === "\n\n"
  const blankAfter = code[end] === "\n"
  return (
    code.slice(0, start) + code.slice(blankBefore && blankAfter ? end + 1 : end)
  )
}

export function usesIconPlaceholders(code) {
  return PLACEHOLDER_IMPORT.test(code)
}

export function toPhosphorIcons(code) {
  if (!usesIconPlaceholders(code)) return code
  const replaced = replacePlaceholders(removePlaceholderImport(code))
  return replaced.icons.length
    ? addImport(replaced.code, replaced.icons)
    : replaced.code
}
