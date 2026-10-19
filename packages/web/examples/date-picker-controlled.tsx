import * as React from "react"
import { DatePicker } from "@/components/patterns/date-picker"

export default function DatePickerControlled() {
  const [value, setValue] = React.useState<Date | null>(new Date(2026, 9, 4))

  return (
    <div className="flex flex-col items-start gap-2">
      <DatePicker
        aria-label="Date"
        className="w-60"
        value={value}
        onValueChange={setValue}
      />
      <p className="text-sm text-muted-foreground">
        Selected: {value ? value.toDateString() : "none"}
      </p>
    </div>
  )
}
