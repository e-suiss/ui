// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent } from "storybook/test"

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
  play: async ({ canvas, step }) => {
    const slider = canvas.getByRole("slider", { name: "Volume" })

    await step("starts at the default value", async () => {
      await expect(slider).toHaveAttribute("aria-valuenow", "50")
    })

    await step("moves with the arrow and edge keys", async () => {
      await userEvent.tab()
      await expect(slider).toHaveFocus()
      await userEvent.keyboard("{ArrowRight}")
      await expect(slider).toHaveAttribute("aria-valuenow", "51")
      await userEvent.keyboard("{ArrowLeft}{ArrowLeft}")
      await expect(slider).toHaveAttribute("aria-valuenow", "49")
      await userEvent.keyboard("{End}")
      await expect(slider).toHaveAttribute("aria-valuenow", "100")
      await userEvent.keyboard("{Home}")
      await expect(slider).toHaveAttribute("aria-valuenow", "0")
    })
  },
}

export const Range: Story = {
  args: { defaultValue: [25, 75], "aria-label": "Price range" },
  play: async ({ canvas, step }) => {
    const [start, end] = canvas.getAllByRole("slider", { name: "Price range" })

    await step("renders a thumb per value", async () => {
      await expect(start).toHaveAttribute("aria-valuenow", "25")
      await expect(end).toHaveAttribute("aria-valuenow", "75")
    })

    await step("moves each thumb independently", async () => {
      await userEvent.tab()
      await userEvent.keyboard("{ArrowRight}")
      await userEvent.tab()
      await userEvent.keyboard("{ArrowLeft}")
      await expect(start).toHaveAttribute("aria-valuenow", "26")
      await expect(end).toHaveAttribute("aria-valuenow", "74")
    })
  },
}

export const Steps: Story = {
  args: { defaultValue: [40], step: 10, "aria-label": "Brightness" },
  play: async ({ canvas, step }) => {
    const slider = canvas.getByRole("slider", { name: "Brightness" })

    await step("moves by the step size", async () => {
      await userEvent.tab()
      await userEvent.keyboard("{ArrowRight}")
      await expect(slider).toHaveAttribute("aria-valuenow", "50")
    })
  },
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
  play: async ({ canvas, step }) => {
    const slider = canvas.getByRole("slider", { name: "Volume" })

    await step("runs vertically", async () => {
      await expect(slider).toHaveAttribute("aria-orientation", "vertical")
      await expect(slider).toHaveAttribute("aria-valuenow", "50")
    })

    await step("moves with the up and down keys", async () => {
      await userEvent.tab()
      await expect(slider).toHaveFocus()
      await userEvent.keyboard("{ArrowUp}")
      await expect(slider).toHaveAttribute("aria-valuenow", "51")
      await userEvent.keyboard("{ArrowDown}{ArrowDown}")
      await expect(slider).toHaveAttribute("aria-valuenow", "49")
    })
  },
}

export const Disabled: Story = {
  args: { disabled: true, "aria-label": "Volume" },
  play: async ({ canvas, step }) => {
    const slider = canvas.getByRole("slider", { name: "Volume" })

    await step("stays out of the tab order and keeps its value", async () => {
      await expect(slider).toBeDisabled()
      await userEvent.tab()
      await expect(slider).not.toHaveFocus()
      await expect(slider).toHaveAttribute("aria-valuenow", "50")
    })
  },
}
