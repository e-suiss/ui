import { readdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { parseArgs } from "node:util"

const ROOT = path.resolve(import.meta.dirname, "..")
const DOCS = path.join(ROOT, "content/docs")
const MOBILE = path.resolve(ROOT, "../../packages/mobile")
const SOURCES = {
  swift: path.join(MOBILE, "swiftui/Sources/EsuissUI"),
  kotlin: path.join(MOBILE, "kotlin/ui/src/main/kotlin/com/esuiss/ui"),
}
const NATIVE_SECTION = '<Only platform="rn swift kotlin">'
const API_HEADING = "## API Reference"
const PLATFORMS = { swift: "SwiftUI", kotlin: "Compose" }
const PARAMETERS = "| Parameter | Type | Default |\n| --- | --- | --- |"
const PROPERTIES = "| Property | Type |\n| --- | --- |"
const VARIANTS = "| Value | Parameters |\n| --- | --- |"
const SOURCE_PATH = /<ComponentSource path="((?:swift|kotlin)\/[^"]+)"/g
const PART_HEADING = /^### (.+)$/
const RN_PART = /^### /m
const LEADING_NEWLINES = /^\n+/
const ONLY_TAG = /<Only platform="[^"]*">|<\/Only>/g
const ONLY_BASE = /<OnlyBase base="([^"]*)">[\s\S]*?<\/OnlyBase>/g
const SWIFT_DECLARATION =
  /^((?:@[\w.]+(?:\([^)\n]*\))?\s+)*)((?:(?:public|internal|private|fileprivate|final|nonisolated)\s+)*)(struct|enum|class|actor|extension|protocol|func)\s+([\w.]+)/gm
const SWIFT_MEMBER =
  /\bpublic\s+((?:(?:static|nonisolated|private\(set\)|final|override|mutating)\s+)*)(init\??|func\s+`?\w+`?|var\s+\w+|let\s+\w+|typealias\s+\w+|enum\s+\w+)/g
const SWIFT_REQUIREMENT = /^\s*(func\s+\w+|var\s+\w+)/gm
const SWIFT_WHERE_SELF = /where\s+Self\s*==\s*([\w.]+)/
const SWIFT_RETURN = /^\s*(?:async\s+)?(?:throws\s+)?->\s*([^{\n]+)/
const SWIFT_SKIPPED = new Set(["body", "makeBody", "_body"])
const KOTLIN_DECLARATION =
  /^((?:@[\w.]+(?:\([^)\n]*\))?\s+)*)((?:(?:private|internal|public|protected|inline|suspend|sealed|data|enum|abstract|open|value|annotation|operator|infix)\s+)*)(fun|class|interface|object)\b/gm
const KOTLIN_MEMBER =
  /^ {4}((?:@[\w.]+(?:\([^)\n]*\))?\s+)*)((?:(?:private|internal|public|protected|override|open|abstract|suspend|inline|operator|data)\s+)*)(fun|val|var|class|object)\b/gm
const KOTLIN_RETURN = /^\s*:\s*([^={\n]+)/
const VALUE_LIST = /^`[^`]+`(?:(?:,|,? or) `[^`]+`)*\.?$/
const DEFAULTS_SENTENCE = /\s*Defaults to (?:`[^`]*`|[^.`])*\./g
const PLATFORM_WORDS =
  /className|Pressable|accessibility(?:Label|Role)|aria-|data-|HTML|DOM\b|\bref\b|React|Uniwind|NativeWind|StyleSheet/
const WORD_SPLIT = /[\s-]+/
const BLOCK_COMMENT = /\/\*[\s\S]*?\*\//g
const LINE_COMMENT = /(^|[^:"])\/\/.*$/gm
const CONTINUED_LINE = /[,:&]\s*$/
const INTEGER = /^-?\d+$/
const CONSTRUCTOR_CALL = /^[A-Z]\w*\(/
const DECIMAL = /^-?\d+\.\d+$/
const STRING_LITERAL = /^".*"$/
const SWIFT_ATTRIBUTE = /@(\w+)(\([^)]*\))?\s*/g
const WHITESPACE = /\s+/
const SWIFT_TYPE_PREFIX = /^(?:@escaping|inout|sending)\s+/
const SWIFT_CASE = /^\s*(?:indirect\s+)?case\s+(.+)$/
const BACKTICKS = /[`]/g
const ASSIGNMENT = /=.*$/
const PUBLIC = /\bpublic\b/
const TYPE_ANNOTATION = /^\s*:\s*([^{\n]+)/
const VIEW_CONFORMANCE = /:[^{]*\bView\b/
const STATIC = /\bstatic\b/
const TYPED_VALUE = /^\s*:\s*([^={\n]+)/
const INITIAL_VALUE = /^\s*=\s*([^\n]+)/
const ALIAS_TARGET = /^\s*=\s*([\w.]+)/
const KOTLIN_PARAMETER_ANNOTATION =
  /@[\w.]+(\([^)]*\))?\s+(?=(?:vararg\s+|val\s+|var\s+)?\w+\s*:)/g
const KOTLIN_VARARG = /^(?:(?:override|private|internal|public)\s+)*vararg\s+/
const KOTLIN_PARAMETER_MODIFIERS =
  /^(?:(?:vararg|val|var|override|private|internal|public)\s+)+/
const KOTLIN_HIDDEN = /\b(private|internal|protected)\b/
const LEADING_NAME = /^\s+(\w+)/
const KOTLIN_CONSTRUCTOR =
  /^\s*((?:(?:private|internal|public|protected)\s+)?)(?:@\w+\s+)*constructor\s*/
const OVERRIDE = /\boverride\b/
const KOTLIN_PROPERTY =
  /^\s+(?:[\w.<>?, ]+\.)?(\w+)\s*(?::\s*([^=\n{]+?))?\s*(?:=\s*([^\n]+)|by\b|\n)/
const KOTLIN_VARIANT =
  /^ {4}((?:(?:data|private|internal)\s+)*)(class|object)\s+(\w+)/gm
const ENUM = /\benum\b/
const CALL_REST = /\(.*$/s
const IDENTIFIER = /^\w+$/
const SEALED = /\bsealed\b/
const ABSTRACT = /\babstract\b/
const ARGUMENTS = /\(.*$/
const PIPE = /\|/g
const WHITESPACE_RUN = /\s+/g
const OPTIONAL = /\?$/
const LEADING_DOT = /^\./
const NAME_END = /[.(]/
const THEME_PATH = /\/(Theme|theme)\//
const EXTENSION = /\.\w+$/
const QUOTED = /"([^"]*)"/
const TITLE = /^title:\s*(.+)$/m
const QUOTES = /["']/g

function matching(text, open) {
  const pairs = { "(": ")", "{": "}", "[": "]", "<": ">" }
  const close = pairs[text[open]]
  let depth = 0
  let quote = null
  for (let index = open; index < text.length; index++) {
    const char = text[index]
    if (quote) {
      if (char === "\\") index++
      else if (char === quote) quote = null
      continue
    }
    if (char === '"') {
      quote = char
      continue
    }
    if (char === "-" && text[index + 1] === ">") {
      index++
      continue
    }
    if (char === text[open]) depth++
    else if (char === close) {
      depth--
      if (depth === 0) return index
    }
  }
  return -1
}

function splitTop(text, separator = ",") {
  const parts = []
  let depth = 0
  let quote = null
  let start = 0
  for (let index = 0; index < text.length; index++) {
    const char = text[index]
    if (quote) {
      if (char === "\\") index++
      else if (char === quote) quote = null
      continue
    }
    if (char === '"') quote = char
    else if (char === "-" && text[index + 1] === ">") index++
    else if ("([{<".includes(char)) depth++
    else if (")]}>".includes(char)) depth--
    else if (char === separator && depth === 0) {
      parts.push(text.slice(start, index))
      start = index + 1
    }
  }
  parts.push(text.slice(start))
  return parts.map((part) => part.trim()).filter(Boolean)
}

function topIndex(text, needle) {
  let depth = 0
  let quote = null
  for (let index = 0; index < text.length; index++) {
    const char = text[index]
    if (quote) {
      if (char === "\\") index++
      else if (char === quote) quote = null
      continue
    }
    if (char === '"') {
      quote = char
      continue
    }
    if (char === "-" && text[index + 1] === ">") {
      index++
      continue
    }
    if ("([{<".includes(char)) depth++
    else if (")]}>".includes(char)) depth--
    else if (depth === 0 && text.startsWith(needle, index)) return index
  }
  return -1
}

function depthAt(text, index) {
  let depth = 0
  let quote = null
  for (let position = 0; position < index; position++) {
    const char = text[position]
    if (quote) {
      if (char === "\\") position++
      else if (char === quote) quote = null
      continue
    }
    if (char === '"') quote = char
    else if (char === "{") depth++
    else if (char === "}") depth--
  }
  return depth
}

function stripComments(source) {
  return source.replace(BLOCK_COMMENT, "").replace(LINE_COMMENT, "$1")
}

function skipGenerics(text, index) {
  let position = index
  while (text[position] === " ") position++
  return text[position] === "<" ? matching(text, position) + 1 : position
}

function bodyAfter(text, index) {
  for (let position = index; position < text.length; position++) {
    const char = text[position]
    if (char === "{") return { open: position, close: matching(text, position) }
    if (char === "\n" && !CONTINUED_LINE.test(text.slice(index, position)))
      return null
    if (char === "(" || char === "<") position = matching(text, position)
  }
  return null
}

function literalType(value, platform) {
  if (INTEGER.test(value)) return "Int"
  if (CONSTRUCTOR_CALL.test(value)) return value.slice(0, value.indexOf("("))
  if (DECIMAL.test(value)) return "Double"
  if (value === "true" || value === "false")
    return platform === "swift" ? "Bool" : "Boolean"
  if (STRING_LITERAL.test(value)) return "String"
  return null
}

function swiftParameter(raw) {
  const attributes = []
  const text = raw
    .replace(SWIFT_ATTRIBUTE, (_, name) => {
      attributes.push(name)
      return ""
    })
    .trim()
  const colon = topIndex(text, ":")
  if (colon < 0) return null
  const labels = text.slice(0, colon).trim().split(WHITESPACE)
  const rest = text.slice(colon + 1).trim()
  const equals = topIndex(rest, "=")
  const type = (equals < 0 ? rest : rest.slice(0, equals)).trim()
  const fallback = equals < 0 ? null : rest.slice(equals + 1).trim()
  const [external, internal = external] = labels
  return {
    name: external === "_" ? `_ ${internal}` : external,
    label: external,
    key: internal,
    type: type.replace(SWIFT_TYPE_PREFIX, ""),
    fallback,
  }
}

function swiftCall(text, index) {
  const open = text.indexOf("(", skipGenerics(text, index))
  const close = matching(text, open)
  const params = splitTop(text.slice(open + 1, close))
    .map(swiftParameter)
    .filter(Boolean)
  const returns = text
    .slice(close + 1)
    .match(SWIFT_RETURN)?.[1]
    .trim()
  return { params, returns: returns && returns !== "Void" ? returns : null }
}

function swiftCases(body) {
  const cases = []
  for (const line of body.split("\n")) {
    const found = line.match(SWIFT_CASE)
    if (!found || depthAt(body, body.indexOf(line)) !== 0) continue
    for (const item of splitTop(found[1])) {
      const raw = item.replace(BACKTICKS, "")
      const equals = topIndex(raw, "=")
      const value = (equals < 0 ? raw : raw.slice(0, equals)).trim()
      const paren = value.indexOf("(")
      if (paren < 0) {
        cases.push({ name: `.${value}`, params: [] })
        continue
      }
      const params = splitTop(
        value.slice(paren + 1, matching(value, paren))
      ).map((param) => {
        const colon = topIndex(param, ":")
        const equals = topIndex(param, "=")
        const typed = colon < 0 ? null : param.slice(0, colon).trim()
        const type = (colon < 0 ? param : param.slice(colon + 1))
          .replace(ASSIGNMENT, "")
          .trim()
        return {
          name: typed ?? "_",
          type,
          fallback: equals < 0 ? null : param.slice(equals + 1).trim(),
        }
      })
      cases.push({ name: `.${value.slice(0, paren)}`, params })
    }
  }
  return cases
}

function swiftHost(name) {
  return name.charAt(0).toLowerCase() + name.slice(1)
}

function swiftParts(source) {
  const text = stripComments(source)
  const parts = []
  const byName = new Map()
  const enums = new Map()
  const aliases = new Map()
  const requirements = new Map()
  const part = (name, kind, extra = {}) => {
    if (!byName.has(name)) {
      const item = { name, kind, signatures: [], properties: [], ...extra }
      byName.set(name, item)
      parts.push(item)
    }
    return byName.get(name)
  }
  const types = new Set(
    [...text.matchAll(SWIFT_DECLARATION)]
      .filter((match) => PUBLIC.test(match[2]) && match[3] !== "func")
      .map((match) => match[4])
  )

  for (const match of text.matchAll(SWIFT_DECLARATION)) {
    const [, , modifiers, kind, name] = match
    const isPublic = PUBLIC.test(modifiers)
    const after = match.index + match[0].length
    if (kind === "func") {
      if (!isPublic) continue
      const call = swiftCall(text, after)
      part(name, "function", { returns: call.returns }).signatures.push(
        call.params
      )
      continue
    }
    const body = bodyAfter(text, after)
    if (!body) continue
    const header = text.slice(after, body.open)
    const inner = text.slice(body.open + 1, body.close)
    if (kind === "enum") {
      const cases = swiftCases(inner)
      enums.set(name, cases)
      if (isPublic) part(name, "enum", { cases })
      continue
    }
    if (kind === "protocol") {
      if (!isPublic) continue
      const owner = part(name, "type")
      requirements.set(name, new Set())
      for (const member of inner.matchAll(SWIFT_REQUIREMENT)) {
        if (depthAt(inner, member.index) !== 0) continue
        const [word, member_name] = member[1].split(WHITESPACE)
        const at = member.index + member[0].length
        requirements.get(name).add(member_name)
        if (word === "func") {
          const call = swiftCall(inner, at)
          part(`${name}.${member_name}`, "method", {
            returns: call.returns,
          }).signatures.push(call.params)
        } else {
          const type = inner.slice(at).match(TYPE_ANNOTATION)?.[1].trim()
          if (type) owner.properties.push({ name: member_name, type })
        }
      }
      continue
    }
    const styled = kind === "extension" && header.match(SWIFT_WHERE_SELF)
    const isView = kind === "extension" && name === "View"
    const known = kind === "extension" && types.has(name)
    if (kind !== "extension" && !isPublic) continue
    if (kind === "extension" && !styled && !isView && !known) continue
    const conformed = new Set(
      [...requirements]
        .filter(([protocol]) => new RegExp(`\\b${protocol}\\b`).test(header))
        .flatMap(([, names]) => [...names])
    )
    const owner =
      kind === "extension"
        ? null
        : part(name, "type", {
            view: VIEW_CONFORMANCE.test(header.slice(skipGenerics(header, 0))),
          })
    for (const member of inner.matchAll(SWIFT_MEMBER)) {
      if (depthAt(inner, member.index) !== 0) continue
      const isStatic = STATIC.test(member[1])
      const [word, raw_name] = member[2].split(WHITESPACE)
      const member_name = raw_name?.replace(BACKTICKS, "")
      const at = member.index + member[0].length
      if (word.startsWith("init")) {
        if (styled || isView) continue
        part(name, "type").signatures.push(swiftCall(inner, at).params)
      } else if (word === "func") {
        if (SWIFT_SKIPPED.has(member_name) || conformed.has(member_name))
          continue
        const call = swiftCall(inner, at)
        if (styled && isStatic) {
          part(`.${swiftHost(name)}(.${member_name})`, "style", {
            note: styled[1],
          }).signatures.push(call.params)
        } else if (isView) {
          part(`.${member_name}`, "modifier").signatures.push(call.params)
        } else if (!styled) {
          part(`${name}.${member_name}`, "method", {
            returns: call.returns,
          }).signatures.push(call.params)
        }
      } else if (word === "var" || word === "let") {
        if (SWIFT_SKIPPED.has(member_name)) continue
        const rest = inner.slice(at)
        const typed = rest.match(TYPED_VALUE)?.[1].trim()
        if (styled && isStatic) {
          part(`.${swiftHost(name)}(.${member_name})`, "style", {
            note: styled[1],
          })
          continue
        }
        if (!owner || styled || isView) continue
        const literal = rest.match(INITIAL_VALUE)?.[1].trim()
        const type = typed ?? (literal && literalType(literal, "swift"))
        if (!type) continue
        owner.properties.push({
          name: isStatic ? `static ${member_name}` : member_name,
          type,
        })
      } else if (word === "typealias" && owner) {
        const target = inner.slice(at).match(ALIAS_TARGET)?.[1]
        if (target) aliases.set(`${name}.${member_name}`, target)
      } else if (word === "enum" && owner) {
        const nested = bodyAfter(inner, at)
        if (nested) {
          enums.set(
            `${name}.${member_name}`,
            swiftCases(inner.slice(nested.open + 1, nested.close))
          )
        }
      }
    }
  }
  for (const item of parts) {
    if (item.kind !== "style" || !item.note) continue
    const created = byName.get(item.note)
    if (!created) continue
    if (item.signatures.length === 0) item.signatures = created.signatures
    if (created.properties.length === 0) created.hidden = true
  }
  return { parts: parts.filter((item) => !item.hidden), enums, aliases }
}

function kotlinParameter(raw) {
  const text = raw.replace(KOTLIN_PARAMETER_ANNOTATION, "").trim()
  const vararg = KOTLIN_VARARG.test(text)
  const plain = text.replace(KOTLIN_PARAMETER_MODIFIERS, "")
  const colon = topIndex(plain, ":")
  if (colon < 0) return null
  const name = plain.slice(0, colon).trim()
  const rest = plain.slice(colon + 1).trim()
  const equals = topIndex(rest, "=")
  const type = (equals < 0 ? rest : rest.slice(0, equals)).trim()
  return {
    name,
    label: name,
    key: name,
    type: vararg ? `vararg ${type}` : type,
    fallback: equals < 0 ? null : rest.slice(equals + 1).trim(),
  }
}

function kotlinCall(text, index) {
  const start = skipGenerics(text, index)
  const open = text.indexOf("(", start)
  const head = text.slice(start, open).trim()
  const dot = head.lastIndexOf(".")
  const close = matching(text, open)
  const params = splitTop(text.slice(open + 1, close))
    .map(kotlinParameter)
    .filter(Boolean)
  const returns = text
    .slice(close + 1)
    .match(KOTLIN_RETURN)?.[1]
    .trim()
  return {
    name: dot < 0 ? head : head.slice(dot + 1),
    receiver: dot < 0 ? null : head.slice(0, dot),
    params,
    returns: returns && returns !== "Unit" ? returns : null,
  }
}

function kotlinHidden(modifiers) {
  return KOTLIN_HIDDEN.test(modifiers)
}

function kotlinClass(text, index) {
  const name = text.slice(index).match(LEADING_NAME)
  if (!name) return null
  let position = skipGenerics(text, index + name[0].length)
  const rest = text.slice(position)
  const explicit = rest.match(KOTLIN_CONSTRUCTOR)
  let hiddenConstructor = false
  if (explicit) {
    hiddenConstructor = kotlinHidden(explicit[1])
    position += explicit[0].length
  }
  while (text[position] === " ") position++
  let params = null
  if (text[position] === "(") {
    const close = matching(text, position)
    params = splitTop(text.slice(position + 1, close))
      .map(kotlinParameter)
      .filter(Boolean)
    position = close + 1
  }
  const body = bodyAfter(text, position)
  return {
    name: name[1],
    params: hiddenConstructor ? null : params,
    hiddenConstructor,
    inner: body ? text.slice(body.open + 1, body.close) : "",
  }
}

function kotlinMembers(inner, owner, part) {
  for (const member of inner.matchAll(KOTLIN_MEMBER)) {
    const [, annotations, modifiers, word] = member
    if (kotlinHidden(modifiers) || OVERRIDE.test(modifiers)) continue
    const at = member.index + member[0].length
    if (word === "fun") {
      const call = kotlinCall(inner, at)
      part(`${owner.name}.${call.name}`, "method", {
        returns: call.returns,
        receiver: call.receiver,
        view: annotations.includes("@Composable") && !call.returns,
      }).signatures.push(call.params)
    } else if (word === "val" || word === "var") {
      const found = inner.slice(at).match(KOTLIN_PROPERTY)
      if (!found) continue
      const type =
        found[2]?.trim() ?? (found[3] && literalType(found[3].trim(), "kotlin"))
      if (type) owner.properties.push({ name: found[1], type })
    }
  }
}

function kotlinVariants(inner, name) {
  const variants = []
  const pattern = KOTLIN_VARIANT
  for (const match of inner.matchAll(pattern)) {
    if (kotlinHidden(match[1])) continue
    const parsed =
      match[2] === "class"
        ? kotlinClass(
            inner,
            match.index + match[0].length - match[3].length - 1
          )
        : null
    variants.push({
      name: `${name}.${match[3]}`,
      params: parsed?.params ?? [],
    })
  }
  return variants
}

function kotlinParts(source) {
  const text = stripComments(source)
  const parts = []
  const byName = new Map()
  const enums = new Map()
  const part = (name, kind, extra = {}) => {
    if (!byName.has(name)) {
      const item = { name, kind, signatures: [], properties: [], ...extra }
      byName.set(name, item)
      parts.push(item)
    }
    return byName.get(name)
  }

  for (const match of text.matchAll(KOTLIN_DECLARATION)) {
    const [, annotations, modifiers, word] = match
    const hidden = kotlinHidden(modifiers)
    const at = match.index + match[0].length
    if (word === "fun") {
      if (hidden) continue
      const call = kotlinCall(text, at)
      const shown =
        call.receiver === "Modifier" ? `Modifier.${call.name}` : call.name
      part(shown, "function", {
        returns: call.returns,
        receiver: call.receiver === "Modifier" ? null : call.receiver,
        view: annotations.includes("@Composable") && !call.returns,
      }).signatures.push(call.params)
      continue
    }
    if (word === "object") continue
    const parsed = kotlinClass(text, at)
    if (!parsed) continue
    if (ENUM.test(modifiers)) {
      const body = parsed.inner.split(";")[0]
      const cases = splitTop(body)
        .map((entry) => entry.replace(CALL_REST, "").trim())
        .filter((entry) => IDENTIFIER.test(entry))
        .map((entry) => ({ name: `${parsed.name}.${entry}`, params: [] }))
      enums.set(parsed.name, cases)
      if (!hidden) part(parsed.name, "enum", { cases })
      continue
    }
    if (hidden) continue
    if (SEALED.test(modifiers)) {
      part(parsed.name, "enum", {
        cases: kotlinVariants(parsed.inner, parsed.name),
      })
      continue
    }
    const owner = part(parsed.name, "type")
    if (parsed.params) owner.signatures.push(parsed.params)
    else if (
      word === "class" &&
      !ABSTRACT.test(modifiers) &&
      !parsed.hiddenConstructor
    )
      owner.signatures.push([])
    kotlinMembers(parsed.inner, owner, part)
  }
  return { parts, enums, aliases: new Map() }
}

function merge(signatures) {
  const rows = []
  const seen = new Map()
  for (const params of signatures) {
    for (const param of params) {
      if (seen.has(param.name)) {
        const row = seen.get(param.name)
        if (!row.fallback && param.fallback) row.fallback = param.fallback
        continue
      }
      const row = { ...param }
      seen.set(param.name, row)
      rows.push(row)
    }
  }
  return rows
}

function overloads(item, platform) {
  const unique = []
  const keys = new Set()
  for (const params of item.signatures) {
    const key = params.map((param) => `${param.name}:${param.type}`).join(",")
    if (keys.has(key)) continue
    keys.add(key)
    unique.push(params)
  }
  if (unique.length < 2) return null
  const shared = unique[0].filter((param) =>
    unique.every((params) => params.some((other) => other.name === param.name))
  )
  if (unique.every((params) => params.length === shared.length)) return null
  const base = item.name.split(".").at(-1).replace(ARGUMENTS, "")
  const calls = unique.map((params) => {
    if (platform === "swift") {
      const head = item.kind === "type" ? "init" : base
      return `${head}(${params.map((param) => `${param.label}:`).join("")})`
    }
    const listed = params.filter(
      (param) =>
        !param.fallback || !shared.some((other) => other.name === param.name)
    )
    return `${base}(${listed.map((param) => param.name).join(", ")})`
  })
  return `Overloads: ${calls.map((call) => code(call)).join(", ")}.`
}

function escapePipes(value) {
  return value.replace(PIPE, "\\|")
}

function code(value) {
  const ticks = value.includes("`") ? "``" : "`"
  return `${ticks}${escapePipes(value.replace(WHITESPACE_RUN, " "))}${ticks}`
}

function resolveAlias(type, parsed, owner) {
  const bare = type.replace(OPTIONAL, "")
  const scope = owner.split(".")[0]
  return (
    parsed.aliases.get(`${scope}.${bare}`) ??
    [...parsed.aliases].find(([name]) => name.endsWith(`.${bare}`))?.[1] ??
    bare
  )
}

function shortCase(value, platform) {
  return platform === "kotlin" ? value.split(".").at(-1) : value
}

function typeCell(type, parsed, owner, platform) {
  const bare = resolveAlias(type, parsed, owner)
  const scope = owner.split(".")[0]
  const cases =
    parsed.enums.get(`${scope}.${bare}`) ??
    parsed.enums.get(bare) ??
    [...parsed.enums].find(([name]) => name.endsWith(`.${bare}`))?.[1]
  if (!cases?.length || cases.some((value) => value.params.length > 0))
    return code(type)
  const list = cases
    .map((value) => code(shortCase(value.name, platform)))
    .join(" \\| ")
  return `${code(type)}: ${list}`
}

function clean(description) {
  if (!description) return ""
  const text = description.replace(DEFAULTS_SENTENCE, "").trim()
  if (VALUE_LIST.test(text) || PLATFORM_WORDS.test(text)) return ""
  return text
}

function reference(api) {
  const parts = new Map()
  let current = null
  let expectSummary = false
  for (const line of api.split("\n")) {
    const heading = line.match(PART_HEADING)
    if (heading) {
      current = heading[1].trim()
      parts.set(current, "")
      expectSummary = true
      continue
    }
    if (
      expectSummary &&
      line.trim() &&
      !line.startsWith("|") &&
      !line.startsWith("<")
    ) {
      if (!line.startsWith("Also accepts")) parts.set(current, line.trim())
      expectSummary = false
      continue
    }
    if (line.startsWith("|")) expectSummary = false
  }
  return { parts }
}

function baseName(item) {
  if (item.kind === "method") return item.name.split(".").at(-1)
  return item.name.replace(LEADING_DOT, "").split(NAME_END)[0]
}

function summaryOf(item, references) {
  if (item.kind === "style") return `Style that creates \`${item.note}\`.`
  if (!item.view) return ""
  for (const ref of references) {
    const found = clean(ref.parts.get(baseName(item)))
    if (found) return found
  }
  return ""
}

function variantsTable(item, platform) {
  if (item.cases.every((value) => value.params.length === 0)) {
    return [
      `Values: ${item.cases.map((value) => code(shortCase(value.name, platform))).join(", ")}.`,
    ]
  }
  const lines = [VARIANTS]
  for (const value of item.cases) {
    const params = value.params
      .map((param) => {
        const head =
          param.name === "_" ? param.type : `${param.name}: ${param.type}`
        return code(param.fallback ? `${head} = ${param.fallback}` : head)
      })
      .join(", ")
    lines.push(
      `| ${code(shortCase(value.name, platform))} | ${params || "-"} |`
    )
  }
  return lines
}

function render(platform, parsed, references) {
  const blocks = []
  for (const item of parsed.parts) {
    const rows = merge(item.signatures)
    if (
      item.kind === "type" &&
      item.signatures.length === 0 &&
      item.properties.length === 0
    )
      continue
    if (item.kind === "enum" && item.cases.length === 0) continue
    const lines = [`### ${item.name}`, ""]
    const summary = summaryOf(item, references)
    if (summary) lines.push(summary, "")
    if (item.receiver) lines.push(`Receiver: ${code(item.receiver)}.`, "")
    if (item.kind === "enum") {
      lines.push(...variantsTable(item, platform), "")
    } else if (item.signatures.length > 0 && rows.length === 0) {
      lines.push("Takes no parameters.", "")
    } else if (rows.length > 0) {
      lines.push(PARAMETERS)
      for (const row of rows) {
        lines.push(
          `| ${code(row.name).replace("_ ", "_\u00a0")} | ${typeCell(row.type, parsed, item.name, platform)} | ${row.fallback ? code(row.fallback) : "-"} |`
        )
      }
      lines.push("")
      const overload = overloads(item, platform)
      if (overload) lines.push(overload, "")
    }
    if (item.returns) lines.push(`Returns ${code(item.returns)}.`, "")
    if (item.properties.length > 0) {
      lines.push(PROPERTIES)
      for (const property of item.properties) {
        lines.push(`| ${code(property.name)} | ${code(property.type)} |`)
      }
      lines.push("")
    }
    blocks.push(lines.join("\n").trimEnd())
  }
  if (blocks.length === 0) return null
  return `<Only platform="${platform}">\n\n${blocks.join("\n\n")}\n\n</Only>`
}

function mainSource(native, platform, title, report, file) {
  const paths = [...native.matchAll(SOURCE_PATH)]
    .map((match) => match[1])
    .filter((item) => item.startsWith(`${platform}/`))
    .filter((item) => !THEME_PATH.test(item))
  if (paths.length === 0) return null
  const wanted = title.split(WORD_SPLIT).join("").toLowerCase()
  const exact = paths.find(
    (item) =>
      path.basename(item).replace(EXTENSION, "").toLowerCase() === wanted
  )
  if (!exact) report.push(`${file}: ${platform} reference uses ${paths[0]}`)
  return exact ?? paths[0]
}

async function files(dir) {
  const entries = await readdir(dir, { recursive: true })
  return entries
    .filter((entry) => entry.endsWith(".mdx"))
    .map((entry) => path.join(dir, entry))
}

function closingOnly(source, start) {
  let depth = 0
  for (const match of source.slice(start).matchAll(ONLY_TAG)) {
    depth += match[0] === "</Only>" ? -1 : 1
    if (depth === 0) return start + match.index
  }
  return -1
}

function scopeAt(text, index) {
  const stack = []
  for (const match of text.slice(0, index).matchAll(ONLY_TAG)) {
    if (match[0] === "</Only>") stack.pop()
    else stack.push(match[0].match(QUOTED)[1].split(" "))
  }
  return stack.reduce((scope, own) =>
    scope.filter((platform) => own.includes(platform))
  )
}

function splitApi(native) {
  const start = native.indexOf(`\n${API_HEADING}\n`)
  if (start < 0) return null
  const from = start + API_HEADING.length + 2
  const next = native.indexOf("\n## ", from)
  let end = next < 0 ? native.length : next
  const open = []
  for (const match of native.slice(from, end).matchAll(ONLY_TAG)) {
    if (match[0] !== "</Only>") open.push(match.index)
    else if (open.length) open.pop()
    else {
      end = from + native.slice(from, from + match.index).trimEnd().length + 1
      break
    }
  }
  if (open.length)
    end = from + native.slice(from, from + open[0]).trimEnd().length + 1
  return {
    before: native.slice(0, from),
    api: native.slice(from, end),
    after: native.slice(end),
    scope: scopeAt(native, start),
  }
}

function rnPart(api) {
  const trimmed = api.trim()
  if (!trimmed.startsWith('<Only platform="rn">')) return trimmed
  const end = closingOnly(trimmed, 0)
  return trimmed.slice('<Only platform="rn">'.length, end).trim()
}

function onlyBases(text, bases) {
  return text.replace(ONLY_BASE, (block, list) =>
    list.split(" ").some((base) => bases.includes(base)) ? block : ""
  )
}

function webApi(source, nativeStart) {
  const web = source.slice(0, nativeStart)
  const start = web.indexOf(`\n${API_HEADING}\n`)
  if (start < 0) return ""
  const next = web.indexOf("\n## ", start + 1)
  return web.slice(start, next < 0 ? web.length : next)
}

async function generate(file, report) {
  const source = await readFile(file, "utf8")
  const nativeStart = source.indexOf(NATIVE_SECTION)
  if (nativeStart < 0) return null
  const nativeEnd = closingOnly(source, nativeStart)
  const native = source.slice(nativeStart, nativeEnd)
  const split = splitApi(native)
  if (!split) return null
  const rnApi = rnPart(split.api)
  if (!RN_PART.test(rnApi)) return null
  const name = path.relative(DOCS, file)
  const title = source.match(TITLE)?.[1].replace(QUOTES, "").trim() ?? ""
  const web = webApi(source, nativeStart)
  const references = [
    reference(rnApi),
    reference(onlyBases(web, ["base"])),
    reference(onlyBases(web, ["base", "radix"])),
  ]
  const sections = [`<Only platform="rn">\n\n${rnApi}\n\n</Only>`]
  for (const [platform, label] of Object.entries(PLATFORMS)) {
    if (!split.scope.includes(platform)) continue
    const relative = mainSource(native, platform, title, report, name)
    if (!relative) {
      report.push(`${name}: no ${platform} source`)
      sections.push(
        `<Only platform="${platform}">\n\n${title} has no ${label} API.\n\n</Only>`
      )
      continue
    }
    const absolute = path.join(
      SOURCES[platform],
      relative.slice(platform.length + 1)
    )
    const text = await readFile(absolute, "utf8")
    const parsed = platform === "swift" ? swiftParts(text) : kotlinParts(text)
    const block = render(platform, parsed, references)
    if (block) sections.push(block)
    else report.push(`${name}: no public ${platform} API in ${relative}`)
  }
  const api = `\n${sections.join("\n\n")}\n\n`
  return `${source.slice(0, nativeStart)}${split.before}${api}${split.after.replace(LEADING_NEWLINES, "")}${source.slice(nativeEnd)}`
}

const { values } = parseArgs({ options: { check: { type: "boolean" } } })
const report = []
const stale = []
for (const file of await files(DOCS)) {
  const current = await readFile(file, "utf8")
  const next = await generate(file, report)
  if (next === null || next === current) continue
  if (values.check) stale.push(path.relative(DOCS, file))
  else await writeFile(file, next)
}
if (!values.check) for (const line of report) console.log(line)
if (values.check && stale.length) {
  console.error(
    `Native API references are out of date in ${stale.length} pages. Run pnpm --filter @esuiss/site native-api.\n${stale.join("\n")}`
  )
  process.exit(1)
}
