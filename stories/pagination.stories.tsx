import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationGroup,
  PaginationInput,
  PaginationItem,
  PaginationLast,
  PaginationLink,
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

const meta = {
  title: "Components/Pagination",
  component: Pagination,
} satisfies Meta<typeof Pagination>

export default meta

type Story = StoryObj<typeof meta>

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
              <TableCell className="text-label-secondary">
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

function NumberedExample() {
  const [page, setPage] = React.useState(2)
  const perPage = 5
  const count = Math.ceil(orders.length / perPage)

  return (
    <Orders page={page} perPage={perPage}>
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
    </Orders>
  )
}

export const Default: Story = {
  render: () => <NumberedExample />,
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
        <div className="flex items-center gap-2 text-sm text-label-secondary">
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

export const Compact: Story = {
  render: () => <CompactExample />,
}

function RowsPerPageExample() {
  const [page, setPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState(5)
  const count = Math.ceil(orders.length / perPage)

  return (
    <Orders page={page} perPage={perPage}>
      <Pagination className="justify-between">
        <Select
          value={String(perPage)}
          onValueChange={(value) => {
            setPerPage(Number(value))
            setPage(1)
          }}
        >
          <SelectTrigger
            size="sm"
            className="h-8 text-sm"
            aria-label="Rows per page"
          >
            <SelectValue>{(value: string) => `${value} rows`}</SelectValue>
          </SelectTrigger>
          <SelectContent side="top">
            {[5, 10, 20].map((value) => (
              <SelectItem key={value} value={String(value)}>
                {value} rows
              </SelectItem>
            ))}
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
    </Orders>
  )
}

export const RowsPerPage: Story = {
  render: () => <RowsPerPageExample />,
}

export const WithEllipsis: Story = {
  render: (args) => (
    <Pagination {...args}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">9</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            10
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">11</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">24</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
}

export const CustomLabels: Story = {
  render: (args) => (
    <Pagination {...args}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" text="Newer" />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" text="Older" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
}

export const LargeLinks: Story = {
  render: (args) => (
    <Pagination {...args}>
      <PaginationContent>
        {[1, 2, 3, 4, 5].map((page) => (
          <PaginationItem key={page}>
            <PaginationLink href="#" size="icon" isActive={page === 1}>
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
      </PaginationContent>
    </Pagination>
  ),
}
