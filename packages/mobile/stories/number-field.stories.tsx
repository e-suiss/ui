import type { Meta, StoryObj } from "@storybook/react-native"
import { cn } from "cn"
import { MinusIcon, PlusIcon } from "phosphor-react-native"
import * as React from "react"
import { View } from "react-native"
import * as NumberField from "@/components/primitives/number-field"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

function Stepper({
  label,
  ...props
}: Omit<React.ComponentProps<typeof NumberField.Root>, "children"> & {
  label?: string
}) {
  return (
    <NumberField.Root
      className={(state) => cn("w-full gap-2", state.disabled && "opacity-50")}
      {...props}
    >
      {label ? <Text className="text-sm font-medium">{label}</Text> : null}
      <NumberField.Group className="h-11 flex-row items-center overflow-hidden rounded-lg bg-control">
        <NumberField.Decrement className="h-full w-12 items-center justify-center">
          <Icon as={MinusIcon} className="size-4" />
        </NumberField.Decrement>
        <NumberField.Input
          accessibilityLabel={label}
          className="h-full flex-1 text-center text-base text-label"
        />
        <NumberField.Increment className="h-full w-12 items-center justify-center">
          <Icon as={PlusIcon} className="size-4" />
        </NumberField.Increment>
      </NumberField.Group>
    </NumberField.Root>
  )
}

const meta = {
  title: "Primitives/NumberField",
  component: Stepper,
  args: {
    label: "Quantity",
    defaultValue: 1,
    min: 0,
    max: 10,
  },
} satisfies Meta<typeof Stepper>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

function ControlledDemo() {
  const [value, setValue] = React.useState<number | null>(2.5)
  return (
    <View className="w-full gap-2">
      <Stepper
        label="Weight"
        value={value}
        onValueChange={setValue}
        step={0.5}
        min={0}
        format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
      />
      <Text variant="muted">Value: {value === null ? "empty" : value}</Text>
    </View>
  )
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
}

export const Currency: Story = {
  args: {
    label: "Amount",
    defaultValue: 25,
    min: 0,
    max: undefined,
    step: 5,
    format: { style: "currency", currency: "USD" },
  },
}

export const Percent: Story = {
  args: {
    label: "Opacity",
    defaultValue: 0.5,
    min: 0,
    max: 1,
    step: 0.05,
    format: { style: "percent" },
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}
