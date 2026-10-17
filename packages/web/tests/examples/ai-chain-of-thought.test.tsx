import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import ChainOfThoughtDemo from "@/examples/chain-of-thought-demo"
import { renderExample } from "@/tests/render-example"

const SUMMARY = /Researched in 3 steps/
const BUILD_LOG = /Read the build log/
const WEB_SEARCH = /Searched the web/
const IMAGES = /images\s+3m 52s/
const NEW_TAB = /Image component.*opens in a new tab/

test("Default", async () => {
  const { canvas, step } = await renderExample(<ChainOfThoughtDemo />)

  await step("opens the summary and the build log step", async () => {
    await expect(canvas.getByRole("button", { name: SUMMARY })).toHaveAttribute(
      "aria-expanded",
      "true"
    )
    await expect(
      canvas.getByRole("button", { name: BUILD_LOG })
    ).toHaveAttribute("aria-expanded", "true")
    await expect(canvas.getByText(IMAGES)).toBeVisible()
  })

  await step("expands a step into its sources", async () => {
    const search = canvas.getByRole("button", { name: WEB_SEARCH })
    await expect(search).toHaveAttribute("aria-expanded", "false")
    await userEvent.click(search)
    await expect(search).toHaveAttribute("aria-expanded", "true")
    await expect(
      await canvas.findByRole("link", { name: NEW_TAB })
    ).toHaveAttribute("target", "_blank")
  })
})
