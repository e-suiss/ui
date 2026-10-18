import { View } from "react-native"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function CheckboxDisabled() {
  return (
    <View className="gap-4">
      <View className="flex-row items-center gap-3">
        <Checkbox disabled checked={false} onCheckedChange={() => undefined} />
        <Label disabled>Unchecked</Label>
      </View>
      <View className="flex-row items-center gap-3">
        <Checkbox disabled checked onCheckedChange={() => undefined} />
        <Label disabled>Checked</Label>
      </View>
    </View>
  )
}
