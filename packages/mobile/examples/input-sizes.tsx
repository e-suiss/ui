import { View } from "react-native"
import { Input } from "@/components/ui/input"

export default function InputSizes() {
  return (
    <View className="gap-3">
      <Input size="sm" placeholder="Small" />
      <Input size="md" placeholder="Medium" />
      <Input placeholder="Default" />
    </View>
  )
}
