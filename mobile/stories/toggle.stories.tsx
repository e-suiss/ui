import type { Meta, StoryObj } from "@storybook/react-native"
import {
  BookmarkSimpleIcon,
  TextBIcon,
  TextItalicIcon,
} from "phosphor-react-native"
import * as React from "react"
import { View } from "react-native"
import { Text } from "@/components/ui/text"
import { Toggle, ToggleIcon } from "@/components/ui/toggle"

type ToggleDemoProps = Omit<
  React.ComponentProps<typeof Toggle>,
  "pressed" | "onPressedChange"
> & {
  initial?: boolean
}

function ToggleDemo({ initial = false, children, ...props }: ToggleDemoProps) {
  const [pressed, setPressed] = React.useState(initial)
  return (
    <Toggle pressed={pressed} onPressedChange={setPressed} {...props}>
      {children}
    </Toggle>
  )
}

const meta = {
  title: "Components/Toggle",
  component: Toggle,
  args: {
    pressed: false,
    onPressedChange: () => {},
  },
} satisfies Meta<typeof Toggle>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <View className="flex-row">
      <ToggleDemo accessibilityLabel="Toggle bold">
        <ToggleIcon as={TextBIcon} />
      </ToggleDemo>
    </View>
  ),
}

export const Pressed: Story = {
  render: () => (
    <View className="flex-row">
      <ToggleDemo initial accessibilityLabel="Toggle bold">
        <ToggleIcon as={TextBIcon} />
      </ToggleDemo>
    </View>
  ),
}

export const Variants: Story = {
  render: () => (
    <View className="flex-row gap-2">
      <ToggleDemo accessibilityLabel="Toggle italic">
        <ToggleIcon as={TextItalicIcon} />
      </ToggleDemo>
      <ToggleDemo variant="outline" accessibilityLabel="Toggle italic">
        <ToggleIcon as={TextItalicIcon} />
      </ToggleDemo>
    </View>
  ),
}

export const Sizes: Story = {
  render: () => (
    <View className="flex-row items-center gap-2">
      <ToggleDemo size="sm" variant="outline" accessibilityLabel="Small">
        <ToggleIcon as={TextBIcon} />
      </ToggleDemo>
      <ToggleDemo variant="outline" accessibilityLabel="Default">
        <ToggleIcon as={TextBIcon} />
      </ToggleDemo>
      <ToggleDemo size="lg" variant="outline" accessibilityLabel="Large">
        <ToggleIcon as={TextBIcon} />
      </ToggleDemo>
    </View>
  ),
}

export const WithText: Story = {
  render: () => (
    <View className="flex-row">
      <ToggleDemo variant="outline" accessibilityLabel="Bookmark">
        <ToggleIcon as={BookmarkSimpleIcon} />
        <Text>Bookmark</Text>
      </ToggleDemo>
    </View>
  ),
}

export const Disabled: Story = {
  render: () => (
    <View className="flex-row gap-2">
      <ToggleDemo disabled accessibilityLabel="Toggle bold">
        <ToggleIcon as={TextBIcon} />
      </ToggleDemo>
      <ToggleDemo
        disabled
        initial
        variant="outline"
        accessibilityLabel="Toggle italic"
      >
        <ToggleIcon as={TextItalicIcon} />
      </ToggleDemo>
    </View>
  ),
}
