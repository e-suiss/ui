import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import LabelDemo from "@/examples/label-demo"
import LabelDisabled from "@/examples/label-disabled"
import LabelWithCheckbox from "@/examples/label-with-checkbox"
import LabelWithInput from "@/examples/label-with-input"
import { renderExample } from "@/tests/render-example"

test("Default", async () => {
  const { canvas, step } = await renderExample(<LabelDemo />)

  await step("renders the label text", async () => {
    await expect(canvas.getByText("Email address").tagName).toBe("LABEL")
  })
})
test("With Input", async () => {
  const { canvas, step } = await renderExample(<LabelWithInput />)

  const input = canvas.getByRole("textbox", { name: "Email address" })

  await step("names the input and focuses it on click", async () => {
    await userEvent.click(canvas.getByText("Email address"))
    await expect(input).toHaveFocus()
  })
})
test("With Checkbox", async () => {
  const { canvas, step } = await renderExample(<LabelWithCheckbox />)

  const checkbox = canvas.getByRole("checkbox", {
    name: "Accept terms and conditions",
  })

  await step("toggles the checkbox from its label", async () => {
    await expect(checkbox).not.toBeChecked()
    await userEvent.click(canvas.getByText("Accept terms and conditions"))
    await expect(checkbox).toBeChecked()
  })
})
test("Disabled", async () => {
  const { canvas, step } = await renderExample(<LabelDisabled />)

  await step("keeps the named input disabled", async () => {
    await expect(
      canvas.getByRole("textbox", { name: "Email address" })
    ).toBeDisabled()
  })
})
