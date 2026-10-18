import * as React from "react"
import { View } from "react-native"
import { Text } from "@/components/ui/text"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

type GroupProps = Omit<
  React.ComponentProps<typeof ToggleGroup>,
  "value" | "onValueChange" | "children"
>

const views = ["day", "week", "month", "year"]

function SegmentedDemo({
  items = views,
  ...props
}: GroupProps & { items?: string[] }) {
  const [value, setValue] = React.useState<string[]>(["week"])
  return (
    <ToggleGroup
      spacing={0}
      value={value}
      onValueChange={setValue}
      accessibilityLabel="Calendar view"
      {...props}
    >
      {items.map((item) => (
        <ToggleGroupItem key={item} value={item}>
          <Text className="capitalize">{item}</Text>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

export default function ToggleGroupSegmentedSizes() {
  return (
    <View className="items-start gap-3">
      <SegmentedDemo size="sm" items={views.slice(0, 3)} />
      <SegmentedDemo items={views.slice(0, 3)} />
      <SegmentedDemo size="lg" items={views.slice(0, 3)} />
    </View>
  )
}
