import { screen, waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import { LoginAccount } from "@/components/blocks/login-account"
import { LoginPasskey } from "@/components/blocks/login-passkey"
import { LoginSheet } from "@/components/blocks/login-sheet"
import { renderExample } from "@/tests/render-example"

test("Account", async () => {
  const { canvas, step } = await renderExample(<LoginAccount />)

  const email = canvas.getByRole("textbox", { name: "Email or phone number" })

  await step("an invalid email shows the error", async () => {
    await userEvent.type(email, "jamie{Enter}")
    await expect(
      await canvas.findByText("Enter a valid suiss Account.")
    ).toBeInTheDocument()
    await expect(email).toHaveAttribute("aria-invalid", "true")
  })

  await step("a valid email and password sign in", async () => {
    await userEvent.type(email, "@example.com")
    await expect(email).not.toHaveAttribute("aria-invalid")
    await userEvent.keyboard("{Enter}")
    const password = canvas.getByLabelText("Password", { exact: true })
    await waitFor(() => expect(password).toHaveFocus())
    await userEvent.type(password, "secret")
    const submit = canvas.getAllByRole("button", { name: "Continue" }).at(-1)
    if (!submit) throw new Error("Missing continue button")
    await userEvent.click(submit)
    await waitFor(
      () =>
        expect(
          canvas.getByRole("heading", { name: "Hello." })
        ).toBeInTheDocument(),
      { timeout: 4000 }
    )
  })
})
test("Passkey", async () => {
  const { canvas, step } = await renderExample(<LoginPasskey />)

  await step("the passkey scan verifies and signs in", async () => {
    await userEvent.click(
      canvas.getByRole("button", { name: "Continue with passkey" })
    )
    const dialog = await screen.findByRole("dialog")
    await expect(dialog).toHaveTextContent("Face scan")
    await waitFor(
      () =>
        expect(
          canvas.getByRole("heading", { name: "Welcome, Jamie." })
        ).toBeInTheDocument(),
      { timeout: 5000 }
    )
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
  })
})
test("Sheet", async () => {
  const { canvas, step } = await renderExample(<LoginSheet />)

  await step("opening the sheet focuses its close button", async () => {
    await userEvent.click(
      canvas.getByRole("button", { name: "Sign in with suiss" })
    )
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Close" })).toHaveFocus()
    )
  })

  await step("continuing with face scan signs in", async () => {
    await userEvent.click(
      screen.getByRole("button", { name: "Continue with face scan" })
    )
    await waitFor(
      () =>
        expect(
          canvas.getByRole("heading", { name: "Welcome, Jamie" })
        ).toBeInTheDocument(),
      { timeout: 5000 }
    )
  })
})
