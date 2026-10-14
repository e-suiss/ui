// @ts-nocheck
import { CalendarBlankIcon, InfoIcon } from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent } from "storybook/test"

import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"

const meta = {
  title: "Components/Marker",
  component: Marker,
  args: {
    variant: "default",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "separator", "border"],
    },
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Marker>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Marker {...args}>
      <MarkerContent>Conversation started</MarkerContent>
    </Marker>
  ),
  play: async ({ canvas, step }) => {
    await step("renders the marker text", async () => {
      await expect(canvas.getByText("Conversation started")).toBeVisible()
    })
  },
}

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      <Marker {...args} variant="default">
        <MarkerContent>Default</MarkerContent>
      </Marker>
      <Marker {...args} variant="separator">
        <MarkerContent>Today</MarkerContent>
      </Marker>
      <Marker {...args} variant="border">
        <MarkerContent>Earlier messages</MarkerContent>
      </Marker>
    </div>
  ),
}

export const Separator: Story = {
  args: { variant: "separator" },
  render: (args) => (
    <Marker {...args}>
      <MarkerContent>Yesterday</MarkerContent>
    </Marker>
  ),
}

export const WithIcon: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      <Marker {...args}>
        <MarkerIcon>
          <InfoIcon />
        </MarkerIcon>
        <MarkerContent>Maya joined the conversation</MarkerContent>
      </Marker>
      <Marker {...args} variant="separator">
        <MarkerIcon>
          <CalendarBlankIcon />
        </MarkerIcon>
        <MarkerContent>March 12</MarkerContent>
      </Marker>
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    await step("hides the decorative icons from assistive tech", async () => {
      const icons = canvasElement.querySelectorAll('[data-slot="marker-icon"]')
      await expect(icons).toHaveLength(2)
      for (const icon of icons) {
        await expect(icon).toHaveAttribute("aria-hidden", "true")
      }
    })
  },
}

export const WithLink: Story = {
  render: (args) => (
    <Marker {...args}>
      <MarkerContent>
        This chat was archived. <a href="#restore">Restore it</a>
      </MarkerContent>
    </Marker>
  ),
  play: async ({ canvas, step }) => {
    await step("keeps the inline link reachable by keyboard", async () => {
      const link = canvas.getByRole("link", { name: "Restore it" })
      await userEvent.tab()
      await expect(link).toHaveFocus()
    })
  },
}
