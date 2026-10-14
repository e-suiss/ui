// @ts-nocheck
import { PlusIcon } from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { expect, screen, userEvent, waitFor } from "storybook/test"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerIndent,
  DrawerIndentBackground,
  DrawerProvider,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

const meta = {
  title: "Components/Drawer",
  component: Drawer,
  args: {
    swipeDirection: "down",
    floating: false,
    showSwipeHandle: true,
    modal: true,
  },
  argTypes: {
    swipeDirection: {
      control: "select",
      options: ["down", "up", "left", "right"],
    },
    floating: { control: "boolean" },
    showSwipeHandle: { control: "boolean" },
    modal: { control: "boolean" },
  },
  render: (args) => (
    <Drawer {...args}>
      <DrawerTrigger render={<Button variant="outline" />}>
        Open drawer
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Move goal</DrawerTitle>
          <DrawerDescription>Set your daily activity goal.</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col items-center gap-1 p-4">
          <span className="text-5xl font-semibold tracking-tight">350</span>
          <span className="text-label-secondary text-xs uppercase">
            Calories per day
          </span>
        </div>
        <DrawerFooter>
          <Button>Save goal</Button>
          <DrawerClose render={<Button variant="outline" />}>
            Cancel
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
} satisfies Meta<typeof Drawer>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, step }) => {
    const trigger = canvas.getByRole("button", { name: "Open drawer" })

    await step("opens a named drawer and moves focus in", async () => {
      await userEvent.click(trigger)
      const drawer = await screen.findByRole("dialog", { name: "Move goal" })
      await expect(drawer).toHaveAccessibleDescription(
        "Set your daily activity goal."
      )
      await waitFor(() =>
        expect(drawer).toContainElement(document.activeElement as HTMLElement)
      )
    })

    await step("closes with Escape and returns focus", async () => {
      await userEvent.keyboard("{Escape}")
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
      await waitFor(() => expect(trigger).toHaveFocus())
    })

    await step("closes from the cancel button", async () => {
      await userEvent.click(trigger)
      await userEvent.click(
        await screen.findByRole("button", { name: "Cancel" })
      )
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    })
  },
}

export const OpenByDefault: Story = {
  args: { defaultOpen: true },
  play: async () => {
    const drawer = await screen.findByRole("dialog", { name: "Move goal" })
    await waitFor(() => expect(drawer).toBeVisible())
  },
}

export const Directions: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {(["down", "up", "left", "right"] as const).map((direction) => (
        <Drawer key={direction} {...args} swipeDirection={direction}>
          <DrawerTrigger render={<Button variant="outline" />}>
            {direction.charAt(0).toUpperCase() + direction.slice(1)}
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Notifications</DrawerTitle>
              <DrawerDescription>
                You have three unread messages.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter className="pt-4">
              <DrawerClose render={<Button variant="outline" />}>
                Close
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ))}
    </div>
  ),
  play: async ({ canvas, step }) => {
    const edges = {
      down: (rect: DOMRect) => rect.bottom - window.innerHeight,
      up: (rect: DOMRect) => rect.top,
      left: (rect: DOMRect) => rect.left,
      right: (rect: DOMRect) => rect.right - window.innerWidth,
    }

    for (const [direction, edgeGap] of Object.entries(edges)) {
      const label = direction.charAt(0).toUpperCase() + direction.slice(1)

      await step(`opens the ${direction} drawer from its edge`, async () => {
        const trigger = canvas.getByRole("button", { name: label })
        await userEvent.click(trigger)
        const drawer = await screen.findByRole("dialog", {
          name: "Notifications",
        })
        await expect(drawer).toHaveAttribute("data-swipe-direction", direction)
        await waitFor(() =>
          expect(
            Math.abs(edgeGap(drawer.getBoundingClientRect()))
          ).toBeLessThan(1)
        )
        await userEvent.keyboard("{Escape}")
        await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
        await waitFor(() => expect(trigger).toHaveFocus())
      })
    }
  },
}

export const DirectionsRightToLeft: Story = {
  globals: { direction: "rtl" },
  render: Directions.render,
  play: Directions.play,
}

export const WithCloseButton: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open drawer" }))
    await userEvent.click(await screen.findByRole("button", { name: "Close" }))
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
  },
  render: (args) => (
    <Drawer {...args}>
      <DrawerTrigger render={<Button variant="outline" />}>
        Open drawer
      </DrawerTrigger>
      <DrawerContent showCloseButton>
        <DrawerHeader>
          <DrawerTitle>Move goal</DrawerTitle>
          <DrawerDescription>Set your daily activity goal.</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col items-center gap-1 p-4">
          <span className="text-5xl font-semibold tracking-tight">350</span>
          <span className="text-label-secondary text-xs uppercase">
            Calories per day
          </span>
        </div>
        <DrawerFooter>
          <Button>Save goal</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}

export const WithCloseLabel: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open drawer" }))
    const close = await screen.findByRole("button", { name: "Close" })
    await expect(close).toHaveTextContent("Close")
    await userEvent.click(close)
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
  },
  render: (args) => (
    <Drawer {...args}>
      <DrawerTrigger render={<Button variant="outline" />}>
        Open drawer
      </DrawerTrigger>
      <DrawerContent showCloseButton closeLabel="Close">
        <DrawerHeader>
          <DrawerTitle>Move goal</DrawerTitle>
          <DrawerDescription>Set your daily activity goal.</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col items-center gap-1 p-4">
          <span className="text-5xl font-semibold tracking-tight">350</span>
          <span className="text-label-secondary text-xs uppercase">
            Calories per day
          </span>
        </div>
        <DrawerFooter>
          <Button>Save goal</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}

export const Floating: Story = {
  args: { floating: true },
  play: async ({ canvas, step }) => {
    const trigger = canvas.getByRole("button", { name: "Open drawer" })

    await step("opens inset from the screen edges", async () => {
      await userEvent.click(trigger)
      const drawer = await screen.findByRole("dialog", { name: "Move goal" })
      await expect(drawer).toHaveAttribute("data-floating")
      await waitFor(() => {
        const rect = drawer.getBoundingClientRect()
        expect(rect.left).toBeGreaterThan(0)
        expect(window.innerHeight - rect.bottom).toBeGreaterThan(0)
      })
    })

    await step("closes from the cancel button", async () => {
      await userEvent.click(screen.getByRole("button", { name: "Cancel" }))
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
      await waitFor(() => expect(trigger).toHaveFocus())
    })
  },
}

export const WithSnapPoints: Story = {
  args: { snapPoints: [0.5, 1] },
  play: async ({ canvas, step }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open drawer" }))
    const drawer = await screen.findByRole("dialog", { name: "Move goal" })

    await step("opens at the first snap point", async () => {
      await expect(drawer).toHaveAttribute("data-snap-points")
      await expect(drawer).not.toHaveAttribute("data-expanded")
      await waitFor(() =>
        expect(drawer.getBoundingClientRect().top).toBeCloseTo(
          window.innerHeight / 2,
          -1
        )
      )
    })

    await step("expands to the next snap point when dragged up", async () => {
      const handle = drawer.querySelector(
        '[data-slot="drawer-swipe-handle"]'
      ) as HTMLElement
      const rect = handle.getBoundingClientRect()
      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 2
      await userEvent.pointer([
        { keys: "[MouseLeft>]", target: handle, coords: { x, y } },
        { target: handle, coords: { x, y: y - 100 } },
        { target: handle, coords: { x, y: y - 300 } },
        { target: handle, coords: { x, y: y - 400 } },
        { keys: "[/MouseLeft]", target: handle, coords: { x, y: y - 400 } },
      ])
      await waitFor(() => expect(drawer).toHaveAttribute("data-expanded"))
    })
  },
}

export const NonModal: Story = {
  args: { modal: false },
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Open drawer" })
    await userEvent.click(trigger)
    const drawer = await screen.findByRole("dialog", { name: "Move goal" })
    await expect(drawer).not.toHaveAttribute("aria-modal", "true")
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
  },
}

const days = Array.from({ length: 35 }, (_, index) => index - 2)

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

function CalendarExample() {
  const [open, setOpen] = React.useState(false)
  const [allDay, setAllDay] = React.useState(false)

  return (
    <DrawerProvider>
      <DrawerIndentBackground />
      <DrawerIndent className="flex flex-col px-4 pt-6 pb-10">
        <div className="mx-auto flex w-full max-w-md flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">October</h2>
            <Drawer
              open={open}
              onOpenChange={setOpen}
              snapPoints={[0.5, 1]}
              showSwipeHandle
            >
              <DrawerTrigger
                render={
                  <Button
                    variant="plain"
                    size="icon-lg"
                    aria-label="New event"
                  />
                }
              >
                <PlusIcon weight="bold" className="size-5.5" />
              </DrawerTrigger>
              <DrawerContent>
                <div className="flex items-center justify-between px-2 pt-1">
                  <DrawerClose render={<Button variant="plain" />}>
                    Cancel
                  </DrawerClose>
                  <DrawerTitle>New Event</DrawerTitle>
                  <Button
                    variant="plain"
                    className="font-semibold"
                    onClick={() => setOpen(false)}
                  >
                    Add
                  </Button>
                </div>
                <DrawerDescription className="sr-only">
                  Drag the handle up for the full form.
                </DrawerDescription>
                <div className="flex flex-col gap-4 overflow-y-auto p-4">
                  <div className="flex flex-col overflow-hidden rounded-xl bg-surface-secondary">
                    <Input
                      aria-label="Title"
                      placeholder="Title"
                      className="rounded-none border-0 bg-transparent"
                    />
                    <Input
                      aria-label="Location"
                      placeholder="Location or Video Call"
                      className="rounded-none border-0 border-t border-separator bg-transparent"
                    />
                  </div>
                  <div className="flex flex-col divide-y divide-separator overflow-hidden rounded-xl bg-surface-secondary">
                    <div className="flex min-h-11 items-center justify-between px-3 text-base">
                      <span id="all-day-label">All-day</span>
                      <Switch
                        aria-labelledby="all-day-label"
                        checked={allDay}
                        onCheckedChange={setAllDay}
                      />
                    </div>
                    <div className="flex min-h-11 items-center justify-between px-3 text-base">
                      Starts
                      <span className="text-label-secondary">
                        {allDay ? "Oct 14" : "Oct 14, 9:00 AM"}
                      </span>
                    </div>
                    <div className="flex min-h-11 items-center justify-between px-3 text-base">
                      Ends
                      <span className="text-label-secondary">
                        {allDay ? "Oct 14" : "Oct 14, 10:00 AM"}
                      </span>
                    </div>
                  </div>
                  <textarea
                    aria-label="Notes"
                    placeholder="Notes"
                    rows={6}
                    className="resize-none rounded-xl bg-surface-secondary p-3 text-base outline-none placeholder:text-label-secondary focus-visible:focus-ring"
                  />
                </div>
              </DrawerContent>
            </Drawer>
          </div>
          <div className="grid grid-cols-7 gap-y-3 text-center text-sm">
            {weekdays.map((day) => (
              <abbr
                key={day}
                title={day}
                className="text-xs font-semibold text-label-secondary no-underline"
              >
                {day[0]}
              </abbr>
            ))}
            {days.map((day) => (
              <span
                key={day}
                className={
                  day === 14
                    ? "mx-auto flex size-9 items-center justify-center rounded-full bg-danger font-semibold text-surface"
                    : "flex h-9 items-center justify-center"
                }
              >
                {day > 0 && day <= 31 ? day : ""}
              </span>
            ))}
          </div>
          <div className="flex flex-col gap-2 rounded-2xl bg-surface-secondary p-4">
            <span className="text-sm font-semibold">Tuesday, October 14</span>
            <span className="text-sm text-label-secondary">
              9:00 AM · Design review
            </span>
            <span className="text-sm text-label-secondary">
              1:00 PM · Lunch with Sam
            </span>
          </div>
        </div>
      </DrawerIndent>
    </DrawerProvider>
  )
}

export const SheetWithDetents: Story = {
  parameters: { layout: "fullscreen" },
  render: () => <CalendarExample />,
  play: async ({ canvas, step }) => {
    const trigger = canvas.getByRole("button", { name: "New event" })

    await step("opens the sheet from the plus button", async () => {
      await userEvent.click(trigger)
      await expect(
        await screen.findByRole("dialog", { name: "New Event" })
      ).toBeInTheDocument()
    })

    await step("toggles the all-day switch", async () => {
      const allDay = screen.getByRole("switch", { name: "All-day" })
      await userEvent.click(allDay)
      await expect(allDay).toBeChecked()
      await expect(screen.getAllByText("Oct 14")).toHaveLength(2)
    })

    await step("closes from the add button", async () => {
      await userEvent.click(screen.getByRole("button", { name: "Add" }))
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
      await waitFor(() => expect(trigger).toHaveFocus())
    })
  },
}
