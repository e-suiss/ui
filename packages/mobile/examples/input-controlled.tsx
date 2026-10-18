import * as React from "react"
import { View } from "react-native"
import { Input } from "@/components/ui/input"
import { Text } from "@/components/ui/text"

function ControlledDemo() {
  const [value, setValue] = React.useState("")
  return (
    <View className="gap-2">
      <Input
        placeholder="Lowercase only"
        autoCapitalize="none"
        value={value}
        onValueChange={(next) => setValue(next.toLowerCase())}
      />
      <Text variant="muted">Value: {value}</Text>
    </View>
  )
}

export default function InputControlled() {
  return <ControlledDemo />
}
