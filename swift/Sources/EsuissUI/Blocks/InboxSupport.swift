import PhosphorSwift
import SwiftUI

public struct InboxSupport: View {
  public enum Status: String, CaseIterable, Sendable {
    case open = "Open"
    case pending = "Pending"
    case solved = "Solved"
  }

  enum Priority: String {
    case high = "High"
    case medium = "Medium"
    case low = "Low"
  }

  struct Ticket: Identifiable, Equatable {
    let id: String
    let title: String
    let device: String
    var status: Status
    let priority: Priority
    let requester: String
    let tint: Color
  }

  static var initialTickets: [Ticket] {
    [
      Ticket(id: "#4821", title: "Screen flickers", device: "Phone Pro", status: .open, priority: .high, requester: "Jamie Rivera", tint: .orange),
      Ticket(id: "#4820", title: "Battery drains fast", device: "Book Air", status: .pending, priority: .medium, requester: "Morgan Lee", tint: .blue),
      Ticket(id: "#4819", title: "Pods won't pair", device: "Pods Studio", status: .open, priority: .low, requester: "Avery Brooks", tint: .pink),
      Ticket(id: "#4818", title: "Cloud backup error", device: "Phone Air", status: .solved, priority: .medium, requester: "Taylor Kim", tint: .green),
    ]
  }

  static let views = ["Open", "Pending", "Solved", "All"]

  private var onViewChange: ((String) -> Void)?
  private var onReply: ((String, String) -> Void)?
  private var onStatusChange: ((String, Status) -> Void)?
  private let swiped: String?
  @State private var tickets: [Ticket]
  @State private var view: String
  @State private var selected: String
  @State private var reply: String
  @State private var column: SplitViewColumn
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(
    onViewChange: ((_ view: String) -> Void)? = nil,
    onStatusChange: ((_ id: String, _ status: Status) -> Void)? = nil,
    onReply: ((_ id: String, _ text: String) -> Void)? = nil
  ) {
    self.init(view: "Open")
    self.onViewChange = onViewChange
    self.onReply = onReply
    self.onStatusChange = onStatusChange
  }

  init(
    view: String = "Open",
    selected: String = "#4821",
    reply: String = "",
    column: SplitViewColumn = .list,
    swiped: String? = nil
  ) {
    _tickets = State(initialValue: Self.initialTickets)
    _view = State(initialValue: view)
    _selected = State(initialValue: selected)
    _reply = State(initialValue: reply)
    _column = State(initialValue: column)
    self.swiped = swiped
  }

  private func count(_ value: String) -> Int {
    value == "All" ? tickets.count : tickets.filter { $0.status.rawValue == value }.count
  }

  public var body: some View {
    let list = tickets.filter { view == "All" || $0.status.rawValue == view }
    let current = tickets.first { $0.id == selected }
    Screen {
      SplitView(column: $column) {
        SplitViewSidebar("Support") {
          ForEach(Self.views, id: \.self) { item in
            SplitViewItem(isActive: view == item, action: {
              if view != item { onViewChange?(item) }
              view = item
            }) {
              HStack(spacing: 10) {
                (item == "Solved" ? Ph.check.regular : item == "All" ? Ph.tray.regular : Ph.chatCircle.regular)
                  .frame(width: 20, height: 20)
                  .foregroundStyle(Color.accent)
                Text(LocalizedStringKey(item))
                  .frame(maxWidth: .infinity, alignment: .leading)
                Text(verbatim: "\(count(item))")
                  .scaledFont(.xs)
                  .monospacedDigit()
                  .foregroundStyle(Color.labelSecondary)
              }
            }
          }
        }
        SplitViewList(LocalizedStringKey(view)) {
          VStack(spacing: 0) {
            ForEach(list) { ticket in
              SwipeActions(revealed: swiped == ticket.id ? -88 : 0) {
                SplitViewItem(isActive: ticket.id == selected, action: { selected = ticket.id }) {
                  InboxSupportRow(ticket: ticket)
                }
              } leading: {
                EmptyView()
              } trailing: {
                if ticket.status != .solved {
                  SwipeAction("Solved", icon: Ph.check.bold, variant: .default, fullSwipe: true) {
                    setStatus(.solved, for: ticket.id)
                  }
                }
              }
              .transition(.opacity)
            }
            if list.isEmpty {
              Text("No tickets")
                .scaledFont(.sm)
                .foregroundStyle(Color.labelSecondary)
                .frame(maxWidth: .infinity)
                .padding(24)
            }
          }
        }
        SplitViewDetail {
          if let current {
            detail(current)
              .id(current.id)
              .transition(.opacity.combined(with: .offset(y: 8)))
          }
        }
      }
    }
  }

  private func detail(_ ticket: Ticket) -> some View {
    let ready = !reply.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    return VStack(alignment: .leading, spacing: 16) {
      Text(verbatim: "\(ticket.id) · \(ticket.device)")
        .scaledFont(.sm)
        .foregroundStyle(Color.labelSecondary)
        .padding(.top, 8)
      ToggleGroup(
        selection: Binding<Status?>(
          get: { ticket.status },
          set: { value in if let value { setStatus(value, for: ticket.id) } }
        ),
        size: .sm,
        spacing: 0
      ) {
        ForEach(Status.allCases, id: \.self) { status in
          ToggleGroupItem(LocalizedStringKey(status.rawValue), value: status)
        }
      }
      .accessibilityLabel(Text("Status"))
      Text(verbatim: ticket.title)
        .scaledTextStyle(.xl3, weight: .semibold)
        .fixedSize(horizontal: false, vertical: true)
        .accessibilityAddTraits(.isHeader)
      HStack(spacing: 10) {
        InboxSupportAvatar(ticket: ticket, size: 34)
        VStack(alignment: .leading, spacing: 0) {
          Text(verbatim: ticket.requester)
            .scaledFont(.sm, weight: .semibold)
          Text("Today 8:12 AM")
            .scaledFont(.xs)
            .foregroundStyle(Color.labelSecondary)
        }
      }
      .accessibilityElement(children: .combine)
      Text("Hi, this started right after the latest update. I tried restarting but it keeps happening. Can you help?")
        .scaledTextStyle(.base)
        .lineSpacing(4)
        .fixedSize(horizontal: false, vertical: true)
        .padding(.horizontal, 14)
        .padding(.vertical, 12)
        .background(
          UnevenRoundedRectangle(
            topLeadingRadius: 4,
            bottomLeadingRadius: Radius.xl2,
            bottomTrailingRadius: Radius.xl2,
            topTrailingRadius: Radius.xl2,
            style: .continuous
          )
          .fill(Color.surfaceSecondary)
        )
      VStack(alignment: .leading, spacing: 10) {
        TextField("Write a reply…", text: $reply, axis: .vertical)
          .textFieldStyle(.textarea)
          .lineLimit(3...8)
          .accessibilityLabel(Text("Reply"))
        HStack(spacing: 10) {
          Button("Send and set pending") {
            onReply?(ticket.id, reply)
            reply = ""
            setStatus(.pending, for: ticket.id)
          }
          .buttonStyle(.variant(.default, size: .sm))
          .disabled(!ready)
          Button("Mark as solved") {
            setStatus(.solved, for: ticket.id)
          }
          .buttonStyle(.variant(.outline, size: .sm))
        }
      }
    }
    .foregroundStyle(Color.label)
  }

  private func setStatus(_ status: Status, for id: String) {
    guard let index = tickets.firstIndex(where: { $0.id == id }), tickets[index].status != status else { return }
    onStatusChange?(id, status)
    withAnimation(reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.35)) {
      tickets[index].status = status
    }
  }
}

private struct InboxSupportAvatar: View {
  let ticket: InboxSupport.Ticket
  let size: CGFloat

  var body: some View {
    Text(verbatim: ticket.requester.split(separator: " ").compactMap(\.first).map(String.init).joined())
      .font(.system(size: size * 0.4, weight: .semibold))
      .foregroundStyle(Color.onAccent)
      .frame(width: size, height: size)
      .background(ticket.tint, in: Circle())
      .accessibilityHidden(true)
  }
}

private struct InboxSupportRow: View {
  let ticket: InboxSupport.Ticket

  var body: some View {
    VStack(alignment: .leading, spacing: 4) {
      HStack(spacing: 8) {
        Text(verbatim: "\(ticket.id) · \(ticket.device)")
          .scaledFont(.xs)
          .foregroundStyle(Color.labelSecondary)
          .frame(maxWidth: .infinity, alignment: .leading)
        InboxSupportPriority(priority: ticket.priority)
      }
      Text(verbatim: ticket.title)
        .scaledFont(.base, weight: .semibold)
      HStack(spacing: 6) {
        InboxSupportAvatar(ticket: ticket, size: 18)
        Text(verbatim: ticket.requester)
          .scaledFont(.xs)
          .foregroundStyle(Color.labelSecondary)
      }
      .padding(.top, 2)
    }
    .accessibilityElement(children: .combine)
  }
}

private struct InboxSupportPriority: View {
  let priority: InboxSupport.Priority

  var body: some View {
    let tint: Color = switch priority {
    case .high: .danger
    case .medium: .warning
    case .low: .labelSecondary
    }
    Text(LocalizedStringKey(priority.rawValue))
      .scaledFont(.xs2, weight: .semibold)
      .foregroundStyle(tint)
      .padding(.horizontal, 8)
      .padding(.vertical, 2)
      .background(priority == .low ? Color.control : tint.opacity(0.14), in: RoundedRectangle(cornerRadius: Radius.md, style: .continuous))
  }
}
