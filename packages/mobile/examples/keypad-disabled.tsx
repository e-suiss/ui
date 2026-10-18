import * as React from "react"
import { View } from "react-native"
import {
  Keypad,
  type KeypadAccessoryKey,
  type KeypadKeyValue,
} from "@/components/ui/keypad"
import { Text } from "@/components/ui/text"

function KeyLog({
  accessoryKey,
  disabled,
}: {
  accessoryKey?: KeypadAccessoryKey
  disabled?: boolean
}) {
  const [last, setLast] = React.useState<KeypadKeyValue | null>(null)
  return (
    <View className="items-center gap-6">
      <Text
        role="status"
        accessibilityLiveRegion="polite"
        className="text-sm text-muted-foreground"
      >
        {last ? `Last key: ${last}` : "Press a key"}
      </Text>
      <Keypad
        accessoryKey={accessoryKey}
        disabled={disabled}
        onKeyPress={setLast}
      />
    </View>
  )
}

export default function KeypadDisabled() {
  return <KeyLog accessoryKey="biometric" disabled />
}
