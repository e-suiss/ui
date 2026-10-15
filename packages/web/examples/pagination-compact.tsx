import * as React from "react"
import {
  Pagination,
  PaginationGroup,
  PaginationInput,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const places = [
  "Table 7",
  "Table 4",
  "Takeaway",
  "Table 12",
  "Pickup",
  "Garden 3",
]

const currency = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
})

const orders = Array.from({ length: 62 }, (_, index) => {
  const id = 1100 - index
  return {
    id,
    place: places[(id * 7) % places.length],
    amount: ((id * 379) % 900) + 150,
  }
})

function go(setPage: (page: number) => void, page: number, disabled: boolean) {
  return {
    href: "#",
    "aria-disabled": disabled || undefined,
    onClick: (event: React.MouseEvent) => {
      event.preventDefault()
      if (!disabled) setPage(page)
    },
  }
}

function Orders({
  page,
  perPage,
  children,
}: {
  page: number
  perPage: number
  children: React.ReactNode
}) {
  const rows = orders.slice((page - 1) * perPage, page * perPage)

  return (
    <div className="flex w-136 flex-col gap-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Table</TableHead>
            <TableHead className="text-end">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="tabular-nums">#{order.id}</TableCell>
              <TableCell className="text-muted-foreground">
                {order.place}
              </TableCell>
              <TableCell className="text-end tabular-nums">
                {currency.format(order.amount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {children}
    </div>
  )
}

function CompactExample() {
  const [page, setPage] = React.useState(3)
  const [draft, setDraft] = React.useState("3")
  const perPage = 5
  const count = Math.ceil(orders.length / perPage)

  const change = (next: number) => {
    setPage(next)
    setDraft(String(next))
  }

  const commit = () => {
    const next = Number.parseInt(draft, 10)
    if (Number.isNaN(next)) return setDraft(String(page))
    change(Math.min(Math.max(next, 1), count))
  }

  return (
    <Orders page={page} perPage={perPage}>
      <Pagination className="justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <label htmlFor="orders-page">Page</label>
          <PaginationInput
            id="orders-page"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={commit}
            onKeyDown={(event) => event.key === "Enter" && commit()}
          />
          <span className="tabular-nums">/ {count}</span>
        </div>
        <PaginationGroup>
          <PaginationPrevious text="" {...go(change, page - 1, page === 1)} />
          <PaginationNext text="" {...go(change, page + 1, page === count)} />
        </PaginationGroup>
      </Pagination>
    </Orders>
  )
}

export default function PaginationCompact() {
  return <CompactExample />
}
