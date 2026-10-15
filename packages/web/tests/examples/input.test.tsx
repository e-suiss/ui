import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import InputDemo from "@/examples/input-demo"
import InputDisabled from "@/examples/input-disabled"
import InputFile from "@/examples/input-file"
import InputInvalid from "@/examples/input-invalid"
import InputTypes from "@/examples/input-types"
import InputWithValue from "@/examples/input-with-value"
import { renderExample } from "@/tests/render-example"

test("Default", async () => {
  const { canvas, step } = await renderExample(<InputDemo />)

  const input = canvas.getByPlaceholderText("Enter your name")

  await step("accepts typed text", async () => {
    await userEvent.type(input, "Ada")
    await expect(input).toHaveValue("Ada")
    await expect(input).toHaveFocus()
  })
})
test("Types", async () => {
  const { canvas, step } = await renderExample(<InputTypes />)

  const email = canvas.getByPlaceholderText("jane@example.com")
  const password = canvas.getByPlaceholderText("Password")
  const quantity = canvas.getByPlaceholderText("Quantity")
  const search = canvas.getByPlaceholderText("Search...")

  await step("renders each input with its type", async () => {
    await expect(email).toHaveAttribute("type", "email")
    await expect(password).toHaveAttribute("type", "password")
    await expect(quantity).toHaveRole("spinbutton")
    await expect(search).toHaveRole("searchbox")
  })

  await step("accepts typing suited to each type", async () => {
    await userEvent.type(email, "jane@example.com")
    await expect(email).toHaveValue("jane@example.com")
    await expect(email).toBeValid()
    await userEvent.type(password, "secret")
    await expect(password).toHaveValue("secret")
    await userEvent.type(quantity, "12")
    await expect(quantity).toHaveValue(12)
    await userEvent.type(search, "grill")
    await expect(search).toHaveValue("grill")
  })
})
test("With Value", async () => {
  const { canvas, step } = await renderExample(<InputWithValue />)

  const input = canvas.getByRole("textbox")

  await step("replaces the default value", async () => {
    await expect(input).toHaveValue("Jane Doe")
    await userEvent.clear(input)
    await userEvent.type(input, "Ada")
    await expect(input).toHaveValue("Ada")
  })
})
test("File", async () => {
  const { canvasElement, step } = await renderExample(<InputFile />)

  const input =
    canvasElement.querySelector<HTMLInputElement>('input[type="file"]')
  if (!input) throw new Error("file input not rendered")
  const upload = new window.File(["menu"], "menu.pdf", {
    type: "application/pdf",
  })

  await step("is reachable with Tab", async () => {
    await expect(input).toHaveAccessibleName("Menu")
    await userEvent.tab()
    await expect(input).toHaveFocus()
  })

  await step("accepts a chosen file", async () => {
    await userEvent.upload(input, upload)
    await expect(input.files?.[0]).toBe(upload)
    await expect(input.files).toHaveLength(1)
  })
})
test("Invalid", async () => {
  const { canvas, step } = await renderExample(<InputInvalid />)

  await step("flags the input as invalid", async () => {
    await expect(canvas.getByRole("textbox")).toBeInvalid()
  })
})
test("Disabled", async () => {
  const { canvas, step } = await renderExample(<InputDisabled />)

  const input = canvas.getByRole("textbox")

  await step("ignores typing while disabled", async () => {
    await expect(input).toBeDisabled()
    await userEvent.type(input, "Ada")
    await expect(input).toHaveValue("")
  })
})
