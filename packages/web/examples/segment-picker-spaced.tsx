import {
  SegmentPicker,
  SegmentPickerItem,
} from "@/components/patterns/segment-picker"

export default function SegmentPickerSpaced() {
  return (
    <SegmentPicker defaultValue="week" aria-label="Period" spacing={2}>
      <SegmentPickerItem value="day">Day</SegmentPickerItem>
      <SegmentPickerItem value="week">Week</SegmentPickerItem>
      <SegmentPickerItem value="month">Month</SegmentPickerItem>
      <SegmentPickerItem value="year">Year</SegmentPickerItem>
    </SegmentPicker>
  )
}
