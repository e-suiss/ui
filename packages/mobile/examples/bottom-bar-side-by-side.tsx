import { View } from "react-native"
import { BottomBar, BottomBarContent } from "@/components/ui/bottom-bar"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"

export default function BottomBarSideBySide() {
  return (
    <View className="-m-4 flex-1">
      <View className="flex-1 gap-2 p-4">
        <Text variant="h3">Review order</Text>
        <Text variant="muted">2 items, delivery on Thursday.</Text>
      </View>
      <BottomBar separator>
        <BottomBarContent className="flex-row">
          <Button size="lg" variant="secondary" block className="flex-1">
            <Text>Back</Text>
          </Button>
          <Button size="lg" block className="flex-1">
            <Text>Next</Text>
          </Button>
        </BottomBarContent>
      </BottomBar>
    </View>
  )
}
