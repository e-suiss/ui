import { describe, expect, it } from "vitest"

import {
  DARK_FOREGROUND,
  foregroundFor,
  formatOklch,
  LIGHT_FOREGROUND,
  normalizeColor,
  oklchToRgb,
  parseColor,
  primaryColors,
  rgbToOklch,
  withPrimary,
} from "../lib/color.mjs"

function hexOf(channels) {
  return `#${channels.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`
}

describe("normalizeColor", () => {
  it.each([
    ["#e11d48", "oklch(0.5858 0.222 17.58)"],
    ["#E11D48", "oklch(0.5858 0.222 17.58)"],
    ["#fff", "oklch(1 0 0)"],
    ["rgb(225 29 72)", "oklch(0.5858 0.222 17.58)"],
    ["rgb(225, 29, 72)", "oklch(0.5858 0.222 17.58)"],
    ["rgba(225, 29, 72)", "oklch(0.5858 0.222 17.58)"],
    ["oklch(0.7 0.15 162)", "oklch(0.7 0.15 162)"],
    ["oklch(70% 0.15 162deg)", "oklch(0.7 0.15 162)"],
    ["oklch(0.62346 0.123456 400.1234)", "oklch(0.6235 0.1235 40.12)"],
    ["  #000  ", "oklch(0 0 0)"],
  ])("turns %s into %s", (input, output) => {
    expect(normalizeColor(input)).toBe(output)
  })

  it.each([
    "",
    "blue",
    "#12345",
    "rgb(1 2)",
    "rgb(300 0 0)",
    "rgb(1 2 3 / 50%)",
    "oklch(1.2 0 0)",
    "oklch(0.5 0.1)",
  ])("rejects %j", (input) => {
    expect(() => normalizeColor(input)).toThrow("is not a color")
  })
})

describe("conversions", () => {
  it("round-trips sRGB through oklch within one unit", () => {
    for (let index = 0; index < 500; index++) {
      const channels = [0, 1, 2].map(
        (offset) => (index * 37 + offset * 91) % 256
      )
      const back = oklchToRgb(parseColor(formatOklch(rgbToOklch(channels))))
      back.forEach((channel, position) => {
        expect(Math.abs(channel - channels[position])).toBeLessThanOrEqual(1)
      })
    }
  })

  it("keeps hex values through normalization", () => {
    for (const hex of ["#2563eb", "#e11d48", "#16a34a", "#facc15", "#0f172a"]) {
      const back = hexOf(oklchToRgb(parseColor(normalizeColor(hex))))
      const delta = [1, 3, 5].map((start) =>
        Math.abs(
          Number.parseInt(back.slice(start, start + 2), 16) -
            Number.parseInt(hex.slice(start, start + 2), 16)
        )
      )
      expect(Math.max(...delta)).toBeLessThanOrEqual(1)
    }
  })
})

describe("foregroundFor", () => {
  it("picks white on dark colors and ink on light ones", () => {
    expect(foregroundFor("#2563eb")).toBe(LIGHT_FOREGROUND)
    expect(foregroundFor("#facc15")).toBe(DARK_FOREGROUND)
    expect(foregroundFor("#ffffff")).toBe(DARK_FOREGROUND)
    expect(foregroundFor("#000000")).toBe(LIGHT_FOREGROUND)
  })
})

describe("primaryColors", () => {
  it("sets the primary tokens in both modes", () => {
    const colors = primaryColors("#facc15")
    for (const mode of ["light", "dark"]) {
      expect(colors[mode]).toEqual({
        primary: "oklch(0.8606 0.1731 91.94)",
        ring: "oklch(0.8606 0.1731 91.94)",
        "sidebar-primary": "oklch(0.8606 0.1731 91.94)",
        "sidebar-ring": "oklch(0.8606 0.1731 91.94)",
        "chart-1": "oklch(0.8606 0.1731 91.94)",
        "primary-foreground": DARK_FOREGROUND,
        "sidebar-primary-foreground": DARK_FOREGROUND,
      })
    }
  })

  it("keeps the rest of a palette", () => {
    const palette = withPrimary(
      { light: { background: "a", primary: "b" }, dark: { background: "c" } },
      "#000"
    )
    expect(palette.light.background).toBe("a")
    expect(palette.dark.background).toBe("c")
    expect(palette.light.primary).toBe("oklch(0 0 0)")
    expect(withPrimary(null, undefined)).toBeNull()
  })
})
