import type { Meta, StoryObj } from "@storybook/react-native"
import { cn } from "cn"
import {
  ArrowClockwiseIcon,
  ArrowCounterClockwiseIcon,
  TextAlignCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
  TextBIcon,
  TextItalicIcon,
  TextUnderlineIcon,
} from "phosphor-react-native"
import * as React from "react"
import { View } from "react-native"
import * as Toolbar from "@/components/primitives/toolbar"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import { Toggle, ToggleIcon } from "@/components/ui/toggle"

const rootClassName = (state: Toolbar.RootState) =>
  cn(
    "items-center gap-1 self-start rounded-3xl border border-separator bg-surface p-1",
    state.orientation === "horizontal" ? "flex-row" : "flex-col",
    state.disabled && "opacity-50"
  )

const separatorClassName = (state: Toolbar.SeparatorState) =>
  cn(
    "bg-separator",
    state.orientation === "vertical" ? "mx-1 h-5 w-px" : "my-1 h-px w-5"
  )

function FormattingToolbar({
  orientation,
  disabled,
}: {
  orientation?: Toolbar.RootProps["orientation"]
  disabled?: boolean
}) {
  const [bold, setBold] = React.useState(true)
  const [italic, setItalic] = React.useState(false)
  const [underline, setUnderline] = React.useState(false)
  const [align, setAlign] = React.useState("left")
  const alignments = [
    { value: "left", icon: TextAlignLeftIcon, label: "Align left" },
    { value: "center", icon: TextAlignCenterIcon, label: "Align center" },
    { value: "right", icon: TextAlignRightIcon, label: "Align right" },
  ]
  const vertical = orientation === "vertical"

  return (
    <Toolbar.Root
      orientation={orientation}
      disabled={disabled}
      accessibilityLabel="Formatting options"
      className={rootClassName}
    >
      <Toolbar.Group className={vertical ? "gap-1" : "flex-row gap-1"}>
        <Toolbar.Button
          accessibilityLabel="Bold"
          render={
            <Toggle size="sm" pressed={bold} onPressedChange={setBold}>
              <ToggleIcon as={TextBIcon} />
            </Toggle>
          }
        />
        <Toolbar.Button
          accessibilityLabel="Italic"
          render={
            <Toggle size="sm" pressed={italic} onPressedChange={setItalic}>
              <ToggleIcon as={TextItalicIcon} />
            </Toggle>
          }
        />
        <Toolbar.Button
          accessibilityLabel="Underline"
          render={
            <Toggle
              size="sm"
              pressed={underline}
              onPressedChange={setUnderline}
            >
              <ToggleIcon as={TextUnderlineIcon} />
            </Toggle>
          }
        />
      </Toolbar.Group>
      <Toolbar.Separator className={separatorClassName} />
      <Toolbar.Group className={vertical ? "gap-1" : "flex-row gap-1"}>
        {alignments.map((item) => (
          <Toolbar.Button
            key={item.value}
            accessibilityLabel={item.label}
            render={
              <Toggle
                size="sm"
                pressed={align === item.value}
                onPressedChange={() => setAlign(item.value)}
              >
                <ToggleIcon as={item.icon} />
              </Toggle>
            }
          />
        ))}
      </Toolbar.Group>
      <Toolbar.Separator className={separatorClassName} />
      <Toolbar.Group className={vertical ? "gap-1" : "flex-row gap-1"}>
        <Toolbar.Button
          accessibilityLabel="Undo"
          render={<Button variant="ghost" size="icon-sm" />}
        >
          <Icon as={ArrowCounterClockwiseIcon} className="size-4" />
        </Toolbar.Button>
        <Toolbar.Button
          accessibilityLabel="Redo"
          render={<Button variant="ghost" size="icon-sm" />}
        >
          <Icon as={ArrowClockwiseIcon} className="size-4" />
        </Toolbar.Button>
      </Toolbar.Group>
    </Toolbar.Root>
  )
}

function SearchToolbar() {
  const [query, setQuery] = React.useState("")
  return (
    <Toolbar.Root className={rootClassName}>
      <Toolbar.Input
        value={query}
        onChangeText={setQuery}
        placeholder="Find in document"
        accessibilityLabel="Find in document"
        className="h-8 w-44 rounded-md bg-control px-2.5 text-sm text-label"
        placeholderTextColorClassName="accent-label-secondary"
      />
      <Toolbar.Separator className={separatorClassName} />
      <Toolbar.Button
        disabled={!query}
        render={<Button variant="ghost" size="sm" />}
      >
        <Text className="text-sm font-medium">Find</Text>
      </Toolbar.Button>
    </Toolbar.Root>
  )
}

const meta = {
  title: "Components/Toolbar",
  component: FormattingToolbar,
} satisfies Meta<typeof FormattingToolbar>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <FormattingToolbar />,
}

export const Vertical: Story = {
  render: () => <FormattingToolbar orientation="vertical" />,
}

export const Disabled: Story = {
  render: () => <FormattingToolbar disabled />,
}

export const WithInput: Story = {
  render: () => (
    <View className="gap-2">
      <SearchToolbar />
      <Text variant="muted">Toolbar.Input sits alongside toolbar buttons.</Text>
    </View>
  ),
}
