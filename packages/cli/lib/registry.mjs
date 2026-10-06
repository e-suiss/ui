import { CliError } from "./output.mjs"

const DEFAULT_BASE = "https://raw.githubusercontent.com/e-suiss/ui/main"
const base = (process.env.ESUISS_REGISTRY ?? DEFAULT_BASE).replace(/\/$/, "")

export async function fetchText(file) {
  let response
  try {
    response = await fetch(`${base}/${file}`)
  } catch {
    throw new CliError(`Could not reach the registry to download ${file}.`)
  }
  if (!response.ok) {
    throw new CliError(`Could not download ${file} (HTTP ${response.status}).`)
  }
  return response.text()
}

export async function fetchRegistry() {
  return JSON.parse(await fetchText("registry.json"))
}

export const SCOPES = {
  ui: { kind: "component", command: "add", example: "button" },
  pattern: { kind: "pattern", command: "add patterns", example: "<name>" },
  interaction: {
    kind: "interaction",
    command: "add interactions",
    example: "<name>",
  },
  chart: { kind: "chart", command: "add charts", example: "<name>" },
}

export function scopeOf(item) {
  return item.type in SCOPES ? item.type : "ui"
}

export function resolveItems(registry, names) {
  const byName = new Map(registry.items.map((item) => [item.name, item]))

  const ordered = []
  const seen = new Set()
  const visit = (name) => {
    if (seen.has(name)) return
    seen.add(name)
    const item = byName.get(name)
    for (const required of item.requires) visit(required)
    ordered.push(item)
  }
  names.forEach(visit)
  return ordered
}

export async function fetchStylesheet(registry) {
  return fetchText(registry.stylesheet)
}
