import { within } from "@testing-library/dom"
import { expect, test } from "vitest"
import TableListDemo from "@/examples/table-list-demo"
import TableListEmpty from "@/examples/table-list-empty"
import TableListWithoutTitle from "@/examples/table-list-without-title"
import { renderExample } from "@/tests/render-example"

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

test("Default", async () => {
  const { canvas, step } = await renderExample(<TableListDemo />)

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
})
test("Without Title", async () => {
  const { canvas } = await renderExample(<TableListWithoutTitle />)

  await expect(canvas.queryByRole("heading")).toBeNull()
  await expect(canvas.queryByRole("region")).toBeNull()
  await expect(canvas.getAllByRole("row")).toHaveLength(orders.length + 1)
})
test("Empty", async () => {
  const { canvas } = await renderExample(<TableListEmpty />)

  const rows = canvas.getAllByRole("row")
  await expect(rows).toHaveLength(2)
  await expect(canvas.getByRole("cell")).toHaveTextContent("No orders yet.")
})
