import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function AvatarPlaceholder() {
  return (
    <div className="flex items-center gap-3">
      <Avatar size="sm">
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
      <Avatar size="default">
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
      <Avatar size="lg">
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
      <Avatar size="xl">
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
    </div>
  )
}
