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

export default function AvatarSizes() {
  return (
    <div className="flex items-center gap-3">
      {(["sm", "default", "lg", "xl"] as const).map((size) => (
        <Avatar key={size} size={size}>
          <AvatarImage src={people[1].src} alt={people[1].name} />
          <AvatarFallback>{people[1].initials}</AvatarFallback>
        </Avatar>
      ))}
    </div>
  )
}
