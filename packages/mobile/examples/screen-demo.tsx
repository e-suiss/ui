import { View } from "react-native"
import { Screen, ScreenContent } from "@/components/ui/screen"
import { Text } from "@/components/ui/text"

export default function ScreenDemo() {
  return (
    <Screen className="-m-4">
      <ScreenContent>
        <Text variant="h2">Account</Text>
        <Text variant="muted">
          The screen pads every safe-area edge and sets the status bar style
          from the color scheme.
        </Text>
        <View className="overflow-hidden rounded-2xl bg-muted">
          <View className="px-4 py-3">
            <Text>Row 1</Text>
          </View>
          <View className="border-t border-border px-4 py-3">
            <Text>Row 2</Text>
          </View>
          <View className="border-t border-border px-4 py-3">
            <Text>Row 3</Text>
          </View>
          <View className="border-t border-border px-4 py-3">
            <Text>Row 4</Text>
          </View>
        </View>
      </ScreenContent>
    </Screen>
  )
}
