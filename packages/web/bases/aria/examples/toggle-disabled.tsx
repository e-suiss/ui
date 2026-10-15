import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Toggle } from "@/components/ui/toggle"

export default function ToggleDisabled() {
  return (
    <Toggle isDisabled aria-label="Toggle bold">
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
