import type { Meta, StoryObj } from "@storybook/react-native"
import * as React from "react"
import { View } from "react-native"
import { PageIndicator } from "@/components/ui/page-indicator"
import { Text } from "@/components/ui/text"

function InteractiveIndicator({ count }: { count: number }) {
  const [index, setIndex] = React.useState(0)
  return (
    <View className="items-center gap-3">
      <PageIndicator count={count} index={index} onIndexChange={setIndex} />
      <Text variant="muted">
        Page {index + 1} of {count}
      </Text>
    </View>
  )
}

const meta = {
  title: "Components/Page Indicator",
  component: PageIndicator,
  args: { count: 5, index: 1 },
} satisfies Meta<typeof PageIndicator>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Sizes: Story = {
  render: (args) => (
    <View className="items-center gap-6">
      <PageIndicator {...args} size="sm" />
      <PageIndicator {...args} />
    </View>
  ),
}

export const Accent: Story = {
  args: { variant: "accent" },
}

export const ManyPages: Story = {
  render: () => (
    <View className="items-center gap-6">
      <PageIndicator count={12} index={0} />
      <PageIndicator count={12} index={5} />
      <PageIndicator count={12} index={11} />
    </View>
  ),
}

export const Interactive: Story = {
  render: () => <InteractiveIndicator count={12} />,
}
