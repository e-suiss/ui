import { isPacked, unpackStyle } from "./packages/web/scripts/lib/packed.mjs"

const PREFIX = "/ui/r/"
const BASES = ["base", "radix", "aria"]
const STYLES = [
  "suiss",
  "vega",
  "nova",
  "maia",
  "lyra",
  "mira",
  "luma",
  "sera",
  "rhea",
]
const DEFAULT_STYLE = "suiss"
const LEGACY_RADIX = new Set(["new-york", "new-york-v4", "default"])
const NATIVE = /^rn-.+$/
const NATIVE_STYLED =
  /^(rn-(?:uniwind|nativewind|stylesheet))-(suiss|vega|nova|maia|lyra|mira|luma|sera|rhea)$/
const NATIVE_THEME_NAME = "theme-suiss"
const NATIVE_THEME = `${NATIVE_THEME_NAME}.json`
const FAILED = 400
const JSON_TYPE = "application/json; charset=utf-8"

const common = {
  "Strict-Transport-Security": "max-age=31536000",
  "X-Content-Type-Options": "nosniff",
  "X-Robots-Tag": "noindex",
}

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Access-Control-Max-Age": "86400",
}

const cached = {
  ...common,
  ...cors,
  "Cache-Control": "public, max-age=3600, s-maxage=86400",
}

export function resolveStyle(name) {
  if (BASES.includes(name)) return { base: name, style: DEFAULT_STYLE }
  if (LEGACY_RADIX.has(name)) return { base: "radix", style: DEFAULT_STYLE }
  if (STYLES.includes(name)) return { base: "base", style: name }
  const dash = name.indexOf("-")
  const base = name.slice(0, dash)
  const style = name.slice(dash + 1)
  if (dash > 0 && BASES.includes(base)) {
    return { base, style: STYLES.includes(style) ? style : DEFAULT_STYLE }
  }
  return { base: "base", style: DEFAULT_STYLE }
}

export function registryPath(rest) {
  const [first, file] = rest.split("/")
  if (file === undefined) return { path: `base/${first}`, style: DEFAULT_STYLE }
  const native = first.match(NATIVE_STYLED)
  if (native) {
    const [, styling, style] = native
    if (file === NATIVE_THEME && style !== DEFAULT_STYLE) {
      return {
        path: `${styling}/theme-${style}.json`,
        name: NATIVE_THEME_NAME,
      }
    }
    return { path: `${styling}/${file}` }
  }
  if (NATIVE.test(first)) return { path: rest }
  const { base, style } = resolveStyle(first)
  return { path: `${base}/${file}`, style }
}

async function styled(response, style) {
  if (!response.ok || !style) return new Response(response.body, response)
  const bytes = new Uint8Array(await response.arrayBuffer())
  if (!isPacked(bytes)) return new Response(bytes, response)
  const result = new Response(
    unpackStyle(bytes, style, DEFAULT_STYLE),
    response
  )
  result.headers.set("Content-Type", "application/json; charset=utf-8")
  result.headers.delete("Content-Length")
  result.headers.delete("ETag")
  return result
}

async function renamed(request, response, name) {
  if (!name || request.method !== "GET" || response.status !== 200) {
    return response
  }
  const item = await response.json()
  const result = new Response(JSON.stringify({ ...item, name }), response)
  result.headers.set("Content-Type", JSON_TYPE)
  result.headers.delete("Content-Length")
  result.headers.delete("ETag")
  return result
}

function failure(status) {
  return new Response(
    JSON.stringify({ error: status === 404 ? "Not found" : "Unavailable" }),
    {
      status,
      headers: {
        ...common,
        "Cache-Control": "no-store",
        "Content-Type": JSON_TYPE,
      },
    }
  )
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: { ...common, ...cors },
      })
    }
    const url = new URL(request.url)
    const { path, style, name } = registryPath(
      url.pathname.slice(PREFIX.length)
    )
    url.pathname = `${PREFIX}${path}`
    const response = await env.ASSETS.fetch(new Request(url, request))
    if (response.status >= FAILED) return failure(response.status)
    const registry = await renamed(request, await styled(response, style), name)
    for (const [key, value] of Object.entries(cached)) {
      registry.headers.set(key, value)
    }
    return registry
  },
}
