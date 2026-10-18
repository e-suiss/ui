import { View } from "react-native"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Text } from "@/components/ui/text"

export default function AvatarSizes() {
  return (
    <View className="flex-row items-center gap-4">
      {(["sm", "default", "lg", "xl"] as const).map((size) => (
        <Avatar key={size} size={size}>
          <AvatarImage
            alt="Ada Lovelace"
            source={{ uri: "https://i.pravatar.cc/150?img=5" }}
          />
          <AvatarFallback>
            <Text>AL</Text>
          </AvatarFallback>
        </Avatar>
      ))}
    </View>
  )
}
