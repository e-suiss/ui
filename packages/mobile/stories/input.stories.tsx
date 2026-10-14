import type { Meta, StoryObj } from "@storybook/react-native"
import * as React from "react"
import { View } from "react-native"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
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

export const Sizes: Story = {
  render: () => (
    <View className="gap-3">
      <Input size="sm" placeholder="Small" />
      <Input size="md" placeholder="Medium" />
      <Input placeholder="Default" />
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
    <Field>
      <FieldLabel>Email</FieldLabel>
      <Input
        placeholder="m@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <FieldDescription>We will never share your email.</FieldDescription>
    </Field>
  ),
}

export const Invalid: Story = {
  render: () => (
    <Field invalid>
      <FieldLabel>Username</FieldLabel>
      <Input defaultValue="x" />
      <FieldError>Username must be at least 3 characters.</FieldError>
    </Field>
  ),
}

function ControlledDemo() {
  const [value, setValue] = React.useState("")
  return (
    <View className="gap-2">
      <Input
        placeholder="Lowercase only"
        autoCapitalize="none"
        value={value}
        onValueChange={(next) => setValue(next.toLowerCase())}
      />
      <Text variant="muted">Value: {value}</Text>
    </View>
  )
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
}

export const Disabled: Story = {
  args: {
    editable: false,
    placeholder: "Disabled",
  },
}
