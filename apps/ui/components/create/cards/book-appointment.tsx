"use client"

import * as React from "react"
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function BookAppointment() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(2026, 9, 23)
  )
  return (
    <Card>
      <CardHeader>
        <CardTitle>Book an appointment</CardTitle>
        <CardDescription>Dental check-up, 30 minutes</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          defaultMonth={new Date(2026, 9, 1)}
          className="mx-auto p-0"
        />
        <ToggleGroup
          variant="outline"
          spacing={2}
          multiple={false}
          defaultValue={["10:30"]}
          aria-label="Time slot"
          className="grid w-full grid-cols-3"
        >
          <ToggleGroupItem value="09:00">9:00</ToggleGroupItem>
          <ToggleGroupItem value="09:30">9:30</ToggleGroupItem>
          <ToggleGroupItem value="10:30">10:30</ToggleGroupItem>
          <ToggleGroupItem value="13:00">1:00</ToggleGroupItem>
          <ToggleGroupItem value="14:30">2:30</ToggleGroupItem>
          <ToggleGroupItem value="16:00">4:00</ToggleGroupItem>
        </ToggleGroup>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Confirm Friday, 10:30</Button>
      </CardFooter>
    </Card>
  )
}
