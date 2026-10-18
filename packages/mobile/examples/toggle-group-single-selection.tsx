import {
  TextAlignCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
} from "phosphor-react-native"
import * as React from "react"
import {
  ToggleGroup,
  ToggleGroupIcon,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

function AlignmentDemo() {
  const [value, setValue] = React.useState<string[]>(["left"])
  return (
    <ToggleGroup value={value} onValueChange={setValue} variant="outline">
      <ToggleGroupItem value="left" accessibilityLabel="Align left">
        <ToggleGroupIcon as={TextAlignLeftIcon} />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" accessibilityLabel="Align center">
        <ToggleGroupIcon as={TextAlignCenterIcon} />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" accessibilityLabel="Align right">
        <ToggleGroupIcon as={TextAlignRightIcon} />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

export default function ToggleGroupSingleSelection() {
  return <AlignmentDemo />
}
