import {
  TableList,
  type TableListColumn,
} from "@/components/patterns/table-list"
import { cn } from "@/lib/utils"

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
          "font-semibold text-muted-foreground",
          order.status === "shipped" && "text-primary",
          order.status === "returned" && "text-destructive"
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

export default function TableListDemo() {
  return (
    <TableList<Order>
      rows={orders}
      columns={columns}
      getKey={(order: Order) => order.id}
      title="Orders"
      className="mx-auto w-full max-w-3xl"
    />
  )
}
