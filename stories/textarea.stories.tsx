import type { Meta, StoryObj } from "@storybook/react-vite"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const meta = {
  title: "Components/Textarea",
  component: Textarea,
  args: {
    placeholder: "Type your message here.",
    disabled: false,
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Textarea>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithValue: Story = {
  args: {
    defaultValue:
      "Thanks for the quick turnaround. The new layout looks great on mobile.",
  },
}

export const WithLabel: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="feedback">Feedback</Label>
      <Textarea {...args} id="feedback" placeholder="Tell us what you think." />
    </div>
  ),
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const Invalid: Story = {
  args: {
    "aria-invalid": true,
    defaultValue: "Too short",
  },
}
