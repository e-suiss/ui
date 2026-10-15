import { cn } from "cn"
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

export default function TableListEmpty() {
  return (
    <TableList<Order>
      rows={[]}
      columns={columns}
      getKey={(order: Order) => order.id}
      title="Orders"
      className="mx-auto w-full max-w-3xl"
      emptyText="No orders yet."
    />
  )
}
