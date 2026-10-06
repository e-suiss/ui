import { PlusIcon } from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"

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

export const Default: Story = {}

export const OpenByDefault: Story = {
  args: { defaultOpen: true },
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
}

export const WithCloseButton: Story = {
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
}

export const WithSnapPoints: Story = {
  args: { snapPoints: [0.5, 1] },
}

export const NonModal: Story = {
  args: { modal: false },
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
}
