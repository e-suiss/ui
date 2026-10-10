import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import * as Meter from "@/components/primitives/meter"

function StorageMeter({
  value,
  label,
  ...props
}: Omit<React.ComponentProps<typeof Meter.Root>, "children"> & {
  label: string
}) {
  return (
    <Meter.Root value={value} className="w-full gap-2" {...props}>
      <View className="flex-row items-center justify-between">
        <Meter.Label className="text-sm font-medium text-label">
          {label}
        </Meter.Label>
        <Meter.Value className="text-sm text-label-secondary" />
      </View>
      <Meter.Track className="h-2 w-full overflow-hidden rounded-full bg-surface-secondary">
        <Meter.Indicator className="h-full rounded-full bg-accent" />
      </Meter.Track>
    </Meter.Root>
  )
}

const meta = {
  title: "Primitives/Meter",
  component: StorageMeter,
  args: {
    value: 24,
    label: "Storage used",
  },
} satisfies Meta<typeof StorageMeter>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const CustomRange: Story = {
  args: {
    value: 42.5,
    min: 0,
    max: 64,
    label: "Storage",
    format: { style: "unit", unit: "gigabyte", maximumFractionDigits: 1 },
  },
}

export const CustomValue: Story = {
  render: () => (
    <Meter.Root value={68} className="w-full gap-2">
      <View className="flex-row items-center justify-between">
        <Meter.Label className="text-sm font-medium text-label">
          Daily goal
        </Meter.Label>
        <Meter.Value className="text-sm text-label-secondary">
          {(_, value) => `${value} of 100 steps`}
        </Meter.Value>
      </View>
      <Meter.Track className="h-3 w-full overflow-hidden rounded-full bg-surface-secondary">
        <Meter.Indicator className="h-full rounded-full bg-blue" />
      </Meter.Track>
    </Meter.Root>
  ),
}

export const Levels: Story = {
  render: () => (
    <View className="w-full gap-4">
      <StorageMeter value={10} label="Low" />
      <StorageMeter value={55} label="Medium" />
      <StorageMeter value={92} label="High" />
    </View>
  ),
}
