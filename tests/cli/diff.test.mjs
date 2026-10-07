import { describe, expect, it } from "vitest"

import { formatDiff } from "../../packages/cli/lib/diff.mjs"

const lines = (count, prefix = "line") =>
  Array.from({ length: count }, (_, index) => `${prefix} ${index + 1}`)

describe("formatDiff", () => {
  it("returns an empty string when nothing changed", () => {
    expect(formatDiff("a\nb", "a\nb")).toBe("")
  })

  it("marks removed and added lines", () => {
    expect(formatDiff("a\nb\nc", "a\nB\nc")).toBe(
      ["  a", "- b", "+ B", "  c"].join("\n")
    )
  })

  it("keeps three lines of context around a change", () => {
    const before = lines(10)
    const after = [...before]
    after[5] = "changed"
    expect(formatDiff(before.join("\n"), after.join("\n")).split("\n")).toEqual(
      [
        "  line 3",
        "  line 4",
        "  line 5",
        "- line 6",
        "+ changed",
        "  line 7",
        "  line 8",
        "  line 9",
      ]
    )
  })

  it("separates distant changes with an ellipsis", () => {
    const before = lines(20)
    const after = [...before]
    after[0] = "first"
    after[19] = "last"
    const output = formatDiff(before.join("\n"), after.join("\n")).split("\n")
    expect(output.filter((line) => line === "  ...")).toHaveLength(1)
    expect(output[0]).toBe("- line 1")
    expect(output.at(-1)).toBe("+ last")
  })

  it("handles lines added at the end", () => {
    expect(formatDiff("a", "a\nb")).toBe(["  a", "+ b"].join("\n"))
  })
})
