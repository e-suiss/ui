import { BookmarkSimpleIcon } from "phosphor-react-native"
import * as React from "react"
import { View } from "react-native"
import { Text } from "@/components/ui/text"
import { Toggle, ToggleIcon } from "@/components/ui/toggle"

export default function ToggleWithText() {
  const [pressed, setPressed] = React.useState(false)
  return (
    <View className="flex-row">
      <Toggle
        pressed={pressed}
        onPressedChange={setPressed}
        variant="outline"
        accessibilityLabel="Bookmark"
      >
        <ToggleIcon as={BookmarkSimpleIcon} />
        <Text>Bookmark</Text>
      </Toggle>
    </View>
  )
}
