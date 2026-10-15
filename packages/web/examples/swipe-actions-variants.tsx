import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import {
  SwipeAction,
  SwipeActions,
  SwipeActionsActions,
  SwipeActionsContent,
} from "@/components/interactions/swipe-actions"

export default function SwipeActionsVariants() {
  return (
    <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border">
      <SwipeActions>
        <SwipeActionsContent className="px-4 py-3">
          Swipe to see every action style
        </SwipeActionsContent>
        <SwipeActionsActions>
          <SwipeAction>
            <IconPlaceholder
              lucide="FlagIcon"
              tabler="IconFlag"
              hugeicons="Flag01Icon"
              phosphor="FlagIcon"
              remixicon="RiFlagLine"
              className="fill-current"
            />
            Flag
          </SwipeAction>
          <SwipeAction variant="neutral">
            <IconPlaceholder
              lucide="BellOffIcon"
              tabler="IconBellOff"
              hugeicons="NotificationOff01Icon"
              phosphor="BellSlashIcon"
              remixicon="RiNotificationOffLine"
            />
            Mute
          </SwipeAction>
          <SwipeAction variant="archive">
            <IconPlaceholder
              lucide="ArchiveIcon"
              tabler="IconArchive"
              hugeicons="Archive02Icon"
              phosphor="ArchiveIcon"
              remixicon="RiArchiveLine"
            />
            Archive
          </SwipeAction>
          <SwipeAction variant="destructive">
            <IconPlaceholder
              lucide="TrashIcon"
              tabler="IconTrash"
              hugeicons="Delete02Icon"
              phosphor="TrashIcon"
              remixicon="RiDeleteBinLine"
            />
            Delete
          </SwipeAction>
        </SwipeActionsActions>
      </SwipeActions>
    </div>
  )
}
