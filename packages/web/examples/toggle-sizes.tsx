import { TextBIcon } from "@phosphor-icons/react"
import { Toggle } from "@/components/ui/toggle"

export default function ToggleSizes() {
  return (
    <div className="flex items-center gap-3">
      <Toggle aria-label="Toggle bold" size="sm">
        <TextBIcon />
      </Toggle>
      <Toggle aria-label="Toggle bold" size="default">
        <TextBIcon />
      </Toggle>
      <Toggle aria-label="Toggle bold" size="lg">
        <TextBIcon />
      </Toggle>
    </div>
  )
}
