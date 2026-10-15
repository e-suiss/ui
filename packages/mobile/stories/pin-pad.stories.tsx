import type { Meta, StoryObj } from "@storybook/react-native"
import { ScanSmileyIcon } from "phosphor-react-native"
import * as React from "react"
import { View } from "react-native"
import { PinPad } from "@/components/ui/pin-pad"
import { Text } from "@/components/ui/text"

const PASSCODE = "123456"

function VerifyDemo() {
  const [value, setValue] = React.useState("")
  const [error, setError] = React.useState(false)
  const [status, setStatus] = React.useState("Enter 123456")
  return (
    <View className="items-center gap-6">
      <Text
        role="status"
        accessibilityLiveRegion="polite"
        className={
          error ? "text-sm text-destructive" : "text-sm text-muted-foreground"
        }
      >
        {status}
      </Text>
      <PinPad
        value={value}
        error={error}
        onValueChange={(next) => {
          setValue(next)
          if (next.length > 0) setError(false)
        }}
        onComplete={(code) => {
          if (code === PASSCODE) {
            setStatus("Unlocked")
          } else {
            setError(true)
            setStatus("Wrong passcode. Try again.")
            setTimeout(() => setValue(""), 600)
          }
        }}
      />
    </View>
  )
}

function BiometricDemo({ faceId = false }: { faceId?: boolean }) {
  const [log, setLog] = React.useState(0)
  return (
    <View className="items-center gap-6">
      <Text className="text-sm text-muted-foreground">
        {log > 0 ? `Biometric requested (${log})` : "Biometric key"}
      </Text>
      <PinPad
        biometricIcon={faceId ? ScanSmileyIcon : undefined}
        biometricLabel={faceId ? "Use Face ID" : "Use Touch ID"}
        onBiometric={() => setLog((count) => count + 1)}
      />
    </View>
  )
}

const meta = {
  title: "Components/Pin Pad",
  component: PinPad,
} satisfies Meta<typeof PinPad>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <PinPad />,
}

export const Filled: Story = {
  render: () => <PinPad defaultValue="1234" />,
}

export const ErrorState: Story = {
  name: "Error",
  render: () => <PinPad defaultValue="654321" error />,
}

export const Verify: Story = {
  render: () => <VerifyDemo />,
}

export const Disabled: Story = {
  render: () => (
    <PinPad defaultValue="12" disabled onBiometric={() => undefined} />
  ),
}

export const Biometric: Story = {
  render: () => <BiometricDemo />,
}

export const FaceBiometric: Story = {
  render: () => <BiometricDemo faceId />,
}

export const FourDigits: Story = {
  render: () => <PinPad length={4} defaultValue="1" />,
}
