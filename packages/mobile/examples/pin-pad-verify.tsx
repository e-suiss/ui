import * as React from "react"
import { View } from "react-native"
import { PinPad } from "@/components/ui/pin-pad"
import { Text } from "@/components/ui/text"

const PASSCODE = "123456"

export default function PinPadVerify() {
  const [value, setValue] = React.useState("")
  const [error, setError] = React.useState(false)
  const [status, setStatus] = React.useState("Enter 123456")
  return (
    <View className="items-center gap-6">
      <Text
        role="status"
        accessibilityLiveRegion="polite"
        className={
          error ? "text-sm text-destructive" : "text-sm text-muted-foreground"
        }
      >
        {status}
      </Text>
      <PinPad
        value={value}
        error={error}
        onValueChange={(next) => {
          setValue(next)
          if (next.length > 0) setError(false)
        }}
        onComplete={(code) => {
          if (code === PASSCODE) {
            setStatus("Unlocked")
          } else {
            setError(true)
            setStatus("Wrong passcode. Try again.")
            setTimeout(() => setValue(""), 600)
          }
        }}
      />
    </View>
  )
}
