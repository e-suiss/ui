import { View } from "react-native"
import { BottomBar, BottomBarContent } from "@/components/ui/bottom-bar"
import { Button } from "@/components/ui/button"
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

export default function KeyboardScrollViewWithBottomBar() {
  return (
    <View className="-m-4 flex-1">
      <KeyboardScrollView contentContainerClassName="gap-4 p-4">
        <Text variant="h3">Shipping address</Text>
        {fields.map((label) => (
          <View key={label} className="gap-1.5">
            <Text variant="small">{label}</Text>
            <Input placeholder={label} />
          </View>
        ))}
      </KeyboardScrollView>
      <BottomBar separator>
        <BottomBarContent>
          <Button size="lg" block>
            <Text>Save address</Text>
          </Button>
        </BottomBarContent>
      </BottomBar>
    </View>
  )
}
