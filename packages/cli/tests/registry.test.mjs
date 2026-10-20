import { readFileSync } from "node:fs"
import { afterEach, describe, expect, it, vi } from "vitest"

import { CliError } from "../lib/output.mjs"
import {
  fetchRegistry,
  fetchStylesheet,
  fetchText,
  fetchThemes,
  resolveItems,
  toCss,
} from "../lib/registry.mjs"
import { serveRegistry } from "./helpers.mjs"

const RADIX_INDEX = /\/registry\/radix\/registry\.json$/
const ARIA_INDEX = /\/registry\/aria\/registry\.json$/

const item = (name, requires = []) => ({ name, requires })

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

describe("resolveItems", () => {
  const registry = {
    items: [
      item("button"),
      item("dialog", ["button"]),
      item("drawer", ["button", "dialog"]),
      item("sheet", ["dialog"]),
    ],
  }

  it("puts dependencies before the items that require them", () => {
    const names = resolveItems(registry, ["drawer"]).map((entry) => entry.name)
    expect(names).toEqual(["button", "dialog", "drawer"])
  })

  it("lists every item once even when several share a dependency", () => {
    const names = resolveItems(registry, ["sheet", "drawer", "button"]).map(
      (entry) => entry.name
    )
    expect(names).toEqual(["button", "dialog", "sheet", "drawer"])
  })
})

describe("fetchText", () => {
  it("returns the file body", async () => {
    serveRegistry({ "components/ui/button.tsx": "export {}" })
    await expect(fetchText("components/ui/button.tsx")).resolves.toBe(
      "export {}"
    )
  })

  it("reports the HTTP status when the file is missing", async () => {
    serveRegistry({})
    await expect(fetchText("missing.tsx")).rejects.toThrow(
      new CliError("Could not download missing.tsx (HTTP 404).")
    )
  })

  it("retries once when the connection drops", async () => {
    const fetch = vi
      .fn()
      .mockRejectedValueOnce(new TypeError("fetch failed"))
      .mockResolvedValueOnce(new Response("export {}"))
    vi.stubGlobal("fetch", fetch)
    await expect(fetchText("components/ui/button.tsx")).resolves.toBe(
      "export {}"
    )
    expect(fetch).toHaveBeenCalledTimes(2)
  })

  it("reports an unreachable registry", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new TypeError("fetch failed")))
    )
    await expect(fetchText("registry.json")).rejects.toThrow(
      new CliError("Could not reach the registry to download registry.json.")
    )
  })
})

describe("fetchRegistry", () => {
  it("reads the items of the standard registry", async () => {
    serveRegistry({
      "registry/registry.json": {
        name: "esuiss",
        homepage: "https://suiss.app/ui",
        items: [
          {
            name: "area-chart-default",
            type: "registry:block",
            dependencies: ["recharts"],
            registryDependencies: ["@esuiss/chart", "utils"],
            files: [
              {
                path: "components/charts/area-chart-default.tsx",
                type: "registry:component",
                target: "@components/charts/area-chart-default.tsx",
              },
            ],
          },
          {
            name: "use-mobile",
            type: "registry:hook",
            files: [{ path: "hooks/use-mobile.ts", type: "registry:hook" }],
          },
          { name: "theme-suiss", type: "registry:theme", cssVars: {} },
        ],
      },
    })
    expect((await fetchRegistry()).items).toEqual([
      {
        name: "area-chart-default",
        scope: "chart",
        requires: ["chart", "utils"],
        dependencies: ["recharts"],
        files: ["components/charts/area-chart-default.tsx"],
      },
      {
        name: "use-mobile",
        scope: "ui",
        requires: [],
        dependencies: [],
        files: ["hooks/use-mobile.ts"],
        listed: false,
      },
    ])
  })
})

describe("fetchRegistry for the second base", () => {
  it("reads its own index and installs twins into the usual folders", async () => {
    const fetch = serveRegistry({
      "registry/radix/registry.json": {
        name: "esuiss",
        homepage: "https://suiss.app/ui",
        items: [
          {
            name: "dialog",
            type: "registry:ui",
            dependencies: ["radix-ui"],
            files: [
              {
                path: "bases/radix/components/ui/dialog.tsx",
                type: "registry:ui",
              },
            ],
          },
        ],
      },
    })
    expect((await fetchRegistry("radix")).items).toEqual([
      {
        name: "dialog",
        scope: "ui",
        requires: [],
        dependencies: ["radix-ui"],
        files: ["components/ui/dialog.tsx"],
        sources: ["bases/radix/components/ui/dialog.tsx"],
      },
    ])
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(RADIX_INDEX),
      expect.anything()
    )
  })
})

describe("fetchRegistry for the third base", () => {
  it("reads its own index and installs twins into the usual folders", async () => {
    const fetch = serveRegistry({
      "registry/aria/registry.json": {
        name: "esuiss",
        homepage: "https://suiss.app/ui",
        items: [
          {
            name: "dialog",
            type: "registry:ui",
            dependencies: ["react-aria-components"],
            files: [
              {
                path: "bases/aria/components/ui/dialog.tsx",
                type: "registry:ui",
              },
            ],
          },
        ],
      },
    })
    expect((await fetchRegistry("aria")).items).toEqual([
      {
        name: "dialog",
        scope: "ui",
        requires: [],
        dependencies: ["react-aria-components"],
        files: ["components/ui/dialog.tsx"],
        sources: ["bases/aria/components/ui/dialog.tsx"],
      },
    ])
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(ARIA_INDEX),
      expect.anything()
    )
  })
})

describe("fetchStylesheet", () => {
  it("downloads the stylesheet", async () => {
    serveRegistry({ "styles/globals.css": "@import 'tailwindcss';" })
    await expect(fetchStylesheet()).resolves.toBe("@import 'tailwindcss';")
  })
})

describe("toCss", () => {
  it("writes rules, at-rules and statements", () => {
    expect(
      toCss({
        '@import "tw-animate-css"': {},
        "@keyframes spin": { to: { rotate: "1turn" } },
      })
    ).toEqual([
      '@import "tw-animate-css";',
      "@keyframes spin {\n  to {\n    rotate: 1turn;\n  }\n}",
    ])
  })
})

describe("registry version", () => {
  const { version } = JSON.parse(
    readFileSync(new URL("../package.json", import.meta.url), "utf8")
  )

  function freshRegistry() {
    vi.resetModules()
    return import("../lib/registry.mjs")
  }

  it("downloads from the tag of the CLI version", async () => {
    const fetch = serveRegistry({ "components/ui/button.tsx": "export {}" })
    const { fetchText: fetchFromTag } = await freshRegistry()
    await expect(fetchFromTag("components/ui/button.tsx")).resolves.toBe(
      "export {}"
    )
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch.mock.calls[0][0]).toBe(
      `https://raw.githubusercontent.com/e-suiss/ui/v${version}/packages/web/components/ui/button.tsx`
    )
  })

  it("falls back to main when the tag has no such file", async () => {
    const fetch = vi.fn((url) =>
      Promise.resolve(
        url.includes(`/v${version}/`)
          ? new Response("missing", { status: 404 })
          : new Response(`from ${url}`, { status: 200 })
      )
    )
    vi.stubGlobal("fetch", fetch)
    const { fetchText: fetchFromTag } = await freshRegistry()
    await expect(fetchFromTag("a.tsx")).resolves.toBe(
      "from https://raw.githubusercontent.com/e-suiss/ui/main/packages/web/a.tsx"
    )
    await fetchFromTag("b.tsx")
    expect(fetch.mock.calls.map(([url]) => url)).toEqual([
      `https://raw.githubusercontent.com/e-suiss/ui/v${version}/packages/web/a.tsx`,
      "https://raw.githubusercontent.com/e-suiss/ui/main/packages/web/a.tsx",
      "https://raw.githubusercontent.com/e-suiss/ui/main/packages/web/b.tsx",
    ])
  })

  it("uses only the registry set in ESUISS_REGISTRY", async () => {
    vi.stubEnv("ESUISS_REGISTRY", "http://localhost:4000/web/")
    const fetch = serveRegistry({})
    const { fetchText: fetchFromOverride } = await freshRegistry()
    await expect(fetchFromOverride("a.tsx")).rejects.toThrow(
      "Could not download a.tsx (HTTP 404)."
    )
    expect(fetch.mock.calls.map(([url]) => url)).toEqual([
      "http://localhost:4000/web/a.tsx",
    ])
  })
})

describe("registry errors", () => {
  it("reports a download that times out", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.reject(
          new DOMException("The operation timed out.", "TimeoutError")
        )
      )
    )
    await expect(fetchText("registry.json")).rejects.toThrow(
      new CliError("Timed out downloading registry.json from the registry.")
    )
  })

  it("reports an index that is not JSON", async () => {
    serveRegistry({ "registry/registry.json": "<html>" })
    await expect(fetchRegistry()).rejects.toThrow(
      new CliError(
        "The registry file registry/registry.json is not valid JSON."
      )
    )
  })

  it("names a required item that is missing", () => {
    expect(() =>
      resolveItems({ items: [item("menu", ["popup"])] }, ["menu"])
    ).toThrow(new CliError("menu needs popup, which is not in the registry."))
  })
})

describe("malformed registry entries", () => {
  it.each([
    [{ name: "x", files: ["components/ui/x.tsx"] }],
    [{ name: "x", files: [{ type: "registry:ui" }] }],
    [{ name: "x", files: "components/ui/x.tsx" }],
    [
      {
        name: "x",
        files: [{ path: "components/ui/x.tsx" }],
        dependencies: "a",
      },
    ],
  ])("names the bad item %j instead of crashing", async (entry) => {
    serveRegistry({
      "registry/registry.json": {
        items: [
          entry,
          { name: "button", files: [{ path: "components/ui/button.tsx" }] },
        ],
      },
    })
    await expect(fetchRegistry()).rejects.toThrow(
      new CliError(
        "The registry entry for x is malformed. Update @esuiss/ui or check ESUISS_REGISTRY."
      )
    )
  })
})

describe("registry themes", () => {
  it.each([
    'red; } @import url("https://evil.example/x.css"); :root { --x: y',
    "oklch(0.5 0.2 $1)",
    "url(https://evil.example/a.png)",
    "oklch(0.5 0.2 1) /* x",
    "\\72 ed",
  ])("refuses the value %s", async (value) => {
    serveRegistry({
      "registry/themes.json": [
        { name: "blue", light: { primary: value }, dark: {} },
      ],
    })
    await expect(fetchThemes()).rejects.toThrow(
      "Refusing registry/themes.json: --primary is not a plain color or size."
    )
  })

  it("keeps colors with alpha, hex and sizes", async () => {
    const themes = [
      {
        name: "blue",
        light: {
          border: "oklch(1 0 0 / 10%)",
          ring: "#2563eb",
          radius: "0.625rem",
        },
        dark: { primary: "oklch(0.488 0.243 264.376)" },
      },
    ]
    serveRegistry({ "registry/themes.json": themes })
    await expect(fetchThemes()).resolves.toEqual(themes)
  })
})

describe("registry redirects", () => {
  function redirectTo(location, body = "export {}") {
    const fetch = vi.fn(async (url) =>
      url === location
        ? new Response(body, { status: 200 })
        : new Response(null, { status: 302, headers: { location } })
    )
    vi.stubGlobal("fetch", fetch)
    return fetch
  }

  it.each([
    ["https://registry.example/web", "http://evil.example/web/a.tsx"],
    ["http://127.0.0.1:4712/web", "http://localhost.:4711/web/a.tsx"],
    ["https://registry.example/web", "ftp://registry.example/web/a.tsx"],
  ])("refuses a redirect from %s to %s", async (override, location) => {
    vi.stubEnv("ESUISS_REGISTRY", override)
    const fetch = redirectTo(location)
    await expect(fetchText("a.tsx")).rejects.toThrow("it must use https")
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch.mock.calls[0][1]).toMatchObject({ redirect: "manual" })
  })

  it("follows a redirect that stays on https", async () => {
    vi.stubEnv("ESUISS_REGISTRY", "https://registry.example/web")
    redirectTo("https://cdn.registry.example/web/a.tsx")
    await expect(fetchText("a.tsx")).resolves.toBe("export {}")
  })

  it("stops after too many redirects", async () => {
    vi.stubEnv("ESUISS_REGISTRY", "https://registry.example/web")
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(null, {
            status: 307,
            headers: { location: "https://registry.example/web/loop" },
          })
      )
    )
    await expect(fetchText("a.tsx")).rejects.toThrow(
      "The registry redirected a.tsx too many times."
    )
  })
})
