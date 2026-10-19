import * as React from "react"
import {
  SegmentPicker,
  SegmentPickerItem,
} from "@/components/patterns/segment-picker"

export default function SegmentPickerControlled() {
  const [value, setValue] = React.useState("month")

  return (
    <div className="flex flex-col items-start gap-2">
      <SegmentPicker
        defaultValue="week"
        aria-label="Period"
        value={value}
        onValueChange={setValue}
      >
        <SegmentPickerItem value="day">Day</SegmentPickerItem>
        <SegmentPickerItem value="week">Week</SegmentPickerItem>
        <SegmentPickerItem value="month">Month</SegmentPickerItem>
        <SegmentPickerItem value="year">Year</SegmentPickerItem>
      </SegmentPicker>
      <p className="text-sm text-muted-foreground">Selected: {value}</p>
    </div>
  )
}
