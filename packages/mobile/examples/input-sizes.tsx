import { View } from "react-native"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Text } from "@/components/ui/text"

export default function InputSizes() {
  return (
    <View className="gap-3">
      <Input size="sm" placeholder="Small" />
      <Input size="md" placeholder="Medium" />
      <Input placeholder="Default" />
      <View className="flex-row items-center gap-2">
        <Input size="lg" placeholder="Large" className="flex-1" />
        <Button size="form">
          <Text>Save</Text>
        </Button>
      </View>
    </View>
  )
}
