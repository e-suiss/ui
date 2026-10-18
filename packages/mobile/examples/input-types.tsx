import { View } from "react-native"
import { Input } from "@/components/ui/input"

export default function InputTypes() {
  return (
    <View className="gap-3">
      <Input placeholder="Text" />
      <Input
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input placeholder="Password" secureTextEntry />
      <Input placeholder="Number" keyboardType="number-pad" />
      <Input placeholder="Search" inputMode="search" />
    </View>
  )
}
