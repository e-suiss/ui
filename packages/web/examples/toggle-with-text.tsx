import { BookmarkSimpleIcon, TextItalicIcon } from "@phosphor-icons/react"
import { Toggle } from "@/components/ui/toggle"

export default function ToggleWithText() {
  return (
    <div className="flex items-center gap-3">
      <Toggle aria-label="Toggle italic">
        <TextItalicIcon data-icon="inline-start" />
        Italic
      </Toggle>
      <Toggle variant="outline" aria-label="Save for later">
        <BookmarkSimpleIcon data-icon="inline-start" />
        Save
      </Toggle>
    </div>
  )
}
