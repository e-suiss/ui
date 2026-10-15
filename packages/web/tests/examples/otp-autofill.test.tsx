import { waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import OtpAutofillDemo from "@/examples/otp-autofill-demo"
import OtpAutofillWrongCode from "@/examples/otp-autofill-wrong-code"
import { renderExample } from "@/tests/render-example"

const CODE = "482913"
const SUGGESTION = /From Messages/

test("Default", async () => {
  const { canvas, step } = await renderExample(<OtpAutofillDemo />)

  const input = canvas.getByRole("textbox", { name: "Verification code" })

  await step(
    "offers the incoming code while the field is focused",
    async () => {
      await waitFor(() => expect(input).toHaveFocus())
      const suggestion = await canvas.findByRole(
        "button",
        { name: SUGGESTION },
        { timeout: 4000 }
      )
      await expect(suggestion).toHaveTextContent(CODE)
    }
  )

  await step("fills and verifies the code in one tap", async () => {
    await userEvent.click(canvas.getByRole("button", { name: SUGGESTION }))
    await waitFor(() => expect(input).toHaveValue(CODE))
    await waitFor(
      () => expect(canvas.getByRole("status")).toHaveTextContent("Verified"),
      { timeout: 3000 }
    )
    await expect(input).toHaveAttribute("readonly")
    await expect(canvas.queryByRole("button", { name: SUGGESTION })).toBeNull()
  })
})
test("Wrong Code", async () => {
  const { canvas, step } = await renderExample(<OtpAutofillWrongCode />)

  const input = canvas.getByRole("textbox", { name: "Verification code" })

  await step("rejects the suggested code and clears the field", async () => {
    await userEvent.click(
      await canvas.findByRole("button", { name: SUGGESTION }, { timeout: 4000 })
    )
    await waitFor(
      () =>
        expect(canvas.getByRole("status")).toHaveTextContent(
          "That code didn't work. Try again."
        ),
      { timeout: 3000 }
    )
    await expect(input).toHaveAttribute("aria-invalid", "true")
    await waitFor(() => expect(input).toHaveValue(""))
    await waitFor(() => expect(input).toHaveFocus())
  })

  await step("verifies a code typed by hand", async () => {
    await userEvent.type(input, CODE)
    await waitFor(
      () => expect(canvas.getByRole("status")).toHaveTextContent("Verified"),
      { timeout: 3000 }
    )
  })
})
