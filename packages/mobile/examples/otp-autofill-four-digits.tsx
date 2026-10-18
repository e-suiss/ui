import {
  OtpAutofill,
  OtpAutofillInput,
  OtpAutofillSuggestion,
  useOtpAutofill,
} from "@/components/interactions/otp-autofill"
import { InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Text } from "@/components/ui/text"

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

export default function OtpAutofillFourDigits() {
  return (
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
  )
}
