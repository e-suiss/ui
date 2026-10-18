import { BottomBar, BottomBarContent } from "@/components/ui/bottom-bar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Screen, ScreenContent } from "@/components/ui/screen"
import { Text } from "@/components/ui/text"

export default function ScreenWithBottomBar() {
  return (
    <Screen className="-m-4">
      <ScreenContent scrollable>
        <Text variant="h2">Your email</Text>
        <Text variant="muted">We will send a code to this address.</Text>
        <Input placeholder="name@example.com" keyboardType="email-address" />
      </ScreenContent>
      <BottomBar separator>
        <BottomBarContent>
          <Button size="lg" block>
            <Text>Continue</Text>
          </Button>
        </BottomBarContent>
      </BottomBar>
    </Screen>
  )
}
