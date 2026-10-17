import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import SubagentDemo from "@/examples/subagent-demo"
import SubagentDetails from "@/examples/subagent-details"
import SubagentRunning from "@/examples/subagent-running"
import { renderExample } from "@/tests/render-example"

const RESEARCH_SUBAGENT = /Ran the research subagent/
const RESEARCH_AGENT = /research agent/
const RAN_LS = /Ran ls public\/images/

test("Default", async () => {
  const { canvas, step } = await renderExample(<SubagentDemo />)

  await step("opens the subagent with its report", async () => {
    await expect(
      canvas.getByRole("button", { name: RESEARCH_SUBAGENT })
    ).toHaveAttribute("aria-expanded", "true")
    await expect(
      canvas.getByText(
        "The cache is keyed on the commit SHA, so every deploy misses it and optimizes all 1,240 images again."
      )
    ).toBeVisible()
  })

  await step("expands a step into its output", async () => {
    const command = canvas.getByRole("button", { name: RAN_LS })
    await userEvent.click(command)
    await expect(command).toHaveAttribute("aria-expanded", "true")
    await expect(await canvas.findByText("1240")).toBeVisible()
  })
})
test("Details", async () => {
  const { canvas } = await renderExample(<SubagentDetails />)

  await expect(
    canvas.getByRole("button", { name: RESEARCH_AGENT })
  ).toHaveAttribute("aria-expanded", "true")
  await expect(canvas.getByText("48s")).toBeVisible()
  await expect(canvas.getByText("runCommand")).toBeVisible()
})
test("Running", async () => {
  const { canvas, canvasElement } = await renderExample(<SubagentRunning />)

  await expect(
    canvas.getByRole("button", { name: RESEARCH_AGENT })
  ).toHaveAttribute("aria-expanded", "true")
  await expect(
    canvasElement.querySelectorAll('[data-status="running"]')
  ).toHaveLength(2)
})
