// @ts-nocheck
import { ArrowRightIcon } from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect } from "storybook/test"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DirectionProvider, useDirection } from "@/components/ui/direction"

function DirectionPreview() {
  const direction = useDirection()

  return (
    <Card dir={direction} className="w-80">
      <CardHeader>
        <CardTitle>Reading direction</CardTitle>
        <CardDescription>
          Current direction is {direction.toUpperCase()}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          Components that use logical properties flip their layout when the
          direction changes.
        </p>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="ghost">Cancel</Button>
        <Button>
          Continue
          <ArrowRightIcon data-icon="inline-end" className="rtl:rotate-180" />
        </Button>
      </CardFooter>
    </Card>
  )
}

const meta = {
  title: "Components/Direction",
  component: DirectionProvider,
  args: {
    direction: "ltr",
  },
  argTypes: {
    direction: {
      control: "select",
      options: ["ltr", "rtl"],
    },
  },
} satisfies Meta<typeof DirectionProvider>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <DirectionProvider {...args}>
      <DirectionPreview />
    </DirectionProvider>
  ),
  play: async ({ canvas }) => {
    const description = canvas.getByText("Current direction is LTR.")
    await expect(description.closest("[dir]")).toHaveAttribute("dir", "ltr")
  },
}

export const RightToLeft: Story = {
  args: { direction: "rtl" },
  render: Default.render,
  play: async ({ canvas }) => {
    const description = canvas.getByText("Current direction is RTL.")
    await expect(description.closest("[dir]")).toHaveAttribute("dir", "rtl")
    const cancel = canvas.getByRole("button", { name: "Cancel" })
    const next = canvas.getByRole("button", { name: "Continue" })
    await expect(cancel.getBoundingClientRect().left).toBeGreaterThan(
      next.getBoundingClientRect().left
    )
  },
}
