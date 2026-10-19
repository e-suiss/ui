import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Text } from "@/components/ui/text"

export default function ContextMenuSimple() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="border-border h-36 w-full items-center justify-center rounded-md border border-dashed">
        <Text className="text-sm text-muted-foreground">Long press here</Text>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem>
          <Text>Profile</Text>
        </ContextMenuItem>
        <ContextMenuItem>
          <Text>Billing</Text>
        </ContextMenuItem>
        <ContextMenuItem>
          <Text>Team</Text>
        </ContextMenuItem>
        <ContextMenuItem>
          <Text>Subscription</Text>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
