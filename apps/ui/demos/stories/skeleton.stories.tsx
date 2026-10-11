// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect } from "storybook/test"

import { Skeleton } from "@/components/ui/skeleton"

const meta = {
  title: "Components/Skeleton",
  component: Skeleton,
  args: {
    className: "h-4 w-48",
  },
} satisfies Meta<typeof Skeleton>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    await step("renders a pulsing placeholder with no text", async () => {
      const skeleton = canvasElement.querySelector('[data-slot="skeleton"]')
      await expect(skeleton).toHaveClass("animate-pulse")
      await expect(skeleton).toBeEmptyDOMElement()
    })
  },
}

export const Profile: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Skeleton className="size-12 rounded-full" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  ),
}

export const Card: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-3">
      <Skeleton className="aspect-video w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  ),
}

export const List: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="flex items-center gap-3">
          <Skeleton className="size-9 rounded-xl" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-3.5 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    await step("renders three placeholders per row", async () => {
      await expect(
        canvasElement.querySelectorAll('[data-slot="skeleton"]')
      ).toHaveLength(12)
    })
  },
}
