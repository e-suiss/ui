import { CliError } from "../output.mjs"
import { version } from "./package.mjs"

const TRAILING_SLASH = /\/$/
const REF = "{ref}"
const TIMEOUT = 30_000

const DEFAULT_BRANCH = "main"

function registryRoots(base, override) {
  const roots = override
    ? [override]
    : [base.replace(REF, `v${version}`), base.replace(REF, DEFAULT_BRANCH)]
  return roots.map((root) => root.replace(TRAILING_SLASH, ""))
}

async function request(url, file) {
  try {
    return await fetch(url, { signal: AbortSignal.timeout(TIMEOUT) })
  } catch (error) {
    if (error?.name === "TimeoutError") {
      throw new CliError(`Timed out downloading ${file} from the registry.`)
    }
    throw new CliError(`Could not reach the registry to download ${file}.`)
  }
}

export function createRegistry({ base, env, index = "registry.json" }) {
  const roots = registryRoots(base, process.env[env])
  let first = 0

  async function fetchText(file) {
    for (let current = first; ; current++) {
      const response = await request(`${roots[current]}/${file}`, file)
      if (response.status === 404 && current < roots.length - 1) {
        first = Math.max(first, current + 1)
        continue
      }
      if (!response.ok) {
        throw new CliError(
          `Could not download ${file} (HTTP ${response.status}).`
        )
      }
      return response.text()
    }
  }

  async function fetchJson(file) {
    const text = await fetchText(file)
    try {
      return JSON.parse(text)
    } catch {
      throw new CliError(`The registry file ${file} is not valid JSON.`)
    }
  }

  function fetchRegistry() {
    return fetchJson(index)
  }

  return { fetchText, fetchJson, fetchRegistry }
}

export function resolveItems(registry, names) {
  const byName = new Map(registry.items.map((item) => [item.name, item]))

  const ordered = []
  const seen = new Set()
  const visit = (name, parent) => {
    if (seen.has(name)) return
    seen.add(name)
    const item = byName.get(name)
    if (!item) {
      throw new CliError(
        parent
          ? `${parent} needs ${name}, which is not in the registry.`
          : `Unknown item: ${name}.`
      )
    }
    for (const required of item.requires ?? []) visit(required, name)
    ordered.push(item)
  }
  for (const name of names) visit(name)
  return ordered
}
