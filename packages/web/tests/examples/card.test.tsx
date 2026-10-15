import { expect, test } from "vitest"
import CardDemo from "@/examples/card-demo"
import CardWithAction from "@/examples/card-with-action"
import { renderExample } from "@/tests/render-example"

test("Default", async () => {
  const { canvas } = await renderExample(<CardDemo />)

  await expect(canvas.getByText("Team plan")).toBeVisible()
  await expect(
    canvas.getByText("Everything your team needs to ship faster.")
  ).toBeVisible()
  await expect(canvas.getAllByRole("button")).toHaveLength(2)
})
test("With Action", async () => {
  const { canvas } = await renderExample(<CardWithAction />)

  await expect(
    canvas.getByRole("button", { name: "More options" })
  ).toBeVisible()
})
