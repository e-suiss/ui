import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

function slotIndexes(length: number) {
  return Array.from({ length }, (_, index) => index)
}

export default function InputotpMasked() {
  return (
    <InputOTP length={4} mask defaultValue="12">
      <InputOTPGroup>
        {slotIndexes(4).map((index) => (
          <InputOTPSlot key={index} index={index} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  )
}
