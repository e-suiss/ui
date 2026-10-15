import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
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

export default function AvatarGroupWithIconCount() {
  return (
    <AvatarGroup>
      {people.map((person) => (
        <Avatar key={person.name} size="lg">
          <AvatarImage src={person.src} alt={person.name} />
          <AvatarFallback>{person.initials}</AvatarFallback>
        </Avatar>
      ))}
      <AvatarGroupCount>
        <IconPlaceholder
          lucide="PlusIcon"
          tabler="IconPlus"
          hugeicons="PlusSignIcon"
          phosphor="PlusIcon"
          remixicon="RiAddLine"
        />
      </AvatarGroupCount>
    </AvatarGroup>
  )
}
