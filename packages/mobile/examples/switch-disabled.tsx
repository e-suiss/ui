import { View } from "react-native"
import { Switch } from "@/components/ui/switch"

export default function SwitchDisabled() {
  return (
    <View className="gap-4">
      <Switch disabled checked={false} onCheckedChange={() => undefined} />
      <Switch disabled checked onCheckedChange={() => undefined} />
    </View>
  )
}
