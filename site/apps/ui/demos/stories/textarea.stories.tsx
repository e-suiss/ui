// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { expect, userEvent, waitFor } from "storybook/test"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MOUSE_POINTER_ID } from "./pointer"

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

export const Default: Story = {
  play: async ({ canvas, step }) => {
    const textarea = canvas.getByRole("textbox")

    await step("accepts multi-line text", async () => {
      await userEvent.type(textarea, "Hello{Enter}World")
      await expect(textarea).toHaveValue("Hello\nWorld")
    })
  },
}

export const WithValue: Story = {
  args: {
    defaultValue:
      "Thanks for the quick turnaround. The new layout looks great on mobile.",
  },
  play: async ({ canvas, step }) => {
    const textarea = canvas.getByRole("textbox")

    await step("shows the default value", async () => {
      await expect(textarea).toHaveValue(
        "Thanks for the quick turnaround. The new layout looks great on mobile."
      )
    })

    await step("appends and replaces text", async () => {
      await userEvent.type(textarea, " Ship it.")
      await expect(textarea).toHaveValue(
        "Thanks for the quick turnaround. The new layout looks great on mobile. Ship it."
      )
      await userEvent.clear(textarea)
      await userEvent.type(textarea, "Looks good.")
      await expect(textarea).toHaveValue("Looks good.")
    })
  },
}

export const WithLabel: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="feedback">Feedback</Label>
      <Textarea {...args} id="feedback" placeholder="Tell us what you think." />
    </div>
  ),
  play: async ({ canvas, step }) => {
    await step("focuses the named textarea from its label", async () => {
      await userEvent.click(canvas.getByText("Feedback"))
      await expect(
        canvas.getByRole("textbox", { name: "Feedback" })
      ).toHaveFocus()
    })
  },
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

const ROWS = /rows$/

function pointer(target: HTMLElement, type: string, x: number, y: number) {
  target.dispatchEvent(
    new PointerEvent(type, {
      pointerId: MOUSE_POINTER_ID,
      pointerType: "mouse",
      button: 0,
      buttons: type === "pointerup" ? 0 : 1,
      clientX: x,
      clientY: y,
      bubbles: true,
      cancelable: true,
    })
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
  play: async ({ canvas, step }) => {
    await step("names and describes the textarea", async () => {
      const textarea = canvas.getByRole("textbox", { name: "Campaign copy" })
      await expect(textarea).toHaveAccessibleDescription(
        "Drag the bottom corner to resize. Double-click it to reset."
      )
      await expect(textarea).toHaveValue(campaign)
    })
  },
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
  play: async ({ canvas, canvasElement, step }) => {
    const textarea = canvas.getByRole("textbox", { name: "Campaign copy" })
    const handle = canvasElement.querySelector<HTMLElement>(
      '[data-slot="textarea-handle"]'
    )
    if (!handle) throw new Error("textarea handle not rendered")
    const startHeight = textarea.offsetHeight
    const rowCount = canvas.getByText(ROWS)
    const startRows = rowCount.textContent

    await step("places the handle outside the field", async () => {
      await expect(handle).toHaveAttribute("data-placement", "outside")
      await expect(handle.getBoundingClientRect().bottom).toBeGreaterThan(
        textarea.getBoundingClientRect().bottom
      )
    })

    await step("grows taller when the handle is dragged down", async () => {
      const rect = handle.getBoundingClientRect()
      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 2
      pointer(handle, "pointerdown", x, y)
      pointer(handle, "pointermove", x, y + 40)
      pointer(handle, "pointermove", x, y + 80)
      pointer(handle, "pointerup", x, y + 80)
      await expect(textarea.offsetHeight).toBe(startHeight + 80)
      await waitFor(() => expect(rowCount.textContent).not.toBe(startRows))
    })

    await step("resets the height on double-click", async () => {
      await userEvent.dblClick(handle)
      await expect(textarea.style.height).toBe("")
      await expect(textarea.offsetHeight).toBe(startHeight)
      await waitFor(() => expect(rowCount.textContent).toBe(startRows))
    })
  },
}

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas, step }) => {
    const textarea = canvas.getByRole("textbox")

    await step("ignores typing while disabled", async () => {
      await expect(textarea).toBeDisabled()
      await userEvent.type(textarea, "Hello")
      await expect(textarea).toHaveValue("")
    })
  },
}

export const Invalid: Story = {
  args: {
    "aria-invalid": true,
    defaultValue: "Too short",
  },
  play: async ({ canvas, step }) => {
    const textarea = canvas.getByRole("textbox")

    await step("flags the textarea as invalid", async () => {
      await expect(textarea).toBeInvalid()
      await expect(textarea).toHaveValue("Too short")
    })

    await step("stays editable while invalid", async () => {
      await userEvent.type(textarea, " but fixed")
      await expect(textarea).toHaveValue("Too short but fixed")
    })
  },
}
