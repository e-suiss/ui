import EsuissUI
import SwiftUI

enum TableListStories {
  static let group = StoryGroup(.patterns, "Table List", stories: [
    Story("Default") {
      VStack(alignment: .leading, spacing: 32) {
        TableList(tableListInvoices, columns: tableListColumns, title: "Invoices", action: { _ in })
        TableList([TableListInvoice](), columns: tableListColumns, emptyText: "No invoices yet.")
      }
    },
    Story("WithFlatList") {
      TableListSection(header: "Recent", footer: "Payments settle within two days.") {
        ForEach(tableListInvoices) { invoice in
          TableListRow(action: {}) {
            VStack(alignment: .leading, spacing: 2) {
              Text(verbatim: invoice.customer)
                .textStyle(.base)
                .foregroundStyle(Color.label)
                .lineLimit(1)
              Text(verbatim: invoice.status)
                .textStyle(.sm)
                .foregroundStyle(Color.labelSecondary)
                .lineLimit(1)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            Text(verbatim: invoice.amount)
              .textStyle(.base)
              .monospacedDigit()
              .foregroundStyle(Color.labelSecondary)
              .lineLimit(1)
              .fixedSize()
          }
        }
      }
    },
  ])
}

private struct TableListInvoice: Identifiable {
  let id: String
  let customer: String
  let status: String
  let method: String
  let amount: String
}

private let tableListInvoices = [
  TableListInvoice(id: "INV001", customer: "Olivia Martin", status: "Paid", method: "Card", amount: "$250.00"),
  TableListInvoice(id: "INV002", customer: "Jackson Lee", status: "Pending", method: "PayPal", amount: "$150.00"),
  TableListInvoice(id: "INV003", customer: "Isabella Nguyen", status: "Unpaid", method: "Transfer", amount: "$350.00"),
  TableListInvoice(id: "INV004", customer: "William Kim", status: "Paid", method: "Card", amount: "$450.00"),
]

private let tableListColumns: [TableListColumn<TableListInvoice>] = [
  TableListColumn("customer", header: "Customer", slot: .title) { Text(verbatim: $0.customer) },
  TableListColumn("status", header: "Status", slot: .description) { Text(verbatim: $0.status) },
  TableListColumn("method", header: "Method", slot: .description) { Text(verbatim: $0.method) },
  TableListColumn("amount", header: "Amount", slot: .trailing) { Text(verbatim: $0.amount) },
]
