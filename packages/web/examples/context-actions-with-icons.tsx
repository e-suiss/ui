import {
  CopyIcon,
  PencilSimpleIcon,
  ShareIcon,
  TrashIcon,
} from "@phosphor-icons/react"
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
            <PencilSimpleIcon />
            Edit
          </ContextActionsItem>
          <ContextActionsItem>
            <CopyIcon />
            Duplicate
          </ContextActionsItem>
          <ContextActionsItem>
            <ShareIcon />
            Share
          </ContextActionsItem>
          <ContextActionsSeparator />
          <ContextActionsItem variant="destructive">
            <TrashIcon />
            Delete
          </ContextActionsItem>
        </ContextActionsContent>
      </ContextActions>
    </div>
  )
}
