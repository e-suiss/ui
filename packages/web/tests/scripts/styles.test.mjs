import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

import { applyStyleMap, composeStyleMap } from "../../../cli/lib/styles.mjs"
import {
  applyStyle,
  loadStyleData,
  loadStyleMaps,
  markersIn,
  STYLE_NAMES,
} from "../../scripts/lib/styles.mjs"

const root = path.resolve(import.meta.dirname, "../..")
const BASES = ["base", "radix", "aria"]

function sources(base) {
  const dir =
    base === "base"
      ? path.join(root, "components/ui")
      : path.join(root, "bases", base, "components/ui")
  return readdirSync(dir)
    .filter((name) => name.endsWith(".tsx"))
    .map((name) => path.join(dir, name))
}

describe("style markers", () => {
  it.each(BASES)("are all defined for the %s base", async (base) => {
    const maps = await loadStyleMaps(base)
    for (const file of sources(base)) {
      const source = readFileSync(file, "utf8")
      for (const style of STYLE_NAMES) {
        expect(applyStyle(source, maps[style], file).unknown).toEqual([])
      }
    }
  })

  it.each(BASES)(
    "expand the same way in the CLI for the %s base",
    async (base) => {
      const data = JSON.parse(
        readFileSync(path.join(root, "registry/styles.json"), "utf8")
      )
      const maps = await loadStyleMaps(base)
      for (const file of sources(base)) {
        const source = readFileSync(file, "utf8")
        if (markersIn(source, file).length === 0) continue
        for (const style of STYLE_NAMES) {
          expect(
            applyStyleMap(source, composeStyleMap(data, base, style)).output
          ).toBe(applyStyle(source, maps[style], file).output)
        }
      }
    }
  )

  it("publishes the current style data", async () => {
    const data = JSON.parse(
      readFileSync(path.join(root, "registry/styles.json"), "utf8")
    )
    expect(data).toEqual(await loadStyleData())
  })
})
