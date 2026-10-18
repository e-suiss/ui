import { View } from "react-native"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LabelWithInput() {
  return (
    <View className="gap-2">
      <Label nativeID="label-email">Email</Label>
      <Input
        accessibilityLabelledBy="label-email"
        placeholder="m@example.com"
      />
    </View>
  )
}
