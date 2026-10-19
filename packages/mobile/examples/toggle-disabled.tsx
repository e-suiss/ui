import { TextBIcon, TextItalicIcon } from "phosphor-react-native"
import { View } from "react-native"
import { Toggle, ToggleIcon } from "@/components/ui/toggle"

export default function ToggleDisabled() {
  return (
    <View className="flex-row gap-2">
      <Toggle disabled accessibilityLabel="Toggle bold">
        <ToggleIcon as={TextBIcon} />
      </Toggle>
      <Toggle
        disabled
        defaultPressed
        variant="outline"
        accessibilityLabel="Toggle italic"
      >
        <ToggleIcon as={TextItalicIcon} />
      </Toggle>
    </View>
  )
}
