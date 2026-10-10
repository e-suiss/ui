import type { Meta, StoryObj } from "@storybook/react-native"
import * as React from "react"
import { View } from "react-native"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Text } from "@/components/ui/text"

const meta = {
  title: "Components/Switch",
  component: Switch,
  args: {
    checked: false,
    onCheckedChange: () => {},
  },
} satisfies Meta<typeof Switch>

export default meta

type Story = StoryObj<typeof meta>

function SwitchDemo({ initial = false }: { initial?: boolean }) {
  const [checked, setChecked] = React.useState(initial)
  return <Switch checked={checked} onCheckedChange={setChecked} />
}

export const Default: Story = {
  render: () => <SwitchDemo />,
}

export const Checked: Story = {
  render: () => <SwitchDemo initial />,
}

function WithLabelDemo() {
  const [checked, setChecked] = React.useState(false)
  return (
    <View className="flex-row items-center gap-2">
      <Switch
        accessibilityLabelledBy="airplane-mode"
        checked={checked}
        onCheckedChange={setChecked}
      />
      <Label nativeID="airplane-mode" onPress={() => setChecked((v) => !v)}>
        Airplane mode
      </Label>
    </View>
  )
}

export const Sizes: Story = {
  render: () => (
    <View className="flex-row items-center gap-4">
      <Switch size="sm" defaultChecked accessibilityLabel="Wi-Fi" />
      <Switch defaultChecked accessibilityLabel="Bluetooth" />
    </View>
  ),
}

export const WithLabel: Story = {
  render: () => <WithLabelDemo />,
}

function WithDescriptionDemo() {
  const [checked, setChecked] = React.useState(true)
  return (
    <View className="flex-row items-center justify-between gap-4 rounded-2xl bg-surface-secondary p-4">
      <View className="flex-1 gap-1">
        <Label nativeID="marketing" onPress={() => setChecked((v) => !v)}>
          Marketing emails
        </Label>
        <Text className="text-sm text-label-secondary">
          Receive emails about new products.
        </Text>
      </View>
      <Switch
        accessibilityLabelledBy="marketing"
        checked={checked}
        onCheckedChange={setChecked}
      />
    </View>
  )
}

export const WithDescription: Story = {
  render: () => <WithDescriptionDemo />,
}

export const Disabled: Story = {
  render: () => (
    <View className="gap-4">
      <Switch disabled checked={false} onCheckedChange={() => {}} />
      <Switch disabled checked onCheckedChange={() => {}} />
    </View>
  ),
}

export const Invalid: Story = {
  render: () => (
    <View className="flex-row items-center gap-2">
      <Switch invalid accessibilityLabelledBy="terms-switch" />
      <Label nativeID="terms-switch">Accept terms</Label>
    </View>
  ),
}
