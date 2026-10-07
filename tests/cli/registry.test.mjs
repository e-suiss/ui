import { afterEach, describe, expect, it, vi } from "vitest"

import { CliError } from "../../packages/cli/lib/output.mjs"
import {
  fetchRegistry,
  fetchStylesheet,
  fetchText,
  resolveItems,
  scopeOf,
} from "../../packages/cli/lib/registry.mjs"
import { serveRegistry } from "./helpers.mjs"

const item = (name, requires = []) => ({ name, requires })

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("scopeOf", () => {
  it("returns the item type when it is a known scope", () => {
    expect(scopeOf({ type: "chart" })).toBe("chart")
    expect(scopeOf({ type: "block" })).toBe("block")
  })

  it("falls back to ui for unknown or missing types", () => {
    expect(scopeOf({ type: "hook" })).toBe("ui")
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

describe("fetchRegistry and fetchStylesheet", () => {
  it("parse the registry and download its stylesheet", async () => {
    serveRegistry({
      "registry.json": { stylesheet: "styles/globals.css", items: [] },
      "styles/globals.css": "@import 'tailwindcss';",
    })
    const registry = await fetchRegistry()
    expect(registry.items).toEqual([])
    await expect(fetchStylesheet(registry)).resolves.toBe(
      "@import 'tailwindcss';"
    )
  })
})
