import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import CheckboxChecked from "@/examples/checkbox-checked"
import CheckboxDemo from "@/examples/checkbox-demo"
import CheckboxDisabled from "@/examples/checkbox-disabled"
import CheckboxInvalid from "@/examples/checkbox-invalid"
import CheckboxWithDescription from "@/examples/checkbox-with-description"
import CheckboxWithLabel from "@/examples/checkbox-with-label"
import { byBase } from "@/tests/base"
import { renderExample } from "@/tests/render-example"

const DISABLED = byBase({
  base: { name: "aria-disabled", value: "true" },
  radix: { name: "disabled", value: "" },
  aria: { name: "disabled", value: "" },
})

test("Default", async () => {
  const { canvas, step } = await renderExample(<CheckboxDemo />)

  const checkbox = canvas.getByRole("checkbox", { name: "Accept terms" })

  await step("toggles on click", async () => {
    await expect(checkbox).not.toBeChecked()
    await userEvent.click(checkbox)
    await expect(checkbox).toBeChecked()
  })

  await step("toggles with Space", async () => {
    await expect(checkbox).toHaveFocus()
    await userEvent.keyboard(" ")
    await expect(checkbox).not.toBeChecked()
  })
})
test("Checked", async () => {
  const { canvas } = await renderExample(<CheckboxChecked />)

  const checkbox = canvas.getByRole("checkbox", { name: "Accept terms" })
  await expect(checkbox).toBeChecked()
  await userEvent.click(checkbox)
  await expect(checkbox).not.toBeChecked()
})
test("With Label", async () => {
  const { canvas } = await renderExample(<CheckboxWithLabel />)

  const checkbox = canvas.getByRole("checkbox", {
    name: "Accept terms and conditions",
  })
  await userEvent.click(canvas.getByText("Accept terms and conditions"))
  await expect(checkbox).toBeChecked()
})
test("With Description", async () => {
  const { canvas, step } = await renderExample(<CheckboxWithDescription />)

  const checkbox = canvas.getByRole("checkbox", { name: "Product updates" })

  await step("describes the checkbox with its text", async () => {
    await expect(checkbox).toHaveAccessibleDescription(
      "Get an email when we release new features."
    )
  })

  await step("shows the description under the label", async () => {
    const description = canvas.getByText(
      "Get an email when we release new features."
    )
    await expect(description).toBeVisible()
    await expect(
      description.getBoundingClientRect().top
    ).toBeGreaterThanOrEqual(
      canvas.getByText("Product updates").getBoundingClientRect().bottom
    )
  })

  await step("toggles from its label", async () => {
    await expect(checkbox).toBeChecked()
    await userEvent.click(canvas.getByText("Product updates"))
    await expect(checkbox).not.toBeChecked()
    await userEvent.click(checkbox)
    await expect(checkbox).toBeChecked()
  })
})
test("Disabled", async () => {
  const { canvas } = await renderExample(<CheckboxDisabled />)

  const unavailable = canvas.getByRole("checkbox", {
    name: "Unavailable option",
  })
  const included = canvas.getByRole("checkbox", { name: "Always included" })
  await expect(unavailable).toHaveAttribute(DISABLED.name, DISABLED.value)
  await expect(included).toBeChecked()
  await userEvent.click(unavailable)
  await expect(unavailable).not.toBeChecked()
  await userEvent.tab()
  await expect(unavailable).not.toHaveFocus()
  await expect(included).not.toHaveFocus()
})
test("Invalid", async () => {
  const { canvas } = await renderExample(<CheckboxInvalid />)

  await expect(
    canvas.getByRole("checkbox", { name: "You must accept the terms" })
  ).toBeInvalid()
})
