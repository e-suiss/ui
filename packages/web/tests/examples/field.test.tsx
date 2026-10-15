import { within } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import FieldChoiceCards from "@/examples/field-choice-cards"
import FieldDemo from "@/examples/field-demo"
import FieldDisabled from "@/examples/field-disabled"
import FieldForm from "@/examples/field-form"
import FieldHorizontal from "@/examples/field-horizontal"
import FieldInvalid from "@/examples/field-invalid"
import FieldMultipleErrors from "@/examples/field-multiple-errors"
import FieldWithHelpLink from "@/examples/field-with-help-link"
import FieldWithTextarea from "@/examples/field-with-textarea"
import { renderExample } from "@/tests/render-example"

test("Default", async () => {
  const { canvas, step } = await renderExample(<FieldDemo />)

  const input = canvas.getByRole("textbox", { name: "Username" })

  await step("names the input and focuses it from the label", async () => {
    await expect(input).toHaveAccessibleDescription(
      "Choose a unique name for your account."
    )
    await userEvent.click(canvas.getByText("Username"))
    await expect(input).toHaveFocus()
    await userEvent.keyboard("ada")
    await expect(input).toHaveValue("ada")
  })
})
test("With Help Link", async () => {
  const { canvas, step } = await renderExample(<FieldWithHelpLink />)

  const input = canvas.getByRole("textbox", { name: "Serial number" })

  await step("focuses the input from its label", async () => {
    await userEvent.click(canvas.getByText("Serial number"))
    await expect(input).toHaveFocus()
    await userEvent.keyboard("C02XL0GTJGH5")
    await expect(input).toHaveValue("C02XL0GTJGH5")
  })

  await step("reaches the help link after the input", async () => {
    const link = canvas.getByRole("link", { name: "Find your serial number" })
    await expect(link).toHaveAttribute("href", "#serial-help")
    await userEvent.tab()
    await expect(link).toHaveFocus()
  })
})
test("With Textarea", async () => {
  const { canvas, step } = await renderExample(<FieldWithTextarea />)

  const textarea = canvas.getByRole("textbox", { name: "Feedback" })

  await step("names the textarea and focuses it from the label", async () => {
    await expect(textarea).toHaveAttribute("rows", "4")
    await expect(textarea).toHaveAccessibleDescription(
      "Your feedback helps us improve."
    )
    await userEvent.click(canvas.getByText("Feedback"))
    await expect(textarea).toHaveFocus()
  })

  await step("accepts multi-line text", async () => {
    await userEvent.keyboard("Great{Enter}work")
    await expect(textarea).toHaveValue("Great\nwork")
  })
})
test("Invalid", async () => {
  const { canvas, step } = await renderExample(<FieldInvalid />)

  await step("flags the input and announces the error", async () => {
    await expect(canvas.getByRole("textbox", { name: "Email" })).toBeInvalid()
    await expect(canvas.getByRole("alert")).toHaveTextContent(
      "Enter a valid email address."
    )
  })
})
test("Multiple Errors", async () => {
  const { canvas, step } = await renderExample(<FieldMultipleErrors />)

  await step("lists every error in one alert", async () => {
    const alert = canvas.getByRole("alert")
    await expect(within(alert).getAllByRole("listitem")).toHaveLength(2)
  })
})
test("Disabled", async () => {
  const { canvas, step } = await renderExample(<FieldDisabled />)

  await step("disables the named input", async () => {
    await expect(
      canvas.getByRole("textbox", { name: "Workspace URL" })
    ).toBeDisabled()
  })
})
test("Horizontal", async () => {
  const { canvas, step } = await renderExample(<FieldHorizontal />)

  await step("toggles each control from its label", async () => {
    const terms = canvas.getByRole("checkbox", {
      name: "Accept terms and conditions",
    })
    await expect(terms).toBeChecked()
    await userEvent.click(canvas.getByText("Accept terms and conditions"))
    await expect(terms).not.toBeChecked()

    const marketing = canvas.getByRole("switch", { name: "Marketing emails" })
    await userEvent.click(canvas.getByText("Marketing emails"))
    await expect(marketing).toBeChecked()
  })
})
test("Choice Cards", async () => {
  const { canvas, step } = await renderExample(<FieldChoiceCards />)

  const [starter, pro] = canvas.getAllByRole("radio")

  await step("selects a plan by clicking its card", async () => {
    await expect(pro).toBeChecked()
    await userEvent.click(canvas.getByText("Starter"))
    await expect(starter).toBeChecked()
    await expect(pro).not.toBeChecked()
  })
})
test("Form", async () => {
  const { canvas, step } = await renderExample(<FieldForm />)

  await step("groups the fields under their legends", async () => {
    await expect(
      canvas.getByRole("group", { name: "Payment method" })
    ).toBeVisible()
    await expect(
      canvas.getByRole("group", { name: "Billing address" })
    ).toBeVisible()
  })

  await step("marks the required fields", async () => {
    await expect(
      canvas.getByRole("textbox", { name: "Name on card" })
    ).toBeRequired()
    await expect(
      canvas.getByRole("textbox", { name: "Card number" })
    ).toBeRequired()
    await expect(
      canvas.getByRole("textbox", { name: "CVV" })
    ).not.toBeRequired()
  })
})
