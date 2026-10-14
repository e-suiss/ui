// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, screen, userEvent, waitFor } from "storybook/test"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

const SHARED_LINKS = /^Shared links stay active for 30 days/

const meta = {
  title: "Components/Popover",
  component: Popover,
} satisfies Meta<typeof Popover>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Popover {...args}>
      <PopoverTrigger render={<Button variant="outline" />}>
        Open popover
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Dimensions</PopoverTitle>
          <PopoverDescription>
            Set the dimensions for the layer.
          </PopoverDescription>
        </PopoverHeader>
        <div className="grid gap-3">
          <div className="grid grid-cols-3 items-center gap-3">
            <Label htmlFor="popover-width">Width</Label>
            <Input
              id="popover-width"
              defaultValue="100%"
              className="col-span-2"
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-3">
            <Label htmlFor="popover-height">Height</Label>
            <Input
              id="popover-height"
              defaultValue="25px"
              className="col-span-2"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
  play: async ({ canvas, step }) => {
    const trigger = canvas.getByRole("button", { name: "Open popover" })

    await step("opens a named popover from the trigger", async () => {
      await userEvent.click(trigger)
      const popover = await screen.findByRole("dialog", { name: "Dimensions" })
      await expect(popover).toHaveAccessibleDescription(
        "Set the dimensions for the layer."
      )
      await expect(trigger).toHaveAttribute("aria-expanded", "true")
    })

    await step("lets the user edit a field inside", async () => {
      const width = screen.getByRole("textbox", { name: "Width" })
      await userEvent.clear(width)
      await userEvent.type(width, "50%")
      await expect(width).toHaveValue("50%")
    })

    await step("closes with Escape and returns focus", async () => {
      await userEvent.keyboard("{Escape}")
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
      await expect(trigger).toHaveFocus()
      await expect(trigger).toHaveAttribute("aria-expanded", "false")
    })

    await step("closes on an outside click", async () => {
      await userEvent.click(trigger)
      await screen.findByRole("dialog", { name: "Dimensions" })
      await userEvent.click(document.body)
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    })
  },
}

export const OpenByDefault: Story = {
  args: { defaultOpen: true },
  render: Default.render,
  play: async ({ step }) => {
    await step("renders the popover open on mount", async () => {
      await waitFor(
        () =>
          expect(
            screen.getByRole("dialog", { name: "Dimensions" })
          ).toBeVisible(),
        { timeout: 3000 }
      )
    })
  },
}

export const Sides: Story = {
  render: (args) => (
    <div className="grid grid-cols-2 gap-3">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Popover key={side} {...args}>
          <PopoverTrigger render={<Button variant="outline" />}>
            {side.charAt(0).toUpperCase() + side.slice(1)}
          </PopoverTrigger>
          <PopoverContent side={side} className="w-56">
            <PopoverHeader>
              <PopoverTitle>Heads up</PopoverTitle>
              <PopoverDescription>
                This popover opens on the {side} side.
              </PopoverDescription>
            </PopoverHeader>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  ),
  play: async ({ canvas, step }) => {
    await step("opens each side's popover on its own", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Left" }))
      const popover = await screen.findByRole("dialog", { name: "Heads up" })
      await expect(popover).toHaveTextContent(
        "This popover opens on the left side."
      )
      await userEvent.keyboard("{Escape}")
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    })
  },
}

export const Simple: Story = {
  render: (args) => (
    <Popover {...args}>
      <PopoverTrigger render={<Button variant="ghost" />}>
        What is this?
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <p>
          Shared links stay active for 30 days and can be revoked at any time
          from settings.
        </p>
      </PopoverContent>
    </Popover>
  ),
  play: async ({ canvas, step }) => {
    const trigger = canvas.getByRole("button", { name: "What is this?" })

    await step("opens from the trigger", async () => {
      await userEvent.click(trigger)
      const popover = await screen.findByRole("dialog")
      await waitFor(() => expect(popover).toBeVisible())
      await expect(popover).toHaveTextContent(SHARED_LINKS)
      await expect(trigger).toHaveAttribute("aria-expanded", "true")
    })

    await step("closes with Escape and returns focus", async () => {
      await userEvent.keyboard("{Escape}")
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
      await expect(trigger).toHaveFocus()
    })

    await step("closes from the trigger", async () => {
      await userEvent.click(trigger)
      await screen.findByRole("dialog")
      await userEvent.click(trigger)
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    })
  },
}
