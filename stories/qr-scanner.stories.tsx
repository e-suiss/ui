import type { Meta, StoryObj } from "@storybook/react-native"
import * as React from "react"
import { View } from "react-native"
import { QRScanner, type QRScannerState } from "@/components/ui/qr-scanner"

function CameraPlaceholder() {
  return (
    <View className="flex-1 items-center justify-center bg-surface-tertiary">
      <View className="absolute top-10 left-8 size-24 rounded-full bg-label-quaternary" />
      <View className="absolute right-6 bottom-16 h-32 w-40 rounded-3xl bg-label-tertiary" />
      <View className="size-36 rotate-6 rounded-xl bg-surface p-3">
        <View className="flex-1 flex-row flex-wrap gap-1.5">
          {Array.from({ length: 16 }, (_, index) => index).map((cell) => (
            <View
              key={cell}
              className={
                cell % 3 === 0
                  ? "size-6 rounded-xs bg-label"
                  : "size-6 rounded-xs bg-surface"
              }
            />
          ))}
        </View>
      </View>
    </View>
  )
}

function Scanner({
  state,
  description,
  scanLine,
}: {
  state?: QRScannerState
  description?: string
  scanLine?: boolean
}) {
  const [torch, setTorch] = React.useState(false)
  return (
    <QRScanner
      className="h-[560px] w-full rounded-3xl"
      state={state}
      scanLine={scanLine}
      title="Scan QR code"
      description={description}
      torch={torch}
      onTorchToggle={setTorch}
    >
      <CameraPlaceholder />
    </QRScanner>
  )
}

const meta = {
  title: "Components/QR Scanner",
  component: QRScanner,
} satisfies Meta<typeof QRScanner>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Scanner description="Point your camera at a code to pay or connect." />
  ),
}

export const Success: Story = {
  render: () => <Scanner state="success" description="Code recognised" />,
}

export const ErrorState: Story = {
  name: "Error",
  render: () => (
    <Scanner state="error" description="This code is not supported." />
  ),
}

export const WithoutScanLine: Story = {
  render: () => (
    <Scanner scanLine={false} description="Hold steady over the code." />
  ),
}

export const WithoutTorch: Story = {
  render: () => (
    <QRScanner
      className="h-[560px] w-full rounded-3xl"
      title="Scan to sign in"
      description="Open Settings on your other device."
    >
      <CameraPlaceholder />
    </QRScanner>
  ),
}
