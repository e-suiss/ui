import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, screen, userEvent, waitFor } from "storybook/test"

import { LoginAccount } from "@/components/blocks/login-account"
import { LoginPasskey } from "@/components/blocks/login-passkey"
import { LoginSheet } from "@/components/blocks/login-sheet"

const meta = {
  title: "Blocks/Login",
  component: LoginAccount,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof LoginAccount>

export default meta

type Story = StoryObj<typeof meta>

export const Account: Story = {
  play: async ({ canvas, step }) => {
    const email = canvas.getByRole("textbox", { name: "Email or phone number" })

    await step("an invalid email shows the error", async () => {
      await userEvent.type(email, "jamie{Enter}")
      await expect(
        await canvas.findByText("Enter a valid suiss Account.")
      ).toBeInTheDocument()
      await expect(email).toHaveAttribute("aria-invalid", "true")
    })

    await step("a valid email and password sign in", async () => {
      await userEvent.type(email, "@suiss.com")
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
  },
}

export const Passkey: Story = {
  render: () => <LoginPasskey />,
  play: async ({ canvas, step }) => {
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
  },
}

export const Sheet: Story = {
  render: () => <LoginSheet />,
  play: async ({ canvas, step }) => {
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
  },
}
