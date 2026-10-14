// @ts-nocheck
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

type Side = "top" | "right" | "bottom" | "left"

type TooltipStoryArgs = React.ComponentProps<typeof Tooltip> & {
  side?: Side
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
    <div className="grid grid-cols-2 place-items-center gap-x-24 gap-y-16">
      {(["top", "right", "left", "bottom"] as const).map((side) => (
        <TooltipProvider key={side}>
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" />}>
              {side}
            </TooltipTrigger>
            <TooltipContent side={side}>Shown on the {side}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  ),
  play: async ({ canvas, step }) => {
    const sides = ["top", "right", "bottom", "left"] as const

    await step("shows all four tooltips at once", async () => {
      for (const side of sides) {
        await waitFor(() =>
          expect(
            screen
              .getByText(`Shown on the ${side}`)
              .closest('[data-slot="tooltip-content"]')
          ).toHaveAttribute("data-open")
        )
      }
    })

    for (const side of sides) {
      await step(`places the ${side} tooltip on its side`, async () => {
        const trigger = canvas.getByRole("button", { name: side })
        const content = screen.getByText(`Shown on the ${side}`)
        await expect(
          content
            .closest('[data-slot="tooltip-content"]')
            ?.getAttribute("data-side")
        ).toBe(side)
        await waitFor(() => {
          const tip = content.getBoundingClientRect()
          const anchor = trigger.getBoundingClientRect()
          const placements = {
            top: tip.bottom <= anchor.top,
            right: tip.left >= anchor.right,
            bottom: tip.top >= anchor.bottom,
            left: tip.right <= anchor.left,
          }
          expect(placements[side]).toBe(true)
        })
      })
    }
  },
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
