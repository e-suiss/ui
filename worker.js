const PREFIX = "/ui/r/"
const RADIX_STYLE = /^(radix-.+|new-york|default)$/
const ARIA_STYLE = /^aria-.+$/
const OWN_STYLE = /^(base|radix|aria|rn-.+)$/
const RN_STYLE =
  /^(rn-(?:uniwind|nativewind|stylesheet))-(suiss|vega|nova|maia|lyra|mira|luma|sera|rhea)$/
const RN_THEME = "theme-suiss.json"

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Cache-Control": "public, max-age=3600, s-maxage=86400",
  "X-Robots-Tag": "noindex",
}

function registryPath(rest) {
  const [style, file] = rest.split("/")
  if (file === undefined) return `base/${style}`
  const native = style.match(RN_STYLE)
  if (native) {
    const [, styling, name] = native
    return `${styling}/${file === RN_THEME ? `theme-${name}.json` : file}`
  }
  if (RADIX_STYLE.test(style)) return `radix/${file}`
  if (ARIA_STYLE.test(style)) return `aria/${file}`
  if (OWN_STYLE.test(style)) return rest
  return `base/${file}`
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    url.pathname = `${PREFIX}${registryPath(url.pathname.slice(PREFIX.length))}`
    const response = await env.ASSETS.fetch(new Request(url, request))
    const registry = new Response(response.body, response)
    for (const [key, value] of Object.entries(headers)) {
      registry.headers.set(key, value)
    }
    return registry
  },
}
