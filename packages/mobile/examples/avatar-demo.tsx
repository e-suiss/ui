import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Text } from "@/components/ui/text"

export default function AvatarDemo() {
  return (
    <Avatar>
      <AvatarImage
        alt="Ada Lovelace"
        source={{ uri: "https://i.pravatar.cc/150?img=5" }}
      />
      <AvatarFallback>
        <Text>AL</Text>
      </AvatarFallback>
    </Avatar>
  )
}
