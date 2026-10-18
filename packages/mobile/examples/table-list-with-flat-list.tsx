import { FlatList } from "react-native"
import {
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

export default function TableListWithFlatList() {
  return (
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
          onPress={() => undefined}
        />
      )}
    />
  )
}
