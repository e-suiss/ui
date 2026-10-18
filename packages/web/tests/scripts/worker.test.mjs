import { readFileSync } from "node:fs"
import { describe, expect, it, vi } from "vitest"

import worker from "../../../../worker.js"

const ORIGIN = "https://suiss.app"
const FRAME_POLICY = /^Content-Security-Policy: frame-ancestors 'self'/
const TRANSPORT_POLICY = /^Strict-Transport-Security: max-age=\d+/
const PERMISSIONS_POLICY = /^Permissions-Policy: /

function assets(files) {
  return {
    fetch: vi.fn((request) => {
      const { pathname } = new URL(request.url)
      const body = files[pathname]
      if (body === undefined) {
        return Promise.resolve(
          new Response("<html>404</html>", {
            status: 404,
            headers: { "Content-Type": "text/html" },
          })
        )
      }
      return Promise.resolve(
        new Response(request.method === "HEAD" ? null : JSON.stringify(body), {
          status: 200,
          headers: { "Content-Type": "application/json", ETag: '"abc"' },
        })
      )
    }),
  }
}

function get(path, init) {
  return new Request(`${ORIGIN}${path}`, init)
}

const files = {
  "/ui/r/radix/button.json": { name: "button" },
  "/ui/r/rn-uniwind/theme-vega.json": {
    name: "theme-vega",
    title: "suiss/ui Theme (Vega)",
  },
  "/ui/r/rn-uniwind/theme-suiss.json": { name: "theme-suiss" },
  "/ui/r/base/button.json": { name: "button" },
  "/ui/r/rn-uniwind/button.json": { name: "button" },
}

describe("registry worker", () => {
  it("caches and shares valid items", async () => {
    const response = await worker.fetch(get("/ui/r/radix/button.json"), {
      ASSETS: assets(files),
    })
    expect(response.status).toBe(200)
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*")
    expect(response.headers.get("Cache-Control")).toBe(
      "public, max-age=3600, s-maxage=86400"
    )
    expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff")
    expect(await response.json()).toEqual({ name: "button" })
  })

  it("answers unknown items with an uncached JSON 404", async () => {
    const response = await worker.fetch(get("/ui/r/radix/missing.json"), {
      ASSETS: assets(files),
    })
    expect(response.status).toBe(404)
    expect(response.headers.get("Cache-Control")).toBe("no-store")
    expect(response.headers.get("Access-Control-Allow-Origin")).toBeNull()
    expect(response.headers.get("Content-Type")).toContain("application/json")
    expect(await response.json()).toEqual({ error: "Not found" })
  })

  it("answers preflight requests", async () => {
    const env = { ASSETS: assets(files) }
    const response = await worker.fetch(
      get("/ui/r/radix/button.json", { method: "OPTIONS" }),
      env
    )
    expect(response.status).toBe(204)
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*")
    expect(response.headers.get("Access-Control-Allow-Methods")).toContain(
      "GET"
    )
    expect(env.ASSETS.fetch).not.toHaveBeenCalled()
  })

  it("names a styled native theme after the requested item", async () => {
    const response = await worker.fetch(
      get("/ui/r/rn-uniwind-vega/theme-suiss.json"),
      { ASSETS: assets(files) }
    )
    expect(await response.json()).toEqual({
      name: "theme-suiss",
      title: "suiss/ui Theme (Vega)",
    })
    expect(response.headers.get("ETag")).toBeNull()
  })

  it("answers HEAD for a styled native theme", async () => {
    const response = await worker.fetch(
      get("/ui/r/rn-uniwind-vega/theme-suiss.json", { method: "HEAD" }),
      { ASSETS: assets(files) }
    )
    expect(response.status).toBe(200)
  })
})

describe("registry worker paths", () => {
  it.each([
    "/ui/r/",
    "/ui/r/radix-vega/",
    "/ui/r/radix-vega",
    "/ui/r/radix-vega/button.json/anything",
    "/ui/r/radix-vega/button.json/",
    "/ui/r/radix-vega//button.json",
    "/ui/r/rn-uniwind-vega/%2e%2e%2fbase%2fbutton.json",
    "/ui/r/rn-uniwind%2f..%2fbase/button.json",
    "/ui/r/radix/.hidden.json",
    "/ui/r/radix/button.txt",
  ])("answers %s with a 404 without reading other folders", async (path) => {
    const env = { ASSETS: assets(files) }
    const response = await worker.fetch(get(path), env)
    expect(response.status).toBe(404)
    expect(response.headers.get("Cache-Control")).toBe("no-store")
    expect(env.ASSETS.fetch).not.toHaveBeenCalled()
  })

  it("never passes an asset redirect on", async () => {
    const env = {
      ASSETS: {
        fetch: vi.fn(
          async () =>
            new Response(null, {
              status: 307,
              headers: { Location: "/ui/r/radix" },
            })
        ),
      },
    }
    const response = await worker.fetch(get("/ui/r/radix/x.json"), env)
    expect(response.status).toBe(404)
    expect(response.headers.get("Location")).toBeNull()
  })

  it("keeps the style placeholder and short item paths working", async () => {
    for (const path of ["/ui/r/%7Bstyle%7D/button.json", "/ui/r/button.json"]) {
      const response = await worker.fetch(get(path), { ASSETS: assets(files) })
      expect(response.status).toBe(200)
      expect(await response.json()).toEqual({ name: "button" })
    }
  })

  it("forwards only the method and the URL to the asset store", async () => {
    const env = { ASSETS: assets(files) }
    await worker.fetch(
      get("/ui/r/radix-vega/button.json", {
        headers: {
          Range: "bytes=0-10",
          "If-None-Match": '"abc"',
          Cookie: "a=b",
        },
      }),
      env
    )
    const [forwarded] = env.ASSETS.fetch.mock.calls[0]
    expect(forwarded.url).toBe(`${ORIGIN}/ui/r/radix/button.json`)
    expect(forwarded.method).toBe("GET")
    expect([...forwarded.headers.keys()]).toEqual([])
  })

  it("answers HEAD without a body or the stored length", async () => {
    const env = { ASSETS: assets(files) }
    const response = await worker.fetch(
      get("/ui/r/radix/button.json", { method: "HEAD" }),
      env
    )
    expect(response.status).toBe(200)
    expect(response.headers.get("Content-Length")).toBeNull()
    expect(await response.text()).toBe("")
    expect(env.ASSETS.fetch.mock.calls[0][0].method).toBe("GET")
  })
})

describe("site headers", () => {
  const rules = readFileSync(
    new URL("../../../../apps/www/public/_headers", import.meta.url),
    "utf8"
  )
  const global = rules.split("\n\n")[0].split("\n")

  it("applies the security headers to every page", () => {
    expect(global[0]).toBe("/*")
    expect(global.slice(1).map((line) => line.trim())).toEqual(
      expect.arrayContaining([
        "X-Content-Type-Options: nosniff",
        "Referrer-Policy: strict-origin-when-cross-origin",
        "X-Frame-Options: SAMEORIGIN",
        expect.stringMatching(FRAME_POLICY),
        expect.stringMatching(TRANSPORT_POLICY),
        expect.stringMatching(PERMISSIONS_POLICY),
      ])
    )
  })

  it("leaves scripts out of the policy so inline scripts keep running", () => {
    expect(rules).not.toContain("script-src")
    expect(rules).not.toContain("default-src")
  })
})
