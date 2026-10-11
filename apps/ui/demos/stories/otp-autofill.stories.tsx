// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { expect, userEvent, waitFor } from "storybook/test"

import {
  OtpAutofill,
  OtpAutofillInput,
  OtpAutofillSuggestion,
  useOtpAutofill,
} from "@/components/interactions/otp-autofill"
import { Button } from "@/components/ui/button"
import {
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

const CODE = "482913"
const SUGGESTION = /From Messages/

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function Status() {
  const { state } = useOtpAutofill()

  return (
    <p
      role="status"
      className="min-h-5 text-sm text-label-secondary data-[state=invalid]:text-danger data-[state=verified]:text-success"
      data-state={state}
    >
      {state === "verifying" && "Verifying…"}
      {state === "verified" && "Verified"}
      {state === "invalid" && "That code didn't work. Try again."}
    </p>
  )
}

function VerificationExample({ incoming }: { incoming: string }) {
  const [suggestion, setSuggestion] = React.useState<string | null>(null)
  const [sending, setSending] = React.useState(false)

  const send = React.useCallback(async () => {
    setSending(true)
    setSuggestion(null)
    await wait(1200)
    setSuggestion(incoming)
    setSending(false)
  }, [incoming])

  React.useEffect(() => {
    send()
  }, [send])

  return (
    <div className="mx-auto flex w-[min(28rem,calc(100vw-2rem))] flex-col items-center gap-2 text-center">
      <h2 className="text-2xl font-bold tracking-tight">Enter the code</h2>
      <p className="text-sm text-label-secondary">
        We sent a 6-digit code to +1 555 0100.
      </p>
      <OtpAutofill
        maxLength={6}
        onVerify={async (code) => {
          await wait(700)
          return code === CODE
        }}
        className="mt-4"
      >
        <OtpAutofillInput autoFocus aria-label="Verification code">
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </OtpAutofillInput>
        <Status />
        <OtpAutofillSuggestion code={suggestion} />
      </OtpAutofill>
      <Button variant="plain" onClick={send} disabled={sending}>
        {sending ? "Sending…" : "Resend code"}
      </Button>
    </div>
  )
}

const meta = {
  title: "Interactions/OTP Autofill",
  component: OtpAutofill,
} satisfies Meta<typeof OtpAutofill>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { maxLength: 6, onVerify: () => true },
  render: () => <VerificationExample incoming={CODE} />,
  play: async ({ canvas, step }) => {
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
      await expect(
        canvas.queryByRole("button", { name: SUGGESTION })
      ).toBeNull()
    })
  },
}

export const WrongCode: Story = {
  args: { maxLength: 6, onVerify: () => true },
  render: () => <VerificationExample incoming="113355" />,
  play: async ({ canvas, step }) => {
    const input = canvas.getByRole("textbox", { name: "Verification code" })

    await step("rejects the suggested code and clears the field", async () => {
      await userEvent.click(
        await canvas.findByRole(
          "button",
          { name: SUGGESTION },
          { timeout: 4000 }
        )
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
  },
}
