import type { Meta, StoryObj } from "@storybook/react-native"
import {
  ArrowRightIcon,
  DownloadSimpleIcon,
  PlusIcon,
  TrashIcon,
} from "phosphor-react-native"
import { View } from "react-native"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

const meta = {
  title: "Components/Button",
  component: Button,
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <View className="items-start">
      <Button>
        <Text>Button</Text>
      </Button>
    </View>
  ),
}

export const Variants: Story = {
  render: () => (
    <View className="gap-3">
      <Button>
        <Text>Default</Text>
      </Button>
      <Button variant="secondary">
        <Text>Secondary</Text>
      </Button>
      <Button variant="tinted">
        <Text>Tinted</Text>
      </Button>
      <Button variant="outline">
        <Text>Outline</Text>
      </Button>
      <Button variant="ghost">
        <Text>Ghost</Text>
      </Button>
      <Button variant="plain">
        <Text>Plain</Text>
      </Button>
      <Button variant="destructive">
        <Text>Destructive</Text>
      </Button>
      <Button variant="link">
        <Text>Link</Text>
      </Button>
      <Button size="icon" variant="outline">
        <Icon as={PlusIcon} />
      </Button>
    </View>
  ),
}

export const Sizes: Story = {
  render: () => (
    <View className="gap-3">
      <View className="flex-row flex-wrap items-center gap-3">
        <Button size="xs">
          <Text>Extra small</Text>
        </Button>
        <Button size="sm">
          <Text>Small</Text>
        </Button>
        <Button>
          <Text>Default</Text>
        </Button>
        <Button size="lg">
          <Text>Large</Text>
        </Button>
        <Button size="xl">
          <Text>Extra large</Text>
        </Button>
      </View>
      <View className="flex-row flex-wrap items-center gap-3">
        <Button size="icon-xs" variant="secondary">
          <Icon as={PlusIcon} />
        </Button>
        <Button size="icon-sm" variant="secondary">
          <Icon as={PlusIcon} />
        </Button>
        <Button size="icon" variant="secondary">
          <Icon as={PlusIcon} />
        </Button>
        <Button size="icon-lg" variant="secondary">
          <Icon as={PlusIcon} />
        </Button>
        <Button size="icon-xl" variant="secondary">
          <Icon as={PlusIcon} />
        </Button>
      </View>
    </View>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <View className="items-start gap-3">
      <Button>
        <Icon as={DownloadSimpleIcon} />
        <Text>Download</Text>
      </Button>
      <Button variant="outline">
        <Text>Continue</Text>
        <Icon as={ArrowRightIcon} />
      </Button>
      <Button variant="destructive">
        <Icon as={TrashIcon} />
        <Text>Delete</Text>
      </Button>
    </View>
  ),
}

export const Disabled: Story = {
  render: () => (
    <View className="items-start gap-3">
      <Button disabled>
        <Text>Default</Text>
      </Button>
      <Button disabled variant="secondary">
        <Text>Secondary</Text>
      </Button>
      <Button disabled variant="tinted">
        <Text>Tinted</Text>
      </Button>
      <Button disabled variant="outline">
        <Text>Outline</Text>
      </Button>
      <Button disabled variant="destructive">
        <Text>Destructive</Text>
      </Button>
    </View>
  ),
}

export const Block: Story = {
  render: () => (
    <View className="gap-3">
      <Button block size="lg">
        <Text>Continue</Text>
      </Button>
      <Button block size="lg" variant="secondary">
        <Text>Not now</Text>
      </Button>
      <Button block variant="tinted">
        <Text>Learn more</Text>
      </Button>
    </View>
  ),
}
