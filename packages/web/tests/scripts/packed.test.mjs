import { describe, expect, it } from "vitest"

import { registryPath, resolveStyle } from "../../../../worker.js"
import { isPacked, packStyles, unpackStyle } from "../../scripts/lib/packed.mjs"

const decoder = new TextDecoder()
const encoder = new TextEncoder()

describe("packed styles", () => {
  const packed = packStyles([
    ["suiss", '{"name":"button","style":"suiss"}\n'],
    ["vega", '{"name":"button","style":"vega"}\n'],
    ["nova", '{"name":"button","style":"suiss"}\n'],
  ])

  it("returns the chunk for each style", () => {
    expect(isPacked(packed)).toBe(true)
    expect(decoder.decode(unpackStyle(packed, "vega", "suiss"))).toBe(
      '{"name":"button","style":"vega"}\n'
    )
    expect(decoder.decode(unpackStyle(packed, "suiss", "suiss"))).toBe(
      '{"name":"button","style":"suiss"}\n'
    )
  })

  it("stores identical styles once", () => {
    const header = decoder.decode(packed).split("\n")[1]
    expect(JSON.parse(header).ranges).toHaveLength(2)
    expect(decoder.decode(unpackStyle(packed, "nova", "suiss"))).toBe(
      '{"name":"button","style":"suiss"}\n'
    )
  })

  it("falls back for unknown styles", () => {
    expect(decoder.decode(unpackStyle(packed, "mira", "suiss"))).toBe(
      '{"name":"button","style":"suiss"}\n'
    )
  })

  it("leaves plain JSON alone", () => {
    expect(isPacked(encoder.encode('{"name":"button"}'))).toBe(false)
  })
})

describe("registry paths", () => {
  it.each([
    ["base-nova/button.json", "base/button.json", "nova"],
    ["radix-vega/button.json", "radix/button.json", "vega"],
    ["aria-suiss/button.json", "aria/button.json", "suiss"],
    ["new-york/button.json", "radix/button.json", "suiss"],
    ["default/button.json", "radix/button.json", "suiss"],
    ["new-york-v4/button.json", "radix/button.json", "suiss"],
    ["radix/button.json", "radix/button.json", "suiss"],
    ["base-unknown/button.json", "base/button.json", "suiss"],
    ["nova/button.json", "base/button.json", "nova"],
    ["whatever/button.json", "base/button.json", "suiss"],
    ["button.json", "base/button.json", "suiss"],
  ])("maps %s", (rest, path, style) => {
    expect(registryPath(rest)).toEqual({ path, style })
  })

  it("passes native registries through", () => {
    expect(registryPath("rn-uniwind/button.json")).toEqual({
      path: "rn-uniwind/button.json",
    })
  })

  it.each([
    ["rn-nativewind-suiss/theme-suiss.json", "rn-nativewind/theme-suiss.json"],
    ["rn-stylesheet-rhea/button.json", "rn-stylesheet/button.json"],
  ])("maps the native style path %s", (rest, path) => {
    expect(registryPath(rest)).toEqual({ path })
  })

  it("keeps the requested name for a styled native theme", () => {
    expect(registryPath("rn-uniwind-vega/theme-suiss.json")).toEqual({
      path: "rn-uniwind/theme-vega.json",
      name: "theme-suiss",
    })
  })

  it("resolves base and style names", () => {
    expect(resolveStyle("aria-rhea")).toEqual({ base: "aria", style: "rhea" })
  })
})
