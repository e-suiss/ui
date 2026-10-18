import { View } from "react-native"
import { Picker, PickerItem } from "@/components/patterns/picker"

export default function PickerStates() {
  return (
    <View className="gap-3">
      <Picker defaultValue="banana" size="sm" className="w-56">
        <PickerItem value="cherry">Cherry</PickerItem>
        <PickerItem value="banana">Banana</PickerItem>
      </Picker>
      <Picker placeholder="Invalid" invalid className="w-56">
        <PickerItem value="cherry">Cherry</PickerItem>
      </Picker>
      <Picker placeholder="Disabled" disabled className="w-56">
        <PickerItem value="cherry">Cherry</PickerItem>
      </Picker>
    </View>
  )
}
