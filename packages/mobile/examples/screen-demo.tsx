import { View } from "react-native"
import { Screen, ScreenContent } from "@/components/ui/screen"
import { Text } from "@/components/ui/text"

function Rows({ count = 4 }: { count?: number }) {
  return (
    <View className="overflow-hidden rounded-2xl bg-muted">
      {Array.from({ length: count }, (_, index) => `Row ${index + 1}`).map(
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
  )
}

export default function ScreenDemo() {
  return (
    <Screen className="-m-4">
      <ScreenContent>
        <Text variant="h2">Account</Text>
        <Text variant="muted">
          The screen pads every safe-area edge and sets the status bar style
          from the color scheme.
        </Text>
        <Rows />
      </ScreenContent>
    </Screen>
  )
}
