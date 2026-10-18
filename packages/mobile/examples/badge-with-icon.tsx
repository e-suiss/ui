import { SealCheckIcon, StarIcon } from "phosphor-react-native"
import { View } from "react-native"
import { Badge } from "@/components/ui/badge"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

export default function BadgeWithIcon() {
  return (
    <View className="flex-row flex-wrap gap-2">
      <Badge variant="secondary">
        <Icon as={SealCheckIcon} />
        <Text>Verified</Text>
      </Badge>
      <Badge variant="outline">
        <Icon as={StarIcon} />
        <Text>Featured</Text>
      </Badge>
      <Badge variant="outline" className="min-w-5 px-1">
        <Text>8</Text>
      </Badge>
    </View>
  )
}
