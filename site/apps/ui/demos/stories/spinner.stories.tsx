// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect } from "storybook/test"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

const meta = {
  title: "Components/Spinner",
  component: Spinner,
} satisfies Meta<typeof Spinner>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, step }) => {
    await step("announces itself as a loading status", async () => {
      await expect(
        canvas.getByRole("status", { name: "Loading" })
      ).toBeVisible()
    })
  },
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Spinner {...args} className="size-3" />
      <Spinner {...args} className="size-4" />
      <Spinner {...args} className="size-6" />
      <Spinner {...args} className="size-8" />
    </div>
  ),
}

export const Colors: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Spinner {...args} className="text-accent size-6" />
      <Spinner {...args} className="text-label-secondary size-6" />
      <Spinner {...args} className="text-danger size-6" />
    </div>
  ),
}

export const InButton: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Button disabled>
        <Spinner {...args} data-icon="inline-start" />
        Saving
      </Button>
      <Button variant="outline" disabled>
        <Spinner {...args} data-icon="inline-start" />
        Loading more
      </Button>
    </div>
  ),
  play: async ({ canvas, step }) => {
    await step("keeps the busy buttons disabled with a status", async () => {
      for (const button of canvas.getAllByRole("button")) {
        await expect(button).toBeDisabled()
      }
      await expect(canvas.getAllByRole("status")).toHaveLength(2)
    })
  },
}
