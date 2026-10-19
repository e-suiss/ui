import { StarIcon } from "phosphor-react-native"
import { View } from "react-native"
import { Chip } from "@/components/ui/chip"
import { Text } from "@/components/ui/text"

export default function ChipSizes() {
  return (
    <View className="gap-4">
      <View className="gap-2">
        <Text variant="muted">Default</Text>
        <View className="flex-row gap-2">
          <Chip icon={StarIcon}>Top rated</Chip>
          <Chip icon={StarIcon} defaultSelected>
            Top rated
          </Chip>
          <Chip onRemove={() => undefined}>Nearby</Chip>
        </View>
      </View>
      <View className="gap-2">
        <Text variant="muted">Small</Text>
        <View className="flex-row gap-2">
          <Chip size="sm" icon={StarIcon}>
            Top rated
          </Chip>
          <Chip size="sm" icon={StarIcon} defaultSelected>
            Top rated
          </Chip>
          <Chip size="sm" onRemove={() => undefined}>
            Nearby
          </Chip>
        </View>
      </View>
    </View>
  )
}
