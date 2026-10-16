import PhosphorSwift
import SwiftUI

public struct InboxMail: View {
  struct Mail: Identifiable, Equatable {
    let id: Int
    let from: String
    let subject: String
    let body: String
    let time: String
    let tint: Color?
    var unread: Bool
    var starred: Bool
  }

  struct Mailbox {
    let value: String
    let icon: Image
  }

  static var initialMail: [Mail] {
    [
      Mail(id: 0, from: "suiss", subject: "Your order has shipped", body: "Order #W1048 is on its way and arrives tomorrow. A signature is required on delivery.", time: "9:12 AM", tint: nil, unread: true, starred: false),
      Mail(id: 1, from: "Morgan Lee", subject: "Tomorrow's meeting", body: "Does 10:00 tomorrow work? The Q4 budget and the campaign calendar are on the agenda. I'll share the deck tonight.", time: "8:40 AM", tint: Palette.orange500, unread: true, starred: false),
      Mail(id: 2, from: "suiss Cloud", subject: "Your storage is almost full", body: "90% of your Cloud storage is used. Upgrade your plan to keep your backups running.", time: "Yesterday", tint: Palette.blue500, unread: true, starred: false),
      Mail(id: 3, from: "Riley Chen", subject: "Coast trip photos", body: "I added the photos to the shared album. The ones from the boat tour came out great.", time: "Yesterday", tint: Palette.green500, unread: false, starred: true),
      Mail(id: 4, from: "suiss Store", subject: "Just for you: a Trade In offer", body: "Bring in your old phone and get up to $650 off a new one.", time: "Monday", tint: nil, unread: false, starred: false),
      Mail(id: 5, from: "App Store", subject: "Your receipt", body: "Your Studio Pro subscription renewed. Total: $4.99.", time: "Monday", tint: nil, unread: false, starred: false),
    ]
  }

  static var mailboxes: [Mailbox] {
    [
      Mailbox(value: "Inbox", icon: Ph.tray.regular),
      Mailbox(value: "Starred", icon: Ph.star.regular),
      Mailbox(value: "Sent", icon: Ph.paperPlaneTilt.regular),
      Mailbox(value: "Archive", icon: Ph.archive.regular),
      Mailbox(value: "Trash", icon: Ph.trash.regular),
    ]
  }

  private var onMailboxChange: ((String) -> Void)?
  private var onArchive: ((Int) -> Void)?
  private var onDelete: ((Int) -> Void)?
  private var onReply: ((Int, String) -> Void)?
  private var onStarChange: ((Int, Bool) -> Void)?
  private var onNewMessage: (() -> Void)?
  private let replying: Bool
  private let swiped: Int?
  @State private var mail: [Mail]
  @State private var mailbox: String
  @State private var selected: Int?
  @State private var query: String
  @State private var column: SplitViewColumn
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(
    onMailboxChange: ((_ mailbox: String) -> Void)? = nil,
    onNewMessage: (() -> Void)? = nil,
    onReply: ((_ id: Int, _ text: String) -> Void)? = nil,
    onStarChange: ((_ id: Int, _ starred: Bool) -> Void)? = nil,
    onArchive: ((_ id: Int) -> Void)? = nil,
    onDelete: ((_ id: Int) -> Void)? = nil
  ) {
    self.init(mailbox: "Inbox")
    self.onMailboxChange = onMailboxChange
    self.onArchive = onArchive
    self.onDelete = onDelete
    self.onReply = onReply
    self.onStarChange = onStarChange
    self.onNewMessage = onNewMessage
  }

  init(
    mailbox: String = "Inbox",
    selected: Int? = 0,
    query: String = "",
    column: SplitViewColumn = .list,
    replying: Bool = false,
    swiped: Int? = nil
  ) {
    _mail = State(initialValue: Self.initialMail)
    _mailbox = State(initialValue: mailbox)
    _selected = State(initialValue: selected)
    _query = State(initialValue: query)
    _column = State(initialValue: column)
    self.replying = replying
    self.swiped = swiped
  }

  private var animation: Animation? {
    reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.4)
  }

  static func matches(_ mail: Mail, mailbox: String, query: String) -> Bool {
    guard mailbox != "Starred" || mail.starred else { return false }
    guard !query.isEmpty else { return true }
    return "\(mail.from) \(mail.subject) \(mail.body)".lowercased().contains(query.lowercased())
  }

  public var body: some View {
    let list = mail.filter { Self.matches($0, mailbox: mailbox, query: query) }
    let current = mail.first { $0.id == selected }
    let unread = mail.filter(\.unread).count
    let counts = ["Inbox": unread, "Starred": mail.filter(\.starred).count]
    Screen {
      SplitView(column: $column) {
        SplitViewSidebar("Mailboxes") {
          ForEach(Self.mailboxes, id: \.value) { box in
            SplitViewItem(isActive: mailbox == box.value, action: {
              if mailbox != box.value { onMailboxChange?(box.value) }
              mailbox = box.value
            }) {
              HStack(spacing: 10) {
                box.icon
                  .frame(width: 20, height: 20)
                  .foregroundStyle(EsuissColor.primary)
                Text(LocalizedStringKey(box.value))
                  .frame(maxWidth: .infinity, alignment: .leading)
                if let count = counts[box.value], count > 0 {
                  Text(verbatim: "\(count)")
                    .scaledFont(.xs)
                    .monospacedDigit()
                    .foregroundStyle(EsuissColor.mutedForeground)
                }
              }
            }
          }
        }
        SplitViewList(verbatim: mailbox) {
          VStack(alignment: .leading, spacing: 8) {
            InboxMailHeading(mailbox: mailbox, unread: unread)
            HStack(spacing: 8) {
              InputGroup {
                InputGroupAddon {
                  Ph.magnifyingGlass.regular.frame(width: 16, height: 16)
                }
                InputGroupInput("Search", text: $query)
                  .submitLabel(.search)
                  .accessibilityLabel(Text("Search mail"))
              }
              Button {
                onNewMessage?()
              } label: {
                Ph.notePencil.regular
                  .frame(width: 22, height: 22)
                  .foregroundStyle(EsuissColor.primary)
              }
              .buttonStyle(.variant(.ghost, size: .icon))
              .accessibilityLabel(Text("New message"))
            }
            .padding(.bottom, 4)
            VStack(spacing: 0) {
              if list.isEmpty {
                Text("No Results")
                  .scaledFont(.sm)
                  .foregroundStyle(EsuissColor.mutedForeground)
                  .frame(maxWidth: .infinity)
                  .padding(24)
              }
              ForEach(list) { item in
                SwipeActions(revealed: swiped == item.id ? -144 : 0) {
                  SplitViewItem(isActive: item.id == selected, action: {
                    selected = item.id
                    update(item.id) { $0.unread = false }
                  }) {
                    InboxMailRow(mail: item)
                  }
                } leading: {
                  EmptyView()
                } trailing: {
                  SwipeAction("Archive", icon: Ph.archive.fill, variant: .archive) {
                    onArchive?(item.id)
                    remove(item.id)
                  }
                  SwipeAction("Delete", icon: Ph.trash.fill, variant: .destructive, fullSwipe: true) {
                    onDelete?(item.id)
                    remove(item.id)
                  }
                }
                .transition(.opacity.combined(with: .offset(y: 6)))
              }
            }
          }
        }
        SplitViewDetail {
          if let current {
            InboxMailReader(
              mail: current,
              replying: replying,
              onStar: {
                onStarChange?(current.id, !current.starred)
                update(current.id) { $0.starred.toggle() }
              },
              onArchive: {
                onArchive?(current.id)
                remove(current.id)
              },
              onDelete: {
                onDelete?(current.id)
                remove(current.id)
              },
              onReply: { text in onReply?(current.id, text) }
            )
            .id(current.id)
          } else {
            Text("No Message Selected")
              .scaledFont(.base)
              .foregroundStyle(EsuissColor.mutedForeground)
              .frame(maxWidth: .infinity)
              .padding(.top, 120)
          }
        }
      }
    }
  }

  private func update(_ id: Int, _ change: (inout Mail) -> Void) {
    guard let index = mail.firstIndex(where: { $0.id == id }) else { return }
    change(&mail[index])
  }

  private func remove(_ id: Int) {
    withAnimation(animation) {
      mail.removeAll { $0.id == id }
      selected = mail.first?.id
    }
  }
}

private struct InboxMailHeading: View {
  let mailbox: String
  let unread: Int

  @Environment(\.splitView) private var splitView

  var body: some View {
    VStack(alignment: .leading, spacing: 0) {
      if splitView?.wide ?? false {
        Text(LocalizedStringKey(mailbox))
          .scaledFont(.lg, weight: .semibold)
          .accessibilityAddTraits(.isHeader)
      }
      Text(unread > 0 ? "\(unread) unread" : "All read")
        .scaledFont(.xs)
        .foregroundStyle(EsuissColor.mutedForeground)
    }
    .foregroundStyle(EsuissColor.foreground)
  }
}

private struct InboxMailAvatar: View {
  let mail: InboxMail.Mail
  let size: CGFloat

  var body: some View {
    let initials = mail.from.split(separator: " ").compactMap(\.first).map(String.init).joined()
    Text(verbatim: mail.tint == nil ? "s" : initials)
      .font(.system(size: size * 0.4, weight: .semibold))
      .foregroundStyle(mail.tint == nil ? EsuissColor.background : EsuissColor.primaryForeground)
      .frame(width: size, height: size)
      .background(mail.tint ?? EsuissColor.foreground, in: Circle())
      .accessibilityHidden(true)
  }
}

private struct InboxMailRow: View {
  let mail: InboxMail.Mail

  var body: some View {
    HStack(alignment: .top, spacing: 8) {
      Circle()
        .fill(mail.unread ? EsuissColor.primary : .clear)
        .frame(width: 8, height: 8)
        .padding(.top, 6)
        .accessibilityHidden(true)
      VStack(alignment: .leading, spacing: 2) {
        HStack(spacing: 6) {
          Text(verbatim: mail.from)
            .scaledFont(.sm, weight: .semibold)
            .lineLimit(1)
            .frame(maxWidth: .infinity, alignment: .leading)
          if mail.starred {
            Ph.star.fill
              .frame(width: 12, height: 12)
              .foregroundStyle(Palette.orange500)
              .accessibilityLabel(Text("Starred"))
          }
          Text(LocalizedStringKey(mail.time))
            .scaledFont(.xs)
            .foregroundStyle(EsuissColor.mutedForeground)
        }
        Text(verbatim: mail.subject)
          .scaledFont(.sm)
          .lineLimit(1)
        Text(verbatim: mail.body)
          .scaledFont(.xs)
          .foregroundStyle(EsuissColor.mutedForeground)
          .lineLimit(2)
          .multilineTextAlignment(.leading)
      }
    }
    .accessibilityElement(children: .combine)
    .accessibilityValue(mail.unread ? Text("Unread") : Text(verbatim: ""))
  }
}

private struct InboxMailReader: View {
  let mail: InboxMail.Mail
  let onStar: () -> Void
  let onArchive: () -> Void
  let onDelete: () -> Void
  let onReply: (String) -> Void

  @State private var replying: Bool
  @State private var reply = ""
  @FocusState private var focused: Bool
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  init(
    mail: InboxMail.Mail,
    replying: Bool,
    onStar: @escaping () -> Void,
    onArchive: @escaping () -> Void,
    onDelete: @escaping () -> Void,
    onReply: @escaping (String) -> Void
  ) {
    self.mail = mail
    self.onStar = onStar
    self.onArchive = onArchive
    self.onDelete = onDelete
    self.onReply = onReply
    _replying = State(initialValue: replying)
  }

  var body: some View {
    VStack(alignment: .leading, spacing: 0) {
      HStack(spacing: 2) {
        Spacer(minLength: 0)
        action("Reply", icon: Ph.arrowBendUpLeft.regular) {
          replying = true
          focused = true
        }
        action(mail.starred ? "Unstar" : "Star", icon: mail.starred ? Ph.star.fill : Ph.star.regular, active: mail.starred, perform: onStar)
        action("Archive", icon: Ph.archive.regular, perform: onArchive)
        action("Delete", icon: Ph.trash.regular, perform: onDelete)
      }
      .frame(height: 50)
      .overlay(alignment: .bottom) {
        EsuissColor.border.frame(height: 1).padding(.horizontal, -16)
      }
      VStack(alignment: .leading, spacing: 16) {
        HStack(spacing: 12) {
          InboxMailAvatar(mail: mail, size: 40)
          VStack(alignment: .leading, spacing: 0) {
            Text(verbatim: mail.from)
              .scaledFont(.base, weight: .semibold)
            Text("To: Jamie Rivera")
              .scaledFont(.xs)
              .foregroundStyle(EsuissColor.mutedForeground)
          }
          .frame(maxWidth: .infinity, alignment: .leading)
          Text(LocalizedStringKey(mail.time))
            .scaledFont(.xs)
            .foregroundStyle(EsuissColor.mutedForeground)
        }
        .accessibilityElement(children: .combine)
        Text(verbatim: mail.subject)
          .scaledTextStyle(.xl2, weight: .semibold)
          .fixedSize(horizontal: false, vertical: true)
          .accessibilityAddTraits(.isHeader)
        Text(verbatim: mail.body)
          .scaledTextStyle(.base)
          .lineSpacing(4)
          .fixedSize(horizontal: false, vertical: true)
      }
      .padding(.top, 22)
      if replying {
        VStack(alignment: .leading, spacing: 10) {
          TextField("Reply to \(mail.from)", text: $reply, axis: .vertical)
            .textFieldStyle(.textarea)
            .lineLimit(4...8)
            .focused($focused)
            .accessibilityLabel(Text("Reply to \(mail.from)"))
          HStack(spacing: 10) {
            Button("Send") {
              onReply(reply)
              reply = ""
              replying = false
            }
            .buttonStyle(.variant(.default, size: .sm))
            .disabled(reply.isEmpty)
            Button("Cancel") {
              replying = false
            }
            .buttonStyle(.variant(.outline, size: .sm))
          }
        }
        .padding(.top, 18)
        .overlay(alignment: .top) {
          EsuissColor.border.frame(height: 1)
        }
        .padding(.top, 22)
        .transition(.opacity.combined(with: .offset(y: 8)))
      }
    }
    .foregroundStyle(EsuissColor.foreground)
    .animation(reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.5), value: replying)
  }

  private func action(_ title: LocalizedStringKey, icon: Image, active: Bool = false, perform: @escaping () -> Void) -> some View {
    Button(action: perform) {
      icon
        .frame(width: 20, height: 20)
        .foregroundStyle(active ? Palette.orange500 : EsuissColor.mutedForeground)
    }
    .buttonStyle(.variant(.ghost, size: .icon))
    .accessibilityLabel(Text(title))
    .accessibilityAddTraits(active ? .isSelected : [])
  }
}
