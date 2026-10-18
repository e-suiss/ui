import {
  ContextActions,
  ContextActionsContent,
  ContextActionsItem,
  ContextActionsLabel,
  ContextActionsSeparator,
  ContextActionsTrigger,
} from "@/components/patterns/context-actions"

export default function ContextActionsNotDismissible() {
  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <ContextActions dismissible={false}>
        <ContextActionsTrigger
          tabIndex={0}
          className="flex h-40 w-72 items-center justify-center rounded-2xl border border-dashed text-sm text-muted-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Right click or long press
        </ContextActionsTrigger>
        <ContextActionsContent>
          <ContextActionsLabel>Photo.jpg</ContextActionsLabel>
          <ContextActionsItem>Edit</ContextActionsItem>
          <ContextActionsItem>Duplicate</ContextActionsItem>
          <ContextActionsItem>Share</ContextActionsItem>
          <ContextActionsSeparator />
          <ContextActionsItem variant="destructive">Delete</ContextActionsItem>
        </ContextActionsContent>
      </ContextActions>
    </div>
  )
}
