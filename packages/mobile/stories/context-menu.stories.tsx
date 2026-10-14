import type { Meta, StoryObj } from "@storybook/react-native"
import * as React from "react"
import { View } from "react-native"
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

function TriggerArea() {
  return (
    <ContextMenuTrigger className="border-separator h-36 w-full items-center justify-center rounded-md border border-dashed">
      <Text className="text-sm text-label-secondary">Long press here</Text>
    </ContextMenuTrigger>
  )
}

function ContextMenuDemo({ defaultOpen }: { defaultOpen?: boolean }) {
  const [showBookmarks, setShowBookmarks] = React.useState(true)
  const [showUrls, setShowUrls] = React.useState(false)
  const [person, setPerson] = React.useState("pedro")
  return (
    <ContextMenu defaultOpen={defaultOpen}>
      <TriggerArea />
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

const meta = {
  title: "Components/Context Menu",
  component: ContextMenu,
} satisfies Meta<typeof ContextMenu>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <ContextMenuDemo />,
}

export const Simple: Story = {
  render: () => (
    <View>
      <ContextMenu>
        <TriggerArea />
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
    </View>
  ),
}

export const OpenByDefault: Story = {
  render: () => <ContextMenuDemo defaultOpen />,
}
