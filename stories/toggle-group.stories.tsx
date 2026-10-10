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
import { Text } from "@/components/ui/text"
import {
  ToggleGroup,
  ToggleGroupIcon,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

type GroupProps = Omit<
  React.ComponentProps<typeof ToggleGroup>,
  "value" | "onValueChange" | "children"
>

function FormattingDemo({
  initial = ["bold"],
  ...props
}: GroupProps & { initial?: string[] }) {
  const [value, setValue] = React.useState<string[]>(initial)
  return (
    <ToggleGroup multiple value={value} onValueChange={setValue} {...props}>
      <ToggleGroupItem value="bold" accessibilityLabel="Toggle bold">
        <ToggleGroupIcon as={TextBIcon} />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" accessibilityLabel="Toggle italic">
        <ToggleGroupIcon as={TextItalicIcon} />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" accessibilityLabel="Toggle underline">
        <ToggleGroupIcon as={TextUnderlineIcon} />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

function AlignmentDemo() {
  const [value, setValue] = React.useState<string[]>(["left"])
  return (
    <ToggleGroup value={value} onValueChange={setValue} variant="outline">
      <ToggleGroupItem value="left" accessibilityLabel="Align left">
        <ToggleGroupIcon as={TextAlignLeftIcon} />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" accessibilityLabel="Align center">
        <ToggleGroupIcon as={TextAlignCenterIcon} />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" accessibilityLabel="Align right">
        <ToggleGroupIcon as={TextAlignRightIcon} />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

const views = ["day", "week", "month", "year"]

function SegmentedDemo({
  items = views,
  ...props
}: GroupProps & { items?: string[] }) {
  const [value, setValue] = React.useState<string[]>(["week"])
  return (
    <ToggleGroup
      spacing={0}
      value={value}
      onValueChange={setValue}
      accessibilityLabel="Calendar view"
      {...props}
    >
      {items.map((item) => (
        <ToggleGroupItem key={item} value={item}>
          <Text className="capitalize">{item}</Text>
        </ToggleGroupItem>
      ))}
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
  render: () => <FormattingDemo variant="outline" initial={["italic"]} />,
}

export const Attached: Story = {
  render: () => <FormattingDemo variant="outline" spacing={0} />,
}

export const Sizes: Story = {
  render: () => (
    <View className="items-start gap-3">
      <FormattingDemo size="sm" />
      <FormattingDemo />
      <FormattingDemo size="lg" />
    </View>
  ),
}

export const Segmented: Story = {
  render: () => <SegmentedDemo />,
}

export const SegmentedVertical: Story = {
  render: () => <SegmentedDemo orientation="vertical" />,
}

export const SegmentedMultiple: Story = {
  render: () => <FormattingDemo spacing={0} initial={["bold", "underline"]} />,
}

export const SegmentedSizes: Story = {
  render: () => (
    <View className="items-start gap-3">
      <SegmentedDemo size="sm" items={views.slice(0, 3)} />
      <SegmentedDemo items={views.slice(0, 3)} />
      <SegmentedDemo size="lg" items={views.slice(0, 3)} />
    </View>
  ),
}

export const SingleSelection: Story = {
  render: () => <AlignmentDemo />,
}

export const Vertical: Story = {
  render: () => (
    <FormattingDemo orientation="vertical" variant="outline" spacing={0} />
  ),
}

export const Disabled: Story = {
  render: () => <FormattingDemo disabled />,
}
