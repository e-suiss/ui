import PhosphorSwift
import SwiftUI

public struct InboxCategories: View {
  struct Mail: Identifiable, Equatable {
    let id: Int
    let from: String
    let subject: String
    let body: String
    let time: String
    let tint: Color?
    let category: String
    var unread: Bool
    var starred: Bool
  }

  struct Category {
    let value: String
    let icon: Image
    let tint: Color
  }

  static var initialMail: [Mail] {
    [
      Mail(id: 0, from: "suiss", subject: "Your order has shipped", body: "Order #W1048 is on its way and arrives tomorrow. A signature is required on delivery.", time: "9:12 AM", tint: nil, category: "Transactions", unread: true, starred: false),
      Mail(id: 1, from: "Morgan Lee", subject: "Tomorrow's meeting", body: "Does 10:00 tomorrow work? The Q4 budget and the campaign calendar are on the agenda. I'll share the deck tonight.", time: "8:40 AM", tint: Palette.orange500, category: "Primary", unread: true, starred: false),
      Mail(id: 2, from: "suiss Cloud", subject: "Your storage is almost full", body: "90% of your Cloud storage is used. Upgrade your plan to keep your backups running.", time: "Yesterday", tint: Palette.blue500, category: "Updates", unread: true, starred: false),
      Mail(id: 3, from: "Riley Chen", subject: "Coast trip photos", body: "I added the photos to the shared album. The ones from the boat tour came out great.", time: "Yesterday", tint: Palette.green500, category: "Primary", unread: false, starred: true),
      Mail(id: 4, from: "suiss Store", subject: "Just for you: a Trade In offer", body: "Bring in your old phone and get up to $650 off a new one.", time: "Monday", tint: nil, category: "Promotions", unread: false, starred: false),
      Mail(id: 5, from: "App Store", subject: "Your receipt", body: "Your Studio Pro subscription renewed. Total: $4.99.", time: "Monday", tint: nil, category: "Transactions", unread: false, starred: false),
    ]
  }

  static var categories: [Category] {
    [
      Category(value: "Primary", icon: Ph.users.bold, tint: EsuissColor.primary),
      Category(value: "Transactions", icon: Ph.creditCard.bold, tint: Palette.green500),
      Category(value: "Updates", icon: Ph.bell.bold, tint: Palette.purple500),
      Category(value: "Promotions", icon: Ph.tag.bold, tint: Palette.pink500),
    ]
  }

  private var onCategoryChange: ((String) -> Void)?
  private var onArchive: ((Int) -> Void)?
  private var onDelete: ((Int) -> Void)?
  private var onReply: ((Int, String) -> Void)?
  private var onStarChange: ((Int, Bool) -> Void)?
  private let replying: Bool
  private let swiped: Int?
  @State private var mail: [Mail]
  @State private var category: String
  @State private var selected: Int?
  @State private var column: SplitViewColumn
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(
    onCategoryChange: ((_ category: String) -> Void)? = nil,
    onReply: ((_ id: Int, _ text: String) -> Void)? = nil,
    onStarChange: ((_ id: Int, _ starred: Bool) -> Void)? = nil,
    onArchive: ((_ id: Int) -> Void)? = nil,
    onDelete: ((_ id: Int) -> Void)? = nil
  ) {
    self.init(category: "Primary")
    self.onCategoryChange = onCategoryChange
    self.onArchive = onArchive
    self.onDelete = onDelete
    self.onReply = onReply
    self.onStarChange = onStarChange
  }

  init(
    category: String = "Primary",
    selected: Int? = 1,
    column: SplitViewColumn = .list,
    replying: Bool = false,
    swiped: Int? = nil
  ) {
    _mail = State(initialValue: Self.initialMail)
    _category = State(initialValue: category)
    _selected = State(initialValue: selected)
    _column = State(initialValue: column)
    self.replying = replying
    self.swiped = swiped
  }

  private var animation: Animation? {
    reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.4)
  }

  public var body: some View {
    let list = mail.filter { $0.category == category }
    let current = list.first { $0.id == selected }
    Screen {
      SplitView(column: $column) {
        SplitViewList("Inbox") {
          VStack(alignment: .leading, spacing: 12) {
            InboxCategoriesHeading()
            categoryBar
            VStack(spacing: 0) {
              if list.isEmpty {
                Text("No messages in \(category).")
                  .scaledFont(.sm)
                  .foregroundStyle(EsuissColor.mutedForeground)
                  .frame(maxWidth: .infinity)
                  .padding(30)
              }
              ForEach(list) { item in
                SwipeActions(revealed: swiped == item.id ? -144 : 0) {
                  SplitViewItem(isActive: item.id == selected, action: {
                    selected = item.id
                    update(item.id) { $0.unread = false }
                  }) {
                    InboxCategoriesRow(mail: item)
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
            .id(category)
            .transition(.opacity.combined(with: .offset(y: 6)))
          }
        }
        SplitViewDetail {
          if let current {
            InboxCategoriesReader(
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

  private var categoryBar: some View {
    HStack(spacing: 6) {
      ForEach(Self.categories, id: \.value) { item in
        let pressed = category == item.value
        let unread = mail.contains { $0.category == item.value && $0.unread }
        Button {
          select(item.value)
        } label: {
          HStack(spacing: 6) {
            item.icon.frame(width: 16, height: 16)
            if pressed {
              Text(LocalizedStringKey(item.value))
                .scaledFont(.sm, weight: .semibold)
                .lineLimit(1)
                .fixedSize()
                .transition(.opacity)
            }
          }
          .foregroundStyle(pressed ? EsuissColor.primaryForeground : EsuissColor.mutedForeground)
          .padding(.horizontal, pressed ? 14 : 11)
          .frame(height: 34)
          .background(pressed ? item.tint : EsuissColor.secondary, in: RoundedRectangle(cornerRadius: Radius.lg, style: .continuous))
          .overlay(alignment: .topTrailing) {
            if !pressed && unread {
              Circle()
                .fill(EsuissColor.primary)
                .frame(width: 8, height: 8)
                .padding(2)
                .background(EsuissColor.background, in: Circle())
                .offset(x: 1, y: -1)
                .accessibilityHidden(true)
            }
          }
          .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .accessibilityLabel(Text(LocalizedStringKey(item.value)))
        .accessibilityValue(unread && !pressed ? Text("Unread") : Text(verbatim: ""))
        .accessibilityAddTraits(pressed ? .isSelected : [])
      }
    }
    .padding(.top, 2)
    .hapticFeedback(.selection, trigger: category)
    .accessibilityElement(children: .contain)
    .accessibilityLabel(Text("Category"))
  }

  private func select(_ value: String) {
    guard value != category else { return }
    onCategoryChange?(value)
    withAnimation(reduceMotion ? nil : .spring(response: 0.35, dampingFraction: 0.75)) {
      category = value
      selected = mail.first { $0.category == value }?.id
    }
  }

  private func update(_ id: Int, _ change: (inout Mail) -> Void) {
    guard let index = mail.firstIndex(where: { $0.id == id }) else { return }
    change(&mail[index])
  }

  private func remove(_ id: Int) {
    withAnimation(animation) {
      mail.removeAll { $0.id == id }
      selected = mail.first { $0.category == category }?.id
    }
  }
}

private struct InboxCategoriesHeading: View {
  @Environment(\.splitView) private var splitView

  var body: some View {
    if splitView?.wide ?? false {
      Text("Inbox")
        .scaledFont(.xl3, weight: .bold)
        .foregroundStyle(EsuissColor.foreground)
        .padding(.horizontal, 6)
        .accessibilityHidden(true)
    }
  }
}

private struct InboxCategoriesAvatar: View {
  let mail: InboxCategories.Mail
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

private struct InboxCategoriesRow: View {
  let mail: InboxCategories.Mail

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

private struct InboxCategoriesReader: View {
  let mail: InboxCategories.Mail
  let onStar: () -> Void
  let onArchive: () -> Void
  let onDelete: () -> Void
  let onReply: (String) -> Void

  @State private var replying: Bool
  @State private var reply = ""
  @FocusState private var focused: Bool
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  init(
    mail: InboxCategories.Mail,
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
          InboxCategoriesAvatar(mail: mail, size: 40)
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
