import {
  TextBIcon,
  TextItalicIcon,
  TextUnderlineIcon,
} from "@phosphor-icons/react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export default function ToggleGroupSizes() {
  return (
    <div className="flex flex-col items-start gap-3">
      {(["sm", "default", "lg"] as const).map((size) => (
        <ToggleGroup
          key={size}
          spacing={2}
          orientation="horizontal"
          multiple
          size={size}
        >
          <ToggleGroupItem value="bold" aria-label="Toggle bold">
            <TextBIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Toggle italic">
            <TextItalicIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Toggle underline">
            <TextUnderlineIcon />
          </ToggleGroupItem>
        </ToggleGroup>
      ))}
    </div>
  )
}
