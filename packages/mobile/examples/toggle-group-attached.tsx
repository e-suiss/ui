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

type GroupProps = Omit<
  React.ComponentProps<typeof ToggleGroup>,
  "value" | "onValueChange" | "children"
>

function FormattingDemo({
  initial = ["bold"],
  ...props
}: GroupProps & { initial?: string[] }) {
  const [value, setValue] = React.useState<string[]>(initial)
  return (
    <ToggleGroup multiple value={value} onValueChange={setValue} {...props}>
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

export default function ToggleGroupAttached() {
  return <FormattingDemo variant="outline" spacing={0} />
}
