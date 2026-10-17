import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import ReasoningDemo from "@/examples/reasoning-demo"
import ReasoningDuration from "@/examples/reasoning-duration"
import { renderExample } from "@/tests/render-example"

const THOUGHT_FOR = /Thought for 5s/
const THOUGHT = /Thought/
const DURATION = /12s/
const CACHE_KEY = /cache key includes the commit hash/

test("Default", async () => {
  const { canvas, step } = await renderExample(<ReasoningDemo />)

  const trigger = canvas.getByRole("button", { name: THOUGHT_FOR })

  await step("shows the reasoning open", async () => {
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
    await expect(canvas.getAllByText(CACHE_KEY)[0]).toBeVisible()
  })

  await step("collapses on click", async () => {
    await userEvent.click(trigger)
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
  })
})
test("Duration", async () => {
  const { canvas } = await renderExample(<ReasoningDuration />)

  const trigger = canvas.getByRole("button", { name: THOUGHT })
  await expect(trigger).toHaveAccessibleName(DURATION)
  await expect(trigger).toHaveAttribute("aria-expanded", "false")
  await userEvent.click(trigger)
  await expect(trigger).toHaveAttribute("aria-expanded", "true")
})
