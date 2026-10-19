import {
  SegmentPicker,
  SegmentPickerItem,
} from "@/components/patterns/segment-picker"

export default function SegmentPickerWithoutValue() {
  return (
    <SegmentPicker defaultValue={undefined} aria-label="Period">
      <SegmentPickerItem value="day">Day</SegmentPickerItem>
      <SegmentPickerItem value="week">Week</SegmentPickerItem>
      <SegmentPickerItem value="month">Month</SegmentPickerItem>
      <SegmentPickerItem value="year">Year</SegmentPickerItem>
    </SegmentPicker>
  )
}
