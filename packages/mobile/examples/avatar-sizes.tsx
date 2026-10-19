import { View } from "react-native"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Text } from "@/components/ui/text"

export default function AvatarSizes() {
  return (
    <View className="flex-row items-center gap-4">
      <Avatar size="sm">
        <AvatarImage
          alt="Ada Lovelace"
          source={{ uri: "https://i.pravatar.cc/150?img=5" }}
        />
        <AvatarFallback>
          <Text>AL</Text>
        </AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage
          alt="Ada Lovelace"
          source={{ uri: "https://i.pravatar.cc/150?img=5" }}
        />
        <AvatarFallback>
          <Text>AL</Text>
        </AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarImage
          alt="Ada Lovelace"
          source={{ uri: "https://i.pravatar.cc/150?img=5" }}
        />
        <AvatarFallback>
          <Text>AL</Text>
        </AvatarFallback>
      </Avatar>
      <Avatar size="xl">
        <AvatarImage
          alt="Ada Lovelace"
          source={{ uri: "https://i.pravatar.cc/150?img=5" }}
        />
        <AvatarFallback>
          <Text>AL</Text>
        </AvatarFallback>
      </Avatar>
    </View>
  )
}
