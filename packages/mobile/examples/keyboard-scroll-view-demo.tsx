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

function Fields() {
  return fields.map((label) => (
    <View key={label} className="gap-1.5">
      <Text variant="small">{label}</Text>
      <Input placeholder={label} />
    </View>
  ))
}

export default function KeyboardScrollViewDemo() {
  return (
    <KeyboardScrollView className="-m-4" contentContainerClassName="gap-4 p-4">
      <Text variant="h3">Shipping address</Text>
      <Fields />
    </KeyboardScrollView>
  )
}
