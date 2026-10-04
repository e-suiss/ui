import {
  CopyIcon,
  PencilSimpleIcon,
  ShareIcon,
  TrashIcon,
} from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  ContextActions,
  ContextActionsContent,
  ContextActionsItem,
  ContextActionsLabel,
  ContextActionsSeparator,
  ContextActionsTrigger,
} from "@/components/patterns/context-actions"

const meta = {
  title: "Patterns/Context Actions",
  component: ContextActions,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-svh items-center justify-center p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ContextActions>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <ContextActions {...args}>
      <ContextActionsTrigger className="flex h-40 w-72 items-center justify-center rounded-2xl border border-dashed text-sm text-label-secondary">
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
  ),
}

export const WithIcons: Story = {
  render: (args) => (
    <ContextActions {...args}>
      <ContextActionsTrigger className="flex h-40 w-72 items-center justify-center rounded-2xl border border-dashed text-sm text-label-secondary">
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
  ),
}

export const NotDismissible: Story = {
  ...Default,
  args: { dismissible: false },
}
