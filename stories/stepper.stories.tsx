import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"

import {
  Stepper,
  StepperDecrement,
  StepperGroup,
  StepperIncrement,
  StepperInput,
  StepperSeparator,
} from "@/components/interactions/stepper"

function StepperRow({
  label,
  ...props
}: React.ComponentProps<typeof Stepper> & { label: string }) {
  const labelId = React.useId()

  return (
    <div className="flex min-h-11 items-center justify-between gap-4 px-4 py-1.5">
      <span id={labelId} className="text-base">
        {label}
      </span>
      <Stepper {...props}>
        <StepperInput aria-labelledby={labelId} />
        <StepperGroup>
          <StepperDecrement />
          <StepperSeparator />
          <StepperIncrement />
        </StepperGroup>
      </Stepper>
    </div>
  )
}

function PrintExample() {
  const [copies, setCopies] = React.useState(1)
  const [scale, setScale] = React.useState(100)

  return (
    <div className="mx-auto flex w-[min(28rem,calc(100vw-2rem))] flex-col gap-3">
      <div className="divide-y divide-separator overflow-hidden rounded-2xl border">
        <StepperRow
          label="Copies"
          value={copies}
          onValueChange={setCopies}
          min={1}
          max={999}
        />
        <StepperRow
          label="Scale"
          value={scale}
          onValueChange={setScale}
          min={25}
          max={400}
          step={5}
          format={{ style: "unit", unit: "percent" }}
        />
        <StepperRow label="Pages per sheet" defaultValue={1} disabled />
      </div>
      <p role="status" className="text-sm text-label-secondary">
        {copies} {copies === 1 ? "copy" : "copies"} at {scale}%
      </p>
    </div>
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
      <StepperInput aria-label="Quantity" />
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
