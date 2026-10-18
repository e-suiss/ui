import { StarIcon } from "phosphor-react-native"
import { View } from "react-native"
import { Icon } from "@/components/ui/icon"

export default function IconWeights() {
  return (
    <View className="flex-row items-center gap-4">
      <Icon as={StarIcon} className="size-6" weight="thin" />
      <Icon as={StarIcon} className="size-6" weight="light" />
      <Icon as={StarIcon} className="size-6" weight="regular" />
      <Icon as={StarIcon} className="size-6" weight="bold" />
      <Icon as={StarIcon} className="size-6" weight="fill" />
      <Icon as={StarIcon} className="size-6" weight="duotone" />
    </View>
  )
}
