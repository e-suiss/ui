import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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

export default function AvatarDemo() {
  return (
    <Avatar>
      <AvatarImage src={people[0].src} alt={people[0].name} />
      <AvatarFallback>{people[0].initials}</AvatarFallback>
    </Avatar>
  )
}
