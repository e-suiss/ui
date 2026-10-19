import * as React from "react"
import {
  Pagination,
  PaginationFirst,
  PaginationGroup,
  PaginationLast,
  PaginationNext,
  PaginationPrevious,
  PaginationSummary,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

export default function PaginationRowsPerPage() {
  const [page, setPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState(5)
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
        <Select
          aria-label="Rows per page"
          value={String(perPage)}
          onChange={(value) => {
            setPerPage(Number(value))
            setPage(1)
          }}
        >
          <SelectTrigger
            size="sm"
            className="h-8 text-sm"
            aria-label="Rows per page"
          >
            <SelectValue>{() => `${perPage} rows`}</SelectValue>
          </SelectTrigger>
          <SelectContent placement="top">
            <SelectItem value="5">5 rows</SelectItem>
            <SelectItem value="10">10 rows</SelectItem>
            <SelectItem value="20">20 rows</SelectItem>
          </SelectContent>
        </Select>
        <PaginationSummary>
          {(page - 1) * perPage + 1}–{Math.min(page * perPage, orders.length)} /{" "}
          {orders.length}
        </PaginationSummary>
        <PaginationGroup>
          <PaginationFirst {...go(setPage, 1, page === 1)} />
          <PaginationPrevious text="" {...go(setPage, page - 1, page === 1)} />
          <PaginationNext text="" {...go(setPage, page + 1, page === count)} />
          <PaginationLast {...go(setPage, count, page === count)} />
        </PaginationGroup>
      </Pagination>
    </div>
  )
}
