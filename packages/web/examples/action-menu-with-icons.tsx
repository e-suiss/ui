import {
  CopyIcon,
  PencilSimpleIcon,
  ShareIcon,
  TrashIcon,
} from "@phosphor-icons/react"
import {
  ActionMenu,
  ActionMenuContent,
  ActionMenuItem,
  ActionMenuSeparator,
  ActionMenuTrigger,
} from "@/components/patterns/action-menu"
import { Button } from "@/components/ui/button"

export default function ActionMenuWithIcons() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <ActionMenu>
        <ActionMenuTrigger render={<Button variant="outline" />}>
          Order actions
        </ActionMenuTrigger>
        <ActionMenuContent>
          <ActionMenuItem>
            <PencilSimpleIcon />
            Edit
          </ActionMenuItem>
          <ActionMenuItem>
            <CopyIcon />
            Duplicate
          </ActionMenuItem>
          <ActionMenuItem>
            <ShareIcon />
            Share
          </ActionMenuItem>
          <ActionMenuSeparator />
          <ActionMenuItem variant="destructive">
            <TrashIcon />
            Delete
          </ActionMenuItem>
        </ActionMenuContent>
      </ActionMenu>
    </div>
  )
}
