import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export default function ToggleGroupAttached() {
  return (
    <ToggleGroup
      variant="outline"
      spacing={0}
      orientation="horizontal"
      selectionMode="multiple"
      defaultSelectedKeys={["bold"]}
    >
      <ToggleGroupItem id="bold" aria-label="Toggle bold">
        <IconPlaceholder
          lucide="BoldIcon"
          tabler="IconBold"
          hugeicons="TextBoldIcon"
          phosphor="TextBIcon"
          remixicon="RiBold"
        />
      </ToggleGroupItem>
      <ToggleGroupItem id="italic" aria-label="Toggle italic">
        <IconPlaceholder
          lucide="ItalicIcon"
          tabler="IconItalic"
          hugeicons="TextItalicIcon"
          phosphor="TextItalicIcon"
          remixicon="RiItalic"
        />
      </ToggleGroupItem>
      <ToggleGroupItem id="underline" aria-label="Toggle underline">
        <IconPlaceholder
          lucide="UnderlineIcon"
          tabler="IconUnderline"
          hugeicons="TextUnderlineIcon"
          phosphor="TextUnderlineIcon"
          remixicon="RiUnderline"
        />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
