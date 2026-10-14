import type { Meta, StoryObj } from "@storybook/react-native"
import { FlatList, View } from "react-native"
import {
  TableList,
  type TableListColumn,
  TableListFooter,
  TableListHeader,
  TableListRow,
  TableListSeparator,
} from "@/components/patterns/table-list"

type Invoice = {
  id: string
  customer: string
  status: string
  method: string
  amount: string
}

const invoices: Invoice[] = [
  {
    id: "INV001",
    customer: "Olivia Martin",
    status: "Paid",
    method: "Card",
    amount: "$250.00",
  },
  {
    id: "INV002",
    customer: "Jackson Lee",
    status: "Pending",
    method: "PayPal",
    amount: "$150.00",
  },
  {
    id: "INV003",
    customer: "Isabella Nguyen",
    status: "Unpaid",
    method: "Transfer",
    amount: "$350.00",
  },
  {
    id: "INV004",
    customer: "William Kim",
    status: "Paid",
    method: "Card",
    amount: "$450.00",
  },
]

const columns: TableListColumn<Invoice>[] = [
  {
    key: "customer",
    header: "Customer",
    cell: (row) => row.customer,
    slot: "title",
  },
  {
    key: "status",
    header: "Status",
    cell: (row) => row.status,
    slot: "description",
  },
  {
    key: "method",
    header: "Method",
    cell: (row) => row.method,
    slot: "description",
  },
  {
    key: "amount",
    header: "Amount",
    cell: (row) => row.amount,
    slot: "trailing",
    align: "end",
  },
]

const meta = {
  title: "Patterns/Table List",
  component: TableList,
} satisfies Meta<typeof TableList>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { rows: [], columns: [] },
  render: () => (
    <View className="gap-8">
      <TableList
        title="Invoices"
        rows={invoices}
        columns={columns}
        getKey={(row) => row.id}
        onRowPress={() => {}}
      />
      <TableList rows={[]} columns={columns} emptyText="No invoices yet." />
    </View>
  ),
}

export const WithFlatList: Story = {
  args: { rows: [], columns: [] },
  render: () => (
    <FlatList
      data={invoices}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={<TableListHeader>Recent</TableListHeader>}
      ListFooterComponent={
        <TableListFooter>Payments settle within two days.</TableListFooter>
      }
      ItemSeparatorComponent={TableListSeparator}
      renderItem={({ item, index }) => (
        <TableListRow
          first={index === 0}
          last={index === invoices.length - 1}
          title={item.customer}
          description={item.status}
          trailing={item.amount}
          onPress={() => {}}
        />
      )}
    />
  ),
}
