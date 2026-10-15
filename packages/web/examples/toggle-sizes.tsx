import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Toggle } from "@/components/ui/toggle"

export default function ToggleSizes() {
  return (
    <div className="flex items-center gap-3">
      <Toggle aria-label="Toggle bold" size="sm">
        <IconPlaceholder
          lucide="BoldIcon"
          tabler="IconBold"
          hugeicons="TextBoldIcon"
          phosphor="TextBIcon"
          remixicon="RiBold"
        />
      </Toggle>
      <Toggle aria-label="Toggle bold" size="default">
        <IconPlaceholder
          lucide="BoldIcon"
          tabler="IconBold"
          hugeicons="TextBoldIcon"
          phosphor="TextBIcon"
          remixicon="RiBold"
        />
      </Toggle>
      <Toggle aria-label="Toggle bold" size="lg">
        <IconPlaceholder
          lucide="BoldIcon"
          tabler="IconBold"
          hugeicons="TextBoldIcon"
          phosphor="TextBIcon"
          remixicon="RiBold"
        />
      </Toggle>
    </div>
  )
}
