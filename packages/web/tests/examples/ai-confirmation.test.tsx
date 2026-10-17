import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import ConfirmationDemo from "@/examples/confirmation-demo"
import { renderExample } from "@/tests/render-example"

test("Default", async () => {
  const { canvas, step } = await renderExample(<ConfirmationDemo />)

  await step("asks before running the command", async () => {
    await expect(canvas.getByText("Run rm -rf dist?")).toBeVisible()
  })

  await step("runs the command once approved", async () => {
    await userEvent.click(canvas.getByRole("button", { name: "Approve" }))
    await expect(canvas.getByText("Ran rm -rf dist")).toBeVisible()
    await expect(canvas.getByText("Removed the dist folder.")).toBeVisible()
    await expect(canvas.queryByRole("button", { name: "Approve" })).toBeNull()
  })

  await step("records a denial", async () => {
    await userEvent.click(canvas.getByRole("button", { name: "Reset" }))
    await userEvent.click(canvas.getByRole("button", { name: "Deny" }))
    await expect(canvas.getByText("Denied rm -rf dist")).toBeVisible()
    await expect(
      canvas.getByText("Okay, I left the dist folder in place.")
    ).toBeVisible()
  })
})
