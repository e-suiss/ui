import { screen, waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import ToolApproval from "@/examples/tool-approval"
import ToolDemo from "@/examples/tool-demo"
import ToolSheet from "@/examples/tool-sheet"
import ToolStates from "@/examples/tool-states"
import { renderExample } from "@/tests/render-example"

const FAILED_PNPM = /Failed to run pnpm --version/
const RAN_NODE = /Ran node --version/
const NOT_FOUND = /command not found: pnpm/
const READ_PACKAGE = /Read package\.json/
const ACME = /acme-chat/

test("Default", async () => {
  const { canvas } = await renderExample(<ToolDemo />)

  await expect(
    canvas.getByRole("button", { name: FAILED_PNPM })
  ).toHaveAttribute("aria-expanded", "true")
  await expect(canvas.getByText(NOT_FOUND)).toBeVisible()
  await expect(canvas.getByRole("button", { name: RAN_NODE })).toHaveAttribute(
    "aria-expanded",
    "false"
  )
})
test("States", async () => {
  const { canvasElement } = await renderExample(<ToolStates />)

  const statuses = [
    ...canvasElement.querySelectorAll('[data-slot="trace-line"]'),
  ].map((line) => line.getAttribute("data-status"))
  await expect(statuses).toEqual([null, "error", null, "running"])
})
test("Approval", async () => {
  const { canvas, step } = await renderExample(<ToolApproval />)

  await step("runs the command once approved", async () => {
    await userEvent.click(canvas.getByRole("button", { name: "Approve" }))
    await expect(canvas.getByText("Ran rm -rf dist")).toBeVisible()
    await expect(canvas.getByText("Removed the dist folder.")).toBeVisible()
  })

  await step("resets the prompt", async () => {
    await userEvent.click(canvas.getByRole("button", { name: "Reset" }))
    await expect(canvas.getByRole("button", { name: "Deny" })).toBeVisible()
  })

  await step("leaves the folder when denied", async () => {
    await userEvent.click(canvas.getByRole("button", { name: "Deny" }))
    await expect(canvas.getByText("Denied rm -rf dist")).toBeVisible()
    await expect(canvas.queryByRole("button", { name: "Approve" })).toBeNull()
  })
})
test("Sheet", async () => {
  const { canvas } = await renderExample(<ToolSheet />)

  await userEvent.click(canvas.getByRole("button", { name: READ_PACKAGE }))
  const sheet = await screen.findByRole("dialog", { name: "package.json" })
  await waitFor(() => expect(sheet).toBeVisible())
  await expect(sheet.textContent).toMatch(ACME)
  await userEvent.keyboard("{Escape}")
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
})
