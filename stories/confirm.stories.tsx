import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  Confirm,
  ConfirmAction,
  ConfirmCancel,
  ConfirmContent,
  ConfirmDescription,
  ConfirmFooter,
  ConfirmHeader,
  ConfirmTitle,
  ConfirmTrigger,
} from "@/components/patterns/confirm"
import { Button } from "@/components/ui/button"

const meta = {
  title: "Patterns/Confirm",
  component: Confirm,
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
} satisfies Meta<typeof Confirm>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Confirm {...args}>
      <ConfirmTrigger render={<Button variant="outline" />}>
        Delete order
      </ConfirmTrigger>
      <ConfirmContent>
        <ConfirmHeader>
          <ConfirmTitle>Delete order?</ConfirmTitle>
          <ConfirmDescription>
            Order #1042 will be permanently deleted. This action cannot be
            undone.
          </ConfirmDescription>
        </ConfirmHeader>
        <ConfirmFooter>
          <ConfirmCancel>Cancel</ConfirmCancel>
          <ConfirmAction variant="destructive">Delete</ConfirmAction>
        </ConfirmFooter>
      </ConfirmContent>
    </Confirm>
  ),
}

export const OpenByDefault: Story = {
  ...Default,
  args: { defaultOpen: true },
}
