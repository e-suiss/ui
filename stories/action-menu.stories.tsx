import {
  CopyIcon,
  PencilSimpleIcon,
  ShareIcon,
  TrashIcon,
} from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  ActionMenu,
  ActionMenuContent,
  ActionMenuItem,
  ActionMenuLabel,
  ActionMenuSeparator,
  ActionMenuTrigger,
} from "@/components/patterns/action-menu"
import { Button } from "@/components/ui/button"

const meta = {
  title: "Patterns/Action Menu",
  component: ActionMenu,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-svh items-center justify-center">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ActionMenu>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <ActionMenu {...args}>
      <ActionMenuTrigger render={<Button variant="outline" />}>
        Order actions
      </ActionMenuTrigger>
      <ActionMenuContent>
        <ActionMenuLabel>Order #1042</ActionMenuLabel>
        <ActionMenuItem>Edit</ActionMenuItem>
        <ActionMenuItem>Duplicate</ActionMenuItem>
        <ActionMenuItem>Share</ActionMenuItem>
        <ActionMenuSeparator />
        <ActionMenuItem variant="destructive">Delete</ActionMenuItem>
      </ActionMenuContent>
    </ActionMenu>
  ),
}

export const WithIcons: Story = {
  render: (args) => (
    <ActionMenu {...args}>
      <ActionMenuTrigger render={<Button variant="outline" />}>
        Order actions
      </ActionMenuTrigger>
      <ActionMenuContent>
        <ActionMenuItem>
          <PencilSimpleIcon />
          Edit
        </ActionMenuItem>
        <ActionMenuItem>
          <CopyIcon />
          Duplicate
        </ActionMenuItem>
        <ActionMenuItem>
          <ShareIcon />
          Share
        </ActionMenuItem>
        <ActionMenuSeparator />
        <ActionMenuItem variant="destructive">
          <TrashIcon />
          Delete
        </ActionMenuItem>
      </ActionMenuContent>
    </ActionMenu>
  ),
}

export const NotDismissible: Story = {
  ...Default,
  args: { dismissible: false },
}
