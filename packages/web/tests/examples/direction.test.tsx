import { expect, test } from "vitest"
import DirectionDemo from "@/examples/direction-demo"
import DirectionRightToLeft from "@/examples/direction-right-to-left"
import { renderExample } from "@/tests/render-example"

test("Default", async () => {
  const { canvas } = await renderExample(<DirectionDemo />)

  const description = canvas.getByText("Current direction is LTR.")
  await expect(description.closest("[dir]")).toHaveAttribute("dir", "ltr")
})
test("Right To Left", async () => {
  const { canvas } = await renderExample(<DirectionRightToLeft />)

  const description = canvas.getByText("Current direction is RTL.")
  await expect(description.closest("[dir]")).toHaveAttribute("dir", "rtl")
  const cancel = canvas.getByRole("button", { name: "Cancel" })
  const next = canvas.getByRole("button", { name: "Continue" })
  await expect(cancel.getBoundingClientRect().left).toBeGreaterThan(
    next.getBoundingClientRect().left
  )
})
