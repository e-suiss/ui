import * as React from "react"
import { View } from "react-native"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Text } from "@/components/ui/text"

function slotIndexes(length: number) {
  return Array.from({ length }, (_, index) => index)
}

function ControlledDemo() {
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
          {slotIndexes(4).map((index) => (
            <InputOTPSlot key={index} index={index} />
          ))}
        </InputOTPGroup>
      </InputOTP>
      <Text variant="muted">
        {completed ? `Submitted ${completed}` : "Enter the 4 digit code"}
      </Text>
    </View>
  )
}

export default function InputotpControlled() {
  return <ControlledDemo />
}
