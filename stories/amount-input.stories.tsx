import type { Meta, StoryObj } from "@storybook/react-native"
import * as React from "react"
import { View } from "react-native"
import { AmountInput } from "@/components/ui/amount-input"
import { Text } from "@/components/ui/text"

function ControlledDemo() {
  const [value, setValue] = React.useState("")
  const [amount, setAmount] = React.useState(0)
  return (
    <View className="items-center gap-4">
      <AmountInput
        currency="USD"
        locale="en-US"
        value={value}
        onValueChange={(next, nextAmount) => {
          setValue(next)
          setAmount(nextAmount)
        }}
      />
      <Text className="text-sm text-label-secondary">
        {`value "${value}" · amount ${amount}`}
      </Text>
    </View>
  )
}

const meta = {
  title: "Components/Amount Input",
  component: AmountInput,
} satisfies Meta<typeof AmountInput>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <AmountInput currency="USD" locale="en-US" />,
}

export const Filled: Story = {
  render: () => (
    <AmountInput currency="USD" locale="en-US" defaultValue="1250.5" />
  ),
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
}

export const LongAmount: Story = {
  render: () => (
    <AmountInput currency="USD" locale="en-US" defaultValue="98765432109.99" />
  ),
}

export const Euro: Story = {
  render: () => (
    <AmountInput currency="EUR" locale="de-DE" defaultValue="1234.5" />
  ),
}

export const TurkishLira: Story = {
  render: () => (
    <AmountInput currency="TRY" locale="tr-TR" defaultValue="2500.75" />
  ),
}

export const Yen: Story = {
  render: () => (
    <AmountInput currency="JPY" locale="ja-JP" defaultValue="15000" />
  ),
}

export const WithMax: Story = {
  render: () => <AmountInput currency="USD" locale="en-US" max={500} />,
}

export const Disabled: Story = {
  render: () => (
    <AmountInput currency="USD" locale="en-US" defaultValue="42" disabled />
  ),
}
