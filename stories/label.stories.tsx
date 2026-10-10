import type { Meta, StoryObj } from "@storybook/react-native"
import * as React from "react"
import { View } from "react-native"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const meta = {
  title: "Components/Label",
  component: Label,
  args: {
    children: "Your email address",
  },
} satisfies Meta<typeof Label>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithInput: Story = {
  render: () => (
    <View className="gap-2">
      <Label nativeID="label-email">Email</Label>
      <Input
        accessibilityLabelledBy="label-email"
        placeholder="m@example.com"
      />
    </View>
  ),
}

function WithCheckboxDemo() {
  const [checked, setChecked] = React.useState(false)
  return (
    <View className="flex-row items-center gap-3">
      <Checkbox
        accessibilityLabelledBy="label-terms"
        checked={checked}
        onCheckedChange={setChecked}
      />
      <Label nativeID="label-terms" onPress={() => setChecked((v) => !v)}>
        Accept terms and conditions
      </Label>
    </View>
  )
}

export const WithCheckbox: Story = {
  render: () => <WithCheckboxDemo />,
}

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Disabled label",
  },
}
