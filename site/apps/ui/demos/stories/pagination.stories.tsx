// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { expect, screen, userEvent, within } from "storybook/test"

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
  play: async ({ canvas, step }) => {
    const nav = canvas.getByRole("navigation", { name: "pagination" })

    await step("marks the current page", async () => {
      await expect(
        within(nav).getByRole("link", { name: "2" })
      ).toHaveAttribute("aria-current", "page")
      await expect(canvas.getByText("#1095")).toBeVisible()
    })

    await step("moves forward with the next link", async () => {
      await userEvent.click(
        within(nav).getByRole("link", { name: "Go to next page" })
      )
      await expect(
        within(nav).getByRole("link", { name: "3" })
      ).toHaveAttribute("aria-current", "page")
      await expect(canvas.getByText("#1090")).toBeVisible()
    })

    await step("disables previous on the first page", async () => {
      await userEvent.click(within(nav).getByRole("link", { name: "1" }))
      await expect(
        within(nav).getByRole("link", { name: "Go to previous page" })
      ).toHaveAttribute("aria-disabled", "true")
      await expect(canvas.getByText("#1100")).toBeVisible()
    })
  },
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
  play: async ({ canvas, step }) => {
    const input = canvas.getByRole("textbox", { name: "Page" })

    await step("jumps to a typed page on Enter", async () => {
      await userEvent.clear(input)
      await userEvent.type(input, "5{Enter}")
      await expect(canvas.getByText("#1080")).toBeVisible()
    })

    await step("clamps an out-of-range page", async () => {
      await userEvent.clear(input)
      await userEvent.type(input, "99{Enter}")
      await expect(input).toHaveValue("13")
      await expect(
        canvas.getByRole("link", { name: "Go to next page" })
      ).toHaveAttribute("aria-disabled", "true")
    })

    await step("syncs the input with the arrows", async () => {
      await userEvent.click(
        canvas.getByRole("link", { name: "Go to previous page" })
      )
      await expect(input).toHaveValue("12")
    })
  },
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
  play: async ({ canvas, step }) => {
    await step("changes the page size from the select", async () => {
      await userEvent.click(
        canvas.getByRole("combobox", { name: "Rows per page" })
      )
      await userEvent.click(
        await screen.findByRole("option", { name: "10 rows" })
      )
      await expect(canvas.getAllByRole("row")).toHaveLength(11)
    })

    await step("jumps to the last and first pages", async () => {
      await userEvent.click(
        canvas.getByRole("link", { name: "Go to last page" })
      )
      await expect(canvas.getAllByRole("row")).toHaveLength(3)
      await expect(
        canvas.getByRole("link", { name: "Go to next page" })
      ).toHaveAttribute("aria-disabled", "true")
      await userEvent.click(
        canvas.getByRole("link", { name: "Go to first page" })
      )
      await expect(canvas.getByText("#1100")).toBeVisible()
    })
  },
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
  play: async ({ canvas, step }) => {
    await step("hides the ellipses and marks page 10", async () => {
      await expect(canvas.getByRole("link", { name: "10" })).toHaveAttribute(
        "aria-current",
        "page"
      )
      await expect(canvas.getAllByRole("link")).toHaveLength(7)
    })
  },
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
  play: async ({ canvas, step }) => {
    await step("names the links after their custom text", async () => {
      await expect(
        canvas.getByRole("link", { name: "Newer" })
      ).toHaveTextContent("Newer")
      await expect(
        canvas.getByRole("link", { name: "Older" })
      ).toHaveTextContent("Older")
    })
  },
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
