import { readdirSync, readFileSync, statSync } from "node:fs"
import path from "node:path"
import ts from "typescript"

const LEADING_SPACES = /^ */
const STORY_SLOT_LINE = /^([ \t]*)<Story\s*\/>/m
const STORY_SLOT = /<Story\s*\/>/
const ARGS_PARAMETER = /\(args\)/
const TYPE_KEYWORD = /^type\s+/

const STORYBOOK = "@storybook/react-native"

function parse(file, source) {
  return ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  )
}

function unwrap(node) {
  let current = node
  while (
    current &&
    (ts.isSatisfiesExpression(current) ||
      ts.isAsExpression(current) ||
      ts.isParenthesizedExpression(current) ||
      ts.isTypeAssertionExpression(current))
  ) {
    current = current.expression
  }
  return current
}

function property(object, name) {
  return object?.properties.find(
    (member) =>
      ts.isPropertyAssignment(member) && member.name.getText() === name
  )
}

function objectArgs(literal, source) {
  const args = new Map()
  if (!literal || !ts.isObjectLiteralExpression(literal)) return args
  for (const member of literal.properties) {
    if (ts.isPropertyAssignment(member))
      args.set(
        ts.isStringLiteral(member.name)
          ? member.name.text
          : member.name.getText(source),
        member.initializer
      )
    else if (ts.isShorthandPropertyAssignment(member))
      args.set(member.name.getText(source), member.name)
  }
  return args
}

function dedent(text) {
  const lines = text.split("\n")
  const indents = lines
    .slice(1)
    .filter((line) => line.trim())
    .map((line) => line.match(LEADING_SPACES)[0].length)
  const cut = indents.length ? Math.min(...indents) : 0
  return [lines[0], ...lines.slice(1).map((line) => line.slice(cut))].join("\n")
}

function indent(text, spaces) {
  const pad = " ".repeat(spaces)
  return text
    .split("\n")
    .map((line) => (line.trim() ? pad + line : line))
    .join("\n")
}

function attributes(args, source) {
  const parts = []
  const list = []
  let children
  for (const [name, value] of args) {
    if (value.kind === ts.SyntaxKind.FalseKeyword) continue
    if (
      ts.isStringLiteral(value) &&
      value.text === "default" &&
      name !== "children"
    )
      continue
    if (name === "children") {
      const element =
        ts.isJsxElement(value) ||
        ts.isJsxSelfClosingElement(value) ||
        ts.isJsxFragment(value)
      if (ts.isStringLiteral(value)) children = value.text
      else if (element) children = value.getText(source)
      else children = `{${value.getText(source)}}`
      continue
    }
    let attr
    if (value.kind === ts.SyntaxKind.TrueKeyword) attr = name
    else if (
      ts.isStringLiteral(value) ||
      ts.isNoSubstitutionTemplateLiteral(value)
    )
      attr = `${name}="${value.text}"`
    else attr = `${name}={${value.getText(source)}}`
    parts.push(attr)
    list.push([name, attr])
  }
  return { text: parts.join(" "), list, children }
}

function boundAttribute(value) {
  if (value === undefined) return "={undefined}"
  if (value.startsWith('"')) return `=${value}`
  return `={${value}}`
}

const pascal = (name) =>
  name.replace(/(^|-)([a-z0-9])/g, (_, __, letter) => letter.toUpperCase())

function storyExamples(file, source, itemName) {
  const tree = parse(file, source)
  const imports = []
  const declarations = new Map()
  let meta
  const stories = []

  for (const statement of tree.statements) {
    if (ts.isImportDeclaration(statement)) {
      const from = statement.moduleSpecifier.text
      if (from !== STORYBOOK) imports.push(statement)
      continue
    }
    if (ts.isVariableStatement(statement)) {
      const exported = statement.modifiers?.some(
        (m) => m.kind === ts.SyntaxKind.ExportKeyword
      )
      for (const declaration of statement.declarationList.declarations) {
        const name = declaration.name.getText(tree)
        const value = unwrap(declaration.initializer)
        if (name === "meta") meta = value
        else if (exported && value && ts.isObjectLiteralExpression(value))
          stories.push({ key: name, value })
        else declarations.set(name, statement)
      }
      continue
    }
    if (
      (ts.isFunctionDeclaration(statement) ||
        ts.isTypeAliasDeclaration(statement) ||
        ts.isInterfaceDeclaration(statement)) &&
      statement.name
    ) {
      declarations.set(statement.name.text, statement)
    }
  }

  const metaArgs = objectArgs(unwrap(property(meta, "args")?.initializer), tree)
  const component = property(meta, "component")?.initializer?.getText(tree)
  const byKey = new Map(stories.map((story) => [story.key, story]))

  const metaRender = unwrap(property(meta, "render")?.initializer)
  function renderOf(story, depth = 0) {
    const render =
      unwrap(property(story.value, "render")?.initializer) ?? metaRender
    if (render && ts.isPropertyAccessExpression(render) && depth < 3) {
      const other = byKey.get(render.expression.getText(tree))
      return other ? renderOf(other, depth + 1) : undefined
    }
    return render
  }

  const examples = []
  for (const story of stories) {
    const storyName = property(story.value, "name")?.initializer
    const args = new Map([
      ...metaArgs,
      ...objectArgs(unwrap(property(story.value, "args")?.initializer), tree),
    ])
    const { text: attrs, list: attrList, children } = attributes(args, tree)
    const render = renderOf(story)

    const bound = new Map()
    let restName = "args"
    const first =
      render && (ts.isArrowFunction(render) || ts.isFunctionExpression(render))
        ? render.parameters[0]
        : undefined
    if (first && ts.isObjectBindingPattern(first.name)) {
      for (const element of first.name.elements) {
        if (element.dotDotDotToken) restName = element.name.getText(tree)
        else
          bound.set(
            element.name.getText(tree),
            (element.propertyName ?? element.name).getText(tree)
          )
      }
    }
    const valueText = (key) => {
      const value = args.get(key)
      if (!value) return undefined
      return ts.isStringLiteral(value)
        ? JSON.stringify(value.text)
        : value.getText(tree)
    }

    let jsx
    let helper = ""
    if (!render) {
      if (!component) continue
      const open = `<${component}${attrs ? ` ${attrs}` : ""}`
      jsx =
        children !== undefined
          ? `${open}>${children}</${component}>`
          : `${open} />`
    } else if (
      (ts.isArrowFunction(render) || ts.isFunctionExpression(render)) &&
      !ts.isBlock(render.body)
    ) {
      jsx = dedent(unwrap(render.body).getText(tree))
    } else {
      const body = ts.isBlock(render.body)
        ? render.body.getText(tree)
        : `{ return ${render.body.getText(tree)} }`
      const params = render.parameters.map((p) => p.getText(tree)).join(", ")
      let helperName = `${pascal(story.key)}Preview`
      while (declarations.has(helperName)) helperName += "Story"
      helper = dedent(`function ${helperName}(${params ? "args" : ""}) ${body}`)
      jsx = `<${helperName} />`
    }

    const decorators = [
      ...(unwrap(property(story.value, "decorators")?.initializer)?.elements ??
        []),
      ...(unwrap(property(meta, "decorators")?.initializer)?.elements ?? []),
    ]
    for (const decorator of decorators) {
      const fn = unwrap(decorator)
      if (
        !fn ||
        !(ts.isArrowFunction(fn) || ts.isFunctionExpression(fn)) ||
        ts.isBlock(fn.body) ||
        fn.parameters.length > 1
      )
        continue
      const wrapper = dedent(unwrap(fn.body).getText(tree))
      const slot = wrapper.match(STORY_SLOT_LINE)
      if (!slot) continue
      const pad = slot[1].length
      jsx = wrapper.replace(STORY_SLOT, indent(jsx, pad).trimStart())
    }

    const spreadInto = (text) =>
      text.replace(
        new RegExp(`\\s*\\{\\s*\\.\\.\\.${restName}\\s*\\}`, "g"),
        (match, offset) => {
          const start = text.lastIndexOf("<", offset)
          const end = text.indexOf(">", offset)
          const tag = text
            .slice(start, end === -1 ? undefined : end)
            .replace(match, "")
          const kept = attrList.filter(
            ([name]) =>
              ![...bound.values()].includes(name) &&
              !new RegExp(`\\s${name}(?=[=\\s/>]|$)`).test(tag)
          )
          return kept.length ? ` ${kept.map(([, attr]) => attr).join(" ")}` : ""
        }
      )
    const inline = (text) => {
      let out = text.replace(
        /\bargs\.(\w+)\b/g,
        (_match, key) => valueText(key) ?? "undefined"
      )
      for (const [local, key] of bound) {
        const value = valueText(key)
        out = out.replace(
          new RegExp(`=\\{\\s*${local}\\s*\\}`, "g"),
          boundAttribute(value)
        )
        out = out.replace(
          new RegExp(`\\{\\s*${local}\\s*\\}`, "g"),
          value === undefined ? "" : `{${value}}`
        )
      }
      return out
    }
    const tidy = (text) =>
      text
        .replace(/\{\s*!undefined\s*&&\s*/g, "{")
        .replace(/\{\s*undefined\s*&&[^{}]*\}/g, "")
    jsx = tidy(inline(spreadInto(jsx)))
    helper = tidy(inline(spreadInto(helper))).replace(ARGS_PARAMETER, "()")

    let body = `${helper}\n${jsx}`
    const uses = (text, identifier) =>
      new RegExp(`\\b${identifier}\\b`).test(text)
    const picked = new Set()
    for (let size = -1; size !== picked.size; ) {
      size = picked.size
      for (const [name] of declarations) if (uses(body, name)) picked.add(name)
      body = [
        helper,
        jsx,
        ...[...declarations]
          .filter(([name]) => picked.has(name))
          .map(([, s]) => s.getText(tree)),
      ].join("\n")
    }
    const used = (identifier) => uses(body, identifier)
    const lines = []
    for (const statement of imports) {
      const clause = statement.importClause
      const from = statement.moduleSpecifier.text
      if (!clause) continue
      const named =
        clause.namedBindings && ts.isNamedImports(clause.namedBindings)
          ? clause.namedBindings.elements
              .map((e) => e.getText(tree))
              .filter((e) =>
                used(e.replace(TYPE_KEYWORD, "").split(" as ").pop())
              )
          : []
      const namespace =
        clause.namedBindings && ts.isNamespaceImport(clause.namedBindings)
          ? clause.namedBindings.name.text
          : undefined
      const fallback = clause.name?.text
      if (named.length)
        lines.push(`import { ${named.join(", ")} } from "${from}"`)
      if (namespace && used(namespace))
        lines.push(`import * as ${namespace} from "${from}"`)
      if (fallback && used(fallback))
        lines.push(`import ${fallback} from "${from}"`)
    }
    const locals = [...declarations]
      .filter(([name]) => picked.has(name))
      .map(([, statement]) => statement)
      .filter((statement, index, all) => all.indexOf(statement) === index)
      .map((statement) => dedent(statement.getText(tree)))

    let exampleName = `${pascal(itemName)}${story.key === "Default" ? "" : pascal(story.key)}Example`
    while (declarations.has(exampleName)) exampleName += "Demo"
    const code = [
      lines.join("\n"),
      locals.join("\n\n"),
      helper,
      `export function ${exampleName}() {\n  return (\n${indent(jsx, 4)}\n  )\n}`,
    ]
      .filter(Boolean)
      .join("\n\n")

    examples.push({
      key: story.key,
      name:
        storyName && ts.isStringLiteral(storyName) ? storyName.text : undefined,
      code,
      jsx,
    })
  }
  return examples
}

const LEADING_DASHES = /^-+/
const TRAILING_DASHES = /-+$/
const LEADING_BLANK_LINE = /^\s*\n/
const TRAILING_WHITESPACE = /\s+$/
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
      text: dedentBlock(source.slice(start, end)).replace(STATIC_MEMBER, ""),
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
    const body = dedentBlock(source.slice(brace + 1, closing(source, brace)))
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
    const body = dedentBlock(source.slice(brace + 1, closing(source, brace)))
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

function nativeStories(uimRepo) {
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

const STORY_TITLE = /title:\s*"([^"]+)"/
const STORY_FILE = /\.stories\.tsx$/

const kebab = (key) =>
  key
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase()

export function nativeExamples(mobileRoot) {
  const map = nativeStories(mobileRoot)
  const directory = path.join(mobileRoot, "stories")
  for (const file of readdirSync(directory)) {
    if (!STORY_FILE.test(file)) continue
    const full = path.join(directory, file)
    const source = readFileSync(full, "utf8")
    const title = source
      .slice(source.indexOf("const meta"))
      .match(STORY_TITLE)?.[1]
    if (!title) continue
    const prefix = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
    for (const example of storyExamples(
      full,
      source,
      file.replace(STORY_FILE, "")
    )) {
      const id = `${prefix}--${kebab(example.key)}`
      if (!map.has(id)) map.set(id, {})
      map.get(id).rn ??= example.code
    }
  }
  return map
}
