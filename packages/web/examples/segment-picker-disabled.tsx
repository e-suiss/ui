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

export default function SegmentPickerDisabled() {
  return (
    <SegmentPicker defaultValue="week" aria-label="Period" disabled>
      {periods}
    </SegmentPicker>
  )
}
