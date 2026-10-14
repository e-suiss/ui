// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { expect, userEvent, within } from "storybook/test"

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
  play: async ({ canvas, step }) => {
    const input = canvas.getByRole("textbox", { name: "Quantity" })
    const decrease = canvas.getByRole("button", { name: "Decrease" })
    const increase = canvas.getByRole("button", { name: "Increase" })

    await step("decrements down to the minimum", async () => {
      await expect(input).toHaveValue("1")
      await userEvent.click(decrease)
      await expect(input).toHaveValue("0")
      await expect(decrease).toBeDisabled()
    })

    await step("increments up to the maximum", async () => {
      for (let count = 0; count < 10; count++) await userEvent.click(increase)
      await expect(input).toHaveValue("10")
      await expect(increase).toBeDisabled()
      await expect(decrease).toBeEnabled()
    })

    await step("steps with the arrow keys from the field", async () => {
      await userEvent.click(input)
      await userEvent.keyboard("{ArrowDown}{ArrowDown}")
      await expect(input).toHaveValue("8")
      await expect(increase).toBeEnabled()
    })
  },
}

function stepperOf(input: HTMLElement) {
  const stepper = input.closest<HTMLElement>("[data-slot=stepper]")
  if (!stepper) throw new Error("stepper not found")
  return within(stepper)
}

export const Print: Story = {
  render: () => <PrintExample />,
  play: async ({ canvas, step }) => {
    const status = canvas.getByRole("status")
    const copies = canvas.getByRole("textbox", { name: "Copies" })
    const scale = canvas.getByRole("textbox", { name: "Scale" })
    const pages = canvas.getByRole("textbox", { name: "Pages per sheet" })

    await step("keeps copies at the minimum of one", async () => {
      await expect(status).toHaveTextContent("1 copy at 100%")
      await expect(
        stepperOf(copies).getByRole("button", { name: "Decrease" })
      ).toBeDisabled()
      await userEvent.click(
        stepperOf(copies).getByRole("button", { name: "Increase" })
      )
      await expect(status).toHaveTextContent("2 copies at 100%")
    })

    await step("steps the scale by five percent", async () => {
      const increase = stepperOf(scale).getByRole("button", {
        name: "Increase",
      })
      await userEvent.click(increase)
      await userEvent.click(increase)
      await expect(status).toHaveTextContent("2 copies at 110%")
    })

    await step("leaves the disabled row untouchable", async () => {
      await expect(pages).toBeDisabled()
      await expect(
        stepperOf(pages).getByRole("button", { name: "Increase" })
      ).toBeDisabled()
      await expect(
        stepperOf(pages).getByRole("button", { name: "Decrease" })
      ).toBeDisabled()
    })
  },
}
