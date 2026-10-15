import { expect, test } from "vitest"
import SpinnerDemo from "@/examples/spinner-demo"
import SpinnerInButton from "@/examples/spinner-in-button"
import { renderExample } from "@/tests/render-example"

test("Default", async () => {
  const { canvas, step } = await renderExample(<SpinnerDemo />)

  await step("announces itself as a loading status", async () => {
    await expect(canvas.getByRole("status", { name: "Loading" })).toBeVisible()
  })
})
test("In Button", async () => {
  const { canvas, step } = await renderExample(<SpinnerInButton />)

  await step("keeps the busy buttons disabled with a status", async () => {
    for (const button of canvas.getAllByRole("button")) {
      await expect(button).toBeDisabled()
    }
    await expect(canvas.getAllByRole("status")).toHaveLength(2)
  })
})
