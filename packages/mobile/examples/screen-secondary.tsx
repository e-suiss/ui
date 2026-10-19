import { View } from "react-native"
import { Screen, ScreenContent } from "@/components/ui/screen"
import { Text } from "@/components/ui/text"

export default function ScreenSecondary() {
  return (
    <Screen variant="secondary" className="-m-4">
      <ScreenContent>
        <Text variant="h2">Settings</Text>
        <View className="overflow-hidden rounded-2xl bg-background">
          <View className="px-4 py-3">
            <Text>General</Text>
          </View>
          <View className="border-t border-border px-4 py-3">
            <Text>Privacy</Text>
          </View>
          <View className="border-t border-border px-4 py-3">
            <Text>Notifications</Text>
          </View>
        </View>
      </ScreenContent>
    </Screen>
  )
}
