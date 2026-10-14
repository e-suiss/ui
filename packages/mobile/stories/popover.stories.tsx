import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { createHandle } from "@/components/primitives/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Text } from "@/components/ui/text"

const dimensions = [
  { id: "width", label: "Width", value: "100%" },
  { id: "max-width", label: "Max. width", value: "300px" },
  { id: "height", label: "Height", value: "25px" },
]

const members = [
  { id: "ada", name: "Ada", role: "Design lead" },
  { id: "linus", name: "Linus", role: "Platform engineer" },
  { id: "grace", name: "Grace", role: "Product manager" },
]

const memberPopover = createHandle<(typeof members)[number]>()

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
            <PopoverHeader>
              <PopoverTitle>Dimensions</PopoverTitle>
              <PopoverDescription>
                Set the dimensions for the layer.
              </PopoverDescription>
            </PopoverHeader>
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
      {(["top", "right", "bottom", "left"] as const).map((side) => (
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
            <PopoverHeader>
              <PopoverTitle>Dimensions</PopoverTitle>
              <PopoverDescription>
                Set the dimensions for the layer.
              </PopoverDescription>
            </PopoverHeader>
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

export const DetachedTriggers: Story = {
  render: () => (
    <View className="flex-row items-start gap-2">
      {members.map((member) => (
        <PopoverTrigger
          key={member.id}
          id={member.id}
          handle={memberPopover}
          payload={member}
          render={<Button variant="outline" />}
        >
          <Text>{member.name}</Text>
        </PopoverTrigger>
      ))}
      <Popover handle={memberPopover}>
        {({ payload }) => (
          <PopoverContent align="start">
            <PopoverHeader>
              <PopoverTitle>{payload?.name}</PopoverTitle>
              <PopoverDescription>{payload?.role}</PopoverDescription>
            </PopoverHeader>
          </PopoverContent>
        )}
      </Popover>
    </View>
  ),
}
