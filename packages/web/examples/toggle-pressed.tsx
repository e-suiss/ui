import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Toggle } from "@/components/ui/toggle"

export default function TogglePressed() {
  return (
    <Toggle aria-label="Toggle bold" defaultPressed>
      <IconPlaceholder
        lucide="BoldIcon"
        tabler="IconBold"
        hugeicons="TextBoldIcon"
        phosphor="TextBIcon"
        remixicon="RiBold"
      />
    </Toggle>
  )
}
