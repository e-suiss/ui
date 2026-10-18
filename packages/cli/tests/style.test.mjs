import {
  decodePreset as decodeUpstream,
  encodePreset,
  generateRandomPreset,
} from "shadcn/preset"
import { describe, expect, it } from "vitest"

import { presetFile } from "../lib/mobile/registry.mjs"
import {
  DEFAULT_STYLE,
  decodePreset,
  presetProblem,
  resolveStyle,
  STYLES,
} from "../lib/shared/style.mjs"

describe("decodePreset", () => {
  it("reads every field the way the upstream decoder does", () => {
    for (let index = 0; index < 500; index++) {
      const code = generateRandomPreset()
      expect(decodePreset(code)).toEqual(decodeUpstream(code))
    }
  })

  it("reads version a codes and rejects invalid ones", () => {
    for (const code of ["a0", "a1b2", "b0", "x123", "b!", "", "b"]) {
      expect(decodePreset(code)).toEqual(decodeUpstream(code))
    }
  })
})

describe("resolveStyle", () => {
  it("defaults to the suiss style", () => {
    expect(resolveStyle({})).toBe(DEFAULT_STYLE)
  })

  it("accepts every style by name", () => {
    for (const style of STYLES) expect(resolveStyle({ style })).toBe(style)
  })

  it("takes the style from a preset code", () => {
    const code = encodePreset({ style: "lyra" })
    expect(resolveStyle({ preset: code })).toBe("lyra")
    expect(resolveStyle({ preset: code, style: "lyra" })).toBe("lyra")
  })

  it("rejects unknown styles, broken codes and conflicts", () => {
    expect(() => resolveStyle({ style: "new-york" })).toThrow(
      "Unknown style new-york"
    )
    expect(() => resolveStyle({ preset: "zzz" })).toThrow(
      "zzz is not a valid preset code."
    )
    expect(() =>
      resolveStyle({ preset: encodePreset({ style: "vega" }), style: "nova" })
    ).toThrow("The preset uses the vega style, but --style is nova.")
  })
})

describe("presetFile", () => {
  const registry = {
    presets: { vega: { uniwind: "styles/presets/vega/uniwind.css" } },
  }

  it("uses the default files for the suiss style", () => {
    expect(presetFile(registry, "uniwind", DEFAULT_STYLE)).toBeNull()
    expect(presetFile({}, "uniwind")).toBeNull()
  })

  it("points to the style's file", () => {
    expect(presetFile(registry, "uniwind", "vega")).toBe(
      "styles/presets/vega/uniwind.css"
    )
  })

  it("explains when the registry has no such style", () => {
    expect(() => presetFile({}, "swift", "luma")).toThrow(
      "This version of the registry has no luma style."
    )
  })
})

describe("presetProblem", () => {
  it("accepts the base color itself or a colored theme", () => {
    expect(presetProblem({ baseColor: "stone", theme: "stone" })).toBeNull()
    expect(presetProblem({ baseColor: "stone", theme: "blue" })).toBeNull()
  })

  it("rejects a gray theme that differs from the base color", () => {
    expect(presetProblem({ baseColor: "stone", theme: "zinc" })).toContain(
      "The zinc theme needs the zinc base color"
    )
  })

  it("ignores the chart color, which no platform reads", () => {
    expect(
      presetProblem({
        baseColor: "stone",
        theme: "blue",
        chartColor: "neutral",
      })
    ).toBeNull()
    expect(
      presetProblem({ baseColor: "stone", theme: "stone", chartColor: "zinc" })
    ).toBeNull()
  })

  it("accepts every preset code the create page made before chartColor", () => {
    for (const code of ["bK9Yuv", "buqttVb", "bJMUSIjR", "b1QXkO"]) {
      expect(presetProblem(decodePreset(code))).toBeNull()
    }
  })

  it("rejects the gray base color and theme with a clear message", () => {
    expect(presetProblem(decodePreset("bw5OFzsG"))).toContain(
      "The gray base color is not available in suiss/ui."
    )
    expect(presetProblem({ baseColor: "neutral", theme: "gray" })).toContain(
      "The gray theme is not available"
    )
  })
})

describe("resolveStyle with --only", () => {
  it("keeps the project style instead of the preset style", () => {
    const preset = encodePreset({ style: "vega" })
    expect(resolveStyle({ preset, only: "theme" })).toBeUndefined()
    expect(resolveStyle({ preset, only: "font" })).toBeUndefined()
  })

  it("uses --style when it is given", () => {
    const preset = encodePreset({ style: "vega" })
    expect(resolveStyle({ preset, only: "theme", style: "suiss" })).toBe(
      "suiss"
    )
    expect(resolveStyle({ preset, only: "theme", style: "vega" })).toBe("vega")
  })

  it("still takes the preset style without --only", () => {
    expect(resolveStyle({ preset: encodePreset({ style: "vega" }) })).toBe(
      "vega"
    )
  })
})

describe("resolveStyle with suiss", () => {
  it("keeps the suiss style with a preset", () => {
    expect(
      resolveStyle({ preset: encodePreset({ style: "vega" }), style: "suiss" })
    ).toBe("suiss")
  })
})
