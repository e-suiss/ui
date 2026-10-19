import { TextBIcon } from "phosphor-react-native"
import * as React from "react"
import { View } from "react-native"
import { Toggle, ToggleIcon } from "@/components/ui/toggle"

export default function TogglePressed() {
  const [pressed, setPressed] = React.useState(true)
  return (
    <View className="flex-row">
      <Toggle
        pressed={pressed}
        onPressedChange={setPressed}
        accessibilityLabel="Toggle bold"
      >
        <ToggleIcon as={TextBIcon} />
      </Toggle>
    </View>
  )
}
