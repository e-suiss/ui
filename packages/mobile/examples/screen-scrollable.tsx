import { View } from "react-native"
import { Screen, ScreenContent } from "@/components/ui/screen"
import { Text } from "@/components/ui/text"

export default function ScreenScrollable() {
  return (
    <Screen className="-m-4">
      <ScreenContent scrollable>
        <Text variant="h2">Long content</Text>
        <View className="overflow-hidden rounded-2xl bg-muted">
          {Array.from({ length: 24 }, (_, index) => `Row ${index + 1}`).map(
            (label, index) => (
              <View
                key={label}
                className={
                  index > 0 ? "border-t border-border px-4 py-3" : "px-4 py-3"
                }
              >
                <Text>{label}</Text>
              </View>
            )
          )}
        </View>
      </ScreenContent>
    </Screen>
  )
}
