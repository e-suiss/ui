"use client"

import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function CalendarRange() {
  const [range, setRange] = React.useState<
    { from: Date | undefined; to?: Date | undefined } | undefined
  >({
    from: new Date(2026, 10, 12),
    to: new Date(2026, 10, 17),
  })
  const nights =
    range?.from && range.to
      ? Math.round((range.to.getTime() - range.from.getTime()) / 86400000)
      : 0
  const format = (date: Date | undefined) =>
    date
      ? date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      : "Pick a date"

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select dates</CardTitle>
        <CardDescription>Lakeside cabin · 2 guests</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <Calendar
          mode="range"
          selected={range}
          onSelect={setRange}
          defaultMonth={new Date(2026, 10, 1)}
          className="p-0"
        />
        <div className="flex w-full items-center gap-3 rounded-xl bg-muted p-3">
          <IconPlaceholder
            phosphor="CalendarBlankIcon"
            lucide="CalendarIcon"
            tabler="IconCalendar"
            hugeicons="Calendar01Icon"
            remixicon="RiCalendarLine"
            className="size-4 text-muted-foreground"
          />
          <span className="text-sm font-medium tabular-nums">
            {format(range?.from)} – {format(range?.to)}
          </span>
          <Badge variant="secondary" className="ms-auto tabular-nums">
            {nights} nights
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline" className="flex-1">
          Clear
        </Button>
        <Button className="flex-1">Apply</Button>
      </CardFooter>
    </Card>
  )
}
