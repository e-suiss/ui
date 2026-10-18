import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

function slotIndexes(length: number) {
  return Array.from({ length }, (_, index) => index)
}

export default function InputotpAlphanumeric() {
  return (
    <InputOTP
      length={6}
      validationType="alphanumeric"
      normalizeValue={(value) => value.toUpperCase()}
    >
      <InputOTPGroup>
        {slotIndexes(6).map((index) => (
          <InputOTPSlot key={index} index={index} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  )
}
