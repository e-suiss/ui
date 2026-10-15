import { waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import { SignupForm } from "@/components/blocks/signup-form"
import { SignupSteps } from "@/components/blocks/signup-steps"
import { SignupTrial } from "@/components/blocks/signup-trial"
import { renderExample } from "@/tests/render-example"

const TERMS = /^I have read and agree/

test("Form", async () => {
  const { canvas, step } = await renderExample(<SignupForm />)

  const continueButton = canvas.getByRole("button", { name: "Continue" })

  await step("submitting empty asks to fix the form", async () => {
    await userEvent.click(continueButton)
    await expect(
      await canvas.findByText("Please fill in every field correctly.")
    ).toBeVisible()
  })

  await step("a complete form creates the account", async () => {
    await userEvent.type(
      canvas.getByRole("textbox", { name: "First name" }),
      "Jamie"
    )
    await userEvent.type(
      canvas.getByRole("textbox", { name: "Last name" }),
      "Rivera"
    )
    await userEvent.type(
      canvas.getByRole("textbox", { name: "Birthday" }),
      "04/12/1990"
    )
    await userEvent.type(
      canvas.getByRole("textbox", { name: "Email" }),
      "jamie@suiss.com"
    )
    await userEvent.type(
      canvas.getByLabelText("Password", { exact: true }),
      "Sunrise2026"
    )
    await userEvent.type(
      canvas.getByLabelText("Confirm password"),
      "Sunrise2026"
    )
    await userEvent.click(continueButton)
    await expect(
      await canvas.findByRole("heading", {
        name: "Your suiss Account is ready.",
      })
    ).toBeInTheDocument()
  })
})
test("Steps", async () => {
  const { canvas, step } = await renderExample(<SignupSteps />)

  await step("an invalid email keeps the email step", async () => {
    const next = canvas.getByRole("button", { name: "Continue" })
    await expect(next).toBeDisabled()
    await userEvent.type(
      canvas.getByRole("textbox", { name: "Full name" }),
      "Jamie Rivera"
    )
    await userEvent.click(next)
    await expect(await canvas.findByText("Step 2 of 3")).toBeInTheDocument()
    const email = canvas.getByRole("textbox", { name: "name@example.com" })
    await userEvent.type(email, "jamie@suiss")
    await expect(
      canvas.getByRole("button", { name: "Continue" })
    ).toBeDisabled()
    await userEvent.type(email, ".com")
    await userEvent.click(canvas.getByRole("button", { name: "Continue" }))
    await expect(await canvas.findByText("Step 3 of 3")).toBeInTheDocument()
  })

  await step("a strong password creates the account", async () => {
    const create = canvas.getByRole("button", { name: "Create account" })
    await userEvent.type(
      canvas.getByLabelText("Password", { exact: true }),
      "Sunrise26"
    )
    await waitFor(() => expect(create).toBeEnabled())
    await userEvent.click(create)
    await expect(
      await canvas.findByRole("heading", { name: "Welcome, Jamie." })
    ).toBeInTheDocument()
  })
})
test("Trial", async () => {
  const { canvas, step } = await renderExample(<SignupTrial />)

  const start = canvas.getByRole("button", { name: "Start free trial" })

  await step("the trial needs a valid email, password and terms", async () => {
    await expect(start).toBeDisabled()
    await userEvent.type(
      canvas.getByRole("textbox", { name: "suiss Account email" }),
      "jamie@suiss.com"
    )
    await userEvent.type(
      canvas.getByLabelText("Create a password"),
      "Sunrise26"
    )
    await expect(
      canvas.getByRole("meter", { name: "Password strength" })
    ).toHaveAttribute("aria-valuetext", "Good")
    await expect(start).toBeDisabled()
    await userEvent.click(canvas.getByText(TERMS))
    await waitFor(() => expect(start).toBeEnabled())
  })

  await step("starting the trial welcomes the person", async () => {
    await userEvent.click(start)
    await expect(
      await canvas.findByRole("heading", { name: "Welcome to suiss Music." })
    ).toBeInTheDocument()
  })
})
