import {
  TextBIcon,
  TextItalicIcon,
  TextUnderlineIcon,
} from "phosphor-react-native"
import * as React from "react"
import {
  ToggleGroup,
  ToggleGroupIcon,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export default function ToggleGroupDisabled() {
  const [value, setValue] = React.useState<string[]>(["bold"])
  return (
    <ToggleGroup multiple value={value} onValueChange={setValue} disabled>
      <ToggleGroupItem value="bold" accessibilityLabel="Toggle bold">
        <ToggleGroupIcon as={TextBIcon} />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" accessibilityLabel="Toggle italic">
        <ToggleGroupIcon as={TextItalicIcon} />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" accessibilityLabel="Toggle underline">
        <ToggleGroupIcon as={TextUnderlineIcon} />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
