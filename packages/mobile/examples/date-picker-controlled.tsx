import * as React from "react"
import { View } from "react-native"
import { DatePicker } from "@/components/patterns/date-picker"
import { Text } from "@/components/ui/text"

export default function DatePickerControlled() {
  const [value, setValue] = React.useState<Date | null>(new Date(2026, 9, 4))

  return (
    <View className="items-start gap-2">
      <DatePicker
        accessibilityLabel="Date"
        value={value}
        onValueChange={setValue}
      />
      <Text className="text-sm text-muted-foreground">
        Selected: {value ? value.toDateString() : "none"}
      </Text>
    </View>
  )
}
