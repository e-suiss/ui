import * as React from "react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationSummary,
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

function pageRange(page: number, count: number) {
  if (count <= 7) return Array.from({ length: count }, (_, index) => index + 1)
  const start = Math.max(1, Math.min(page - 2, count - 6))
  const pages: (number | "ellipsis")[] = Array.from(
    { length: 5 },
    (_, index) => start + index
  )
  if (pages.at(-1) !== count) pages.push("ellipsis", count)
  return pages
}

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

export default function PaginationDemo() {
  const [page, setPage] = React.useState(2)
  const perPage = 5
  const count = Math.ceil(orders.length / perPage)
  const rows = orders.slice((page - 1) * perPage, page * perPage)

  return (
    <div className="flex w-136 min-w-0 flex-col gap-4">
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
      <Pagination className="justify-between">
        <PaginationSummary>
          {(page - 1) * perPage + 1}–{Math.min(page * perPage, orders.length)} /{" "}
          {orders.length}
        </PaginationSummary>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              text=""
              {...go(setPage, page - 1, page === 1)}
            />
          </PaginationItem>
          {pageRange(page, count).map((entry, index) =>
            entry === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={entry}>
                <PaginationLink
                  isActive={entry === page}
                  {...go(setPage, entry, false)}
                >
                  {entry}
                </PaginationLink>
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <PaginationNext
              text=""
              {...go(setPage, page + 1, page === count)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
