import type { Meta, StoryObj } from "@storybook/react-native"
import * as React from "react"
import { View } from "react-native"
import {
  Picker,
  PickerGroup,
  PickerItem,
  PickerSeparator,
} from "@/components/patterns/picker"
import { Text } from "@/components/ui/text"

function PickerDemo() {
  const [value, setValue] = React.useState<string>()
  return (
    <View className="gap-2">
      <Picker
        value={value}
        onValueChange={setValue}
        placeholder="Select a fruit"
        accessibilityLabel="Fruit"
        className="w-56"
      >
        <PickerGroup label="Fruits">
          <PickerItem value="cherry">Cherry</PickerItem>
          <PickerItem value="banana">Banana</PickerItem>
          <PickerItem value="mango">Mango</PickerItem>
        </PickerGroup>
        <PickerSeparator />
        <PickerGroup label="Vegetables">
          <PickerItem value="carrot">Carrot</PickerItem>
          <PickerItem value="spinach" disabled>
            Spinach
          </PickerItem>
        </PickerGroup>
      </Picker>
      <Text className="text-sm text-muted-foreground">
        Selected: {value ?? "none"}
      </Text>
    </View>
  )
}

const meta = {
  title: "Patterns/Picker",
  component: Picker,
} satisfies Meta<typeof Picker>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <PickerDemo />,
}

export const States: Story = {
  render: () => (
    <View className="gap-3">
      <Picker defaultValue="banana" size="sm" className="w-56">
        <PickerItem value="cherry">Cherry</PickerItem>
        <PickerItem value="banana">Banana</PickerItem>
      </Picker>
      <Picker placeholder="Invalid" invalid className="w-56">
        <PickerItem value="cherry">Cherry</PickerItem>
      </Picker>
      <Picker placeholder="Disabled" disabled className="w-56">
        <PickerItem value="cherry">Cherry</PickerItem>
      </Picker>
    </View>
  ),
}
