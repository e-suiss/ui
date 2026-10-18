import { View } from "react-native"
import { BottomBar, BottomBarContent } from "@/components/ui/bottom-bar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Text } from "@/components/ui/text"

export default function BottomBarAboveKeyboard() {
  return (
    <View className="-m-4 flex-1">
      <View className="flex-1 gap-3 p-4">
        <Text variant="h3">Promo code</Text>
        <Input placeholder="Enter code" autoFocus autoCapitalize="characters" />
      </View>
      <BottomBar separator>
        <BottomBarContent>
          <Button size="lg" block>
            <Text>Apply</Text>
          </Button>
        </BottomBarContent>
      </BottomBar>
    </View>
  )
}
