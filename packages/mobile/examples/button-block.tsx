import { View } from "react-native"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"

export default function ButtonBlock() {
  return (
    <View className="gap-3">
      <Button block size="lg">
        <Text>Continue</Text>
      </Button>
      <Button block size="lg" variant="secondary">
        <Text>Not now</Text>
      </Button>
      <Button block variant="tinted">
        <Text>Learn more</Text>
      </Button>
    </View>
  )
}
