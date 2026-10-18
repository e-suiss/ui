import { View } from "react-native"
import { BottomBar, BottomBarContent } from "@/components/ui/bottom-bar"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"

function Page({ children }: { children: React.ReactNode }) {
  return (
    <View className="-m-4 flex-1">
      <View className="flex-1 gap-2 p-4">
        <Text variant="h3">Review order</Text>
        <Text variant="muted">2 items, delivery on Thursday.</Text>
      </View>
      {children}
    </View>
  )
}

export default function BottomBarTwoActions() {
  return (
    <Page>
      <BottomBar separator>
        <BottomBarContent>
          <Button size="lg" block>
            <Text>Place order</Text>
          </Button>
          <Button size="lg" variant="plain" block>
            <Text>Save for later</Text>
          </Button>
        </BottomBarContent>
      </BottomBar>
    </Page>
  )
}
