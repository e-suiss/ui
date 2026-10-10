import type { Meta, StoryObj } from "@storybook/react-native"
import * as React from "react"
import { View } from "react-native"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Text } from "@/components/ui/text"

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  args: {
    checked: false,
    onCheckedChange: () => {},
  },
} satisfies Meta<typeof Checkbox>

export default meta

type Story = StoryObj<typeof meta>

function CheckboxDemo({ initial = false }: { initial?: boolean }) {
  const [checked, setChecked] = React.useState(initial)
  return <Checkbox checked={checked} onCheckedChange={setChecked} />
}

export const Default: Story = {
  render: () => <CheckboxDemo />,
}

export const Checked: Story = {
  render: () => <CheckboxDemo initial />,
}

function WithLabelDemo() {
  const [checked, setChecked] = React.useState(false)
  return (
    <View className="flex-row items-center gap-3">
      <Checkbox
        accessibilityLabelledBy="terms"
        checked={checked}
        onCheckedChange={setChecked}
      />
      <Label nativeID="terms" onPress={() => setChecked((value) => !value)}>
        Accept terms and conditions
      </Label>
    </View>
  )
}

export const WithLabel: Story = {
  render: () => <WithLabelDemo />,
}

function WithDescriptionDemo() {
  const [checked, setChecked] = React.useState(true)
  return (
    <View className="flex-row items-start gap-3">
      <Checkbox
        accessibilityLabelledBy="notifications"
        checked={checked}
        onCheckedChange={setChecked}
      />
      <View className="flex-1 gap-1.5">
        <Label
          nativeID="notifications"
          onPress={() => setChecked((value) => !value)}
        >
          Enable notifications
        </Label>
        <Text variant="muted">
          You can enable or disable notifications at any time.
        </Text>
      </View>
    </View>
  )
}

export const WithDescription: Story = {
  render: () => <WithDescriptionDemo />,
}

export const Disabled: Story = {
  render: () => (
    <View className="gap-4">
      <View className="flex-row items-center gap-3">
        <Checkbox disabled checked={false} onCheckedChange={() => {}} />
        <Label disabled>Unchecked</Label>
      </View>
      <View className="flex-row items-center gap-3">
        <Checkbox disabled checked onCheckedChange={() => {}} />
        <Label disabled>Checked</Label>
      </View>
    </View>
  ),
}
