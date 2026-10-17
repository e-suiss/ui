import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import CheckpointDemo from "@/examples/checkpoint-demo"
import { renderExample } from "@/tests/render-example"

test("Default", async () => {
  const { canvas, step } = await renderExample(<CheckpointDemo />)

  await step("restores the conversation to the checkpoint", async () => {
    await expect(canvas.getByText("Update the docs to match.")).toBeVisible()
    await userEvent.click(
      canvas.getByRole("button", { name: "Restore to Button renamed" })
    )
    await expect(canvas.queryByText("Update the docs to match.")).toBeNull()
    await expect(
      canvas.queryByRole("button", { name: "Restore to Button renamed" })
    ).toBeNull()
  })

  await step("resets the transcript", async () => {
    await userEvent.click(canvas.getByRole("button", { name: "Reset" }))
    await expect(canvas.getByText("Update the docs to match.")).toBeVisible()
  })
})
