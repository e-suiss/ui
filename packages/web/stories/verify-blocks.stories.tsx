import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, screen, userEvent, waitFor } from "storybook/test"

import { VerifyCode } from "@/components/blocks/verify-code"
import { VerifyDevice } from "@/components/blocks/verify-device"
import { VerifyEmail } from "@/components/blocks/verify-email"

const meta = {
  title: "Blocks/Verify",
  component: VerifyCode,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof VerifyCode>

export default meta

type Story = StoryObj<typeof meta>

const RESEND = /^(Resend|Sent again · \d+)$/

export const Code: Story = {
  play: async ({ canvas, step }) => {
    const input = canvas.getByRole("textbox", { name: "Verification code" })

    await step("a wrong code is flagged and cleared", async () => {
      await userEvent.type(input, "000000")
      await expect(await canvas.findByText("Incorrect code.")).toBeVisible()
      await waitFor(() => expect(input).toHaveValue(""))
    })

    await step("the right code verifies", async () => {
      await userEvent.type(input, "482913")
      await expect(
        await canvas.findByRole("heading", { name: "Verified." })
      ).toBeInTheDocument()
    })
  },
}

export const Device: Story = {
  render: () => <VerifyDevice />,
  play: async ({ canvas, step }) => {
    await step("allowing on the trusted device asks for the code", async () => {
      const alert = await screen.findByRole("alertdialog", {
        name: "Trusted device",
      })
      await expect(alert).toHaveTextContent("suiss Account Sign-in Requested")
      await userEvent.click(screen.getByRole("button", { name: "Allow" }))
      await waitFor(() =>
        expect(canvas.getByRole("heading", { level: 1 })).toHaveTextContent(
          "Enter the verification code."
        )
      )
    })

    await step(
      "the device shows the code and a wrong one is flagged",
      async () => {
        await expect(
          screen.getByRole("alertdialog", { name: "Trusted device" })
        ).toHaveTextContent("482 913")
        const input = canvas.getByRole("textbox", { name: "Verification code" })
        await waitFor(() => expect(input).toHaveFocus())
        await userEvent.keyboard("111111")
        await expect(await canvas.findByText("Incorrect code.")).toBeVisible()
        await waitFor(() => expect(input).toHaveValue(""))
      }
    )
  },
}

export const Email: Story = {
  render: () => <VerifyEmail />,
  play: async ({ canvas, step }) => {
    await step("resend locks behind a countdown", async () => {
      const resend = canvas.getByRole("button", { name: RESEND })
      await userEvent.click(resend)
      await expect(resend).toHaveTextContent("Sent again · 45")
      await expect(resend).toBeDisabled()
    })

    await step("opening mail verifies the address", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Open Mail" }))
      await expect(
        await canvas.findByRole("heading", { name: "Your email is verified." })
      ).toBeInTheDocument()
    })
  },
}
