import { View } from "react-native"
import { BottomBar, BottomBarContent } from "@/components/ui/bottom-bar"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"

export default function BottomBarDemo() {
  return (
    <View className="-m-4 flex-1">
      <View className="flex-1 gap-2 p-4">
        <Text variant="h3">Review order</Text>
        <Text variant="muted">2 items, delivery on Thursday.</Text>
      </View>
      <BottomBar>
        <BottomBarContent>
          <Button size="lg" block>
            <Text>Continue</Text>
          </Button>
        </BottomBarContent>
      </BottomBar>
    </View>
  )
}
