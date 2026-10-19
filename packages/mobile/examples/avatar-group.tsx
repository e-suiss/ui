import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar"
import { Text } from "@/components/ui/text"

export default function AvatarGroupExample() {
  return (
    <AvatarGroup>
      <Avatar>
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
          alt="Alan Turing"
          source={{ uri: "https://i.pravatar.cc/150?img=12" }}
        />
        <AvatarFallback>
          <Text>AT</Text>
        </AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage
          alt="Grace Hopper"
          source={{ uri: "https://i.pravatar.cc/150?img=47" }}
        />
        <AvatarFallback>
          <Text>GH</Text>
        </AvatarFallback>
      </Avatar>
      <AvatarGroupCount accessibilityLabel="4 more">
        <Text>+4</Text>
      </AvatarGroupCount>
    </AvatarGroup>
  )
}
