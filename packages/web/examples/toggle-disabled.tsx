import { TextBIcon } from "@phosphor-icons/react"
import { Toggle } from "@/components/ui/toggle"

export default function ToggleDisabled() {
  return (
    <Toggle disabled aria-label="Toggle bold">
      <TextBIcon />
    </Toggle>
  )
}
