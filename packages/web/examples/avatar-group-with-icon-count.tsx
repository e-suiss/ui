import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar"

export default function AvatarGroupWithIconCount() {
  return (
    <AvatarGroup>
      <Avatar size="lg">
        <AvatarImage src="https://i.pravatar.cc/128?img=47" alt="Emma Wilson" />
        <AvatarFallback>EW</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarImage src="https://i.pravatar.cc/128?img=12" alt="Liam Carter" />
        <AvatarFallback>LC</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarImage
          src="https://i.pravatar.cc/128?img=32"
          alt="Sofia Martinez"
        />
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>
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
