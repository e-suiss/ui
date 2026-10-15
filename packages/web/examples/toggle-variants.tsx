import { TextBIcon } from "@phosphor-icons/react"
import { Toggle } from "@/components/ui/toggle"

export default function ToggleVariants() {
  return (
    <div className="flex items-center gap-3">
      <Toggle aria-label="Toggle bold" variant="default">
        <TextBIcon />
      </Toggle>
      <Toggle aria-label="Toggle bold" variant="outline">
        <TextBIcon />
      </Toggle>
    </div>
  )
}
