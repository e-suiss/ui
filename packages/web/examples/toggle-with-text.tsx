import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Toggle } from "@/components/ui/toggle"

export default function ToggleWithText() {
  return (
    <div className="flex items-center gap-3">
      <Toggle aria-label="Toggle italic">
        <IconPlaceholder
          lucide="ItalicIcon"
          tabler="IconItalic"
          hugeicons="TextItalicIcon"
          phosphor="TextItalicIcon"
          remixicon="RiItalic"
          data-icon="inline-start"
        />
        Italic
      </Toggle>
      <Toggle variant="outline" aria-label="Save for later">
        <IconPlaceholder
          lucide="BookmarkIcon"
          tabler="IconBookmark"
          hugeicons="Bookmark01Icon"
          phosphor="BookmarkSimpleIcon"
          remixicon="RiBookmarkLine"
          data-icon="inline-start"
        />
        Save
      </Toggle>
    </div>
  )
}
