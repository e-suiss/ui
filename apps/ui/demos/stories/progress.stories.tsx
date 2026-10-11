// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect } from "storybook/test"

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

export const Default: Story = {
  args: { "aria-label": "Upload progress" },
  play: async ({ canvas, step }) => {
    await step("exposes the current value", async () => {
      await expect(
        canvas.getByRole("progressbar", { name: "Upload progress" })
      ).toHaveAttribute("aria-valuenow", "60")
    })
  },
}

export const WithLabel: Story = {
  args: { value: 42 },
  render: (args) => (
    <Progress {...args}>
      <ProgressLabel>Uploading files</ProgressLabel>
      <ProgressValue />
    </Progress>
  ),
  play: async ({ canvas, step }) => {
    await step("names the bar and shows the value", async () => {
      const bar = canvas.getByRole("progressbar", { name: "Uploading files" })
      await expect(bar).toHaveAttribute("aria-valuenow", "42")
      await expect(bar).toHaveTextContent("42")
    })
  },
}

export const Complete: Story = {
  args: { value: 100 },
  render: WithLabel.render,
  play: async ({ canvas, step }) => {
    await step("reports a full bar", async () => {
      const bar = canvas.getByRole("progressbar", { name: "Uploading files" })
      await expect(bar).toHaveAttribute("aria-valuenow", "100")
      await expect(bar).toHaveTextContent("100")
    })
  },
}

export const Indeterminate: Story = {
  args: { value: null },
  render: (args) => (
    <Progress {...args}>
      <ProgressLabel>Preparing export</ProgressLabel>
    </Progress>
  ),
  play: async ({ canvas, step }) => {
    await step("omits the value while indeterminate", async () => {
      await expect(
        canvas.getByRole("progressbar", { name: "Preparing export" })
      ).not.toHaveAttribute("aria-valuenow")
    })
  },
}
