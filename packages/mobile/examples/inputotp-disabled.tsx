import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

function slotIndexes(length: number) {
  return Array.from({ length }, (_, index) => index)
}

export default function InputotpDisabled() {
  return (
    <InputOTP length={6} disabled defaultValue="123">
      <InputOTPGroup>
        {slotIndexes(6).map((index) => (
          <InputOTPSlot key={index} index={index} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  )
}
