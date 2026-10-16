const PREFIX = "/ui/r/"
const RADIX_STYLE = /^(radix-.+|new-york|default)$/
const ARIA_STYLE = /^aria-.+$/
const OWN_STYLE = /^(base|radix|aria|rn-.+)$/

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Cache-Control": "public, max-age=3600, s-maxage=86400",
  "X-Robots-Tag": "noindex",
}

function registryPath(rest) {
  const [style, file] = rest.split("/")
  if (file === undefined) return `base/${style}`
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
