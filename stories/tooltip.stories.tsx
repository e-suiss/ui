import { PlusIcon } from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, screen, userEvent, waitFor } from "storybook/test"

import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type TooltipStoryArgs = React.ComponentProps<typeof Tooltip> & {
  side?: "top" | "right" | "bottom" | "left"
}

const meta = {
  title: "Components/Tooltip",
  component: Tooltip,
  args: {
    side: "top",
  },
  argTypes: {
    side: {
      control: "select",
      options: ["top", "right", "bottom", "left"],
    },
  },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <div className="p-12">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
  render: ({ side, ...args }) => (
    <Tooltip {...args}>
      <TooltipTrigger render={<Button variant="outline" />}>
        Hover me
      </TooltipTrigger>
      <TooltipContent side={side}>Add to library</TooltipContent>
    </Tooltip>
  ),
} satisfies Meta<TooltipStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, step }) => {
    const trigger = canvas.getByRole("button", { name: "Hover me" })

    await step("opens on hover and closes on unhover", async () => {
      await userEvent.hover(trigger)
      await waitFor(
        () => expect(screen.getByText("Add to library")).toBeVisible(),
        { timeout: 3000 }
      )
      await userEvent.unhover(trigger)
      await waitFor(() =>
        expect(screen.queryByText("Add to library")).toBeNull()
      )
    })

    await step("opens on keyboard focus and closes with Escape", async () => {
      await userEvent.tab()
      await expect(trigger).toHaveFocus()
      await waitFor(
        () => expect(screen.getByText("Add to library")).toBeVisible(),
        { timeout: 3000 }
      )
      await userEvent.keyboard("{Escape}")
      await waitFor(() =>
        expect(screen.queryByText("Add to library")).toBeNull()
      )
      await expect(trigger).toHaveFocus()
    })
  },
}

export const Open: Story = {
  args: { defaultOpen: true },
  play: async ({ step }) => {
    await step("renders the tooltip open on mount", async () => {
      await waitFor(
        () => expect(screen.getByText("Add to library")).toBeVisible(),
        { timeout: 3000 }
      )
    })
  },
}

export const Sides: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-x-24 gap-y-16">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Tooltip key={side} defaultOpen>
          <TooltipTrigger render={<Button variant="outline" />}>
            {side}
          </TooltipTrigger>
          <TooltipContent side={side}>Shown on the {side}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
}

export const WithShortcut: Story = {
  args: { defaultOpen: true },
  render: ({ side, ...args }) => (
    <Tooltip {...args}>
      <TooltipTrigger
        render={<Button variant="outline" size="icon" aria-label="New file" />}
      >
        <PlusIcon />
      </TooltipTrigger>
      <TooltipContent side={side}>
        New file
        <Kbd mod>N</Kbd>
      </TooltipContent>
    </Tooltip>
  ),
  play: async ({ canvas, step }) => {
    await step("names the icon trigger and shows the shortcut", async () => {
      await expect(
        canvas.getByRole("button", { name: "New file" })
      ).toBeVisible()
      const content = await screen.findByText("New file")
      await expect(
        content.querySelector('[data-slot="kbd"]')
      ).toHaveTextContent("N")
    })
  },
}
