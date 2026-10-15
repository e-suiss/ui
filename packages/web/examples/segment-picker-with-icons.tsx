import { ListIcon, SquaresFourIcon, TableIcon } from "@phosphor-icons/react"
import {
  SegmentPicker,
  SegmentPickerItem,
} from "@/components/patterns/segment-picker"

export default function SegmentPickerWithIcons() {
  return (
    <SegmentPicker defaultValue="grid" aria-label="View">
      <SegmentPickerItem value="list" aria-label="List">
        <ListIcon />
      </SegmentPickerItem>
      <SegmentPickerItem value="grid" aria-label="Grid">
        <SquaresFourIcon />
      </SegmentPickerItem>
      <SegmentPickerItem value="table" aria-label="Table">
        <TableIcon />
      </SegmentPickerItem>
    </SegmentPicker>
  )
}
