import type { Meta, StoryObj } from "@storybook/react-native"
import * as React from "react"
import { View } from "react-native"
import {
  Stepper,
  StepperDecrement,
  StepperGroup,
  StepperIncrement,
  StepperInput,
  StepperSeparator,
} from "@/components/interactions/stepper"
import { Text } from "@/components/ui/text"

function StepperRow({
  label,
  ...props
}: React.ComponentProps<typeof Stepper> & { label: string }) {
  const labelId = React.useId()

  return (
    <View className="min-h-11 flex-row items-center justify-between gap-4 px-4 py-1.5">
      <Text nativeID={labelId} className="text-base">
        {label}
      </Text>
      <Stepper {...props}>
        <StepperInput accessibilityLabelledBy={labelId} />
        <StepperGroup>
          <StepperDecrement />
          <StepperSeparator />
          <StepperIncrement />
        </StepperGroup>
      </Stepper>
    </View>
  )
}

function PrintExample() {
  const [copies, setCopies] = React.useState(1)
  const [scale, setScale] = React.useState(100)

  return (
    <View className="w-full gap-3">
      <View className="overflow-hidden rounded-2xl border border-border">
        <StepperRow
          label="Copies"
          value={copies}
          onValueChange={setCopies}
          min={1}
          max={999}
        />
        <View className="h-px bg-border" />
        <StepperRow
          label="Scale"
          value={scale}
          onValueChange={setScale}
          min={25}
          max={400}
          step={5}
          format={{ style: "unit", unit: "percent" }}
        />
        <View className="h-px bg-border" />
        <StepperRow label="Pages per sheet" defaultValue={1} disabled />
      </View>
      <Text
        accessibilityLiveRegion="polite"
        className="text-sm text-muted-foreground"
      >
        {copies} {copies === 1 ? "copy" : "copies"} at {scale}%
      </Text>
    </View>
  )
}

const meta = {
  title: "Interactions/Stepper",
  component: Stepper,
} satisfies Meta<typeof Stepper>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Stepper defaultValue={1} min={0} max={10}>
      <StepperInput accessibilityLabel="Quantity" />
      <StepperGroup>
        <StepperDecrement />
        <StepperSeparator />
        <StepperIncrement />
      </StepperGroup>
    </Stepper>
  ),
}

export const Print: Story = {
  render: () => <PrintExample />,
}
