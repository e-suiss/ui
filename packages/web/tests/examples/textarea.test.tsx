import { waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import TextareaDemo from "@/examples/textarea-demo"
import TextareaDisabled from "@/examples/textarea-disabled"
import TextareaInvalid from "@/examples/textarea-invalid"
import TextareaResizable from "@/examples/textarea-resizable"
import TextareaResizableOutside from "@/examples/textarea-resizable-outside"
import TextareaWithLabel from "@/examples/textarea-with-label"
import TextareaWithValue from "@/examples/textarea-with-value"
import { MOUSE_POINTER_ID } from "@/tests/pointer"
import { renderExample } from "@/tests/render-example"

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

test("Default", async () => {
  const { canvas, step } = await renderExample(<TextareaDemo />)

  const textarea = canvas.getByRole("textbox")

  await step("accepts multi-line text", async () => {
    await userEvent.type(textarea, "Hello{Enter}World")
    await expect(textarea).toHaveValue("Hello\nWorld")
  })
})
test("With Value", async () => {
  const { canvas, step } = await renderExample(<TextareaWithValue />)

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
})
test("With Label", async () => {
  const { canvas, step } = await renderExample(<TextareaWithLabel />)

  await step("focuses the named textarea from its label", async () => {
    await userEvent.click(canvas.getByText("Feedback"))
    await expect(
      canvas.getByRole("textbox", { name: "Feedback" })
    ).toHaveFocus()
  })
})
test("Resizable", async () => {
  const { canvas, step } = await renderExample(<TextareaResizable />)

  await step("names and describes the textarea", async () => {
    const textarea = canvas.getByRole("textbox", { name: "Campaign copy" })
    await expect(textarea).toHaveAccessibleDescription(
      "Drag the bottom corner to resize. Double-click it to reset."
    )
    await expect(textarea).toHaveValue(campaign)
  })
})
test("Resizable Outside", async () => {
  const { canvas, canvasElement, step } = await renderExample(
    <TextareaResizableOutside />
  )

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
})
test("Disabled", async () => {
  const { canvas, step } = await renderExample(<TextareaDisabled />)

  const textarea = canvas.getByRole("textbox")

  await step("ignores typing while disabled", async () => {
    await expect(textarea).toBeDisabled()
    await userEvent.type(textarea, "Hello")
    await expect(textarea).toHaveValue("")
  })
})
test("Invalid", async () => {
  const { canvas, step } = await renderExample(<TextareaInvalid />)

  const textarea = canvas.getByRole("textbox")

  await step("flags the textarea as invalid", async () => {
    await expect(textarea).toBeInvalid()
    await expect(textarea).toHaveValue("Too short")
  })

  await step("stays editable while invalid", async () => {
    await userEvent.type(textarea, " but fixed")
    await expect(textarea).toHaveValue("Too short but fixed")
  })
})
