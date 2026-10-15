import { TextBIcon } from "@phosphor-icons/react"
import { Toggle } from "@/components/ui/toggle"

export default function TogglePressed() {
  return (
    <Toggle aria-label="Toggle bold" defaultPressed>
      <TextBIcon />
    </Toggle>
  )
}
