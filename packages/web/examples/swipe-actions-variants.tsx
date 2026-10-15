import {
  ArchiveIcon,
  BellSlashIcon,
  FlagIcon,
  TrashIcon,
} from "@phosphor-icons/react"
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
            <FlagIcon weight="fill" />
            Flag
          </SwipeAction>
          <SwipeAction variant="neutral">
            <BellSlashIcon weight="fill" />
            Mute
          </SwipeAction>
          <SwipeAction variant="archive">
            <ArchiveIcon weight="fill" />
            Archive
          </SwipeAction>
          <SwipeAction variant="destructive">
            <TrashIcon weight="fill" />
            Delete
          </SwipeAction>
        </SwipeActionsActions>
      </SwipeActions>
    </div>
  )
}
