import type { Meta, StoryObj } from "@storybook/react-native"
import {
  TextAlignCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
  TextBIcon,
  TextItalicIcon,
  TextUnderlineIcon,
} from "phosphor-react-native"
import * as React from "react"
import { View } from "react-native"
import {
  ToggleGroup,
  ToggleGroupIcon,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

type Variant = "default" | "outline"
type Size = "default" | "sm" | "lg"

function FormattingDemo({
  variant,
  size,
  disabled = false,
}: {
  variant?: Variant
  size?: Size
  disabled?: boolean
}) {
  const [value, setValue] = React.useState<string[]>(["bold"])
  return (
    <ToggleGroup
      multiple
      value={value}
      onValueChange={setValue}
      variant={variant}
      size={size}
      disabled={disabled}
    >
      <ToggleGroupItem value="bold" accessibilityLabel="Toggle bold" isFirst>
        <ToggleGroupIcon as={TextBIcon} />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" accessibilityLabel="Toggle italic">
        <ToggleGroupIcon as={TextItalicIcon} />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="underline"
        accessibilityLabel="Toggle underline"
        isLast
      >
        <ToggleGroupIcon as={TextUnderlineIcon} />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

function AlignmentDemo() {
  const [value, setValue] = React.useState<string[]>(["left"])
  return (
    <ToggleGroup value={value} onValueChange={setValue} variant="outline">
      <ToggleGroupItem value="left" accessibilityLabel="Align left" isFirst>
        <ToggleGroupIcon as={TextAlignLeftIcon} />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" accessibilityLabel="Align center">
        <ToggleGroupIcon as={TextAlignCenterIcon} />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" accessibilityLabel="Align right" isLast>
        <ToggleGroupIcon as={TextAlignRightIcon} />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

const meta = {
  title: "Components/Toggle Group",
  component: ToggleGroup,
  args: {
    multiple: true,
    value: [],
    onValueChange: () => {},
  },
} satisfies Meta<typeof ToggleGroup>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <FormattingDemo />,
}

export const Outline: Story = {
  render: () => <FormattingDemo variant="outline" />,
}

export const Sizes: Story = {
  render: () => (
    <View className="items-start gap-4">
      <FormattingDemo variant="outline" size="sm" />
      <FormattingDemo variant="outline" />
      <FormattingDemo variant="outline" size="lg" />
    </View>
  ),
}

export const SingleSelection: Story = {
  render: () => <AlignmentDemo />,
}

export const Disabled: Story = {
  render: () => <FormattingDemo variant="outline" disabled />,
}
