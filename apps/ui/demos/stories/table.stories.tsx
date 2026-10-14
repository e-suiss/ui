// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect } from "storybook/test"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const invoices = [
  { id: "INV-001", status: "Paid", method: "Credit card", amount: 250 },
  { id: "INV-002", status: "Pending", method: "PayPal", amount: 150 },
  { id: "INV-003", status: "Unpaid", method: "Bank transfer", amount: 350 },
  { id: "INV-004", status: "Paid", method: "Credit card", amount: 450 },
  { id: "INV-005", status: "Paid", method: "PayPal", amount: 550 },
]

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

const total = invoices.reduce((sum, invoice) => sum + invoice.amount, 0)

const meta = {
  title: "Components/Table",
  component: Table,
  decorators: [
    (Story) => (
      <div className="w-[36rem]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Table>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Table {...args}>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-end">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">{invoice.id}</TableCell>
            <TableCell>{invoice.status}</TableCell>
            <TableCell>{invoice.method}</TableCell>
            <TableCell className="text-end">
              {currency.format(invoice.amount)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-end">{currency.format(total)}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
  play: async ({ canvas, step }) => {
    await step("names the table with its caption", async () => {
      await expect(
        canvas.getByRole("table", { name: "A list of your recent invoices." })
      ).toBeVisible()
    })

    await step("renders headers, rows and the footer total", async () => {
      await expect(canvas.getAllByRole("columnheader")).toHaveLength(4)
      await expect(canvas.getAllByRole("row")).toHaveLength(7)
      await expect(canvas.getAllByRole("row").at(-1)).toHaveTextContent(
        "Total$1,750.00"
      )
    })
  },
}

export const SelectedRow: Story = {
  render: (args) => (
    <Table {...args}>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-end">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.slice(0, 3).map((invoice, index) => (
          <TableRow key={invoice.id} data-selected={index === 1}>
            <TableCell className="font-medium">{invoice.id}</TableCell>
            <TableCell>{invoice.status}</TableCell>
            <TableCell className="text-end">
              {currency.format(invoice.amount)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
  play: async ({ canvas, step }) => {
    await step("marks only the second row as selected", async () => {
      const rows = canvas.getAllByRole("row").slice(1)
      await expect(rows[1]).toHaveAttribute("data-selected", "true")
      await expect(rows[0]).toHaveAttribute("data-selected", "false")
    })
  },
}
