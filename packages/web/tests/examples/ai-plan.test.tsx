import { expect, test } from "vitest"
import PlanDemo from "@/examples/plan-demo"
import PlanDescription from "@/examples/plan-description"
import { renderExample } from "@/tests/render-example"

const MIGRATE = /Plan: migrate to Base UI/
const DONE = /2 of 4 done/
const COOKIE = /Store the theme in a cookie/
const DARK_MODE = /Plan: add dark mode/

test("Default", async () => {
  const { canvas, canvasElement } = await renderExample(<PlanDemo />)

  const trigger = canvas.getByRole("button", { name: MIGRATE })
  await expect(trigger).toHaveAttribute("aria-expanded", "true")
  await expect(trigger).toHaveAccessibleName(DONE)
  const statuses = [
    ...canvasElement.querySelectorAll(
      '[data-slot="trace-collapsible-content"] [data-slot="trace-line"]'
    ),
  ].map((line) => line.getAttribute("data-status"))
  await expect(statuses).toEqual([null, null, "running", "pending"])
})
test("Description", async () => {
  const { canvas } = await renderExample(<PlanDescription />)

  await expect(canvas.getByRole("button", { name: DARK_MODE })).toHaveAttribute(
    "aria-expanded",
    "true"
  )
  await expect(canvas.getByText(COOKIE)).toBeVisible()
})
