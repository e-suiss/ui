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
const NATIVE = /^(?:rn-.+|swift|kotlin)$/
const NATIVE_STYLED =
  /^(rn-(?:uniwind|nativewind|stylesheet)|swift|kotlin)-(suiss|vega|nova|maia|lyra|mira|luma|sera|rhea)$/
const NATIVE_THEME_NAME = "theme-suiss"
const NATIVE_THEME = `${NATIVE_THEME_NAME}.json`
const FAILED = 400
const NOT_FOUND = 404
const SEGMENT = /^[a-z0-9][a-z0-9._-]*$/i
const ITEM = /^[a-z0-9][a-z0-9._-]*\.json$/i
const STYLE_PLACEHOLDER = /^%7Bstyle%7D$/i
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
  const segments = rest.split("/")
  if (segments.length > 2 || !ITEM.test(segments.at(-1))) return null
  const [first, file] = segments
  if (file === undefined) return { path: `base/${first}`, style: DEFAULT_STYLE }
  if (STYLE_PLACEHOLDER.test(first)) {
    return { path: `base/${file}`, style: DEFAULT_STYLE }
  }
  if (!SEGMENT.test(first)) return null
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

function withoutBody(request, response) {
  return request.method === "HEAD" ? new Response(null, response) : response
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

async function renamed(response, name) {
  if (!name || response.status !== 200) return response
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
    const resolved = registryPath(url.pathname.slice(PREFIX.length))
    if (!resolved) return failure(NOT_FOUND)
    const { path, style, name } = resolved
    const response = await env.ASSETS.fetch(
      new Request(new URL(`${PREFIX}${path}`, url.origin), { method: "GET" })
    )
    if (response.status >= FAILED) return failure(response.status)
    if (response.status !== 200) return failure(NOT_FOUND)
    const registry = await renamed(await styled(response, style), name)
    registry.headers.delete("Content-Length")
    for (const [key, value] of Object.entries(cached)) {
      registry.headers.set(key, value)
    }
    return withoutBody(request, registry)
  },
}
