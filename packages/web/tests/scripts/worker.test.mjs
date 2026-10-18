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
