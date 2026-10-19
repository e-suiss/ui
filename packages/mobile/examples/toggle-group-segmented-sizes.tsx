import { View } from "react-native"
import { Text } from "@/components/ui/text"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export default function ToggleGroupSegmentedSizes() {
  return (
    <View className="items-start gap-3">
      <ToggleGroup
        spacing={0}
        defaultValue={["week"]}
        accessibilityLabel="Calendar view"
        size="sm"
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
      </ToggleGroup>
      <ToggleGroup
        spacing={0}
        defaultValue={["week"]}
        accessibilityLabel="Calendar view"
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
      </ToggleGroup>
      <ToggleGroup
        spacing={0}
        defaultValue={["week"]}
        accessibilityLabel="Calendar view"
        size="lg"
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
      </ToggleGroup>
    </View>
  )
}
