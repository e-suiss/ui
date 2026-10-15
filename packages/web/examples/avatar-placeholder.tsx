import { UserIcon } from "@phosphor-icons/react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function AvatarPlaceholder() {
  return (
    <div className="flex items-center gap-3">
      {(["sm", "default", "lg", "xl"] as const).map((size) => (
        <Avatar key={size} size={size}>
          <AvatarFallback>
            <UserIcon weight="fill" />
          </AvatarFallback>
        </Avatar>
      ))}
    </div>
  )
}
