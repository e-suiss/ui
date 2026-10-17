import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import SuggestionDemo from "@/examples/suggestion-demo"
import { renderExample } from "@/tests/render-example"

const MISSING_IMPORT = /missing import in app\/page\.tsx/
const ONLY_SUGGESTIONS = /only knows the suggestions/

test("Suggestion", async () => {
  const { canvas, step } = await renderExample(<SuggestionDemo />)

  await step("sends a suggestion on click", async () => {
    await userEvent.click(
      canvas.getByRole("button", { name: "Fix the failing build" })
    )
    await expect(await canvas.findByText(MISSING_IMPORT)).toBeVisible()
  })

  await step("sends typed text", async () => {
    await userEvent.type(
      canvas.getByRole("textbox", { name: "Message" }),
      "Add i18n{Enter}"
    )
    await expect(await canvas.findByText("Add i18n")).toBeVisible()
    await expect(canvas.getByText(ONLY_SUGGESTIONS)).toBeVisible()
  })
})
