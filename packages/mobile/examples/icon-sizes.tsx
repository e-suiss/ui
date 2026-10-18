import { BellIcon } from "phosphor-react-native"
import { View } from "react-native"
import { Icon } from "@/components/ui/icon"

export default function IconSizes() {
  return (
    <View className="flex-row items-center gap-4">
      <Icon as={BellIcon} className="size-4" />
      <Icon as={BellIcon} />
      <Icon as={BellIcon} className="size-6" />
      <Icon as={BellIcon} className="size-8" />
    </View>
  )
}
