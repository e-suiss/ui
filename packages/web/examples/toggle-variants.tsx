import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Toggle } from "@/components/ui/toggle"

export default function ToggleVariants() {
  return (
    <div className="flex items-center gap-3">
      <Toggle aria-label="Toggle bold" variant="default">
        <IconPlaceholder
          lucide="BoldIcon"
          tabler="IconBold"
          hugeicons="TextBoldIcon"
          phosphor="TextBIcon"
          remixicon="RiBold"
        />
      </Toggle>
      <Toggle aria-label="Toggle bold" variant="outline">
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
