import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

export default function AvatarWithBadge() {
  return (
    <div className="flex items-center gap-4">
      <Avatar size="sm">
        <AvatarImage
          src="https://i.pravatar.cc/128?img=32"
          alt="Sofia Martinez"
        />
        <AvatarFallback>SM</AvatarFallback>
        <AvatarBadge className="bg-green-500">
          <IconPlaceholder
            lucide="CheckIcon"
            tabler="IconCheck"
            hugeicons="Tick02Icon"
            phosphor="CheckIcon"
            remixicon="RiCheckLine"
          />
        </AvatarBadge>
      </Avatar>
      <Avatar size="default">
        <AvatarImage
          src="https://i.pravatar.cc/128?img=32"
          alt="Sofia Martinez"
        />
        <AvatarFallback>SM</AvatarFallback>
        <AvatarBadge className="bg-green-500">
          <IconPlaceholder
            lucide="CheckIcon"
            tabler="IconCheck"
            hugeicons="Tick02Icon"
            phosphor="CheckIcon"
            remixicon="RiCheckLine"
          />
        </AvatarBadge>
      </Avatar>
      <Avatar size="lg">
        <AvatarImage
          src="https://i.pravatar.cc/128?img=32"
          alt="Sofia Martinez"
        />
        <AvatarFallback>SM</AvatarFallback>
        <AvatarBadge className="bg-green-500">
          <IconPlaceholder
            lucide="CheckIcon"
            tabler="IconCheck"
            hugeicons="Tick02Icon"
            phosphor="CheckIcon"
            remixicon="RiCheckLine"
          />
        </AvatarBadge>
      </Avatar>
      <Avatar size="xl">
        <AvatarImage
          src="https://i.pravatar.cc/128?img=32"
          alt="Sofia Martinez"
        />
        <AvatarFallback>SM</AvatarFallback>
        <AvatarBadge className="bg-green-500">
          <IconPlaceholder
            lucide="CheckIcon"
            tabler="IconCheck"
            hugeicons="Tick02Icon"
            phosphor="CheckIcon"
            remixicon="RiCheckLine"
          />
        </AvatarBadge>
      </Avatar>
    </div>
  )
}
