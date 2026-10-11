// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect } from "storybook/test"

import { Separator } from "@/components/ui/separator"

const meta = {
  title: "Components/Separator",
  component: Separator,
  args: {
    orientation: "horizontal",
  },
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
  },
} satisfies Meta<typeof Separator>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className="w-72">
      <div className="flex flex-col gap-1">
        <h4 className="text-sm font-medium">Account settings</h4>
        <p className="text-label-secondary text-sm">
          Manage your profile and preferences.
        </p>
      </div>
      <Separator {...args} className="my-4" />
      <div className="flex h-5 items-center gap-4 text-sm">
        <span>Profile</span>
        <Separator orientation="vertical" />
        <span>Billing</span>
        <Separator orientation="vertical" />
        <span>Security</span>
      </div>
    </div>
  ),
  play: async ({ canvas, step }) => {
    await step("exposes each separator with its orientation", async () => {
      const separators = canvas.getAllByRole("separator")
      await expect(separators).toHaveLength(3)
      await expect(separators[0]).toHaveAttribute(
        "aria-orientation",
        "horizontal"
      )
      await expect(separators[1]).toHaveAttribute(
        "aria-orientation",
        "vertical"
      )
    })
  },
}

export const Horizontal: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-3 text-sm">
      <span>Recent activity</span>
      <Separator {...args} />
      <span>Archived items</span>
    </div>
  ),
}

export const Vertical: Story = {
  args: { orientation: "vertical" },
  render: (args) => (
    <div className="flex h-6 items-center gap-4 text-sm">
      <span>Docs</span>
      <Separator {...args} />
      <span>Blog</span>
      <Separator {...args} />
      <span>Changelog</span>
    </div>
  ),
  play: async ({ canvas, step }) => {
    await step("marks both separators as vertical", async () => {
      for (const separator of canvas.getAllByRole("separator")) {
        await expect(separator).toHaveAttribute("aria-orientation", "vertical")
      }
    })
  },
}
