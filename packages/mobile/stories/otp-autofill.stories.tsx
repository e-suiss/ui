import type { Meta, StoryObj } from "@storybook/react-native"
import * as React from "react"
import { View } from "react-native"
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
import { Text } from "@/components/ui/text"

const CODE = "482913"

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function statusClassName(state: string) {
  if (state === "invalid") return "min-h-5 text-sm text-danger"
  if (state === "verified") return "min-h-5 text-sm text-success"
  return "min-h-5 text-sm text-label-secondary"
}

function statusText(state: string) {
  if (state === "verifying") return "Verifying…"
  if (state === "verified") return "Verified"
  if (state === "invalid") return "That code didn't work. Try again."
  return ""
}

function Status() {
  const { state } = useOtpAutofill()

  return (
    <Text
      role="status"
      accessibilityLiveRegion="polite"
      className={statusClassName(state)}
    >
      {statusText(state)}
    </Text>
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
    <View className="w-full items-center gap-2">
      <Text className="text-center text-2xl font-bold">Enter the code</Text>
      <Text className="text-center text-sm text-label-secondary">
        We sent a 6-digit code to +1 555 0100.
      </Text>
      <OtpAutofill
        maxLength={6}
        onVerify={async (code) => {
          await wait(700)
          return code === CODE
        }}
        className="mt-4"
      >
        <OtpAutofillInput autoFocus accessibilityLabel="Verification code">
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
      <Button variant="plain" onPress={send} disabled={sending}>
        <Text>{sending ? "Sending…" : "Resend code"}</Text>
      </Button>
    </View>
  )
}

const meta = {
  title: "Interactions/OTP Autofill",
  component: OtpAutofill,
  args: { maxLength: 6, onVerify: () => true },
} satisfies Meta<typeof OtpAutofill>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <VerificationExample incoming={CODE} />,
}

export const WrongCode: Story = {
  render: () => <VerificationExample incoming="113355" />,
}

export const FourDigits: Story = {
  render: () => (
    <OtpAutofill maxLength={4} onVerify={(code) => code === "2468"}>
      <OtpAutofillInput accessibilityLabel="Verification code">
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
      </OtpAutofillInput>
      <Status />
      <OtpAutofillSuggestion code="2468" source="From Messages" />
    </OtpAutofill>
  ),
}
