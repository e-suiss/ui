import { readdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { parseArgs } from "node:util"
import { scopeOf as mobileScope } from "../../../packages/cli/lib/mobile/add.mjs"
import { SCOPES } from "../../../packages/cli/lib/registry.mjs"

const ROOT = path.resolve(import.meta.dirname, "..")
const DOCS = path.join(ROOT, "content/docs")
const PACKAGES = path.resolve(ROOT, "../../packages")
const WEB_INDEXES = [
  "web/registry/registry.json",
  "web/registry/radix/registry.json",
  "web/registry/aria/registry.json",
]
const MOBILE_INDEX = "mobile/registry.json"
const NATIVE = new Set(["swift", "kotlin"])
const CLI_ADD = /^(\s*npx (?:--prefer-online )?@esuiss\/ui(?:@\w+)? add)( .*)?$/
const FENCE = /^\s*```/
const ONLY_OPEN = /<Only platform="([^"]+)">/
const ONLY_CLOSE = /<\/Only>/
const PLATFORMS_FIELD = /^platforms:\s*\[([^\]]*)\]/m
const LIST_SEPARATOR = /\s*,\s*/
const WHITESPACE = /\s+/
const PLACEHOLDER = /^<.*>$|^\[.*\]$|^\.\.\.$/
const VALUE_FLAGS = new Set([
  "--platform",
  "-p",
  "--base",
  "--style",
  "--icon-library",
  "--styling",
  "--path",
  "--cwd",
])

const GROUPS = Object.fromEntries(
  Object.entries(SCOPES).map(([scope, { command }]) => [
    scope,
    command.split(" ").slice(1).join(" "),
  ])
)
const SCOPE_OF_GROUP = Object.fromEntries(
  Object.entries(GROUPS)
    .filter(([, group]) => group)
    .map(([scope, group]) => [group, scope])
)

function webScope(item) {
  const file = item.files?.[0]?.path ?? ""
  const entry = Object.entries(SCOPES).find(
    ([, { directory }]) => directory && file.startsWith(directory)
  )
  return entry ? entry[0] : "ui"
}

async function registries() {
  const web = new Map()
  for (const index of WEB_INDEXES) {
    const { items } = JSON.parse(
      await readFile(path.join(PACKAGES, index), "utf8")
    )
    for (const item of items) if (!web.has(item.name)) web.set(item.name, item)
  }
  const { items } = JSON.parse(
    await readFile(path.join(PACKAGES, MOBILE_INDEX), "utf8")
  )
  return { web, mobile: new Map(items.map((item) => [item.name, item])) }
}

function parse(rest) {
  const args = rest.trim().split(WHITESPACE).filter(Boolean)
  const group = SCOPE_OF_GROUP[args[0]] ? args.shift() : ""
  const names = []
  let platform = null
  for (let index = 0; index < args.length; index++) {
    const arg = args[index]
    if (arg === "--platform" || arg === "-p") platform = args[index + 1]
    if (VALUE_FLAGS.has(arg)) {
      index++
      continue
    }
    if (arg.startsWith("-") || PLACEHOLDER.test(arg)) continue
    names.push(arg)
  }
  return { args, group, names, platform }
}

function scopeFor(name, platform, { web, mobile }) {
  if (platform === "web") {
    const item = web.get(name)
    return item
      ? { scope: webScope(item) }
      : { error: "is not in the web registry" }
  }
  const item = mobile.get(name)
  if (!item) return { error: "is not in the mobile registry" }
  if (NATIVE.has(platform) && !item[platform])
    return { error: `has no ${platform} source` }
  return { scope: mobileScope(item) }
}

function check(line, context, index, problems) {
  const match = line.match(CLI_ADD)
  if (!match) return line
  const { args, group, names, platform } = parse(match[2] ?? "")
  const platforms = platform
    ? [platform]
    : context.filter((item) => item === "web" || item === "rn")
  if (!platforms.length) {
    problems.push(`${line.trim()}: no platform for ${context.join(" ")}`)
    return line
  }
  const scopes = new Set()
  for (const name of names)
    for (const target of platforms) {
      const result = scopeFor(name, target, index)
      if (result.error) problems.push(`${line.trim()}: ${name} ${result.error}`)
      else scopes.add(result.scope)
    }
  if (scopes.size > 1) {
    problems.push(`${line.trim()}: mixes ${[...scopes].join(" and ")} items`)
    return line
  }
  const [scope] = scopes
  if (!scope || GROUPS[scope] === group) return line
  const rest = [GROUPS[scope], ...args].filter(Boolean).join(" ")
  return `${match[1]} ${rest}`
}

async function files(dir) {
  const entries = await readdir(dir, { recursive: true })
  return entries
    .filter((entry) => entry.endsWith(".mdx"))
    .map((entry) => path.join(dir, entry))
}

function rewrite(source, index, problems) {
  const page = (source.match(PLATFORMS_FIELD)?.[1] ?? "web").split(
    LIST_SEPARATOR
  )
  const stack = [page]
  let fenced = false
  return source
    .split("\n")
    .map((line) => {
      if (FENCE.test(line)) {
        fenced = !fenced
        return line
      }
      if (!fenced) {
        const open = line.match(ONLY_OPEN)
        if (open) {
          const own = open[1].split(" ")
          stack.push(stack.at(-1).filter((item) => own.includes(item)))
        }
        if (ONLY_CLOSE.test(line)) stack.pop()
        return line
      }
      return check(line, stack.at(-1), index, problems)
    })
    .join("\n")
}

const { values } = parseArgs({ options: { check: { type: "boolean" } } })
const index = await registries()
const problems = []
const stale = []
for (const file of await files(DOCS)) {
  const current = await readFile(file, "utf8")
  const found = []
  const next = rewrite(current, index, found)
  const name = path.relative(DOCS, file)
  problems.push(...found.map((problem) => `${name}: ${problem}`))
  if (next === current) continue
  if (values.check) stale.push(name)
  else await writeFile(file, next)
}
if (stale.length)
  problems.push(
    `CLI commands use the wrong group in ${stale.length} pages. Run pnpm --filter @esuiss/site docs-commands.\n${stale.join("\n")}`
  )
if (problems.length) {
  console.error(problems.join("\n"))
  process.exit(1)
}
