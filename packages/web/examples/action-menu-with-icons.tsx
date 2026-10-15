import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
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
            <IconPlaceholder
              lucide="PencilIcon"
              tabler="IconPencil"
              hugeicons="PencilEdit01Icon"
              phosphor="PencilSimpleIcon"
              remixicon="RiPencilLine"
            />
            Edit
          </ActionMenuItem>
          <ActionMenuItem>
            <IconPlaceholder
              lucide="CopyIcon"
              tabler="IconCopy"
              hugeicons="Copy01Icon"
              phosphor="CopyIcon"
              remixicon="RiFileCopyLine"
            />
            Duplicate
          </ActionMenuItem>
          <ActionMenuItem>
            <IconPlaceholder
              lucide="ShareIcon"
              tabler="IconShare2"
              hugeicons="Share01Icon"
              phosphor="ShareIcon"
              remixicon="RiShareForwardBoxLine"
            />
            Share
          </ActionMenuItem>
          <ActionMenuSeparator />
          <ActionMenuItem variant="destructive">
            <IconPlaceholder
              lucide="TrashIcon"
              tabler="IconTrash"
              hugeicons="Delete02Icon"
              phosphor="TrashIcon"
              remixicon="RiDeleteBinLine"
            />
            Delete
          </ActionMenuItem>
        </ActionMenuContent>
      </ActionMenu>
    </div>
  )
}
