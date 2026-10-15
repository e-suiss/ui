import type { Meta, StoryObj } from "@storybook/react-native"
import * as React from "react"
import { View } from "react-native"
import { Slider } from "@/components/ui/slider"
import { Text } from "@/components/ui/text"

const meta = {
  title: "Components/Slider",
  component: Slider,
  args: {
    defaultValue: 50,
    max: 100,
    step: 1,
    accessibilityLabel: "Volume",
  },
} satisfies Meta<typeof Slider>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

function ControlledDemo() {
  const [value, setValue] = React.useState(30)
  const [committed, setCommitted] = React.useState(30)
  return (
    <View className="w-full gap-3">
      <View className="flex-row items-center justify-between">
        <Text className="text-sm font-medium">Brightness</Text>
        <Text className="text-sm text-muted-foreground">
          {value} / committed {committed}
        </Text>
      </View>
      <Slider
        value={value}
        onValueChange={(next) => setValue(next)}
        onValueCommitted={(next) => setCommitted(next)}
        accessibilityLabel="Brightness"
      />
    </View>
  )
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
}

function RangeDemo() {
  const [value, setValue] = React.useState<readonly number[]>([25, 75])
  return (
    <View className="w-full gap-3">
      <View className="flex-row items-center justify-between">
        <Text className="text-sm font-medium">Price</Text>
        <Text className="text-sm text-muted-foreground">
          ${value[0]} – ${value[1]}
        </Text>
      </View>
      <Slider
        value={value}
        onValueChange={setValue}
        step={5}
        minStepsBetweenValues={2}
        accessibilityLabel="Price"
      />
    </View>
  )
}

export const Range: Story = {
  render: () => <RangeDemo />,
}

export const MultipleThumbs: Story = {
  args: {
    defaultValue: [10, 40, 80],
    thumbCollisionBehavior: "swap",
  },
}

export const Step: Story = {
  args: {
    defaultValue: 0.5,
    min: 0,
    max: 1,
    step: 0.1,
  },
}

export const Vertical: Story = {
  render: () => (
    <View className="h-48 flex-row justify-center gap-8">
      <Slider defaultValue={40} orientation="vertical" />
      <Slider defaultValue={[20, 70]} orientation="vertical" />
    </View>
  ),
}

export const Disabled: Story = {
  args: {
    defaultValue: 40,
    disabled: true,
  },
}
