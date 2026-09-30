import type { Meta, StoryObj } from "@storybook/react-vite"

import { Slider } from "@/components/ui/slider"

const meta = {
  title: "Components/Slider",
  component: Slider,
  args: {
    defaultValue: [50],
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
  },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Slider>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { "aria-label": "Volume" },
}

export const Range: Story = {
  args: { defaultValue: [25, 75], "aria-label": "Price range" },
}

export const Steps: Story = {
  args: { defaultValue: [40], step: 10, "aria-label": "Brightness" },
}

export const Vertical: Story = {
  args: { orientation: "vertical", "aria-label": "Volume" },
  decorators: [
    (Story) => (
      <div className="flex h-48 justify-center">
        <Story />
      </div>
    ),
  ],
}

export const Disabled: Story = {
  args: { disabled: true, "aria-label": "Volume" },
}
