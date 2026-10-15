import { CliError } from "../output.mjs"

const TRAILING_SLASH = /\/$/

export function createRegistry({ base, env, index = "registry.json" }) {
  const root = (process.env[env] ?? base).replace(TRAILING_SLASH, "")

  async function fetchText(file) {
    let response
    try {
      response = await fetch(`${root}/${file}`)
    } catch {
      throw new CliError(`Could not reach the registry to download ${file}.`)
    }
    if (!response.ok) {
      throw new CliError(
        `Could not download ${file} (HTTP ${response.status}).`
      )
    }
    return response.text()
  }

  async function fetchRegistry() {
    return JSON.parse(await fetchText(index))
  }

  return { fetchText, fetchRegistry }
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
