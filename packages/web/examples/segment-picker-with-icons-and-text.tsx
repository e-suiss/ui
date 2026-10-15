import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import {
  SegmentPicker,
  SegmentPickerItem,
} from "@/components/patterns/segment-picker"

export default function SegmentPickerWithIconsAndText() {
  return (
    <SegmentPicker defaultValue="grid" aria-label="View">
      <SegmentPickerItem value="list" label="List">
        <IconPlaceholder
          lucide="MenuIcon"
          tabler="IconMenu2"
          hugeicons="Menu01Icon"
          phosphor="ListIcon"
          remixicon="RiMenuLine"
          data-icon="inline-start"
        />
        List
      </SegmentPickerItem>
      <SegmentPickerItem value="grid" label="Grid">
        <IconPlaceholder
          lucide="LayoutGridIcon"
          tabler="IconLayoutGrid"
          hugeicons="GridViewIcon"
          phosphor="SquaresFourIcon"
          remixicon="RiLayoutGridLine"
          data-icon="inline-start"
        />
        Grid
      </SegmentPickerItem>
      <SegmentPickerItem value="table" label="Table">
        <IconPlaceholder
          lucide="TableIcon"
          tabler="IconTable"
          hugeicons="TableIcon"
          phosphor="TableIcon"
          remixicon="RiTableLine"
          data-icon="inline-start"
        />
        Table
      </SegmentPickerItem>
    </SegmentPicker>
  )
}
