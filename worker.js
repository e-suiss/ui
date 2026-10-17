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
const LEGACY_RADIX = new Set(["new-york", "default"])
const NATIVE = /^rn-.+$/
const NATIVE_STYLED =
  /^(rn-(?:uniwind|nativewind|stylesheet))-(suiss|vega|nova|maia|lyra|mira|luma|sera|rhea)$/
const NATIVE_THEME = "theme-suiss.json"

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Cache-Control": "public, max-age=3600, s-maxage=86400",
  "X-Robots-Tag": "noindex",
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
    return {
      path: `${styling}/${file === NATIVE_THEME ? `theme-${style}.json` : file}`,
    }
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

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const { path, style } = registryPath(url.pathname.slice(PREFIX.length))
    url.pathname = `${PREFIX}${path}`
    const response = await env.ASSETS.fetch(new Request(url, request))
    const registry = await styled(response, style)
    for (const [key, value] of Object.entries(headers)) {
      registry.headers.set(key, value)
    }
    return registry
  },
}
