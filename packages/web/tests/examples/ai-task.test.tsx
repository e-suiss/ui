import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import TaskDemo from "@/examples/task-demo"
import { renderExample } from "@/tests/render-example"

const FOUND = /Found the project files/
const UPDATED = /Updated the page metadata/

test("Default", async () => {
  const { canvas, step } = await renderExample(<TaskDemo />)

  await step("opens the last task", async () => {
    await expect(canvas.getByRole("button", { name: UPDATED })).toHaveAttribute(
      "aria-expanded",
      "true"
    )
    await expect(canvas.getByText("Edited app/page.tsx")).toBeVisible()
  })

  await step("expands an earlier task", async () => {
    const found = canvas.getByRole("button", { name: FOUND })
    await expect(found).toHaveAttribute("aria-expanded", "false")
    await userEvent.click(found)
    await expect(found).toHaveAttribute("aria-expanded", "true")
    await expect(
      await canvas.findByText("Searched for generateMetadata")
    ).toBeVisible()
  })
})
