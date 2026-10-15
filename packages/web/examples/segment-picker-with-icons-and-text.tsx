import { ListIcon, SquaresFourIcon, TableIcon } from "@phosphor-icons/react"
import {
  SegmentPicker,
  SegmentPickerItem,
} from "@/components/patterns/segment-picker"

export default function SegmentPickerWithIconsAndText() {
  return (
    <SegmentPicker defaultValue="grid" aria-label="View">
      <SegmentPickerItem value="list" label="List">
        <ListIcon data-icon="inline-start" />
        List
      </SegmentPickerItem>
      <SegmentPickerItem value="grid" label="Grid">
        <SquaresFourIcon data-icon="inline-start" />
        Grid
      </SegmentPickerItem>
      <SegmentPickerItem value="table" label="Table">
        <TableIcon data-icon="inline-start" />
        Table
      </SegmentPickerItem>
    </SegmentPicker>
  )
}
