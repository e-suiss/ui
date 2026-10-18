import { View } from "react-native"
import { Input } from "@/components/ui/input"
import { KeyboardScrollView } from "@/components/ui/keyboard-scroll-view"
import { Text } from "@/components/ui/text"

const fields = [
  "First name",
  "Last name",
  "Email",
  "Phone",
  "Street",
  "City",
  "Postal code",
  "Country",
  "Company",
  "Notes",
]

export default function KeyboardScrollViewFocused() {
  return (
    <KeyboardScrollView className="-m-4" contentContainerClassName="gap-4 p-4">
      <Text variant="h3">Last field focused</Text>
      {fields.slice(0, -1).map((label) => (
        <View key={label} className="gap-1.5">
          <Text variant="small">{label}</Text>
          <Input placeholder={label} />
        </View>
      ))}
      <View className="gap-1.5">
        <Text variant="small">Notes</Text>
        <Input placeholder="Notes" autoFocus />
      </View>
    </KeyboardScrollView>
  )
}
