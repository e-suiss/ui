import type { Meta, StoryObj } from "@storybook/react-native"
import * as React from "react"
import { View } from "react-native"
import {
  Keypad,
  type KeypadAccessoryKey,
  type KeypadKeyValue,
} from "@/components/ui/keypad"
import { Text } from "@/components/ui/text"

function KeyLog({
  accessoryKey,
  disabled,
}: {
  accessoryKey?: KeypadAccessoryKey
  disabled?: boolean
}) {
  const [last, setLast] = React.useState<KeypadKeyValue | null>(null)
  return (
    <View className="items-center gap-6">
      <Text
        role="status"
        accessibilityLiveRegion="polite"
        className="text-sm text-muted-foreground"
      >
        {last ? `Last key: ${last}` : "Press a key"}
      </Text>
      <Keypad
        accessoryKey={accessoryKey}
        disabled={disabled}
        onKeyPress={setLast}
      />
    </View>
  )
}

const meta = {
  title: "Components/Keypad",
  component: Keypad,
} satisfies Meta<typeof Keypad>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <KeyLog />,
}

export const Decimal: Story = {
  render: () => <KeyLog accessoryKey="decimal" />,
}

export const Biometric: Story = {
  render: () => <KeyLog accessoryKey="biometric" />,
}

export const Disabled: Story = {
  render: () => <KeyLog accessoryKey="biometric" disabled />,
}
