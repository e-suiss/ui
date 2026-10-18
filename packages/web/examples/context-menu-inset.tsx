import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

export default function ContextMenuInset() {
  return (
    <ContextMenu>
      <ContextMenuTrigger
        tabIndex={0}
        className="text-muted-foreground flex h-40 w-72 items-center justify-center rounded-2xl border border-dashed text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        Right click a file
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuLabel inset>report.pdf</ContextMenuLabel>
          <ContextMenuItem inset>Open</ContextMenuItem>
          <ContextMenuItem inset>Rename</ContextMenuItem>
          <ContextMenuItem inset>Duplicate</ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuItem inset variant="destructive">
          Move to trash
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
