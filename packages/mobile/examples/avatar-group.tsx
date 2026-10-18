import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar"
import { Text } from "@/components/ui/text"

const people = [
  {
    name: "Ada Lovelace",
    initials: "AL",
    uri: "https://i.pravatar.cc/150?img=5",
  },
  {
    name: "Alan Turing",
    initials: "AT",
    uri: "https://i.pravatar.cc/150?img=12",
  },
  {
    name: "Grace Hopper",
    initials: "GH",
    uri: "https://i.pravatar.cc/150?img=47",
  },
]

export default function AvatarGroupExample() {
  return (
    <AvatarGroup>
      {people.map((person) => (
        <Avatar key={person.name}>
          <AvatarImage alt={person.name} source={{ uri: person.uri }} />
          <AvatarFallback>
            <Text>{person.initials}</Text>
          </AvatarFallback>
        </Avatar>
      ))}
      <AvatarGroupCount accessibilityLabel="4 more">
        <Text>+4</Text>
      </AvatarGroupCount>
    </AvatarGroup>
  )
}
