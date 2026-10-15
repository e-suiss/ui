import * as React from "react"
import { DatePicker } from "@/components/patterns/date-picker"

function ControlledExample(props: React.ComponentProps<typeof DatePicker>) {
  const [value, setValue] = React.useState<Date | null>(new Date(2026, 9, 4))

  return (
    <div className="flex flex-col items-start gap-2">
      <DatePicker {...props} value={value} onValueChange={setValue} />
      <p className="text-sm text-muted-foreground">
        Selected: {value ? value.toDateString() : "none"}
      </p>
    </div>
  )
}

export default function DatePickerControlled() {
  return <ControlledExample aria-label="Date" className="w-60" />
}
