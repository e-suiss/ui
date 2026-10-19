import { TextItalicIcon } from "phosphor-react-native"
import { View } from "react-native"
import { Toggle, ToggleIcon } from "@/components/ui/toggle"

export default function ToggleVariants() {
  return (
    <View className="flex-row gap-2">
      <Toggle accessibilityLabel="Toggle italic">
        <ToggleIcon as={TextItalicIcon} />
      </Toggle>
      <Toggle variant="outline" accessibilityLabel="Toggle italic">
        <ToggleIcon as={TextItalicIcon} />
      </Toggle>
    </View>
  )
}
