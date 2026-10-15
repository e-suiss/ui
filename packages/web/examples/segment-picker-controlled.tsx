import * as React from "react"
import {
  SegmentPicker,
  SegmentPickerItem,
} from "@/components/patterns/segment-picker"

const periods = (
  <>
    <SegmentPickerItem value="day">Day</SegmentPickerItem>
    <SegmentPickerItem value="week">Week</SegmentPickerItem>
    <SegmentPickerItem value="month">Month</SegmentPickerItem>
    <SegmentPickerItem value="year">Year</SegmentPickerItem>
  </>
)

function ControlledExample(props: React.ComponentProps<typeof SegmentPicker>) {
  const [value, setValue] = React.useState("month")

  return (
    <div className="flex flex-col items-start gap-2">
      <SegmentPicker {...props} value={value} onValueChange={setValue}>
        {periods}
      </SegmentPicker>
      <p className="text-sm text-muted-foreground">Selected: {value}</p>
    </div>
  )
}

export default function SegmentPickerControlled() {
  return <ControlledExample defaultValue="week" aria-label="Period" />
}
