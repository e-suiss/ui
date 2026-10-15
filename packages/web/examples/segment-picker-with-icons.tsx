import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import {
  SegmentPicker,
  SegmentPickerItem,
} from "@/components/patterns/segment-picker"

export default function SegmentPickerWithIcons() {
  return (
    <SegmentPicker defaultValue="grid" aria-label="View">
      <SegmentPickerItem value="list" aria-label="List">
        <IconPlaceholder
          lucide="MenuIcon"
          tabler="IconMenu2"
          hugeicons="Menu01Icon"
          phosphor="ListIcon"
          remixicon="RiMenuLine"
        />
      </SegmentPickerItem>
      <SegmentPickerItem value="grid" aria-label="Grid">
        <IconPlaceholder
          lucide="LayoutGridIcon"
          tabler="IconLayoutGrid"
          hugeicons="GridViewIcon"
          phosphor="SquaresFourIcon"
          remixicon="RiLayoutGridLine"
        />
      </SegmentPickerItem>
      <SegmentPickerItem value="table" aria-label="Table">
        <IconPlaceholder
          lucide="TableIcon"
          tabler="IconTable"
          hugeicons="TableIcon"
          phosphor="TableIcon"
          remixicon="RiTableLine"
        />
      </SegmentPickerItem>
    </SegmentPicker>
  )
}
