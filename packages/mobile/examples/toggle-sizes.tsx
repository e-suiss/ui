import { TextBIcon } from "phosphor-react-native"
import { View } from "react-native"
import { Toggle, ToggleIcon } from "@/components/ui/toggle"

export default function ToggleSizes() {
  return (
    <View className="flex-row items-center gap-2">
      <Toggle size="sm" variant="outline" accessibilityLabel="Small">
        <ToggleIcon as={TextBIcon} />
      </Toggle>
      <Toggle variant="outline" accessibilityLabel="Default">
        <ToggleIcon as={TextBIcon} />
      </Toggle>
      <Toggle size="lg" variant="outline" accessibilityLabel="Large">
        <ToggleIcon as={TextBIcon} />
      </Toggle>
    </View>
  )
}
