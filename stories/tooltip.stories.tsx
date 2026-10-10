import type { Meta, StoryObj } from "@storybook/react-native"
import { PlusIcon } from "phosphor-react-native"
import { View } from "react-native"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const meta = {
  title: "Components/Tooltip",
  component: Tooltip,
} satisfies Meta<typeof Tooltip>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <View className="items-center py-12">
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" />}>
          <Text>Long press</Text>
        </TooltipTrigger>
        <TooltipContent>
          <Text>Add to library</Text>
        </TooltipContent>
      </Tooltip>
    </View>
  ),
}

export const Sides: Story = {
  render: () => (
    <View className="items-center gap-4 py-12">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Tooltip key={side}>
          <TooltipTrigger render={<Button variant="outline" />}>
            <Text className="capitalize">{side}</Text>
          </TooltipTrigger>
          <TooltipContent side={side}>
            <Text>Tooltip on the {side}</Text>
          </TooltipContent>
        </Tooltip>
      ))}
    </View>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <View className="items-center py-12">
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" size="icon" />}>
          <Icon as={PlusIcon} />
        </TooltipTrigger>
        <TooltipContent>
          <Text>New item</Text>
        </TooltipContent>
      </Tooltip>
    </View>
  ),
}

export const OpenByDefault: Story = {
  render: () => (
    <View className="items-center py-12">
      <Tooltip defaultOpen>
        <TooltipTrigger render={<Button variant="outline" />}>
          <Text>Long press</Text>
        </TooltipTrigger>
        <TooltipContent>
          <Text>Add to library</Text>
        </TooltipContent>
      </Tooltip>
    </View>
  ),
}
