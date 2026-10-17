import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import SourcesDemo from "@/examples/sources-demo"
import { renderExample } from "@/tests/render-example"

const USED_SOURCES = /Used 3 sources/
const NEW_TAB = /opens in a new tab/

test("Default", async () => {
  const { canvas, step } = await renderExample(<SourcesDemo />)

  const trigger = canvas.getByRole("button", { name: USED_SOURCES })

  await step("lists each source once as a new tab link", async () => {
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
    const links = canvas.getAllByRole("link", { name: NEW_TAB })
    await expect(links).toHaveLength(3)
    for (const link of links) {
      await expect(link).toHaveAttribute("target", "_blank")
    }
  })

  await step("collapses on click", async () => {
    await userEvent.click(trigger)
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
  })
})
