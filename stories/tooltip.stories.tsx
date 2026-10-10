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
        <TooltipTrigger asChild>
          <Button variant="outline">
            <Text>Hover or press</Text>
          </Button>
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
      {(["top", "bottom"] as const).map((side) => (
        <Tooltip key={side}>
          <TooltipTrigger asChild>
            <Button variant="outline">
              <Text className="capitalize">{side}</Text>
            </Button>
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
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon">
            <Icon as={PlusIcon} />
          </Button>
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
        <TooltipTrigger asChild>
          <Button variant="outline">
            <Text>Hover or press</Text>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <Text>Add to library</Text>
        </TooltipContent>
      </Tooltip>
    </View>
  ),
}
