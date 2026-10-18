import { View } from "react-native"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"

export default function ButtonDemo() {
  return (
    <View className="items-start">
      <Button>
        <Text>Button</Text>
      </Button>
    </View>
  )
}
