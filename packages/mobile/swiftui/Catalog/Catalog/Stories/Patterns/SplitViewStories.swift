import EsuissUI
import SwiftUI

enum SplitViewStories {
  static let group = StoryGroup(.patterns, "Split View", stories: [
    Story("Default") {
      SplitViewMail()
    },
    Story("DetailColumn") {
      SplitViewMail(column: .detail)
    },
    Story("StartOnSidebar") {
      SplitViewMail(column: .sidebar)
    },
    Story("TwoColumns") {
      SplitViewMail(withSidebar: false)
    },
  ])
}

private struct SplitViewMessage: Identifiable {
  let id: String
  let from: String
  let time: String
  let subject: String
  let body: String
}

private let splitViewMailboxes = ["Inbox", "Sent", "Drafts", "Archive"]

private let splitViewMessages = [
  SplitViewMessage(
    id: "order",
    from: "Acme Store",
    time: "09:12",
    subject: "Your order has shipped",
    body: "Order #1042 will be delivered tomorrow. Tracking number: 4815 1623 42."
  ),
  SplitViewMessage(
    id: "meeting",
    from: "Jordan Lee",
    time: "Yesterday",
    subject: "Tomorrow's meeting",
    body: "Does 10:00 work for you? On the agenda: the Q4 budget and the campaign plan."
  ),
  SplitViewMessage(
    id: "storage",
    from: "Cloud Drive",
    time: "Mon",
    subject: "Your storage is almost full",
    body: "Your cloud storage is 90% full. Upgrade your plan to get more space."
  ),
]

private struct SplitViewMail: View {
  var withSidebar = true

  @State private var column: SplitViewColumn
  @State private var mailbox = "Inbox"
  @State private var messageID = "order"

  init(column: SplitViewColumn = .list, withSidebar: Bool = true) {
    _column = State(initialValue: column)
    self.withSidebar = withSidebar
  }

  private var message: SplitViewMessage {
    splitViewMessages.first { $0.id == messageID } ?? splitViewMessages[0]
  }

  var body: some View {
    SplitView(column: $column) {
      if withSidebar {
        SplitViewSidebar("Mailboxes") {
          ForEach(splitViewMailboxes, id: \.self) { name in
            SplitViewItem(isActive: mailbox == name, action: { mailbox = name }) {
              Text(verbatim: name)
            }
          }
        }
      }
      SplitViewList(verbatim: mailbox) {
        ForEach(splitViewMessages) { item in
          SplitViewItem(isActive: item.id == messageID, action: { messageID = item.id }) {
            HStack(alignment: .firstTextBaseline, spacing: 8) {
              Text(verbatim: item.from)
                .fontWeight(.semibold)
                .lineLimit(1)
                .frame(maxWidth: .infinity, alignment: .leading)
              Text(verbatim: item.time)
                .textStyle(.sm)
                .foregroundStyle(EsuissColor.mutedForeground)
            }
            Text(verbatim: item.subject)
              .lineLimit(1)
            Text(verbatim: item.body)
              .textStyle(.sm)
              .foregroundStyle(EsuissColor.mutedForeground)
              .lineLimit(1)
          }
        }
      }
      SplitViewDetail(verbatim: message.subject) {
        Text(verbatim: "\(message.from) · \(message.time)")
          .textStyle(.sm)
          .foregroundStyle(EsuissColor.mutedForeground)
        Text(verbatim: message.body)
          .foregroundStyle(EsuissColor.foreground)
          .fixedSize(horizontal: false, vertical: true)
          .padding(.top, 24)
      }
    }
    .containerRelativeFrame(.vertical) { height, _ in height - 32 }
  }
}
