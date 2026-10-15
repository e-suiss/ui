import { expect, test } from "vitest"
import SeparatorDemo from "@/examples/separator-demo"
import SeparatorVertical from "@/examples/separator-vertical"
import { byBase } from "@/tests/base"
import { renderExample } from "@/tests/render-example"

const HORIZONTAL = byBase<string | null>({
  base: "horizontal",
  radix: "horizontal",
  aria: null,
})

test("Default", async () => {
  const { canvas, step } = await renderExample(<SeparatorDemo />)

  await step("exposes each separator with its orientation", async () => {
    const separators = canvas.getAllByRole("separator")
    await expect(separators).toHaveLength(3)
    await expect(separators[0]?.getAttribute("aria-orientation")).toBe(
      HORIZONTAL
    )
    await expect(separators[1]).toHaveAttribute("aria-orientation", "vertical")
  })
})
test("Vertical", async () => {
  const { canvas, step } = await renderExample(<SeparatorVertical />)

  await step("marks both separators as vertical", async () => {
    for (const separator of canvas.getAllByRole("separator")) {
      await expect(separator).toHaveAttribute("aria-orientation", "vertical")
    }
  })
})
