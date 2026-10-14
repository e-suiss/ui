import type { Meta, StoryObj } from "@storybook/react-native"
import * as React from "react"
import { View } from "react-native"
import { Label } from "@/components/ui/label"
import {
  type Option,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Text } from "@/components/ui/text"

const fruits: Option[] = [
  { value: "mango", label: "Mango" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "grapes", label: "Grapes" },
  { value: "pineapple", label: "Pineapple" },
]

const vegetables: Option[] = [
  { value: "carrot", label: "Carrot" },
  { value: "broccoli", label: "Broccoli" },
  { value: "spinach", label: "Spinach" },
]

function SelectDemo({
  initial,
  size,
  disabled = false,
  invalid = false,
  labelledBy,
  defaultOpen,
}: {
  initial?: Option
  size?: "default" | "sm"
  disabled?: boolean
  invalid?: boolean
  labelledBy?: string
  defaultOpen?: boolean
}) {
  const [value, setValue] = React.useState<string | null>(
    initial?.value ?? null
  )
  return (
    <Select
      items={fruits}
      value={value}
      onValueChange={setValue}
      disabled={disabled}
      defaultOpen={defaultOpen}
    >
      <SelectTrigger
        size={size}
        accessibilityLabelledBy={labelledBy}
        invalid={invalid}
        className="w-48"
      >
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent className="w-48">
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          {fruits.map((fruit) => (
            <SelectItem
              key={fruit.value}
              value={fruit.value}
              label={fruit.label}
            />
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

const meta = {
  title: "Components/Select",
  component: Select,
} satisfies Meta<typeof Select>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <SelectDemo />,
}

export const WithValue: Story = {
  render: () => <SelectDemo initial={fruits[2]} />,
}

export const Small: Story = {
  render: () => <SelectDemo size="sm" />,
}

function GroupedDemo() {
  const [value, setValue] = React.useState<string | null>(null)
  return (
    <Select
      items={[...fruits.slice(0, 3), ...vegetables]}
      value={value}
      onValueChange={setValue}
    >
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Select produce" />
      </SelectTrigger>
      <SelectContent className="w-56">
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          {fruits.slice(0, 3).map((fruit) => (
            <SelectItem
              key={fruit.value}
              value={fruit.value}
              label={fruit.label}
            />
          ))}
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Vegetables</SelectLabel>
          {vegetables.map((vegetable) => (
            <SelectItem
              key={vegetable.value}
              value={vegetable.value}
              label={vegetable.label}
            />
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export const Grouped: Story = {
  render: () => <GroupedDemo />,
}

export const WithLabel: Story = {
  render: () => (
    <View className="gap-2">
      <Label nativeID="select-fruit">Favorite fruit</Label>
      <SelectDemo labelledBy="select-fruit" />
      <Text className="text-sm text-label-secondary">
        Used to personalize your recommendations.
      </Text>
    </View>
  ),
}

export const Disabled: Story = {
  render: () => <SelectDemo disabled initial={fruits[0]} />,
}

export const Invalid: Story = {
  render: () => (
    <View className="gap-2">
      <SelectDemo invalid />
      <Text className="text-sm text-danger">Please select a fruit.</Text>
    </View>
  ),
}

export const OpenByDefault: Story = {
  render: () => <SelectDemo initial={fruits[2]} defaultOpen />,
}
