import { waitFor } from "@testing-library/dom"
import { expect, test } from "vitest"
import WidgetAutoResize from "@/examples/widget-auto-resize"
import WidgetCentered from "@/examples/widget-centered"
import WidgetDashboard from "@/examples/widget-dashboard"
import WidgetDemo from "@/examples/widget-demo"
import WidgetFreeResize from "@/examples/widget-free-resize"
import WidgetKitchen from "@/examples/widget-kitchen"
import WidgetReservations from "@/examples/widget-reservations"
import WidgetSales from "@/examples/widget-sales"
import WidgetSizes from "@/examples/widget-sizes"
import WidgetWeeklyReport from "@/examples/widget-weekly-report"
import { MOUSE_POINTER_ID } from "@/tests/pointer"
import { renderExample } from "@/tests/render-example"

function bySlot(canvasElement: HTMLElement, slot: string) {
  const element = canvasElement.querySelector<HTMLElement>(
    `[data-slot="${slot}"]`
  )
  if (!element) throw new Error(`${slot} not rendered`)
  return element
}
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
function dragHandle(canvasElement: HTMLElement, dx: number, dy: number) {
  const handle = bySlot(canvasElement, "widget-handle")
  const rect = handle.getBoundingClientRect()
  const x = rect.left + rect.width / 2
  const y = rect.top + rect.height / 2
  pointer(handle, "pointerdown", x, y)
  pointer(handle, "pointermove", x + dx / 2, y + dy / 2)
  pointer(handle, "pointermove", x + dx, y + dy)
  pointer(handle, "pointerup", x + dx, y + dy)
}

test("Default", async () => {
  const { canvas, canvasElement, step } = await renderExample(<WidgetDemo />)

  await step("renders the title, value and footer", async () => {
    await expect(canvas.getByText("Istanbul")).toBeVisible()
    await expect(canvas.getByText("24°")).toBeVisible()
    await expect(canvas.getByText("H 27° · L 18°")).toBeVisible()
  })

  await step("is not resizable without the prop", async () => {
    await expect(
      canvasElement.querySelector('[data-slot="widget-handle"]')
    ).toBeNull()
    await expect(bySlot(canvasElement, "widget")).toHaveAttribute(
      "data-size",
      "small"
    )
  })
})
test("Sales", async () => {
  const { canvasElement, step } = await renderExample(<WidgetSales />)

  const widget = bySlot(canvasElement, "widget")

  await step("snaps to the nearest size after a drag", async () => {
    await expect(widget).toHaveAttribute("data-size", "large")
    dragHandle(canvasElement, -184, -184)
    await waitFor(() => expect(widget).toHaveAttribute("data-size", "small"))
  })

  await step("resets to the default size on double-click", async () => {
    bySlot(canvasElement, "widget-handle").dispatchEvent(
      new MouseEvent("dblclick", { bubbles: true })
    )
    await waitFor(() => expect(widget).toHaveAttribute("data-size", "large"))
  })
})
test("Kitchen", async () => {
  const { canvas, canvasElement, step } = await renderExample(<WidgetKitchen />)

  const widget = bySlot(canvasElement, "widget")
  const firstTicket = canvas.getByText("#1042 · Table 4")

  await step("shows the ticket list with the handle inside", async () => {
    await expect(widget).toHaveAttribute("data-size", "large")
    await expect(bySlot(canvasElement, "widget-handle")).toHaveAttribute(
      "data-placement",
      "inside"
    )
    await expect(canvas.getByText("2 running late")).toBeVisible()
    await expect(firstTicket).toBeVisible()
  })

  await step("hides the tickets when dragged to small", async () => {
    dragHandle(canvasElement, -184, -184)
    await waitFor(() => expect(widget).toHaveAttribute("data-size", "small"))
    await expect(firstTicket).not.toBeVisible()
    await expect(canvas.getByText("pending orders")).toBeVisible()
  })

  await step("resets to large on double-click", async () => {
    bySlot(canvasElement, "widget-handle").dispatchEvent(
      new MouseEvent("dblclick", { bubbles: true })
    )
    await waitFor(() => expect(widget).toHaveAttribute("data-size", "large"))
    await expect(firstTicket).toBeVisible()
  })
})
test("Reservations", async () => {
  const { canvasElement, step } = await renderExample(<WidgetReservations />)

  const widget = bySlot(canvasElement, "widget")

  await step("never grows past the allowed sizes", async () => {
    dragHandle(canvasElement, 0, 184)
    await expect(widget).toHaveAttribute("data-size", "medium")
    dragHandle(canvasElement, -184, 0)
    await waitFor(() => expect(widget).toHaveAttribute("data-size", "small"))
  })
})
test("Weekly Report", async () => {
  const { canvas, canvasElement, step } = await renderExample(
    <WidgetWeeklyReport />
  )

  const widget = bySlot(canvasElement, "widget")
  const bestSellersTitle = canvas.getByText("Best sellers")

  await step("shows the best sellers at extra large", async () => {
    await expect(widget).toHaveAttribute("data-size", "extra-large")
    await expect(canvas.getByText("₺121,900")).toBeVisible()
    await expect(bestSellersTitle).toBeVisible()
    await expect(canvas.getByText("Dine-in")).toBeVisible()
  })

  await step("hides them when dragged down to large", async () => {
    dragHandle(canvasElement, -368, 0)
    await waitFor(() => expect(widget).toHaveAttribute("data-size", "large"))
    await expect(bestSellersTitle).not.toBeVisible()
    await expect(canvas.getByText("Dine-in")).toBeVisible()
  })

  await step("resets to extra large on double-click", async () => {
    bySlot(canvasElement, "widget-handle").dispatchEvent(
      new MouseEvent("dblclick", { bubbles: true })
    )
    await waitFor(() =>
      expect(widget).toHaveAttribute("data-size", "extra-large")
    )
    await expect(bestSellersTitle).toBeVisible()
  })
})
test("Free Resize", async () => {
  const { canvas, canvasElement, step } = await renderExample(
    <WidgetFreeResize />
  )

  const widget = bySlot(canvasElement, "widget")

  await step("follows the pointer without snapping", async () => {
    await expect(canvas.getByText("Free resize · 352 × 352")).toBeVisible()
    dragHandle(canvasElement, 100, -50)
    await waitFor(() =>
      expect(canvas.getByText("Free resize · 452 × 302")).toBeVisible()
    )
    await expect(widget).toHaveAttribute("data-size", "large")
  })

  await step("caps the width at the largest size", async () => {
    dragHandle(canvasElement, 2000, 0)
    await waitFor(() => expect(widget.offsetWidth).toBe(720))
  })
})
test("Auto Resize", async () => {
  const { canvasElement, step } = await renderExample(<WidgetAutoResize />)

  const widget = bySlot(canvasElement, "widget")

  await step(
    "fills its parent, then returns to auto on double-click",
    async () => {
      await expect(widget).toHaveAttribute("data-size", "auto")
      await expect(widget.offsetWidth).toBe(
        bySlot(canvasElement, "widget-container").parentElement?.clientWidth
      )
      dragHandle(
        canvasElement,
        168 - widget.offsetWidth,
        168 - widget.offsetHeight
      )
      await waitFor(() => expect(widget).toHaveAttribute("data-size", "small"))
      bySlot(canvasElement, "widget-handle").dispatchEvent(
        new MouseEvent("dblclick", { bubbles: true })
      )
      await waitFor(() => expect(widget).toHaveAttribute("data-size", "auto"))
    }
  )
})
test("Centered", async () => {
  const { canvas, canvasElement, step } = await renderExample(
    <WidgetCentered />
  )

  await step("centers the icon, title and description", async () => {
    await expect(bySlot(canvasElement, "widget")).toHaveAttribute(
      "data-align",
      "center"
    )
    await expect(canvas.getByText("Point of sale")).toBeVisible()
    await expect(canvas.getByText("3 open orders")).toBeVisible()
    await expect(
      canvasElement.querySelector('[data-slot="widget-handle"]')
    ).toBeNull()
  })
})
test("Sizes", async () => {
  const { canvasElement, step } = await renderExample(<WidgetSizes />)

  await step("renders each fixed size at its dimensions", async () => {
    const widgets = canvasElement.querySelectorAll<HTMLElement>(
      '[data-slot="widget"]'
    )
    const boxes = [...widgets].map((widget) => [
      widget.dataset.size,
      widget.offsetWidth,
      widget.offsetHeight,
    ])
    await expect(boxes).toEqual([
      ["small", 168, 168],
      ["medium", 352, 168],
      ["large", 352, 352],
      ["extra-large", 720, 352],
    ])
  })
})
test("Dashboard", async () => {
  const { canvas, canvasElement, step } = await renderExample(
    <WidgetDashboard />
  )

  await step("lays out every widget with its content", async () => {
    const widgets = canvasElement.querySelectorAll<HTMLElement>(
      '[data-slot="widget"]'
    )
    await expect(widgets).toHaveLength(5)
    for (const title of [
      "Istanbul",
      "Kitchen display",
      "Hestia",
      "Reservations",
      "Point of sale",
    ]) {
      await expect(canvas.getByText(title)).toBeVisible()
    }
    await expect(canvas.getByText("₺18,240")).toBeVisible()
    await expect(canvas.getByText("18:00")).toBeVisible()
  })

  await step("keeps the grid cells fixed", async () => {
    await expect(
      canvasElement.querySelector('[data-slot="widget-handle"]')
    ).toBeNull()
    await expect(
      [...canvasElement.querySelectorAll<HTMLElement>('[data-slot="widget"]')]
        .map((widget) => widget.dataset.align)
        .filter((align) => align === "center")
    ).toHaveLength(2)
  })
})
