import { CliError, note } from "../output.mjs"
import { isRegistryPath } from "./files.mjs"
import { version } from "./package.mjs"

const TRAILING_SLASH = /\/$/
const REF = "{ref}"
const TIMEOUT = 30_000
const LOCAL_HOSTS = ["localhost", "127.0.0.1", "[::1]"]
const REDIRECTS = [301, 302, 303, 307, 308]
const MAX_REDIRECTS = 5

const DEFAULT_BRANCH = "main"
const TAG = `v${version}`
const REFS = [TAG, DEFAULT_BRANCH]

let chosenRef = null
let pending = null

function isSecure(url) {
  return (
    url.protocol === "https:" ||
    (url.protocol === "http:" && LOCAL_HOSTS.includes(url.hostname))
  )
}

function checkOverride(override, env) {
  let url
  try {
    url = new URL(override)
  } catch {
    throw new CliError(`${env} must be a URL.`)
  }
  if (!isSecure(url)) {
    throw new CliError(
      `${env} must use https (http works only for localhost and 127.0.0.1).`
    )
  }
  return override.replace(TRAILING_SLASH, "")
}

async function fetchOnce(url, file, signal) {
  try {
    return await fetch(url, { signal, redirect: "manual" })
  } catch (error) {
    if (error?.name === "TimeoutError") {
      throw new CliError(`Timed out downloading ${file} from the registry.`)
    }
    throw new CliError(`Could not reach the registry to download ${file}.`)
  }
}

async function request(url, file) {
  const signal = AbortSignal.timeout(TIMEOUT)
  let current = url
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const response = await fetchOnce(current, file, signal)
    const location = response.headers?.get?.("location")
    if (!REDIRECTS.includes(response.status) || !location) return response
    let next
    try {
      next = new URL(location, current)
    } catch {
      throw new CliError(`The registry sent an invalid redirect for ${file}.`)
    }
    if (!isSecure(next)) {
      throw new CliError(
        `Refusing to follow the registry to ${next.origin} for ${file}: it must use https.`
      )
    }
    current = next.href
  }
  throw new CliError(`The registry redirected ${file} too many times.`)
}

function announce(ref) {
  note(
    ref === TAG
      ? `Using the ${TAG} registry.`
      : `Using the registry from ${DEFAULT_BRANCH}, because ${TAG} is not published yet.`
  )
}

async function chooseRef(rootFor, file) {
  for (const ref of REFS) {
    const response = await request(`${rootFor(ref)}/${file}`, file)
    if (response.status === 404 && ref !== REFS.at(-1)) continue
    if (response.ok && !chosenRef) {
      chosenRef = ref
      announce(ref)
    }
    return response
  }
}

export function createRegistry({ base, env, index = "registry.json" }) {
  const rootFor = (ref) => base.replace(REF, ref).replace(TRAILING_SLASH, "")
  let override

  async function respond(file) {
    if (override === undefined) {
      override = process.env[env] ? checkOverride(process.env[env], env) : null
      if (override) note(`Using the registry at ${override}.`)
    }
    if (override) return request(`${override}/${file}`, file)
    if (chosenRef) return request(`${rootFor(chosenRef)}/${file}`, file)
    if (pending) {
      await pending.catch(() => undefined)
      return respond(file)
    }
    pending = chooseRef(rootFor, file)
    try {
      return await pending
    } finally {
      pending = null
    }
  }

  async function fetchText(file) {
    if (!isRegistryPath(file)) {
      throw new CliError(`Refusing to download ${file} from the registry.`)
    }
    const response = await respond(file)
    if (!response.ok) {
      throw new CliError(
        `Could not download ${file} (HTTP ${response.status}).`
      )
    }
    return response.text()
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
