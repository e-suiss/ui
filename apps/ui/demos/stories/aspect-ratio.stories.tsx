// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect } from "storybook/test"

import { AspectRatio } from "@/components/ui/aspect-ratio"

const meta = {
  title: "Components/Aspect Ratio",
  component: AspectRatio,
  args: {
    ratio: 16 / 9,
    className: "overflow-hidden rounded-2xl bg-surface-secondary",
  },
  argTypes: {
    ratio: {
      control: "select",
      options: [16 / 9, 4 / 3, 1, 3 / 4, 21 / 9],
    },
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AspectRatio>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <AspectRatio {...args}>
      <img
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80"
        alt="Mountain lake at sunrise"
        className="size-full object-cover"
      />
    </AspectRatio>
  ),
  play: async ({ canvas }) => {
    const image = canvas.getByRole("img", { name: "Mountain lake at sunrise" })
    const frame = image.parentElement as HTMLElement
    const { width, height } = frame.getBoundingClientRect()
    await expect(width / height).toBeCloseTo(16 / 9, 1)
  },
}

export const Square: Story = {
  args: { ratio: 1 },
  render: Default.render,
  play: async ({ canvas }) => {
    const image = canvas.getByRole("img", { name: "Mountain lake at sunrise" })
    const frame = image.parentElement as HTMLElement
    const { width, height } = frame.getBoundingClientRect()
    await expect(width / height).toBeCloseTo(1, 1)
  },
}

export const Portrait: Story = {
  args: { ratio: 3 / 4 },
  render: Default.render,
}

export const Placeholder: Story = {
  args: { ratio: 4 / 3 },
  render: (args) => (
    <AspectRatio {...args}>
      <div className="text-label-secondary flex size-full items-center justify-center text-sm">
        4:3
      </div>
    </AspectRatio>
  ),
}
