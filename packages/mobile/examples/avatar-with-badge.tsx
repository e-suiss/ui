import { CheckIcon } from "phosphor-react-native"
import { View } from "react-native"
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

export default function AvatarWithBadge() {
  return (
    <View className="flex-row items-center gap-4">
      {(["sm", "default", "lg", "xl"] as const).map((size) => (
        <Avatar key={size} size={size}>
          <AvatarImage
            alt="Alan Turing"
            source={{ uri: "https://i.pravatar.cc/150?img=12" }}
          />
          <AvatarFallback>
            <Text>AT</Text>
          </AvatarFallback>
          <AvatarBadge>
            <Icon as={CheckIcon} weight="bold" />
          </AvatarBadge>
        </Avatar>
      ))}
    </View>
  )
}
