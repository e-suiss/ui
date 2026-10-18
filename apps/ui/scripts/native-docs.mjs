import { readdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { parseArgs } from "node:util"
import { nativeExamples } from "../lib/native-examples.mjs"
import { toStyleSheet } from "../lib/native-stylesheet.mjs"

const ROOT = path.resolve(import.meta.dirname, "..")
const DOCS = path.join(ROOT, "content/docs")
const MOBILE = path.resolve(ROOT, "../../packages/mobile")
const RN_COMPONENTS = path.join(MOBILE, "uniwind/components")
const STORIES = path.join(MOBILE, "stories")
const NATIVE_SECTION = '<Only platform="rn swift kotlin">'
const ALL = ["rn", "swift", "kotlin"]
const NATIVE = ["swift", "kotlin"]
const LANGUAGES = { swift: "swift", kotlin: "kotlin" }
const RN_LANGUAGES = new Set(["tsx", "ts", "jsx"])
const RN_ONLY_SECTIONS = new Set(["Accessibility", "Notes"])
const KEPT_SECTIONS = new Set(["API Reference"])

const ONLY_TAG = /<Only platform="[^"]*">|<\/Only>/g
const ONLY_OPEN = /^<Only platform="([^"]+)">$/
const ELEMENT_OPEN = /^<([A-Z]\w*|div)\b[^>]*>$/
const FENCE = /^```(\w*)/
const HEADING = /^(#{2,6}) (.+)$/
const LIST_ITEM = /^[-*] /
const CODE_SPAN = /`([^`]+)`/g
const RN_WORDS =
  /className|Pressable|accessibility[A-Z]|aria-|data-|\bHTML\b|\bDOM\b|\bref\b|React|Uniwind|NativeWind|StyleSheet|\bExpo\b|Reanimated|\bprops?\b|\bhooks?\b|\bJSX\b|\bSVG\b|Storybook/
const NAMES_NATIVE = /\bSwiftUI\b|\b(?:in|Jetpack) Compose\b/
const ANDROID = /\bAndroid\b/
const NUMBER = /^-?\d+(?:\.\d+)?\s*(?:ms|pt|dp|px|%|s)?$/
const QUOTED = /^"([^"]*)"$/
const IDENTIFIER_PATH = /^\.?[A-Za-z_][\w-]*(?:\.[A-Za-z_][\w-]*)*(?:\(\))?$/
const CALL_SUFFIX = /\(\)$/
const LEADING_DOT = /^\./
const KEBAB_PART = /-(\w)/g
const WORD = /\b[A-Za-z_]\w*\b/g
const STRING = /"([^"\\\n]*)"/g
const BLOCK_COMMENT = /\/\*[\s\S]*?\*\//g
const LINE_COMMENT = /(^|[^:"])\/\/.*$/gm
const CLI_ALSO = "The CLI also adds what it builds on"
const RN_ALSO = "On React Native it also adds"
const MANUAL_HEADING = "### Manual"
const DEFAULT_STORY = "--default"
const SOURCE_EXTENSION = /\.tsx?$/
const SLUG = /\.mdx$/
const ADD_COMMAND =
  /npx @esuiss\/ui@\w+ add ([^\n]*?) --platform (swift|kotlin)/
const GROUP_WORDS = new Set(["patterns", "interactions", "charts", "blocks"])
const IMPORT_LINE = /^import\s+(.+?)\s+from\s+"([^"]+)"\s*$/
const IMPORT_NAMES = /\{([^}]*)\}/
const IMPORT_STATEMENT = /^import\s*(?:type\s+)?\{[^}]*\}\s*from\s*"[^"]+"/gm
const WHITESPACE_RUN = /\s+/g
const DEFAULT_IMPORT = /^(\w+)/
const NAMESPACE_IMPORT = /\*\s+as\s+(\w+)/
const AS_NAME = /\s+as\s+/
const TYPE_PREFIX = /^type\s+/
const JSX_TAG = /<([A-Z]\w*)/g
const LOCAL_DECLARATION = /\b(?:function|const|let|class)\s+([A-Z]\w*)/g
const EXPORT_LIST = /export\s*(?:type\s*)?\{([^}]*)\}/g
const EXPORT_DECLARATION =
  /export\s+(?:default\s+)?(?:async\s+)?(?:function|const|let|class)\s+(\w+)/g
const NATIVE_EXAMPLE = /<NativeExample id="([^"]+)"([^>]*)>/g
const SWIFT_PACKAGE_IMPORT = (product) => new RegExp(`^import ${product}$`, "m")
const STYLINGS = {
  uniwind: "Uniwind",
  nativewind: "NativeWind",
  stylesheet: "StyleSheet",
}
const RN_TABS = `<Tabs items={${JSON.stringify(Object.values(STYLINGS))}}>`
const ITEM_PREFIX = "@esuiss/"
const PRIMITIVE_PREFIX = "primitives-"
const SETUP_ITEM = /^theme-/
const SOURCE_DIRECTORY = /^\w+\/(components\/(\w+)\/[\w-]+\.tsx?)$/
const PAGE_SECTIONS = {
  ui: "components",
  patterns: "patterns",
  interactions: "interactions",
  blocks: "blocks",
  charts: "charts",
}
const STYLING_DIRECTORY = new RegExp(`^(?:${Object.keys(STYLINGS).join("|")})/`)
const ALIAS_PREFIX = /^@/
const TAILWIND_STYLINGS = "uniwind nativewind"
const STYLESHEET_BLOCK =
  /\n*<OnlyStyling styling="stylesheet">\n[\s\S]*?\n<\/OnlyStyling>\n*/g
const TAILWIND_BLOCK =
  /<OnlyStyling styling="uniwind nativewind">\n\n([\s\S]*?)\n\n<\/OnlyStyling>/g
const FENCE_BODY = /^```\w*\n([\s\S]*)\n```$/
const FRONTMATTER_TITLE = /^title: (.+)$/m
const RN_SOURCE =
  /<ComponentSource path="(\w+\/components\/\w+\/[\w-]+\.tsx?)" \/>/g
const LINE_WHITESPACE = /\s+/

const scopeKey = (scope) => ALL.filter((item) => scope.includes(item)).join(" ")
const intersect = (a, b) => a.filter((item) => b.includes(item))

function closingOnly(source, start) {
  let depth = 0
  for (const match of source.slice(start).matchAll(ONLY_TAG)) {
    depth += match[0] === "</Only>" ? -1 : 1
    if (depth === 0) return start + match.index
  }
  return -1
}

function elementEnd(lines, start, tag) {
  let depth = 0
  let fenced = false
  const open = new RegExp(`^<${tag}\\b[^>]*[^/]>$|^<${tag}>$`)
  const close = `</${tag}>`
  for (let index = start; index < lines.length; index++) {
    const line = lines[index]
    if (FENCE.test(line)) fenced = !fenced
    if (fenced) continue
    if (open.test(line)) depth++
    if (line === close) depth--
    if (depth === 0) return index
  }
  return lines.length - 1
}

function tokenize(text) {
  const lines = text.split("\n")
  const blocks = []
  let index = 0
  while (index < lines.length) {
    if (!lines[index].trim()) {
      index++
      continue
    }
    const start = index
    const line = lines[index]
    const element = line.match(ELEMENT_OPEN)
    if (FENCE.test(line)) {
      index++
      while (index < lines.length && !lines[index].startsWith("```")) index++
    } else if (element && !line.endsWith("/>")) {
      index = elementEnd(lines, start, element[1])
    } else {
      while (index + 1 < lines.length && lines[index + 1].trim()) index++
    }
    blocks.push(lines.slice(start, index + 1).join("\n"))
    index++
  }
  return blocks
}

function leavesOf(text, scope) {
  const leaves = []
  for (const block of tokenize(text)) {
    const only = block.split("\n")[0].match(ONLY_OPEN)
    if (only && block.endsWith("</Only>")) {
      const inner = block.slice(block.indexOf("\n") + 1, -"</Only>".length)
      leaves.push(...leavesOf(inner, intersect(scope, only[1].split(" "))))
      continue
    }
    const heading = block.match(HEADING)
    if (heading && !block.includes("\n")) {
      leaves.push({
        kind: "heading",
        level: heading[1].length,
        title: heading[2],
        text: block,
        scope,
      })
      continue
    }
    const fence = block.match(FENCE)
    if (fence) {
      leaves.push({ kind: "fence", lang: fence[1], text: block, scope })
      continue
    }
    if (block.startsWith("<")) {
      leaves.push({ kind: "element", text: block, scope })
      continue
    }
    if (LIST_ITEM.test(block)) {
      const items = []
      for (const line of block.split("\n")) {
        if (LIST_ITEM.test(line) || !items.length) items.push(line)
        else items[items.length - 1] += `\n${line}`
      }
      for (const item of items) leaves.push({ kind: "item", text: item, scope })
      continue
    }
    leaves.push({ kind: "text", text: block, scope })
  }
  return leaves
}

function render(leaves) {
  const groups = []
  for (const leaf of leaves) {
    if (!leaf.scope.length) continue
    const key = scopeKey(leaf.scope)
    const last = groups.at(-1)
    if (last && last.key === key) last.leaves.push(leaf)
    else groups.push({ key, leaves: [leaf] })
  }
  const blocks = groups.map(({ key, leaves: members }) => {
    let inner = ""
    members.forEach((leaf, position) => {
      const previous = members[position - 1]
      if (previous)
        inner +=
          previous.kind === "item" && leaf.kind === "item" ? "\n" : "\n\n"
      inner += leaf.text
    })
    return key === ALL.join(" ")
      ? inner
      : `<Only platform="${key}">\n\n${inner}\n\n</Only>`
  })
  return `\n\n${blocks.join("\n\n")}\n\n`
}

function camel(value) {
  return value.replace(KEBAB_PART, (_, letter) => letter.toUpperCase())
}

function known(span, vocabulary) {
  const value = span.trim()
  if (NUMBER.test(value)) return true
  const quoted = value.match(QUOTED)
  if (quoted) return vocabulary.strings.has(quoted[1])
  if (!IDENTIFIER_PATH.test(value)) return false
  return value
    .replace(LEADING_DOT, "")
    .replace(CALL_SUFFIX, "")
    .split(".")
    .every((part) => {
      const lower = camel(part)
      const upper = lower[0].toUpperCase() + lower.slice(1)
      return [part, lower, upper].some((word) => vocabulary.words.has(word))
    })
}

function classify(leaf, vocabularies, builtins) {
  if (!leaf.scope.includes("rn")) return leaf.scope
  const prose = leaf.text.replace(CODE_SPAN, "")
  if (NAMES_NATIVE.test(prose)) return leaf.scope
  if (ANDROID.test(prose))
    leaf.scope = leaf.scope.filter((platform) => platform !== "swift")
  if (RN_WORDS.test(prose)) return ["rn"]
  const spans = [...leaf.text.matchAll(CODE_SPAN)].map((match) => match[1])
  if (spans.some((span) => builtins.has(span.trim()))) return ["rn"]
  return leaf.scope.filter(
    (platform) =>
      platform === "rn" ||
      (vocabularies[platform] &&
        spans.every((span) => known(span, vocabularies[platform])))
  )
}

function settleHeadings(leaves) {
  for (let index = leaves.length - 1; index >= 0; index--) {
    const heading = leaves[index]
    if (heading.kind !== "heading") continue
    const union = new Set()
    let any = false
    for (let next = index + 1; next < leaves.length; next++) {
      const leaf = leaves[next]
      if (leaf.kind === "heading" && leaf.level <= heading.level) break
      any = true
      for (const platform of leaf.scope) union.add(platform)
    }
    if (any) heading.scope = heading.scope.filter((item) => union.has(item))
  }
}

function zones(leaves) {
  let zone = null
  for (const leaf of leaves) {
    if (leaf.kind === "heading" && leaf.level === 2) zone = leaf.title
    leaf.zone = zone
  }
}

function importsOf(code) {
  const imports = new Map()
  const joined = code.replace(IMPORT_STATEMENT, (statement) =>
    statement.replace(WHITESPACE_RUN, " ")
  )
  for (const line of joined.split("\n")) {
    const match = line.trim().match(IMPORT_LINE)
    if (!match) continue
    const [, clause, module] = match
    const names = imports.get(module) ?? []
    const namespace = clause.match(NAMESPACE_IMPORT)
    if (namespace) names.push(namespace[1])
    const list = clause.match(IMPORT_NAMES)
    if (list)
      for (const name of list[1].split(","))
        if (name.trim())
          names.push(name.trim().replace(TYPE_PREFIX, "").split(AS_NAME).at(-1))
    const fallback = !(namespace || clause.startsWith("{"))
      ? clause.match(DEFAULT_IMPORT)
      : null
    if (fallback) names.push(fallback[1])
    imports.set(module, names)
  }
  return imports
}

function importBlock(imports) {
  const rank = (module) => {
    if (module === "react") return 0
    if (module === "react-native") return 1
    return 2
  }
  return [...imports]
    .sort(([a], [b]) => rank(a) - rank(b) || a.localeCompare(b))
    .map(([module, names]) =>
      names.namespace
        ? `import * as ${names.namespace} from "${module}"`
        : `import { ${names.join(", ")} } from "${module}"`
    )
    .join("\n")
}

function repairUsage(leaves, rn, context, report, name) {
  const fences = leaves.filter(
    (leaf) =>
      leaf.zone === "Usage" &&
      leaf.kind === "fence" &&
      RN_LANGUAGES.has(leaf.lang) &&
      leaf.scope.includes("rn")
  )
  if (!fences.length) return
  const code = fences.map((leaf) => leaf.text).join("\n")
  const imports = importsOf(code)
  const imported = new Set([...imports.values()].flat())
  const local = new Set(
    [...code.matchAll(LOCAL_DECLARATION)].map((match) => match[1])
  )
  const used = new Set([...code.matchAll(JSX_TAG)].map((match) => match[1]))
  const invalid = [...imports].some(
    ([module, names]) =>
      module.startsWith("@/") &&
      names.some((item) => context.owners.get(item) !== module)
  )
  const missing = [...used].filter(
    (item) => !(imported.has(item) || local.has(item))
  )
  const unresolved = missing.filter(
    (item) => !(context.owners.has(item) || context.builtins.has(item))
  )
  if (invalid || unresolved.length) {
    if (!rn) {
      report.push(`${name}: Usage renders ${unresolved.join(", ")}`)
      return
    }
    const [first, ...rest] = fences
    first.text = `\`\`\`tsx\n${rn}\n\`\`\``
    for (const leaf of rest) leaf.scope = []
    return
  }
  if (!missing.length) return
  const merged = new Map(
    [...imports].map(([module, names]) => [module, [...names]])
  )
  for (const item of missing) {
    const module = context.owners.get(item) ?? "react-native"
    merged.set(module, [...(merged.get(module) ?? []), item])
  }
  const target =
    fences.find((leaf) => leaf.text.includes("import ")) ?? fences[0]
  const body = target.text
    .split("\n")
    .slice(1, -1)
    .filter((line) => !IMPORT_LINE.test(line.trim()))
    .join("\n")
    .trim()
  for (const leaf of fences)
    if (leaf !== target && leaf.text.includes("import ")) {
      const lines = leaf.text
        .split("\n")
        .filter((line) => !IMPORT_LINE.test(line.trim()))
      leaf.text = lines.join("\n")
    }
  const namespaces = new Map(
    [...merged].map(([module, names]) => {
      const original = imports.get(module) ?? []
      const namespace = code.includes(`* as ${original[0]} from "${module}"`)
      return [
        module,
        namespace
          ? Object.assign([], { namespace: original[0] })
          : [...new Set(names)],
      ]
    })
  )
  const header = importBlock(namespaces)
  target.text = `\`\`\`${target.lang}\n${header}${body ? `\n\n${body}` : ""}\n\`\`\``
}

function stylingUsage(leaves) {
  for (const leaf of leaves) {
    if (
      leaf.zone !== "Usage" ||
      leaf.kind !== "fence" ||
      !RN_LANGUAGES.has(leaf.lang) ||
      !leaf.scope.includes("rn")
    )
      continue
    const code = leaf.text.match(FENCE_BODY)?.[1]
    if (code === undefined) continue
    const converted = toStyleSheet(code)
    if (converted === code) continue
    const variant =
      converted === undefined
        ? "<StylingNote />"
        : `\`\`\`${leaf.lang}\n${converted}\n\`\`\``
    leaf.kind = "element"
    leaf.text = `<OnlyStyling styling="${TAILWIND_STYLINGS}">\n\n${leaf.text}\n\n</OnlyStyling>\n\n<OnlyStyling styling="stylesheet">\n\n${variant}\n\n</OnlyStyling>`
  }
}

function usageLeaves(leaves, codes) {
  const usage = leaves.filter((leaf) => leaf.zone === "Usage")
  if (!usage.length) return leaves
  for (const leaf of usage)
    if (leaf.kind === "fence" && NATIVE.includes(leaf.lang)) leaf.scope = []
  const generated = []
  const heading = usage.find(
    (leaf) => leaf.kind === "heading" && leaf.level === 2
  )
  for (const platform of NATIVE) {
    const code = codes[platform]
    if (!code) continue
    if (heading && !heading.scope.includes(platform))
      heading.scope = ALL.filter(
        (item) => heading.scope.includes(item) || item === platform
      )
    generated.push({
      kind: "fence",
      lang: LANGUAGES[platform],
      text: `\`\`\`${LANGUAGES[platform]}\n${code}\n\`\`\``,
      scope: [platform],
      zone: "Usage",
    })
  }
  const fences = usage.filter(
    (leaf) => leaf.kind === "fence" && leaf.scope.length
  )
  const anchor = fences.at(-1) ?? usage[0]
  const at = leaves.indexOf(anchor) + 1
  return [...leaves.slice(0, at), ...generated, ...leaves.slice(at)]
}

function vocabulary(texts) {
  const words = new Set()
  const strings = new Set()
  for (const text of texts) {
    for (const match of text.matchAll(STRING)) strings.add(match[1])
    const code = text.replace(BLOCK_COMMENT, "").replace(LINE_COMMENT, "$1")
    for (const match of code.replace(STRING, '""').matchAll(WORD))
      words.add(match[0])
  }
  return { words, strings }
}

function itemsOf(native, slug, registry) {
  const names = new Set()
  for (const platform of NATIVE) {
    const match = native.match(
      new RegExp(ADD_COMMAND.source.replace("(swift|kotlin)", platform))
    )
    if (match)
      for (const word of match[1].split(LINE_WHITESPACE))
        if (!GROUP_WORDS.has(word)) names.add(word)
  }
  if (!names.size) names.add(slug)
  return [...names].map((item) => registry.byName.get(item)).filter(Boolean)
}

async function platformFiles(items, platform, registry) {
  const spec = registry.platforms[platform]
  const relative = [...new Set(items.flatMap((item) => item[platform] ?? []))]
  const texts = await Promise.all(
    [...spec.base, ...relative].map((file) =>
      readFile(path.join(MOBILE, spec.directory, file), "utf8")
    )
  )
  return { relative, texts }
}

function swiftManual(relative, texts, spec) {
  const steps = [`Target iOS ${spec.requirements.ios} or later.`]
  const packages = spec.requirements.packages.filter((item) =>
    item.products.some((product) =>
      texts.some((text) => SWIFT_PACKAGE_IMPORT(product).test(text))
    )
  )
  if (packages.length)
    steps.push(
      `Add the Swift package to your app:\n\n\`\`\`swift title="Package.swift"\n${packages.map((item) => `.package(url: "${item.url}", from: "${item.from}")`).join("\n")}\n\`\`\``
    )
  steps.push(
    `Copy the theme files every view uses:\n\n${spec.base.map((file) => `<ComponentSource path="swift/${file}" />`).join("\n\n")}`
  )
  steps.push(
    `Copy the source${relative.length > 1 ? " and every file it uses" : ""}:\n\n${relative.map((file) => `<ComponentSource path="swift/${file}" />`).join("\n\n")}`
  )
  steps.push("Add the files to your app target.")
  return steps.map((step, index) => `${index + 1}. ${step}`).join("\n\n")
}

function kotlinManual(relative, texts, spec) {
  const { minSdk, bom, dependencies } = spec.requirements
  const needed = dependencies.filter((dependency) => {
    const group = dependency.split(":")[0]
    if (group.startsWith("androidx.")) return true
    return texts.some((text) => text.includes(`import ${group}.`))
  })
  const lines = [
    `implementation(platform("${bom}"))`,
    ...needed.map((dependency) => `implementation("${dependency}")`),
  ]
  const steps = [
    `Set \`minSdk\` to ${minSdk} or higher and add the dependencies:\n\n\`\`\`kotlin title="build.gradle.kts"\n${lines.join("\n")}\n\`\`\``,
    `Copy the theme files every view uses:\n\n${spec.base.map((file) => `<ComponentSource path="kotlin/${file}" />`).join("\n\n")}`,
    `Copy the source${relative.length > 1 ? " and every file it uses" : ""}:\n\n${relative.map((file) => `<ComponentSource path="kotlin/${file}" />`).join("\n\n")}`,
    "Update the `com.esuiss.ui` package names to match your project.",
  ]
  return steps.map((step, index) => `${index + 1}. ${step}`).join("\n\n")
}

function rnItem(registry, path) {
  return registry.items.find((item) =>
    item.files?.some((file) => file.path === path)
  )
}

function rnTarget(file) {
  return (file.target || file.path)
    .replace(ALIAS_PREFIX, "")
    .replace(STYLING_DIRECTORY, "")
}

async function rnPage(item, pages) {
  const match = item.files?.[0]?.path.match(SOURCE_DIRECTORY)
  const section = match && PAGE_SECTIONS[match[2]]
  if (!section) return undefined
  const name = path.basename(match[1]).replace(SOURCE_EXTENSION, "")
  const file = path.join(DOCS, section, `${name}.mdx`)
  if (!pages.has(file)) {
    const text = await readFile(file, "utf8").catch(() => undefined)
    pages.set(file, text?.match(FRONTMATTER_TITLE)?.[1].trim())
  }
  const title = pages.get(file)
  return title ? { title, href: `/docs/${section}/${name}` } : undefined
}

async function rnParts(registry, root, pages) {
  const byName = new Map(registry.items.map((item) => [item.name, item]))
  const pieces = []
  const local = []
  const seen = new Set([root.name])
  const queue = [root]
  while (queue.length) {
    const current = queue.shift()
    for (const dependency of current.registryDependencies ?? []) {
      const name = dependency.replace(ITEM_PREFIX, "")
      if (seen.has(name) || SETUP_ITEM.test(name)) continue
      seen.add(name)
      const item = byName.get(name)
      if (!item) continue
      const page = name.startsWith(PRIMITIVE_PREFIX)
        ? undefined
        : await rnPage(item, pages)
      if (page) pieces.push(page)
      else {
        local.push(item)
        queue.push(item)
      }
    }
  }
  const packages = [
    ...new Set([root, ...local].flatMap((item) => item.dependencies ?? [])),
  ].sort()
  pieces.sort((a, b) => a.title.localeCompare(b.title))
  return { pieces, local, packages }
}

const lowerTitle = (title) => title.toLowerCase()

async function rnTab(styling, root, registries, pages) {
  const registry = registries[styling]
  const item = registry.items.find((entry) => entry.name === root.name)
  if (!item) return undefined
  const { pieces, local, packages } = await rnParts(registry, item, pages)
  const source = (file) =>
    `<ComponentSource path="${styling}/${file.path.replace(STYLING_DIRECTORY, "")}" />`
  const steps = []
  if (packages.length)
    steps.push(
      `Install the dependencies:\n\n\`\`\`bash title="Terminal"\nnpx expo install ${packages.join(" ")}\n\`\`\``
    )
  if (pieces.length)
    steps.push(
      `Add the pieces it builds on: ${pieces.map((piece) => `[${piece.title}](${piece.href})`).join(", ")}.`
    )
  const primitives = local.filter((entry) =>
    entry.name.startsWith(PRIMITIVE_PREFIX)
  )
  for (const entry of local.filter((other) => !primitives.includes(other)))
    for (const file of entry.files ?? [])
      steps.push(
        `Copy the ${lowerTitle(entry.title)} into \`${rnTarget(file)}\`:\n\n${source(file)}`
      )
  if (primitives.length) {
    const files = primitives
      .flatMap((entry) => entry.files ?? [])
      .sort((a, b) => a.path.localeCompare(b.path))
    steps.push(
      `Copy the primitives it uses into \`components/primitives\`:\n\n${files.map(source).join("\n\n")}`
    )
  }
  for (const file of item.files ?? [])
    steps.push(`Copy the source into \`${rnTarget(file)}\`:\n\n${source(file)}`)
  steps.push("Update the import paths to match your project.")
  return steps.map((step, index) => `${index + 1}. ${step}`).join("\n\n")
}

async function rnManual(native, registries, pages) {
  const start = native.indexOf(`\n${MANUAL_HEADING}\n`)
  if (start < 0) return native
  const open = '<Only platform="rn">'
  const from = native.indexOf(open, start)
  const next = native.indexOf("\n## ", start)
  if (from < 0 || (next >= 0 && from > next)) return native
  const end = closingOnly(native, from)
  const block = native.slice(from, end)
  if (!block.includes(RN_TABS)) return native
  const main = [...block.matchAll(RN_SOURCE)]
    .map((match) => match[1])
    .find(
      (file) => file.startsWith("uniwind/") && !file.includes("/animated-view.")
    )
  const root = main && rnItem(registries.uniwind, main)
  if (!root) return native
  const tabs = []
  for (const styling of Object.keys(STYLINGS)) {
    const body = await rnTab(styling, root, registries, pages)
    if (!body) return native
    tabs.push(`<div>\n\n${body}\n\n</div>`)
  }
  return `${native.slice(0, from)}${open}\n\n${RN_TABS}\n\n${tabs.join("\n\n")}\n\n</Tabs>\n\n${native.slice(end)}`
}

async function manual(native, items, registry) {
  const start = native.indexOf(`\n${MANUAL_HEADING}\n`)
  if (start < 0 || !items.length) return native
  let result = native
  for (const platform of NATIVE) {
    if (!items.some((item) => item[platform])) continue
    const open = `<Only platform="${platform}">`
    const from = result.indexOf(open, start)
    const next = result.indexOf("\n## ", start)
    if (from < 0 || (next >= 0 && from > next)) continue
    const end = closingOnly(result, from)
    const { relative, texts } = await platformFiles(items, platform, registry)
    const spec = registry.platforms[platform]
    const body =
      platform === "swift"
        ? swiftManual(relative, texts, spec)
        : kotlinManual(relative, texts, spec)
    result = `${result.slice(0, from)}${open}\n\n${body}\n\n${result.slice(end)}`
  }
  return result
}

function installation(leaves) {
  for (const leaf of leaves) {
    if (leaf.zone !== "Installation" || leaf.kind !== "text") continue
    if (!leaf.text.startsWith(CLI_ALSO)) continue
    leaf.scope = intersect(leaf.scope, ["rn"])
    leaf.text = leaf.text.replace(RN_ALSO, "It also adds")
  }
}

function checkExamples(native, scope, codes, report, name) {
  const stack = [scope]
  const tags = new RegExp(`${ONLY_TAG.source}|${NATIVE_EXAMPLE.source}`, "g")
  for (const match of native.matchAll(tags)) {
    if (match[0] === "</Only>") stack.pop()
    else if (match[0].startsWith("<Only"))
      stack.push(intersect(stack.at(-1), match[0].split('"')[1].split(" ")))
    else if (!match[2].includes("platforms=")) {
      const code = codes.get(match[1]) ?? {}
      for (const platform of NATIVE)
        if (stack.at(-1).includes(platform) && !code[platform])
          report.push(`${name}: ${match[1]} has no ${platform} example code`)
    }
  }
}

async function generate(file, context, report) {
  const source = await readFile(file, "utf8")
  const nativeStart = source.indexOf(NATIVE_SECTION)
  if (nativeStart < 0) return null
  const nativeEnd = closingOnly(source, nativeStart)
  const name = path.relative(DOCS, file)
  const slug = path.basename(file).replace(SLUG, "")
  let native = source
    .slice(nativeStart + NATIVE_SECTION.length, nativeEnd)
    .replace(STYLESHEET_BLOCK, "\n\n")
    .replace(TAILWIND_BLOCK, "$1")
  const items = itemsOf(native, slug, context.registry)
  native = await manual(native, items, context.registry)
  native = await rnManual(native, context.rnRegistries, context.pages)

  const vocabularies = {}
  for (const platform of NATIVE)
    if (items.some((item) => item[platform]))
      vocabularies[platform] = vocabulary(
        (await platformFiles(items, platform, context.registry)).texts
      )

  const ids = [...native.matchAll(NATIVE_EXAMPLE)].map((match) => match[1])
  const usageCodes = {}
  for (const platform of [...NATIVE, "rn"]) {
    const usable = ids.filter((item) => context.examples.get(item)?.[platform])
    const id = usable.find((item) => item.endsWith(DEFAULT_STORY)) ?? usable[0]
    usageCodes[platform] = id ? context.examples.get(id)[platform] : undefined
  }

  let leaves = leavesOf(native, ALL)
  zones(leaves)
  installation(leaves)
  for (const leaf of leaves) {
    if (KEPT_SECTIONS.has(leaf.zone) || leaf.zone === "Installation") continue
    if (leaf.kind === "heading" && leaf.level === 2) continue
    if (RN_ONLY_SECTIONS.has(leaf.zone)) {
      leaf.scope = intersect(leaf.scope, ["rn"])
      continue
    }
    if (leaf.kind === "fence" && RN_LANGUAGES.has(leaf.lang))
      leaf.scope = intersect(leaf.scope, ["rn"])
    else if (leaf.kind === "text" || leaf.kind === "item")
      leaf.scope = classify(leaf, vocabularies, context.builtins)
  }
  repairUsage(leaves, usageCodes.rn, context, report, name)
  leaves = usageLeaves(leaves, usageCodes)
  stylingUsage(leaves)
  settleHeadings(leaves)
  const next = render(leaves)
  checkExamples(next, ALL, context.examples, report, name)
  return `${source.slice(0, nativeStart)}${NATIVE_SECTION}${next}${source.slice(nativeEnd)}`
}

async function exportOwners() {
  const owners = new Map()
  for (const directory of await readdir(RN_COMPONENTS)) {
    for (const file of await readdir(path.join(RN_COMPONENTS, directory))) {
      const text = await readFile(
        path.join(RN_COMPONENTS, directory, file),
        "utf8"
      )
      const module = `@/components/${directory}/${file.replace(SOURCE_EXTENSION, "")}`
      for (const match of text.matchAll(EXPORT_LIST))
        for (const item of match[1].split(",")) {
          const exported = item
            .trim()
            .replace(TYPE_PREFIX, "")
            .split(AS_NAME)
            .at(-1)
          if (exported && !owners.has(exported)) owners.set(exported, module)
        }
      for (const match of text.matchAll(EXPORT_DECLARATION))
        if (!owners.has(match[1])) owners.set(match[1], module)
    }
  }
  return owners
}

async function builtins() {
  const names = new Set()
  for (const file of await readdir(STORIES)) {
    const imports = importsOf(await readFile(path.join(STORIES, file), "utf8"))
    for (const item of imports.get("react-native") ?? []) names.add(item)
  }
  return names
}

async function files(dir) {
  const entries = await readdir(dir, { recursive: true })
  return entries
    .filter((entry) => entry.endsWith(".mdx"))
    .map((entry) => path.join(dir, entry))
}

const { values } = parseArgs({ options: { check: { type: "boolean" } } })
const index = JSON.parse(
  await readFile(path.join(MOBILE, "registry.json"), "utf8")
)
const rnRegistries = {}
for (const styling of Object.keys(STYLINGS))
  rnRegistries[styling] = JSON.parse(
    await readFile(
      path.join(MOBILE, "registry", styling, "registry.json"),
      "utf8"
    )
  )
const context = {
  rnRegistries,
  pages: new Map(),
  registry: {
    platforms: index.platforms,
    byName: new Map(index.items.map((item) => [item.name, item])),
  },
  examples: nativeExamples(MOBILE),
  owners: await exportOwners(),
  builtins: await builtins(),
}
const report = []
const stale = []
for (const file of await files(DOCS)) {
  const current = await readFile(file, "utf8")
  const next = await generate(file, context, report)
  if (next === null || next === current) continue
  if (values.check) stale.push(path.relative(DOCS, file))
  else await writeFile(file, next)
}
if (stale.length)
  report.push(
    `Native docs sections are out of date in ${stale.length} pages. Run pnpm --filter @esuiss/site native-docs.\n${stale.join("\n")}`
  )
if (report.length) {
  console.error(report.join("\n"))
  process.exit(1)
}
