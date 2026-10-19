import * as React from "react"
import { View } from "react-native"
import { Keypad, type KeypadKeyValue } from "@/components/ui/keypad"
import { Text } from "@/components/ui/text"

export default function KeypadDemo() {
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
      <Keypad onKeyPress={setLast} />
    </View>
  )
}
