// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite"
import { cn } from "cn"
import { expect, within } from "storybook/test"

import {
  TableList,
  type TableListColumn,
} from "@/components/patterns/table-list"

type Order = {
  id: number
  product: string
  status: "shipped" | "delivered" | "preparing" | "returned"
  date: string
  total: number
}

const orders: Order[] = [
  {
    id: 1042,
    product: "Wireless earbuds",
    status: "shipped",
    date: "Oct 3",
    total: 249,
  },
  {
    id: 1041,
    product: "Magnetic charger",
    status: "delivered",
    date: "Sep 28",
    total: 49,
  },
  {
    id: 1040,
    product: "Phone case",
    status: "preparing",
    date: "Sep 27",
    total: 59,
  },
  {
    id: 1039,
    product: "Watch band",
    status: "returned",
    date: "Sep 20",
    total: 39,
  },
]

const EARBUDS = /Wireless earbuds/

const statusLabel: Record<Order["status"], string> = {
  shipped: "Shipped",
  delivered: "Delivered",
  preparing: "Preparing",
  returned: "Returned",
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

const columns: TableListColumn<Order>[] = [
  {
    key: "id",
    header: "Order",
    cell: (order) => `#${order.id}`,
    slot: "description",
  },
  {
    key: "product",
    header: "Product",
    cell: (order) => order.product,
    slot: "title",
  },
  {
    key: "status",
    header: "Status",
    cell: (order) => (
      <span
        className={cn(
          "font-semibold text-label-secondary",
          order.status === "shipped" && "text-link",
          order.status === "returned" && "text-danger"
        )}
      >
        {statusLabel[order.status]}
      </span>
    ),
    mobileCell: (order) => statusLabel[order.status],
    slot: "description",
  },
  {
    key: "date",
    header: "Date",
    cell: (order) => order.date,
    slot: "description",
  },
  {
    key: "total",
    header: "Total",
    cell: (order) => currency.format(order.total),
    slot: "trailing",
    align: "end",
  },
]

const meta = {
  title: "Patterns/Table List",
  component: TableList<Order>,
  parameters: { layout: "padded" },
  args: {
    rows: orders,
    columns,
    getKey: (order: Order) => order.id,
    title: "Orders",
    className: "mx-auto w-full max-w-3xl",
  },
} satisfies Meta<typeof TableList<Order>>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, step }) => {
    const table = canvas.getByRole("table")

    await step("names the section after its title", async () => {
      await expect(
        canvas.getByRole("region", { name: "Orders" })
      ).toContainElement(table)
    })

    await step("renders a header and one row per order", async () => {
      const headers = within(table).getAllByRole("columnheader")
      await expect(headers.map((header) => header.textContent)).toEqual([
        "Order",
        "Product",
        "Status",
        "Date",
        "Total",
      ])
      await expect(within(table).getAllByRole("row")).toHaveLength(
        orders.length + 1
      )
    })

    await step("formats each cell from its column", async () => {
      const first = within(table).getByRole("row", { name: EARBUDS })
      const cells = within(first).getAllByRole("cell")
      await expect(cells.map((cell) => cell.textContent)).toEqual([
        "#1042",
        "Wireless earbuds",
        "Shipped",
        "Oct 3",
        "$249.00",
      ])
    })
  },
}

export const WithoutTitle: Story = {
  args: { title: undefined },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole("heading")).toBeNull()
    await expect(canvas.queryByRole("region")).toBeNull()
    await expect(canvas.getAllByRole("row")).toHaveLength(orders.length + 1)
  },
}

export const Empty: Story = {
  args: { rows: [], emptyText: "No orders yet." },
  play: async ({ canvas }) => {
    const rows = canvas.getAllByRole("row")
    await expect(rows).toHaveLength(2)
    await expect(canvas.getByRole("cell")).toHaveTextContent("No orders yet.")
  },
}
