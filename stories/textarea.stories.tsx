import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const meta = {
  title: "Components/Textarea",
  component: Textarea,
  args: {
    placeholder: "Type your message here.",
    disabled: false,
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Textarea>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithValue: Story = {
  args: {
    defaultValue:
      "Thanks for the quick turnaround. The new layout looks great on mobile.",
  },
}

export const WithLabel: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="feedback">Feedback</Label>
      <Textarea {...args} id="feedback" placeholder="Tell us what you think." />
    </div>
  ),
}

function ResizableExample({
  resizable,
  ...props
}: React.ComponentProps<typeof Textarea>) {
  const ref = React.useRef<HTMLTextAreaElement>(null)
  const [rows, setRows] = React.useState(0)

  React.useEffect(() => {
    const area = ref.current
    if (!area) return
    const measure = () => {
      const style = getComputedStyle(area)
      const padding =
        Number.parseFloat(style.paddingTop) +
        Number.parseFloat(style.paddingBottom)
      const line = Number.parseFloat(style.lineHeight)
      setRows(Math.floor((area.clientHeight - padding) / line))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(area)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <Label htmlFor={`campaign-${resizable}`}>Campaign copy</Label>
        <span className="text-xs text-label-secondary tabular-nums">
          {rows} rows
        </span>
      </div>
      <Textarea
        {...props}
        ref={ref}
        id={`campaign-${resizable}`}
        resizable={resizable}
        aria-describedby={`campaign-${resizable}-hint`}
      />
      <p
        id={`campaign-${resizable}-hint`}
        className="text-xs text-label-secondary"
      >
        Drag the bottom corner to resize. Double-click it to reset.
      </p>
    </div>
  )
}

const campaign =
  "Weekend sale on every grill. 15% off Saturday and Sunday from 12:00 to 16:00, including delivery orders."

export const Resizable: Story = {
  render: (args) => (
    <ResizableExample
      {...args}
      resizable="inside"
      rows={5}
      defaultValue={campaign}
    />
  ),
}

export const ResizableOutside: Story = {
  render: (args) => (
    <ResizableExample
      {...args}
      resizable="outside"
      rows={5}
      defaultValue={campaign}
    />
  ),
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const Invalid: Story = {
  args: {
    "aria-invalid": true,
    defaultValue: "Too short",
  },
}
