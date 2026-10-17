import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import QueueDemo from "@/examples/queue-demo"
import QueueDescriptions from "@/examples/queue-descriptions"
import { renderExample } from "@/tests/render-example"

const TO_DO = /to do/
const COMPLETED = /completed/
const FOCUS_RING = /Fix the focus ring/

test("Default", async () => {
  const { canvas, canvasElement, step } = await renderExample(<QueueDemo />)

  await step("splits the todos into open and done", async () => {
    await expect(canvas.getByRole("button", { name: TO_DO })).toHaveAttribute(
      "aria-expanded",
      "true"
    )
    await expect(
      canvas.getByRole("button", { name: COMPLETED })
    ).toHaveAttribute("aria-expanded", "true")
    await expect(canvas.getByText("2 to do")).toBeVisible()
    await expect(canvas.getByText("2 completed")).toBeVisible()
  })

  await step("marks the current todo as running", async () => {
    await expect(
      canvas
        .getByText("Add a toggle to the settings page")
        .closest('[data-slot="trace-line"]')
    ).toHaveAttribute("data-status", "running")
    await expect(
      canvasElement.querySelectorAll('[data-status="running"]')
    ).toHaveLength(1)
  })
})
test("Descriptions", async () => {
  const { canvas, step } = await renderExample(<QueueDescriptions />)

  await step("keeps the completed list closed", async () => {
    await expect(
      canvas.getByRole("button", { name: COMPLETED })
    ).toHaveAttribute("aria-expanded", "false")
  })

  await step("expands a todo into its description", async () => {
    const todo = canvas.getByRole("button", { name: FOCUS_RING })
    await expect(todo).toHaveAttribute("aria-expanded", "false")
    await userEvent.click(todo)
    await expect(todo).toHaveAttribute("aria-expanded", "true")
    await expect(
      await canvas.findByText("It is clipped by overflow-hidden on the field.")
    ).toBeVisible()
  })
})
