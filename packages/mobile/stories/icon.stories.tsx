import type { Meta, StoryObj } from "@storybook/react-native"
import {
  BellIcon,
  GearIcon,
  HeartIcon,
  InfoIcon,
  StarIcon,
  WarningIcon,
} from "phosphor-react-native"
import { View } from "react-native"
import { Icon } from "@/components/ui/icon"

const meta = {
  title: "Components/Icon",
  component: Icon,
  args: {
    as: StarIcon,
  },
} satisfies Meta<typeof Icon>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Sizes: Story = {
  render: () => (
    <View className="flex-row items-center gap-4">
      <Icon as={BellIcon} className="size-4" />
      <Icon as={BellIcon} />
      <Icon as={BellIcon} className="size-6" />
      <Icon as={BellIcon} className="size-8" />
    </View>
  ),
}

export const Colors: Story = {
  render: () => (
    <View className="flex-row items-center gap-4">
      <Icon as={InfoIcon} />
      <Icon as={GearIcon} className="text-muted-foreground" />
      <Icon as={HeartIcon} className="text-primary" weight="fill" />
      <Icon as={WarningIcon} className="text-destructive" />
    </View>
  ),
}

export const Weights: Story = {
  render: () => (
    <View className="flex-row items-center gap-4">
      <Icon as={StarIcon} className="size-6" weight="thin" />
      <Icon as={StarIcon} className="size-6" weight="light" />
      <Icon as={StarIcon} className="size-6" weight="regular" />
      <Icon as={StarIcon} className="size-6" weight="bold" />
      <Icon as={StarIcon} className="size-6" weight="fill" />
      <Icon as={StarIcon} className="size-6" weight="duotone" />
    </View>
  ),
}
