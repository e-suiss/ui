import { PlusIcon } from "phosphor-react-native"
import { View } from "react-native"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

export default function ButtonVariants() {
  return (
    <View className="gap-3">
      <Button>
        <Text>Default</Text>
      </Button>
      <Button variant="secondary">
        <Text>Secondary</Text>
      </Button>
      <Button variant="tinted">
        <Text>Tinted</Text>
      </Button>
      <Button variant="outline">
        <Text>Outline</Text>
      </Button>
      <Button variant="ghost">
        <Text>Ghost</Text>
      </Button>
      <Button variant="plain">
        <Text>Plain</Text>
      </Button>
      <Button variant="destructive">
        <Text>Destructive</Text>
      </Button>
      <Button variant="link">
        <Text>Link</Text>
      </Button>
      <Button size="icon" variant="outline">
        <Icon as={PlusIcon} />
      </Button>
    </View>
  )
}
