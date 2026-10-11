import { readdir, readFile } from "node:fs/promises"
import path from "node:path"

const IDENTIFIER = /[A-Za-z_]\w*/g

export const PLATFORMS = {
  swift: {
    title: "SwiftUI",
    source: "swiftui/Sources/EsuissUI",
    manifest: "swiftui/Package.swift",
    extension: ".swift",
    base: ["Theme"],
    folders: {
      ui: "Components",
      pattern: "Patterns",
      interaction: "Interactions",
      block: "Blocks",
      chart: "Charts",
    },
    files: {
      picker: "Patterns/OptionPicker.swift",
      text: "Components/TextVariant.swift",
      theme: "Components/ThemeProvider.swift",
      "haptics-expo": "Components/Haptics.swift",
    },
  },
  kotlin: {
    title: "Compose",
    source: "kotlin/ui/src/main/kotlin/com/esuiss/ui",
    manifest: "kotlin/ui/build.gradle.kts",
    extension: ".kt",
    base: ["theme"],
    folders: {
      ui: "components",
      pattern: "patterns",
      interaction: "interactions",
      block: "blocks",
      chart: "charts",
    },
    files: {
      "haptics-expo": "components/Haptics.kt",
    },
  },
}

function blankLiterals(code, { characters, template }) {
  let output = ""
  let index = 0
  const keep = (end) => {
    output += code.slice(index, end)
    index = end
  }
  const blank = (end) => {
    output += code.slice(index, end).replace(/[^\n]/g, " ")
    index = end
  }

  const skipCode = (closing) => {
    let depth = 0
    while (index < code.length) {
      const char = code[index]
      if (char === '"') {
        skipString()
        continue
      }
      if (char === "{" || char === "(") depth++
      if (char === "}" || char === ")") {
        if (depth === 0 && char === closing) return
        depth--
      }
      keep(index + 1)
    }
  }

  const skipString = () => {
    const triple = code.startsWith('"""', index)
    const delimiter = triple ? '"""' : '"'
    keep(index + delimiter.length)
    while (index < code.length) {
      if (code.startsWith(delimiter, index)) {
        keep(index + delimiter.length)
        return
      }
      const char = code[index]
      if (template === "swift" && char === "\\" && code[index + 1] === "(") {
        keep(index + 2)
        skipCode(")")
        keep(index + 1)
      } else if (
        template === "kotlin" &&
        char === "$" &&
        code[index + 1] === "{"
      ) {
        keep(index + 2)
        skipCode("}")
        keep(index + 1)
      } else if (template === "kotlin" && char === "$") {
        const name = code.slice(index + 1).match(/^[A-Za-z_]\w*/)
        keep(index + 1 + (name ? name[0].length : 0))
      } else if (char === "\\") {
        blank(index + 2)
      } else if (!triple && char === "\n") {
        return
      } else {
        blank(index + 1)
      }
    }
  }

  while (index < code.length) {
    const char = code[index]
    if (char === '"') skipString()
    else if (code.startsWith("//", index))
      blank(
        code.indexOf("\n", index) === -1
          ? code.length
          : code.indexOf("\n", index)
      )
    else if (code.startsWith("/*", index)) blank(code.indexOf("*/", index) + 2)
    else if (characters && char === "'") {
      const literal = code.slice(index).match(/^'(?:\\.|[^'\\])+'/)
      if (literal) blank(index + literal[0].length)
      else keep(index + 1)
    } else keep(index + 1)
  }
  return output
}

function atDepth(code, wanted) {
  let depth = 0
  let output = ""
  for (const char of code) {
    if (char === "}" || char === ")") depth--
    output += depth === wanted || char === "\n" ? char : " "
    if (char === "{" || char === "(") depth++
  }
  return output
}

const SWIFT_DECLARATION =
  /(?:^|[\s;])((?:(?:@\w+(?:\([^)]*\))?|public|internal|private|fileprivate|open|package|final|indirect|nonisolated|static|mutating|override|convenience|required|lazy|weak|unowned)\s+)*)(?:struct|class|enum|protocol|actor|typealias|func|var|let|macro)\s+(\w+)/g

function swiftNames(text) {
  return [...text.matchAll(SWIFT_DECLARATION)]
    .filter((match) => !/\b(?:private|fileprivate)\b/.test(match[1]))
    .map((match) => ({
      name: match[2],
      isStatic: /\bstatic\b/.test(match[1]),
    }))
}

function swiftDeclarations(code) {
  const declared = new Set(swiftNames(atDepth(code, 0)).map(({ name }) => name))
  const members = []

  let depth = 0
  const extensions = []
  for (const match of code.matchAll(/\bextension\s+([\w.]+)[^{]*\{|[{}]/g)) {
    if (match[0] === "}") depth--
    else if (match[0] === "{") depth++
    else {
      if (depth === 0) {
        extensions.push({
          type: match[1],
          start: match.index + match[0].length,
        })
      }
      depth++
    }
  }
  for (const { type, start } of extensions) {
    let level = 1
    let end = start
    while (end < code.length && level > 0) {
      if (code[end] === "{") level++
      if (code[end] === "}") level--
      end++
    }
    for (const member of swiftNames(atDepth(code.slice(start, end - 1), 0))) {
      members.push({ ...member, type: type.split(".").pop() })
    }
  }
  return { declared, members }
}

const KOTLIN_DECLARATION =
  /(?:^|[\s;])((?:(?:@[\w.]+(?:\([^)]*\))?|public|internal|private|protected|inline|data|sealed|enum|value|abstract|open|annotation|const|operator|infix|suspend|tailrec|lateinit|inner|fun)\s+)*)(?:class|interface|object|fun|val|var|typealias)\s+(?:<[^>]*>\s+)?(?:[\w.]+(?:<[^>]*>)?\??\.)?(\w+)/g

function kotlinDeclarations(code) {
  const declared = new Set()
  for (const match of atDepth(code, 0).matchAll(KOTLIN_DECLARATION)) {
    if (/\bprivate\b/.test(match[1])) continue
    declared.add(match[2])
  }
  return { declared, members: [] }
}

async function listFiles(root, folder = "") {
  const entries = await readdir(path.join(root, folder), {
    withFileTypes: true,
  })
  const files = []
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const relative = path.posix.join(folder, entry.name)
    if (entry.isDirectory()) files.push(...(await listFiles(root, relative)))
    else files.push(relative)
  }
  return files
}

async function readSources(root, platform) {
  const config = PLATFORMS[platform]
  const folder = path.join(root, config.source)
  const sources = []
  for (const file of await listFiles(folder)) {
    if (!file.endsWith(config.extension)) continue
    const raw = await readFile(path.join(folder, file), "utf8")
    const code = blankLiterals(raw, {
      characters: platform === "kotlin",
      template: platform,
    })
    const { declared, members } =
      platform === "swift" ? swiftDeclarations(code) : kotlinDeclarations(code)
    const imports = [
      ...raw.matchAll(/^import\s+com\.esuiss\.ui\.([\w.]+?)(?:\.(\w+|\*))?$/gm),
    ]
    sources.push({
      file,
      code: code.replace(/^(?:package|import)\s.*$/gm, ""),
      package: raw.match(/^package\s+([\w.]+)/m)?.[1] ?? "",
      imports: imports.map((match) => ({
        package: `com.esuiss.ui.${match[1]}`,
        name: match[2],
      })),
      declared,
      members,
    })
  }
  return sources
}

function visibleFrom(source, other) {
  if (!source.package) return () => true
  return (name) =>
    other.package === source.package ||
    source.imports.some(
      (entry) =>
        entry.package === other.package &&
        (entry.name === "*" || entry.name === name)
    )
}

function referencedFiles(source, sources) {
  const identifiers = new Set(source.code.match(IDENTIFIER))
  const members = new Set()
  const implicit = new Set()
  for (const match of source.code.matchAll(/(.)\.\s*([A-Za-z_]\w*)/gs)) {
    members.add(match[2])
    if (!/[\w)\]?!>]/.test(match[1])) implicit.add(match[2])
  }
  const usesMember = ({ type, name, isStatic }) => {
    if (!isStatic) return members.has(name)
    if (new RegExp(`\\b${type}\\s*\\.\\s*${name}\\b`).test(source.code)) {
      return true
    }
    if (type.endsWith("Style")) {
      const modifier = type.charAt(0).toLowerCase() + type.slice(1)
      return new RegExp(`\\.${modifier}\\(\\s*\\.${name}\\b`).test(source.code)
    }
    return implicit.has(name)
  }
  const files = new Set()
  for (const other of sources) {
    if (other === source) continue
    const visible = visibleFrom(source, other)
    const uses =
      [...other.declared].some(
        (name) => identifiers.has(name) && visible(name)
      ) || other.members.some(usesMember)
    if (uses) files.add(other.file)
  }
  return files
}

export async function buildNativeGraph(root, platform) {
  const config = PLATFORMS[platform]
  const sources = await readSources(root, platform)
  const isBase = (file) => config.base.includes(file.split("/")[0])
  const edges = new Map(
    sources.map((source) => [source.file, referencedFiles(source, sources)])
  )

  const closure = (starts) => {
    const seen = new Set()
    const visit = (file) => {
      if (seen.has(file)) return
      seen.add(file)
      for (const next of edges.get(file) ?? []) visit(next)
    }
    starts.forEach(visit)
    return seen
  }

  const base = [...closure(sources.map((s) => s.file).filter(isBase))].sort()
  const baseSet = new Set(base)
  const filesFor = (file) => [
    file,
    ...[...closure([file])]
      .filter((entry) => entry !== file && !baseSet.has(entry))
      .sort(),
  ]

  return { files: sources.map((s) => s.file), base, filesFor }
}

export function nativeFileOf(platform, item, files) {
  const config = PLATFORMS[platform]
  const explicit = config.files[item.name]
  if (explicit) return files.includes(explicit) ? explicit : null
  const folder = config.folders[item.type]
  if (!folder) return null
  const key = item.name.replaceAll("-", "")
  return (
    files.find(
      (file) =>
        path.posix.dirname(file) === folder &&
        path.posix.basename(file, config.extension).toLowerCase() === key
    ) ?? null
  )
}

export async function nativeRequirements(root, platform) {
  const manifest = await readFile(
    path.join(root, PLATFORMS[platform].manifest),
    "utf8"
  )
  if (platform === "swift") {
    return {
      ios: Number(manifest.match(/\.iOS\(\.v(\d+)\)/)?.[1]),
      packages: [
        ...manifest.matchAll(
          /\.package\(url:\s*"([^"]+)",\s*from:\s*"([^"]+)"\)/g
        ),
      ].map((match) => ({
        url: match[1],
        from: match[2],
        products: [
          ...manifest.matchAll(
            new RegExp(
              `\\.product\\(name:\\s*"([^"]+)",\\s*package:\\s*"${path.posix.basename(match[1])}"\\)`,
              "g"
            )
          ),
        ]
          .map((product) => product[1])
          .filter((name, index, all) => all.indexOf(name) === index),
      })),
    }
  }
  const main = manifest.slice(0, manifest.search(/^\s*androidTest/m))
  return {
    minSdk: Number(manifest.match(/minSdk\s*=\s*(\d+)/)?.[1]),
    bom: main.match(/platform\("([^"]+)"\)/)?.[1],
    dependencies: [...main.matchAll(/implementation\("([^"]+)"\)/g)].map(
      (match) => match[1]
    ),
  }
}
