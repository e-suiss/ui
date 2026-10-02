import {
  ArrowClockwiseIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  TrashIcon,
} from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

const meta = {
  title: "Components/Context Menu",
  component: ContextMenu,
} satisfies Meta<typeof ContextMenu>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <ContextMenu {...args}>
      <ContextMenuTrigger className="text-muted-foreground flex h-40 w-72 items-center justify-center rounded-2xl border border-dashed text-sm">
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuItem>
            <ArrowLeftIcon />
            Back
            <ContextMenuShortcut>⌘[</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem disabled>
            <ArrowRightIcon />
            Forward
            <ContextMenuShortcut>⌘]</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <ArrowClockwiseIcon />
            Reload
            <ContextMenuShortcut>⌘R</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger>More tools</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>Save page as...</ContextMenuItem>
            <ContextMenuItem>Create shortcut...</ContextMenuItem>
            <ContextMenuItem>Developer tools</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuCheckboxItem defaultChecked>
            Show bookmarks bar
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem>Show full URLs</ContextMenuCheckboxItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuRadioGroup defaultValue="ada">
          <ContextMenuLabel inset>People</ContextMenuLabel>
          <ContextMenuRadioItem value="ada">Ada Lovelace</ContextMenuRadioItem>
          <ContextMenuRadioItem value="alan">Alan Turing</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">
          <TrashIcon />
          Delete
          <ContextMenuShortcut>⌘⌫</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
}

export const OpenByDefault: Story = {
  ...Default,
  args: { defaultOpen: true },
}

export const Inset: Story = {
  render: (args) => (
    <ContextMenu {...args}>
      <ContextMenuTrigger className="text-muted-foreground flex h-40 w-72 items-center justify-center rounded-2xl border border-dashed text-sm">
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
  ),
}
