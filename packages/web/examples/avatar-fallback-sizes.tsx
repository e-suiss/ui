import { Avatar, AvatarFallback } from "@/components/ui/avatar"

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

export default function AvatarFallbackSizes() {
  return (
    <div className="flex items-center gap-3">
      {(["sm", "default", "lg", "xl"] as const).map((size) => (
        <Avatar key={size} size={size}>
          <AvatarFallback>{people[0].initials}</AvatarFallback>
        </Avatar>
      ))}
    </div>
  )
}
