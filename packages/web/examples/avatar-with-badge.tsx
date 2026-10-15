import { CheckIcon } from "@phosphor-icons/react"
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

const people = [
  {
    name: "Emma Wilson",
    initials: "EW",
    src: "https://i.pravatar.cc/128?img=47",
  },
  {
    name: "Liam Carter",
    initials: "LC",
    src: "https://i.pravatar.cc/128?img=12",
  },
  {
    name: "Sofia Martinez",
    initials: "SM",
    src: "https://i.pravatar.cc/128?img=32",
  },
] as const

export default function AvatarWithBadge() {
  return (
    <div className="flex items-center gap-4">
      {(["sm", "default", "lg", "xl"] as const).map((size) => (
        <Avatar key={size} size={size}>
          <AvatarImage src={people[2].src} alt={people[2].name} />
          <AvatarFallback>{people[2].initials}</AvatarFallback>
          <AvatarBadge className="bg-success">
            <CheckIcon weight="bold" />
          </AvatarBadge>
        </Avatar>
      ))}
    </div>
  )
}
