import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"

const meta = {
  title: "Components/Progress",
  component: Progress,
  args: {
    value: 60,
  },
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 100, step: 1 },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Progress>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithLabel: Story = {
  args: { value: 42 },
  render: (args) => (
    <Progress {...args}>
      <ProgressLabel>Uploading files</ProgressLabel>
      <ProgressValue />
    </Progress>
  ),
}

export const Complete: Story = {
  ...WithLabel,
  args: { value: 100 },
}

export const Indeterminate: Story = {
  args: { value: null },
  render: (args) => (
    <Progress {...args}>
      <ProgressLabel>Preparing export</ProgressLabel>
    </Progress>
  ),
}
