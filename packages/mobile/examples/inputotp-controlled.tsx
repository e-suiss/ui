import * as React from "react"
import { View } from "react-native"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Text } from "@/components/ui/text"

export default function InputotpControlled() {
  const [value, setValue] = React.useState("")
  const [completed, setCompleted] = React.useState<string | null>(null)
  return (
    <View className="gap-3">
      <InputOTP
        length={4}
        value={value}
        onValueChange={setValue}
        onValueComplete={setCompleted}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
      </InputOTP>
      <Text variant="muted">
        {completed ? `Submitted ${completed}` : "Enter the 4 digit code"}
      </Text>
    </View>
  )
}
