import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function AvatarPlaceholder() {
  return (
    <div className="flex items-center gap-3">
      {(["sm", "default", "lg", "xl"] as const).map((size) => (
        <Avatar key={size} size={size}>
          <AvatarFallback>
            <IconPlaceholder
              lucide="UserIcon"
              tabler="IconUser"
              hugeicons="UserIcon"
              phosphor="UserIcon"
              remixicon="RiUserLine"
              className="fill-current"
            />
          </AvatarFallback>
        </Avatar>
      ))}
    </div>
  )
}
