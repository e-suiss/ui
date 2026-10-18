import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Text } from "@/components/ui/text"

export default function AvatarFallbackExample() {
  return (
    <Avatar accessibilityLabel="Alan Turing">
      <AvatarFallback>
        <Text>AT</Text>
      </AvatarFallback>
    </Avatar>
  )
}
