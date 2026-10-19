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
      <Avatar size="sm">
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
      <Avatar>
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
      <Avatar size="lg">
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
      <Avatar size="xl">
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
    </View>
  )
}
