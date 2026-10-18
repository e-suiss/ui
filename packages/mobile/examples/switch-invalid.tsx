import { View } from "react-native"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function SwitchInvalid() {
  return (
    <View className="flex-row items-center gap-2">
      <Switch invalid accessibilityLabelledBy="terms-switch" />
      <Label nativeID="terms-switch">Accept terms</Label>
    </View>
  )
}
