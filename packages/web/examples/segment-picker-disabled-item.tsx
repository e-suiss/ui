import {
  SegmentPicker,
  SegmentPickerItem,
} from "@/components/patterns/segment-picker"

export default function SegmentPickerDisabledItem() {
  return (
    <SegmentPicker defaultValue="week" aria-label="Period">
      <SegmentPickerItem value="day">Day</SegmentPickerItem>
      <SegmentPickerItem value="week">Week</SegmentPickerItem>
      <SegmentPickerItem value="month">Month</SegmentPickerItem>
      <SegmentPickerItem value="year" disabled>
        Year
      </SegmentPickerItem>
    </SegmentPicker>
  )
}
