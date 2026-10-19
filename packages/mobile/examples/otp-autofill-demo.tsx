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
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

function statusClassName(state: string) {
  if (state === "invalid") return "min-h-5 text-sm text-destructive"
  if (state === "verified")
    return "min-h-5 text-sm text-green-600 dark:text-green-400"
  return "min-h-5 text-sm text-muted-foreground"
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

export default function OtpAutofillDemo() {
  const [suggestion, setSuggestion] = React.useState<string | null>(null)
  const [sending, setSending] = React.useState(false)

  const send = React.useCallback(async () => {
    setSending(true)
    setSuggestion(null)
    await wait(1200)
    setSuggestion(CODE)
    setSending(false)
  }, [])

  React.useEffect(() => {
    send()
  }, [send])

  return (
    <View className="w-full items-center gap-2">
      <Text className="text-center text-2xl font-bold">Enter the code</Text>
      <Text className="text-center text-sm text-muted-foreground">
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
