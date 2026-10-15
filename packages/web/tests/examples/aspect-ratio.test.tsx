import { expect, test } from "vitest"
import AspectRatioDemo from "@/examples/aspect-ratio-demo"
import AspectRatioSquare from "@/examples/aspect-ratio-square"
import { renderExample } from "@/tests/render-example"

test("Default", async () => {
  const { canvas } = await renderExample(<AspectRatioDemo />)

  const image = canvas.getByRole("img", { name: "Mountain lake at sunrise" })
  const frame = image.parentElement as HTMLElement
  const { width, height } = frame.getBoundingClientRect()
  await expect(width / height).toBeCloseTo(16 / 9, 1)
})
test("Square", async () => {
  const { canvas } = await renderExample(<AspectRatioSquare />)

  const image = canvas.getByRole("img", { name: "Mountain lake at sunrise" })
  const frame = image.parentElement as HTMLElement
  const { width, height } = frame.getBoundingClientRect()
  await expect(width / height).toBeCloseTo(1, 1)
})
