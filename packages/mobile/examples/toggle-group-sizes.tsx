import {
  TextBIcon,
  TextItalicIcon,
  TextUnderlineIcon,
} from "phosphor-react-native"
import { View } from "react-native"
import {
  ToggleGroup,
  ToggleGroupIcon,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export default function ToggleGroupSizes() {
  return (
    <View className="items-start gap-3">
      <ToggleGroup multiple defaultValue={["bold"]} size="sm">
        <ToggleGroupItem value="bold" accessibilityLabel="Toggle bold">
          <ToggleGroupIcon as={TextBIcon} />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" accessibilityLabel="Toggle italic">
          <ToggleGroupIcon as={TextItalicIcon} />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="underline"
          accessibilityLabel="Toggle underline"
        >
          <ToggleGroupIcon as={TextUnderlineIcon} />
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup multiple defaultValue={["bold"]}>
        <ToggleGroupItem value="bold" accessibilityLabel="Toggle bold">
          <ToggleGroupIcon as={TextBIcon} />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" accessibilityLabel="Toggle italic">
          <ToggleGroupIcon as={TextItalicIcon} />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="underline"
          accessibilityLabel="Toggle underline"
        >
          <ToggleGroupIcon as={TextUnderlineIcon} />
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup multiple defaultValue={["bold"]} size="lg">
        <ToggleGroupItem value="bold" accessibilityLabel="Toggle bold">
          <ToggleGroupIcon as={TextBIcon} />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" accessibilityLabel="Toggle italic">
          <ToggleGroupIcon as={TextItalicIcon} />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="underline"
          accessibilityLabel="Toggle underline"
        >
          <ToggleGroupIcon as={TextUnderlineIcon} />
        </ToggleGroupItem>
      </ToggleGroup>
    </View>
  )
}
