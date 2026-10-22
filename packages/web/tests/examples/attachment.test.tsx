import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import AttachmentClickable from "@/examples/attachment-clickable"
import AttachmentDemo from "@/examples/attachment-demo"
import AttachmentDropZone from "@/examples/attachment-drop-zone"
import AttachmentStates from "@/examples/attachment-states"
import { renderExample } from "@/tests/render-example"

test("Default", async () => {
  const { canvas } = await renderExample(<AttachmentDemo />)

  await expect(canvas.getByText("Quarterly report.pdf")).toBeVisible()
  const remove = canvas.getByRole("button", { name: "Remove" })
  await userEvent.tab()
  await expect(remove).toHaveFocus()
})
test("States", async () => {
  const { canvas } = await renderExample(<AttachmentStates />)

  const progress = canvas.getByRole("progressbar", { name: "Uploading" })
  await expect(progress).toHaveAttribute("aria-valuenow", "64")
  await expect(
    canvas.getByRole("button", { name: "Cancel upload" })
  ).toBeEnabled()
  await expect(
    canvas.getByRole("button", { name: "Choose File" })
  ).toBeVisible()
})
test("Drop Zone", async () => {
  const { canvas, canvasElement } = await renderExample(<AttachmentDropZone />)

  const zone = canvasElement.querySelector<HTMLElement>(
    "[data-slot=attachment]"
  )
  await expect(zone).toHaveStyle({ borderStyle: "dashed" })
  await expect(
    canvas.getByRole("button", { name: "Choose a file to upload" })
  ).toBeEnabled()
})
test("Clickable", async () => {
  const { canvas, step } = await renderExample(<AttachmentClickable />)

  await step(
    "exposes the card and its action as separate buttons",
    async () => {
      await userEvent.tab()
      await expect(
        canvas.getByRole("button", { name: "Open Brand guidelines.pdf" })
      ).toHaveFocus()
      await userEvent.tab()
      await expect(
        canvas.getByRole("button", { name: "Download" })
      ).toHaveFocus()
    }
  )
})
