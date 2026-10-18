import { View } from "react-native"
import { Switch } from "@/components/ui/switch"

export default function SwitchSizes() {
  return (
    <View className="flex-row items-center gap-4">
      <Switch size="sm" defaultChecked accessibilityLabel="Wi-Fi" />
      <Switch defaultChecked accessibilityLabel="Bluetooth" />
    </View>
  )
}
