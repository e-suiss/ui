import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import {
  ContextActions,
  ContextActionsContent,
  ContextActionsItem,
  ContextActionsSeparator,
  ContextActionsTrigger,
} from "@/components/patterns/context-actions"

export default function ContextActionsWithIcons() {
  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <ContextActions>
        <ContextActionsTrigger className="flex h-40 w-72 items-center justify-center rounded-2xl border border-dashed text-sm text-muted-foreground">
          Right click or long press
        </ContextActionsTrigger>
        <ContextActionsContent>
          <ContextActionsItem>
            <IconPlaceholder
              lucide="PencilIcon"
              tabler="IconPencil"
              hugeicons="PencilEdit01Icon"
              phosphor="PencilSimpleIcon"
              remixicon="RiPencilLine"
            />
            Edit
          </ContextActionsItem>
          <ContextActionsItem>
            <IconPlaceholder
              lucide="CopyIcon"
              tabler="IconCopy"
              hugeicons="Copy01Icon"
              phosphor="CopyIcon"
              remixicon="RiFileCopyLine"
            />
            Duplicate
          </ContextActionsItem>
          <ContextActionsItem>
            <IconPlaceholder
              lucide="ShareIcon"
              tabler="IconShare2"
              hugeicons="Share01Icon"
              phosphor="ShareIcon"
              remixicon="RiShareForwardBoxLine"
            />
            Share
          </ContextActionsItem>
          <ContextActionsSeparator />
          <ContextActionsItem variant="destructive">
            <IconPlaceholder
              lucide="TrashIcon"
              tabler="IconTrash"
              hugeicons="Delete02Icon"
              phosphor="TrashIcon"
              remixicon="RiDeleteBinLine"
            />
            Delete
          </ContextActionsItem>
        </ContextActionsContent>
      </ContextActions>
    </div>
  )
}
