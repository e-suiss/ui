import * as React from "react"
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Text } from "@/components/ui/text"

export default function ContextMenuDemoExample() {
  const [showBookmarks, setShowBookmarks] = React.useState(true)
  const [showUrls, setShowUrls] = React.useState(false)
  const [person, setPerson] = React.useState("pedro")
  return (
    <ContextMenu>
      <ContextMenuTrigger className="border-border h-36 w-full items-center justify-center rounded-md border border-dashed">
        <Text className="text-sm text-muted-foreground">Long press here</Text>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem inset>
          <Text>Back</Text>
        </ContextMenuItem>
        <ContextMenuItem inset disabled>
          <Text>Forward</Text>
        </ContextMenuItem>
        <ContextMenuItem inset>
          <Text>Reload</Text>
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>
            <Text>More tools</Text>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem>
              <Text>Save page</Text>
            </ContextMenuItem>
            <ContextMenuItem>
              <Text>Create shortcut</Text>
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem variant="destructive">
              <Text>Delete</Text>
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem
          checked={showBookmarks}
          onCheckedChange={setShowBookmarks}
        >
          <Text>Show bookmarks</Text>
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem
          checked={showUrls}
          onCheckedChange={setShowUrls}
        >
          <Text>Show full URLs</Text>
        </ContextMenuCheckboxItem>
        <ContextMenuSeparator />
        <ContextMenuRadioGroup value={person} onValueChange={setPerson}>
          <ContextMenuLabel inset>People</ContextMenuLabel>
          <ContextMenuRadioItem value="pedro">
            <Text>Pedro Duarte</Text>
          </ContextMenuRadioItem>
          <ContextMenuRadioItem value="colm">
            <Text>Colm Tuite</Text>
          </ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuContent>
    </ContextMenu>
  )
}
