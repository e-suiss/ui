import {
  SegmentPicker,
  SegmentPickerItem,
} from "@/components/patterns/segment-picker"

export default function SegmentPickerSizes() {
  return (
    <div className="flex flex-col items-start gap-3">
      <SegmentPicker defaultValue="week" aria-label="Period" size="sm">
        <SegmentPickerItem value="day">Day</SegmentPickerItem>
        <SegmentPickerItem value="week">Week</SegmentPickerItem>
        <SegmentPickerItem value="month">Month</SegmentPickerItem>
        <SegmentPickerItem value="year">Year</SegmentPickerItem>
      </SegmentPicker>
      <SegmentPicker defaultValue="week" aria-label="Period" size="default">
        <SegmentPickerItem value="day">Day</SegmentPickerItem>
        <SegmentPickerItem value="week">Week</SegmentPickerItem>
        <SegmentPickerItem value="month">Month</SegmentPickerItem>
        <SegmentPickerItem value="year">Year</SegmentPickerItem>
      </SegmentPicker>
      <SegmentPicker defaultValue="week" aria-label="Period" size="lg">
        <SegmentPickerItem value="day">Day</SegmentPickerItem>
        <SegmentPickerItem value="week">Week</SegmentPickerItem>
        <SegmentPickerItem value="month">Month</SegmentPickerItem>
        <SegmentPickerItem value="year">Year</SegmentPickerItem>
      </SegmentPicker>
    </div>
  )
}
