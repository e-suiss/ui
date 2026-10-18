import { View } from "react-native"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"

export default function ButtonDisabled() {
  return (
    <View className="items-start gap-3">
      <Button disabled>
        <Text>Default</Text>
      </Button>
      <Button disabled variant="secondary">
        <Text>Secondary</Text>
      </Button>
      <Button disabled variant="tinted">
        <Text>Tinted</Text>
      </Button>
      <Button disabled variant="outline">
        <Text>Outline</Text>
      </Button>
      <Button disabled variant="destructive">
        <Text>Destructive</Text>
      </Button>
    </View>
  )
}
