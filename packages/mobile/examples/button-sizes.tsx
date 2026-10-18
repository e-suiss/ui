import { PlusIcon } from "phosphor-react-native"
import { View } from "react-native"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

export default function ButtonSizes() {
  return (
    <View className="gap-3">
      <View className="flex-row flex-wrap items-center gap-3">
        <Button size="xs">
          <Text>Extra small</Text>
        </Button>
        <Button size="sm">
          <Text>Small</Text>
        </Button>
        <Button>
          <Text>Default</Text>
        </Button>
        <Button size="lg">
          <Text>Large</Text>
        </Button>
        <Button size="xl">
          <Text>Extra large</Text>
        </Button>
      </View>
      <View className="flex-row flex-wrap items-center gap-3">
        <Button size="icon-xs" variant="secondary">
          <Icon as={PlusIcon} />
        </Button>
        <Button size="icon-sm" variant="secondary">
          <Icon as={PlusIcon} />
        </Button>
        <Button size="icon" variant="secondary">
          <Icon as={PlusIcon} />
        </Button>
        <Button size="icon-lg" variant="secondary">
          <Icon as={PlusIcon} />
        </Button>
        <Button size="icon-xl" variant="secondary">
          <Icon as={PlusIcon} />
        </Button>
      </View>
    </View>
  )
}
