import {
  SegmentPicker,
  SegmentPickerItem,
} from "@/components/patterns/segment-picker"

export default function SegmentPickerOutline() {
  return (
    <SegmentPicker defaultValue="week" aria-label="Period" variant="outline">
      <SegmentPickerItem value="day">Day</SegmentPickerItem>
      <SegmentPickerItem value="week">Week</SegmentPickerItem>
      <SegmentPickerItem value="month">Month</SegmentPickerItem>
      <SegmentPickerItem value="year">Year</SegmentPickerItem>
    </SegmentPicker>
  )
}
