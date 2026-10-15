import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export default function ToggleGroupSingleSelection() {
  return (
    <ToggleGroup
      variant="outline"
      spacing={2}
      orientation="horizontal"
      selectionMode="single"
      defaultSelectedKeys={["left"]}
    >
      <ToggleGroupItem id="left" aria-label="Align left">
        <IconPlaceholder
          lucide="TextAlignStartIcon"
          tabler="IconAlignLeft"
          hugeicons="TextAlignLeftIcon"
          phosphor="TextAlignLeftIcon"
          remixicon="RiAlignLeft"
        />
      </ToggleGroupItem>
      <ToggleGroupItem id="center" aria-label="Align center">
        <IconPlaceholder
          lucide="TextAlignCenterIcon"
          tabler="IconAlignCenter"
          hugeicons="TextAlignCenterIcon"
          phosphor="TextAlignCenterIcon"
          remixicon="RiAlignCenter"
        />
      </ToggleGroupItem>
      <ToggleGroupItem id="right" aria-label="Align right">
        <IconPlaceholder
          lucide="TextAlignEndIcon"
          tabler="IconAlignRight"
          hugeicons="TextAlignRightIcon"
          phosphor="TextAlignRightIcon"
          remixicon="RiAlignRight"
        />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
