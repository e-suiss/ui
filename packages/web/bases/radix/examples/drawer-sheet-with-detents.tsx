import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerIndent,
  DrawerIndentBackground,
  DrawerProvider,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

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

export default function DrawerSheetWithDetents() {
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
              <DrawerTrigger asChild>
                <Button variant="plain" size="icon-lg" aria-label="New event">
                  <IconPlaceholder
                    lucide="PlusIcon"
                    tabler="IconPlus"
                    hugeicons="PlusSignIcon"
                    phosphor="PlusIcon"
                    remixicon="RiAddLine"
                    className="size-5.5"
                  />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="flex items-center justify-between px-2 pt-1">
                  <DrawerClose asChild>
                    <Button variant="plain">Cancel</Button>
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
                  <div className="flex flex-col overflow-hidden rounded-xl bg-muted">
                    <Input
                      aria-label="Title"
                      placeholder="Title"
                      className="rounded-none border-0 bg-transparent"
                    />
                    <Input
                      aria-label="Location"
                      placeholder="Location or Video Call"
                      className="rounded-none border-0 border-t border-border bg-transparent"
                    />
                  </div>
                  <div className="flex flex-col divide-y divide-border overflow-hidden rounded-xl bg-muted">
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
                      <span className="text-muted-foreground">
                        {allDay ? "Oct 14" : "Oct 14, 9:00 AM"}
                      </span>
                    </div>
                    <div className="flex min-h-11 items-center justify-between px-3 text-base">
                      Ends
                      <span className="text-muted-foreground">
                        {allDay ? "Oct 14" : "Oct 14, 10:00 AM"}
                      </span>
                    </div>
                  </div>
                  <textarea
                    aria-label="Notes"
                    placeholder="Notes"
                    rows={6}
                    className="resize-none rounded-xl bg-muted p-3 text-base outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
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
                className="text-xs font-semibold text-muted-foreground no-underline"
              >
                {day[0]}
              </abbr>
            ))}
            {days.map((day) => (
              <span
                key={day}
                className={
                  day === 14
                    ? "mx-auto flex size-9 items-center justify-center rounded-full bg-destructive font-semibold text-background"
                    : "flex h-9 items-center justify-center"
                }
              >
                {day > 0 && day <= 31 ? day : ""}
              </span>
            ))}
          </div>
          <div className="flex flex-col gap-2 rounded-2xl bg-muted p-4">
            <span className="text-sm font-semibold">Tuesday, October 14</span>
            <span className="text-sm text-muted-foreground">
              9:00 AM · Design review
            </span>
            <span className="text-sm text-muted-foreground">
              1:00 PM · Lunch with Sam
            </span>
          </div>
        </div>
      </DrawerIndent>
    </DrawerProvider>
  )
}
