import * as React from "react"
import { Text } from "@/components/ui/text"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export default function ToggleGroupSegmentedVertical() {
  const [value, setValue] = React.useState<string[]>(["week"])
  return (
    <ToggleGroup
      spacing={0}
      value={value}
      onValueChange={setValue}
      accessibilityLabel="Calendar view"
      orientation="vertical"
    >
      <ToggleGroupItem value="day">
        <Text>Day</Text>
      </ToggleGroupItem>
      <ToggleGroupItem value="week">
        <Text>Week</Text>
      </ToggleGroupItem>
      <ToggleGroupItem value="month">
        <Text>Month</Text>
      </ToggleGroupItem>
      <ToggleGroupItem value="year">
        <Text>Year</Text>
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
