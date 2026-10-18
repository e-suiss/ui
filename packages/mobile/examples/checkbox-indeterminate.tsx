import { View } from "react-native"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function CheckboxIndeterminate() {
  return (
    <View className="flex-row items-center gap-3">
      <Checkbox
        indeterminate
        checked={false}
        onCheckedChange={() => undefined}
        accessibilityLabelledBy="select-all"
      />
      <Label nativeID="select-all">Select all</Label>
    </View>
  )
}
