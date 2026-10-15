import { afterEach, describe, expect, it, vi } from "vitest"

import { CliError } from "../lib/output.mjs"
import {
  fetchRegistry,
  fetchStylesheet,
  fetchText,
  resolveItems,
  scopeOf,
  toCss,
} from "../lib/registry.mjs"
import { serveRegistry } from "./helpers.mjs"

const RADIX_INDEX = /\/registry\/radix\/registry\.json$/
const ARIA_INDEX = /\/registry\/aria\/registry\.json$/

const item = (name, requires = []) => ({ name, requires })

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("scopeOf", () => {
  it("returns the scope of a fetched item", () => {
    expect(scopeOf({ scope: "chart" })).toBe("chart")
    expect(scopeOf({ scope: "block" })).toBe("block")
  })

  it("falls back to ui for items without a scope", () => {
    expect(scopeOf({})).toBe("ui")
  })
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
        homepage: "https://ui.suiss.app",
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
      },
    ])
  })
})

describe("fetchRegistry for the second base", () => {
  it("reads its own index and installs twins into the usual folders", async () => {
    const fetch = serveRegistry({
      "registry/radix/registry.json": {
        name: "esuiss",
        homepage: "https://ui.suiss.app",
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
    expect(fetch).toHaveBeenCalledWith(expect.stringMatching(RADIX_INDEX))
  })
})

describe("fetchRegistry for the third base", () => {
  it("reads its own index and installs twins into the usual folders", async () => {
    const fetch = serveRegistry({
      "registry/aria/registry.json": {
        name: "esuiss",
        homepage: "https://ui.suiss.app",
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
    expect(fetch).toHaveBeenCalledWith(expect.stringMatching(ARIA_INDEX))
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
