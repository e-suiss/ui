import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  AdaptiveAlert,
  AdaptiveAlertAction,
  AdaptiveAlertCancel,
  AdaptiveAlertContent,
  AdaptiveAlertDescription,
  AdaptiveAlertFooter,
  AdaptiveAlertHeader,
  AdaptiveAlertTitle,
  AdaptiveAlertTrigger,
} from "@/components/patterns/adaptive-alert"
import { Button } from "@/components/ui/button"

const meta = {
  title: "Patterns/Adaptive Alert",
  component: AdaptiveAlert,
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
} satisfies Meta<typeof AdaptiveAlert>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <AdaptiveAlert {...args}>
      <AdaptiveAlertTrigger render={<Button variant="outline" />}>
        Delete order
      </AdaptiveAlertTrigger>
      <AdaptiveAlertContent>
        <AdaptiveAlertHeader>
          <AdaptiveAlertTitle>Delete order?</AdaptiveAlertTitle>
          <AdaptiveAlertDescription>
            Order #1042 will be permanently deleted. This action cannot be
            undone.
          </AdaptiveAlertDescription>
        </AdaptiveAlertHeader>
        <AdaptiveAlertFooter>
          <AdaptiveAlertCancel>Cancel</AdaptiveAlertCancel>
          <AdaptiveAlertAction variant="destructive">
            Delete
          </AdaptiveAlertAction>
        </AdaptiveAlertFooter>
      </AdaptiveAlertContent>
    </AdaptiveAlert>
  ),
}

export const OpenByDefault: Story = {
  ...Default,
  args: { defaultOpen: true },
}
