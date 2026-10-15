import * as React from "react"
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

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function Status() {
  const { state } = useOtpAutofill()

  return (
    <p
      role="status"
      className="min-h-5 text-sm text-muted-foreground data-[state=invalid]:text-destructive data-[state=verified]:text-green-600 dark:data-[state=verified]:text-green-400"
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
      <p className="text-sm text-muted-foreground">
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

export default function OtpAutofillDemo() {
  return <VerificationExample incoming={CODE} />
}
