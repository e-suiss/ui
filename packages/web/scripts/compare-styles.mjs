import { execFileSync } from "node:child_process"
import { existsSync, statSync } from "node:fs"
import { mkdir, readdir, readFile, rm } from "node:fs/promises"
import path from "node:path"
import { twMerge } from "cn"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import ts from "typescript"
import { createServer } from "vite"

import {
  applyStyle,
  DEFAULT_STYLE,
  loadStyleMaps,
  markersIn,
} from "./lib/styles.mjs"

const ROOT = path.resolve(import.meta.dirname, "..")
const REFERENCE = path.join(ROOT, ".compare")
const EXTENSIONS = ["", ".tsx", ".ts"]
const BASES = ["base", "radix", "aria"]
const CLASS_ATTRIBUTE = /\sclass="([^"]*)"/g
const STYLED = /[\\/](components|bases[\\/][^\\/]+[\\/]components)[\\/]/

const SOURCE_FILE = /\.tsx?$/
const WHITESPACE = /\s+/

const HARMLESS = new Set(["group/button"])

const args = process.argv.slice(2)
const ref = args.find((arg) => !arg.startsWith("--")) ?? "main"
const only = args
  .find((arg) => arg.startsWith("--only="))
  ?.slice("--only=".length)
  .split(",")

const maps = await loadStyleMaps()
const map = maps[DEFAULT_STYLE]

function isFile(file) {
  return statSync(file, { throwIfNoEntry: false })?.isFile() ?? false
}

async function extractReference() {
  await rm(REFERENCE, { recursive: true, force: true })
  await mkdir(REFERENCE, { recursive: true })
  const archive = execFileSync(
    "git",
    ["archive", "--format=tar", `${ref}:packages/web`],
    { cwd: path.join(ROOT, "../.."), maxBuffer: 1 << 30 }
  )
  execFileSync("tar", ["-x", "-C", REFERENCE], {
    input: archive,
  })
}

function resolver(base) {
  return {
    name: "compare-resolve",
    enforce: "pre",
    resolveId(source, importer) {
      if (!source.startsWith("@/") || !importer) return null
      const side = importer.startsWith(REFERENCE) ? REFERENCE : ROOT
      const relative = source.slice(2)
      const candidates =
        base === "base"
          ? [relative]
          : [path.join("bases", base, relative), relative]
      for (const candidate of candidates) {
        for (const extension of EXTENSIONS) {
          const file = path.join(side, candidate + extension)
          if (isFile(file)) return file
        }
      }
      return null
    },
  }
}

const styler = {
  name: "compare-style",
  transform(code, id) {
    if (id.startsWith(REFERENCE) || !STYLED.test(id)) return null
    if (!SOURCE_FILE.test(id) || markersIn(code, id).length === 0) return null
    const { output, unknown } = applyStyle(code, map, id)
    if (unknown.length) {
      throw new Error(`${id}: unknown markers ${unknown.join(", ")}`)
    }
    return output
  },
}

function classLists(html) {
  return [...html.matchAll(CLASS_ATTRIBUTE)].map(([, value]) =>
    [...new Set(value.split(WHITESPACE).filter(Boolean))]
      .filter((token) => !HARMLESS.has(token))
      .sort()
      .join(" ")
  )
}

async function render(server, file) {
  try {
    const module = await server.ssrLoadModule(file)
    if (typeof module.default !== "function") return { skipped: "no default" }
    return { html: renderToStaticMarkup(createElement(module.default)) }
  } catch (error) {
    return { skipped: String(error?.message ?? error).split("\n")[0] }
  }
}

function exampleFile(side, base, name) {
  const twin = path.join(side, "bases", base, "examples", name)
  if (base !== "base" && existsSync(twin)) return twin
  return path.join(side, "examples", name)
}

function firstDifference(before, after) {
  const length = Math.max(before.length, after.length)
  for (let index = 0; index < length; index++) {
    if (before[index] !== after[index]) {
      const old = new Set((before[index] ?? "").split(" "))
      const next = new Set((after[index] ?? "").split(" "))
      return {
        element: index,
        removed: [...old].filter((token) => token && !next.has(token)),
        added: [...next].filter((token) => token && !old.has(token)),
      }
    }
  }
  return undefined
}

function stringsOf(node) {
  const strings = []
  const visit = (child) => {
    if (
      ts.isStringLiteral(child) ||
      ts.isNoSubstitutionTemplateLiteral(child)
    ) {
      strings.push(child.text)
    }
    ts.forEachChild(child, visit)
  }
  visit(node)
  return strings
}

function split(value) {
  const tokens = value.split(WHITESPACE).filter(Boolean)
  return {
    markers: tokens.filter((token) => token.startsWith("cn-")),
    plain: tokens.filter((token) => !token.startsWith("cn-")),
  }
}

function conflicts(plain, markers) {
  if (plain.length === 0 || markers.length === 0) return []
  const rules = markers.map((marker) => map[marker] ?? "").join(" ")
  const merged = new Set(twMerge(`${rules} ${plain.join(" ")}`).split(" "))
  const kept = new Set(twMerge(`${plain.join(" ")} ${rules}`).split(" "))
  return plain.filter((token) => merged.has(token) && !kept.has(token))
}

async function lintFile(file) {
  const source = await readFile(file, "utf8")
  if (markersIn(source, file).length === 0) return []
  const tree = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  )
  const problems = []
  const visit = (node) => {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === "cva"
    ) {
      const [first, ...rest] = node.arguments
      const base = first ? stringsOf(first) : []
      const variants = rest.flatMap((argument) => stringsOf(argument))
      const plain = base.flatMap((value) => split(value).plain)
      const markers = [...base, ...variants].flatMap(
        (value) => split(value).markers
      )
      const clash = conflicts(plain, markers)
      if (clash.length) problems.push(`cva: ${clash.join(" ")}`)
      return
    }
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      const { plain, markers } = split(node.text)
      const clash = conflicts(plain, markers)
      if (clash.length) problems.push(`"${node.text.slice(0, 40)}…": ${clash}`)
    }
    ts.forEachChild(node, visit)
  }
  visit(tree)
  return problems.map((problem) => `${path.relative(ROOT, file)}: ${problem}`)
}

async function sourceFiles(dir) {
  if (!existsSync(dir)) return []
  const entries = await readdir(dir, { recursive: true, withFileTypes: true })
  return entries
    .filter((entry) => entry.isFile() && SOURCE_FILE.test(entry.name))
    .map((entry) => path.join(entry.parentPath, entry.name))
}

const lint = (
  await Promise.all(
    [
      path.join(ROOT, "components/ui"),
      ...BASES.slice(1).map((base) =>
        path.join(ROOT, "bases", base, "components/ui")
      ),
    ].map(async (dir) =>
      (await Promise.all((await sourceFiles(dir)).map(lintFile))).flat()
    )
  )
).flat()

await extractReference()

const names = (await readdir(path.join(ROOT, "examples")))
  .filter((name) => name.endsWith(".tsx"))
  .filter((name) => !only || only.some((prefix) => name.startsWith(prefix)))
  .sort()

const differences = []
const skipped = []
let compared = 0

for (const base of BASES) {
  const server = await createServer({
    root: ROOT,
    configFile: false,
    logLevel: "silent",
    appType: "custom",
    server: { middlewareMode: true, hmr: false, ws: false },
    plugins: [resolver(base), styler],
  })
  for (const name of names) {
    const before = await render(server, exampleFile(REFERENCE, base, name))
    const after = await render(server, exampleFile(ROOT, base, name))
    if (before.skipped || after.skipped) {
      if (before.skipped !== after.skipped) {
        differences.push({
          base,
          name,
          detail: `render: ${before.skipped ?? "ok"} -> ${after.skipped ?? "ok"}`,
        })
      } else skipped.push(`${base}/${name}`)
      continue
    }
    compared++
    const difference = firstDifference(
      classLists(before.html),
      classLists(after.html)
    )
    if (difference) {
      differences.push({ base, name, detail: JSON.stringify(difference) })
    }
  }
  await server.close()
}

await rm(REFERENCE, { recursive: true, force: true })

for (const problem of lint) console.log(`conflict ${problem}`)
for (const { base, name, detail } of differences) {
  console.log(`diff ${base}/${name} ${detail}`)
}
console.log(
  `${compared} renders compared, ${skipped.length} skipped on both sides, ${differences.length} differ, ${lint.length} conflicts`
)
if (differences.length || lint.length) process.exit(1)
