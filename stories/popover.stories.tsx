import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Text } from "@/components/ui/text"

const dimensions = [
  { id: "width", label: "Width", value: "100%" },
  { id: "max-width", label: "Max. width", value: "300px" },
  { id: "height", label: "Height", value: "25px" },
]

const meta = {
  title: "Components/Popover",
  component: Popover,
} satisfies Meta<typeof Popover>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <View className="items-start">
      <Popover>
        <PopoverTrigger render={<Button variant="outline" />}>
          <Text>Open popover</Text>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-80">
          <View className="gap-4">
            <View className="gap-2">
              <Text className="font-medium leading-none">Dimensions</Text>
              <Text variant="muted">Set the dimensions for the layer.</Text>
            </View>
            <View className="gap-2">
              {dimensions.map((dimension) => (
                <View
                  key={dimension.id}
                  className="flex-row items-center gap-4"
                >
                  <Label nativeID={`popover-${dimension.id}`} className="w-24">
                    {dimension.label}
                  </Label>
                  <Input
                    accessibilityLabelledBy={`popover-${dimension.id}`}
                    defaultValue={dimension.value}
                    className="h-8 flex-1"
                  />
                </View>
              ))}
            </View>
          </View>
        </PopoverContent>
      </Popover>
    </View>
  ),
}

export const Sides: Story = {
  render: () => (
    <View className="items-center gap-4 py-24">
      {(["top", "bottom"] as const).map((side) => (
        <Popover key={side}>
          <PopoverTrigger render={<Button variant="outline" />}>
            <Text className="capitalize">{side}</Text>
          </PopoverTrigger>
          <PopoverContent side={side} className="w-56">
            <Text className="text-sm">Popover on the {side}.</Text>
          </PopoverContent>
        </Popover>
      ))}
    </View>
  ),
}

export const Simple: Story = {
  render: () => (
    <View className="items-start">
      <Popover>
        <PopoverTrigger render={<Button />}>
          <Text>Info</Text>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-64">
          <Text className="text-sm">
            Popovers display rich content next to a trigger.
          </Text>
        </PopoverContent>
      </Popover>
    </View>
  ),
}

export const OpenByDefault: Story = {
  render: () => (
    <View className="items-start">
      <Popover defaultOpen>
        <PopoverTrigger render={<Button variant="outline" />}>
          <Text>Open popover</Text>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-80">
          <View className="gap-4">
            <View className="gap-2">
              <Text className="font-medium leading-none">Dimensions</Text>
              <Text variant="muted">Set the dimensions for the layer.</Text>
            </View>
            <View className="gap-2">
              {dimensions.map((dimension) => (
                <View
                  key={dimension.id}
                  className="flex-row items-center gap-4"
                >
                  <Label nativeID={`popover-${dimension.id}`} className="w-24">
                    {dimension.label}
                  </Label>
                  <Input
                    accessibilityLabelledBy={`popover-${dimension.id}`}
                    defaultValue={dimension.value}
                    className="h-8 flex-1"
                  />
                </View>
              ))}
            </View>
          </View>
        </PopoverContent>
      </Popover>
    </View>
  ),
}
