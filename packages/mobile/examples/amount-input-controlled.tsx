import * as React from "react"
import { View } from "react-native"
import { AmountInput } from "@/components/ui/amount-input"
import { Text } from "@/components/ui/text"

function ControlledDemo() {
  const [value, setValue] = React.useState("")
  const [amount, setAmount] = React.useState(0)
  return (
    <View className="items-center gap-4">
      <AmountInput
        currency="USD"
        locale="en-US"
        value={value}
        onValueChange={(next, nextAmount) => {
          setValue(next)
          setAmount(nextAmount)
        }}
      />
      <Text className="text-sm text-muted-foreground">
        {`value "${value}" · amount ${amount}`}
      </Text>
    </View>
  )
}

export default function AmountInputControlled() {
  return <ControlledDemo />
}
