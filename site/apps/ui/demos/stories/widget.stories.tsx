// @ts-nocheck
import {
  BowlFoodIcon,
  CalendarBlankIcon,
  CashRegisterIcon,
  ChartBarIcon,
  CoffeeIcon,
  CookingPotIcon,
  HamburgerIcon,
  IceCreamIcon,
  OrangeSliceIcon,
  PizzaIcon,
  SunIcon,
  TriangleIcon,
} from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { expect, waitFor } from "storybook/test"

import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Widget,
  WidgetAction,
  WidgetContent,
  WidgetDescription,
  WidgetFooter,
  WidgetHeader,
  WidgetIcon,
  WidgetTitle,
  WidgetValue,
} from "@/components/ui/widget"
import { MOUSE_POINTER_ID } from "./pointer"

const meta = {
  title: "Components/Widget",
  component: Widget,
  args: {
    size: "small",
    align: "start",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["auto", "small", "medium", "large", "extra-large"],
    },
    align: {
      control: "select",
      options: ["start", "center"],
    },
  },
} satisfies Meta<typeof Widget>

export default meta

type Story = StoryObj<typeof meta>

const hourly = [12, 18, 14, 30, 44, 34, 22, 40, 100, 46, 30, 14]
const topItems = [
  { name: "Grilled meatballs", count: 38 },
  { name: "Lahmacun", count: 31 },
  { name: "Adana kebab", count: 24 },
  { name: "Künefe", count: 19 },
]
const tickets = [
  { id: "#1042", place: "Table 4", minutes: 18 },
  { id: "#1043", place: "Takeaway", minutes: 15 },
  { id: "#1044", place: "Table 12", minutes: 9 },
  { id: "#1045", place: "Pickup", minutes: 7 },
  { id: "#1046", place: "Garden 3", minutes: 5 },
  { id: "#1047", place: "Table 7", minutes: 3 },
  { id: "#1048", place: "Takeaway", minutes: 1 },
]
const week = [
  { day: "Mon", value: 52 },
  { day: "Tue", value: 44 },
  { day: "Wed", value: 60 },
  { day: "Thu", value: 56 },
  { day: "Fri", value: 82 },
  { day: "Sat", value: 100 },
  { day: "Sun", value: 70 },
]
const channels = [
  { name: "Dine-in", amount: "₺64,200", tint: "bg-blue" },
  { name: "Takeaway", amount: "₺38,900", tint: "bg-orange" },
  { name: "Pickup", amount: "₺18,800", tint: "bg-green" },
]
const bestSellers = [
  { name: "Grilled meatballs", count: 238 },
  { name: "Lahmacun", count: 201 },
  { name: "Adana kebab", count: 164 },
  { name: "Künefe", count: 131 },
  { name: "Ayran", count: 120 },
  { name: "Lentil soup", count: 96 },
] as const
const menu = [
  { name: "Meatballs", price: "₺280", icon: <HamburgerIcon /> },
  { name: "Pide", price: "₺220", icon: <PizzaIcon /> },
  { name: "Soup", price: "₺90", icon: <BowlFoodIcon /> },
  { name: "Coffee", price: "₺75", icon: <CoffeeIcon /> },
  { name: "Künefe", price: "₺160", icon: <IceCreamIcon /> },
  { name: "Lemonade", price: "₺70", icon: <OrangeSliceIcon /> },
  { name: "Ayran", price: "₺40", icon: <CoffeeIcon /> },
  { name: "Baklava", price: "₺180", icon: <IceCreamIcon /> },
]

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

function Hint({ children }: { children: React.ReactNode }) {
  return <p className="mt-6 text-xs text-label-secondary">{children}</p>
}

export const Default: Story = {
  render: (args) => (
    <Widget {...args}>
      <WidgetHeader>
        <WidgetIcon>
          <SunIcon weight="fill" />
        </WidgetIcon>
        <WidgetTitle>Istanbul</WidgetTitle>
      </WidgetHeader>
      <WidgetContent>
        <WidgetValue>24°</WidgetValue>
        <WidgetDescription>Partly cloudy</WidgetDescription>
      </WidgetContent>
      <WidgetFooter>H 27° · L 18°</WidgetFooter>
    </Widget>
  ),
  play: async ({ canvas, canvasElement, step }) => {
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
  },
}

export const Sales: Story = {
  render: () => (
    <div>
      <Widget resizable defaultSize="large">
        <WidgetHeader className="gap-1.5 text-warning">
          <WidgetIcon size="sm" className="text-warning">
            <CashRegisterIcon weight="fill" />
          </WidgetIcon>
          <WidgetTitle>Hestia</WidgetTitle>
        </WidgetHeader>
        <div className="flex min-h-0 flex-col gap-3 group-data-[size=medium]/widget:flex-1 group-data-[size=medium]/widget:flex-row group-data-[size=medium]/widget:items-end">
          <div className="shrink-0">
            <WidgetValue>₺18,240</WidgetValue>
            <WidgetDescription className="text-xs">
              Today's revenue · 42 orders
            </WidgetDescription>
          </div>
          <div
            aria-hidden="true"
            className="flex h-14 shrink-0 items-end gap-1 group-data-[size=medium]/widget:h-full group-data-[size=medium]/widget:flex-1 group-data-[size=small]/widget:hidden"
          >
            {hourly.map((value, index) => (
              <span
                key={index}
                data-now={value === 100}
                className="flex-1 rounded-sm bg-control data-[now=true]:bg-orange"
                style={{ height: `${value}%` }}
              />
            ))}
          </div>
        </div>
        <ul className="flex flex-col group-data-[size=medium]/widget:hidden group-data-[size=small]/widget:hidden">
          {topItems.map((item) => (
            <li
              key={item.name}
              className="flex items-center justify-between border-t py-1.5 text-sm"
            >
              {item.name}
              <span className="text-label-secondary tabular-nums">
                {item.count}
              </span>
            </li>
          ))}
        </ul>
      </Widget>
      <Hint>
        Hover the corner and drag the handle. Double-click it to reset.
      </Hint>
    </div>
  ),
  play: async ({ canvasElement, step }) => {
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
  },
}

export const Kitchen: Story = {
  render: () => (
    <div>
      <Widget
        resizable
        handle="inside"
        defaultSize="large"
        className="flex-row gap-4"
      >
        <div className="flex w-32 shrink-0 flex-col gap-1 group-data-[size=small]/widget:w-full">
          <WidgetHeader className="gap-1.5 text-warning">
            <WidgetIcon size="sm" className="text-warning">
              <CookingPotIcon weight="fill" />
            </WidgetIcon>
            <WidgetTitle>Kitchen</WidgetTitle>
          </WidgetHeader>
          <WidgetValue className="mt-2 text-5xl">7</WidgetValue>
          <WidgetDescription className="text-xs">
            pending orders
          </WidgetDescription>
          <p className="text-xs font-medium text-danger">2 running late</p>
        </div>
        <ul className="flex min-w-0 flex-1 flex-col group-data-[size=small]/widget:hidden">
          {tickets.map((ticket) => (
            <li
              key={ticket.id}
              className="flex items-center gap-2 border-b py-1.5 text-sm group-data-[size=medium]/widget:nth-[n+4]:hidden"
            >
              <span
                aria-hidden="true"
                data-late={ticket.minutes >= 15}
                className="size-1.5 shrink-0 rounded-full bg-orange data-[late=true]:bg-red"
              />
              <span className="min-w-0 flex-1 truncate">
                {ticket.id} · {ticket.place}
              </span>
              <span
                data-late={ticket.minutes >= 15}
                className="text-xs text-label-secondary tabular-nums data-[late=true]:font-medium data-[late=true]:text-danger"
              >
                {ticket.minutes} min
              </span>
            </li>
          ))}
        </ul>
      </Widget>
      <Hint>Handle inside the corner. Hover the corner to reveal it.</Hint>
    </div>
  ),
  play: async ({ canvas, canvasElement, step }) => {
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
  },
}

export const Reservations: Story = {
  render: () => (
    <div>
      <Widget resizable defaultSize="medium" sizes={["small", "medium"]}>
        <WidgetHeader className="gap-1.5 text-link">
          <WidgetIcon size="sm" className="text-link">
            <CalendarBlankIcon weight="fill" />
          </WidgetIcon>
          <WidgetTitle>Reservations</WidgetTitle>
          <WidgetAction className="text-xs text-label-secondary">
            Up next
          </WidgetAction>
        </WidgetHeader>
        <div>
          <WidgetValue>20:00</WidgetValue>
          <p className="text-sm">Ayşe Y. · 6 guests</p>
        </div>
        <div className="mt-auto flex flex-col gap-1 group-data-[size=small]/widget:hidden">
          <div className="flex justify-between text-2xs text-label-secondary tabular-nums">
            <span>18:00</span>
            <span>20:00</span>
            <span>22:00</span>
            <span>24:00</span>
          </div>
          <div className="relative h-2 rounded-full bg-control">
            <span className="absolute inset-y-0 start-[30%] w-[45%] rounded-full bg-blue" />
          </div>
        </div>
      </Widget>
      <Hint>Snaps between small and medium only.</Hint>
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    const widget = bySlot(canvasElement, "widget")

    await step("never grows past the allowed sizes", async () => {
      dragHandle(canvasElement, 0, 184)
      await expect(widget).toHaveAttribute("data-size", "medium")
      dragHandle(canvasElement, -184, 0)
      await waitFor(() => expect(widget).toHaveAttribute("data-size", "small"))
    })
  },
}

export const WeeklyReport: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div>
      <Widget resizable defaultSize="extra-large" className="flex-row gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <WidgetHeader className="gap-1.5 text-success">
            <WidgetIcon size="sm" className="text-success">
              <ChartBarIcon weight="fill" />
            </WidgetIcon>
            <WidgetTitle>This week</WidgetTitle>
          </WidgetHeader>
          <div className="flex min-h-0 flex-col gap-3 group-data-[size=medium]/widget:flex-1 group-data-[size=medium]/widget:flex-row group-data-[size=medium]/widget:items-end">
            <div className="shrink-0">
              <WidgetValue>₺121,900</WidgetValue>
              <p className="flex items-center gap-1 text-xs font-medium text-success">
                <TriangleIcon weight="fill" className="size-2.5" />
                12% more than last week
              </p>
            </div>
            <div className="flex h-24 min-w-0 shrink-0 items-end gap-2 group-data-[size=medium]/widget:h-full group-data-[size=medium]/widget:gap-1.5 group-data-[size=medium]/widget:flex-1 group-data-[size=small]/widget:hidden">
              {week.map((day) => (
                <div
                  key={day.day}
                  className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1"
                >
                  <div className="flex min-h-0 w-full flex-1 items-end">
                    <span
                      aria-hidden="true"
                      data-top={day.value === 100}
                      className="w-full rounded-md bg-control data-[top=true]:bg-green"
                      style={{ height: `${day.value}%` }}
                    />
                  </div>
                  <span className="text-2xs text-label-secondary group-data-[size=medium]/widget:hidden">
                    {day.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <ul className="flex flex-col group-data-[size=medium]/widget:hidden group-data-[size=small]/widget:hidden">
            {channels.map((channel) => (
              <li
                key={channel.name}
                className="flex items-center gap-2 border-t py-1.5 text-sm"
              >
                <span
                  aria-hidden="true"
                  className={`size-2 rounded-full ${channel.tint}`}
                />
                <span className="flex-1">{channel.name}</span>
                <span className="text-label-secondary tabular-nums">
                  {channel.amount}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="hidden w-72 shrink-0 flex-col gap-2 group-data-[size=extra-large]/widget:flex">
          <p className="text-xs font-semibold text-label-secondary">
            Best sellers
          </p>
          {bestSellers.map((item) => (
            <div key={item.name} className="flex flex-col gap-1">
              <div className="flex justify-between text-sm">
                {item.name}
                <span className="text-label-secondary tabular-nums">
                  {item.count}
                </span>
              </div>
              <div className="h-1 rounded-full bg-control">
                <div
                  className="h-full rounded-full bg-green"
                  style={{
                    width: `${(item.count / bestSellers[0].count) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Widget>
      <Hint>Extra large shows best sellers, large hides them.</Hint>
    </div>
  ),
  play: async ({ canvas, canvasElement, step }) => {
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
  },
}

function FreeResizeExample() {
  const ref = React.useRef<HTMLDivElement>(null)
  const [box, setBox] = React.useState({ width: 0, height: 0, columns: 0 })

  React.useEffect(() => {
    const widget = ref.current
    if (!widget) return
    const measure = () => {
      const grid = widget.querySelector<HTMLElement>("[data-menu-grid]")
      const columns = grid
        ? getComputedStyle(grid).gridTemplateColumns.split(" ").length
        : 0
      setBox({
        width: Math.round(widget.offsetWidth),
        height: Math.round(widget.offsetHeight),
        columns,
      })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(widget)
    return () => observer.disconnect()
  }, [])

  return (
    <div>
      <Widget
        ref={ref}
        resizable="free"
        defaultSize="large"
        className="gap-0 p-0"
      >
        <div className="flex items-baseline justify-between px-4 pt-4 pb-3">
          <WidgetTitle className="text-xl">Hestia POS</WidgetTitle>
          <span className="text-sm text-label-secondary tabular-nums">
            {box.columns} columns
          </span>
        </div>
        <ScrollArea className="min-h-0 flex-1">
          <div
            data-menu-grid
            className="grid grid-cols-2 gap-2 px-4 pb-4 @[30rem]/widget:grid-cols-3 @[44rem]/widget:grid-cols-4"
          >
            {menu.map((item) => (
              <div
                key={item.name}
                className="flex flex-col gap-2 rounded-2xl bg-surface-raised p-3"
              >
                <span
                  aria-hidden="true"
                  className="text-warning [&_svg]:size-6"
                >
                  {item.icon}
                </span>
                <div>
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className="text-sm text-label-secondary tabular-nums">
                    {item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Widget>
      <Hint>
        Free resize · {box.width} × {box.height}
      </Hint>
    </div>
  )
}

export const FreeResize: Story = {
  parameters: { layout: "padded" },
  render: () => <FreeResizeExample />,
  play: async ({ canvas, canvasElement, step }) => {
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
  },
}

export const AutoResize: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="h-60 w-full max-w-180">
      <Widget resizable defaultSize="auto">
        <WidgetHeader>
          <WidgetIcon>
            <CashRegisterIcon />
          </WidgetIcon>
          <WidgetTitle>Point of sale</WidgetTitle>
        </WidgetHeader>
        <WidgetDescription>
          Fills its parent. Drag to snap to a size, double-click to fill again.
        </WidgetDescription>
      </Widget>
    </div>
  ),
  play: async ({ canvasElement, step }) => {
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
        await waitFor(() =>
          expect(widget).toHaveAttribute("data-size", "small")
        )
        bySlot(canvasElement, "widget-handle").dispatchEvent(
          new MouseEvent("dblclick", { bubbles: true })
        )
        await waitFor(() => expect(widget).toHaveAttribute("data-size", "auto"))
      }
    )
  },
}

export const Centered: Story = {
  args: { align: "center" },
  render: (args) => (
    <Widget {...args}>
      <WidgetHeader>
        <WidgetIcon size="lg">
          <CashRegisterIcon />
        </WidgetIcon>
        <WidgetTitle>Point of sale</WidgetTitle>
      </WidgetHeader>
      <WidgetDescription>3 open orders</WidgetDescription>
    </Widget>
  ),
  play: async ({ canvas, canvasElement, step }) => {
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
  },
}

const gridSpans = {
  small: "1 × 1",
  medium: "2 × 1",
  large: "2 × 2",
  "extra-large": "4 × 2",
}

export const Sizes: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-wrap items-start gap-4">
      {(["small", "medium", "large", "extra-large"] as const).map((size) => (
        <Widget key={size} size={size}>
          <WidgetHeader>
            <WidgetTitle className="capitalize">
              {size.replace("-", " ")}
            </WidgetTitle>
          </WidgetHeader>
          <WidgetFooter>{gridSpans[size]}</WidgetFooter>
        </Widget>
      ))}
    </div>
  ),
  play: async ({ canvasElement, step }) => {
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
  },
}

export const Dashboard: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="grid max-w-4xl auto-rows-[10.5rem] grid-cols-2 gap-4 md:grid-cols-4">
      <Widget>
        <WidgetHeader>
          <WidgetIcon>
            <SunIcon weight="fill" />
          </WidgetIcon>
          <WidgetTitle>Istanbul</WidgetTitle>
        </WidgetHeader>
        <WidgetValue>24°</WidgetValue>
        <WidgetFooter>Partly cloudy</WidgetFooter>
      </Widget>
      <Widget align="center">
        <WidgetHeader>
          <WidgetIcon size="lg">
            <CookingPotIcon />
          </WidgetIcon>
          <WidgetTitle>Kitchen display</WidgetTitle>
        </WidgetHeader>
        <WidgetDescription>5 tickets</WidgetDescription>
      </Widget>
      <Widget className="col-span-2">
        <WidgetHeader className="gap-1.5 text-warning">
          <WidgetIcon size="sm" className="text-warning">
            <CashRegisterIcon weight="fill" />
          </WidgetIcon>
          <WidgetTitle>Hestia</WidgetTitle>
        </WidgetHeader>
        <WidgetValue>₺18,240</WidgetValue>
        <WidgetFooter>Today's revenue · 42 orders</WidgetFooter>
      </Widget>
      <Widget className="col-span-2 row-span-2">
        <WidgetHeader className="gap-1.5 text-link">
          <WidgetIcon size="sm" className="text-link">
            <CalendarBlankIcon weight="fill" />
          </WidgetIcon>
          <WidgetTitle>Reservations</WidgetTitle>
        </WidgetHeader>
        <WidgetContent className="gap-2">
          {tickets.slice(0, 5).map((ticket, index) => (
            <div key={ticket.id} className="flex items-baseline gap-3 text-sm">
              <span className="w-11 shrink-0 text-label-secondary tabular-nums">
                {`${18 + index}:00`}
              </span>
              <span className="truncate">{ticket.place}</span>
            </div>
          ))}
        </WidgetContent>
      </Widget>
      <Widget className="col-span-2 row-span-2" align="center">
        <WidgetHeader>
          <WidgetIcon size="lg">
            <CashRegisterIcon />
          </WidgetIcon>
          <WidgetTitle>Point of sale</WidgetTitle>
        </WidgetHeader>
        <WidgetDescription>3 open orders</WidgetDescription>
      </Widget>
    </div>
  ),
  play: async ({ canvas, canvasElement, step }) => {
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
  },
}
