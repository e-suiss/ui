import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export default function ToggleGroupSizes() {
  return (
    <div className="flex flex-col items-start gap-3">
      <ToggleGroup
        spacing={2}
        orientation="horizontal"
        type="multiple"
        size="sm"
      >
        <ToggleGroupItem value="bold" aria-label="Toggle bold">
          <IconPlaceholder
            lucide="BoldIcon"
            tabler="IconBold"
            hugeicons="TextBoldIcon"
            phosphor="TextBIcon"
            remixicon="RiBold"
          />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Toggle italic">
          <IconPlaceholder
            lucide="ItalicIcon"
            tabler="IconItalic"
            hugeicons="TextItalicIcon"
            phosphor="TextItalicIcon"
            remixicon="RiItalic"
          />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Toggle underline">
          <IconPlaceholder
            lucide="UnderlineIcon"
            tabler="IconUnderline"
            hugeicons="TextUnderlineIcon"
            phosphor="TextUnderlineIcon"
            remixicon="RiUnderline"
          />
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup
        spacing={2}
        orientation="horizontal"
        type="multiple"
        size="default"
      >
        <ToggleGroupItem value="bold" aria-label="Toggle bold">
          <IconPlaceholder
            lucide="BoldIcon"
            tabler="IconBold"
            hugeicons="TextBoldIcon"
            phosphor="TextBIcon"
            remixicon="RiBold"
          />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Toggle italic">
          <IconPlaceholder
            lucide="ItalicIcon"
            tabler="IconItalic"
            hugeicons="TextItalicIcon"
            phosphor="TextItalicIcon"
            remixicon="RiItalic"
          />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Toggle underline">
          <IconPlaceholder
            lucide="UnderlineIcon"
            tabler="IconUnderline"
            hugeicons="TextUnderlineIcon"
            phosphor="TextUnderlineIcon"
            remixicon="RiUnderline"
          />
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup
        spacing={2}
        orientation="horizontal"
        type="multiple"
        size="lg"
      >
        <ToggleGroupItem value="bold" aria-label="Toggle bold">
          <IconPlaceholder
            lucide="BoldIcon"
            tabler="IconBold"
            hugeicons="TextBoldIcon"
            phosphor="TextBIcon"
            remixicon="RiBold"
          />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Toggle italic">
          <IconPlaceholder
            lucide="ItalicIcon"
            tabler="IconItalic"
            hugeicons="TextItalicIcon"
            phosphor="TextItalicIcon"
            remixicon="RiItalic"
          />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Toggle underline">
          <IconPlaceholder
            lucide="UnderlineIcon"
            tabler="IconUnderline"
            hugeicons="TextUnderlineIcon"
            phosphor="TextUnderlineIcon"
            remixicon="RiUnderline"
          />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
