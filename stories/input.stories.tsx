import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Text } from "@/components/ui/text"

const meta = {
  title: "Components/Input",
  component: Input,
  args: {
    placeholder: "Email",
  },
} satisfies Meta<typeof Input>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Types: Story = {
  render: () => (
    <View className="gap-3">
      <Input placeholder="Text" />
      <Input
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input placeholder="Password" secureTextEntry />
      <Input placeholder="Number" keyboardType="number-pad" />
      <Input placeholder="Search" inputMode="search" />
    </View>
  ),
}

export const WithValue: Story = {
  args: {
    defaultValue: "hello@example.com",
  },
}

export const WithLabel: Story = {
  render: () => (
    <View className="gap-2">
      <Label nativeID="input-email">Email</Label>
      <Input
        accessibilityLabelledBy="input-email"
        placeholder="m@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Text variant="muted">We will never share your email.</Text>
    </View>
  ),
}

export const Invalid: Story = {
  render: () => (
    <View className="gap-2">
      <Label nativeID="input-invalid">Username</Label>
      <Input
        accessibilityLabelledBy="input-invalid"
        className="border-destructive"
        defaultValue="x"
      />
      <Text className="text-destructive text-sm">
        Username must be at least 3 characters.
      </Text>
    </View>
  ),
}

export const Disabled: Story = {
  args: {
    editable: false,
    placeholder: "Disabled",
  },
}
