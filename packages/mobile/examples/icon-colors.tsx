import {
  GearIcon,
  HeartIcon,
  InfoIcon,
  WarningIcon,
} from "phosphor-react-native"
import { View } from "react-native"
import { Icon } from "@/components/ui/icon"

export default function IconColors() {
  return (
    <View className="flex-row items-center gap-4">
      <Icon as={InfoIcon} />
      <Icon as={GearIcon} className="text-muted-foreground" />
      <Icon as={HeartIcon} className="text-primary" weight="fill" />
      <Icon as={WarningIcon} className="text-destructive" />
    </View>
  )
}
