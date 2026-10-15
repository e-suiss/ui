import type { Meta, StoryObj } from "@storybook/react-native"
import * as React from "react"
import { View } from "react-native"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Text } from "@/components/ui/text"

const options = [
  { value: "default", label: "Default" },
  { value: "comfortable", label: "Comfortable" },
  { value: "compact", label: "Compact" },
]

const plans = [
  {
    value: "starter",
    label: "Starter",
    description: "For individuals getting started.",
  },
  {
    value: "pro",
    label: "Pro",
    description: "For growing teams that need more.",
  },
  {
    value: "enterprise",
    label: "Enterprise",
    description: "For large organizations with custom needs.",
  },
]

function RadioGroupDemo({
  disabled = false,
  disabledItem,
}: {
  disabled?: boolean
  disabledItem?: string
}) {
  const [value, setValue] = React.useState("comfortable")
  return (
    <RadioGroup value={value} onValueChange={setValue} disabled={disabled}>
      {options.map((option) => {
        const isDisabled = disabled || option.value === disabledItem
        return (
          <View key={option.value} className="flex-row items-center gap-3">
            <RadioGroupItem
              value={option.value}
              accessibilityLabelledBy={`radio-${option.value}`}
              disabled={isDisabled}
            />
            <Label
              nativeID={`radio-${option.value}`}
              disabled={isDisabled}
              onPress={() => setValue(option.value)}
            >
              {option.label}
            </Label>
          </View>
        )
      })}
    </RadioGroup>
  )
}

const meta = {
  title: "Components/Radio Group",
  component: RadioGroup,
  args: {
    value: "comfortable",
    onValueChange: () => undefined,
  },
} satisfies Meta<typeof RadioGroup>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <RadioGroupDemo />,
}

function WithDescriptionsDemo() {
  const [value, setValue] = React.useState("pro")
  return (
    <RadioGroup value={value} onValueChange={setValue} className="gap-4">
      {plans.map((plan) => (
        <View key={plan.value} className="flex-row items-start gap-3">
          <RadioGroupItem
            value={plan.value}
            accessibilityLabelledBy={`plan-${plan.value}`}
          />
          <View className="flex-1 gap-1">
            <Label
              nativeID={`plan-${plan.value}`}
              onPress={() => setValue(plan.value)}
            >
              {plan.label}
            </Label>
            <Text className="text-sm text-label-secondary">
              {plan.description}
            </Text>
          </View>
        </View>
      ))}
    </RadioGroup>
  )
}

export const WithDescriptions: Story = {
  render: () => <WithDescriptionsDemo />,
}

export const DisabledItem: Story = {
  render: () => <RadioGroupDemo disabledItem="compact" />,
}

export const Disabled: Story = {
  render: () => <RadioGroupDemo disabled />,
}

export const Invalid: Story = {
  render: () => (
    <RadioGroup className="gap-3">
      {options.map((option) => (
        <View key={option.value} className="flex-row items-center gap-3">
          <RadioGroupItem
            invalid
            value={option.value}
            accessibilityLabelledBy={`radio-invalid-${option.value}`}
          />
          <Label nativeID={`radio-invalid-${option.value}`}>
            {option.label}
          </Label>
        </View>
      ))}
    </RadioGroup>
  ),
}
