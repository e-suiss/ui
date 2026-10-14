import PhosphorSwift
import SwiftUI

public struct UsersTable: View {
  struct User: Identifiable, Equatable {
    let name: String
    let email: String
    var role: String
    var status: String
    let seen: String
    let tint: Color

    var id: String { email }
  }

  static let roles = ["Admin", "Editor", "Support", "Viewer"]

  static var initialUsers: [User] {
    [
      User(name: "Jamie Rivera", email: "jamie@company.com", role: "Admin", status: "Active", seen: "2 min ago", tint: .indigo),
      User(name: "Morgan Lee", email: "morgan@company.com", role: "Editor", status: "Active", seen: "1 hr ago", tint: .orange),
      User(name: "Riley Chen", email: "riley@company.com", role: "Support", status: "Active", seen: "Yesterday", tint: .green),
      User(name: "Taylor Kim", email: "taylor@company.com", role: "Viewer", status: "Suspended", seen: "3 days ago", tint: .blue),
      User(name: "Avery Brooks", email: "avery@company.com", role: "Editor", status: "Invited", seen: "—", tint: .pink),
      User(name: "Jordan Park", email: "jordan@company.com", role: "Support", status: "Active", seen: "5 hr ago", tint: .mint),
    ]
  }

  static func filtered(_ users: [User], role: String, query: String) -> [User] {
    users.filter { user in
      (role == "All" || user.role == role)
        && (query.isEmpty || "\(user.name) \(user.email)".lowercased().contains(query.lowercased()))
    }
  }

  private var onNavigate: ((String) -> Void)?
  private var onInvite: (() -> Void)?
  private var onFilterChange: ((String) -> Void)?
  private var onBulkUpdate: (([String], String?, String?) -> Void)?
  @State private var users: [User]
  @State private var query: String
  @State private var role: String?
  @State private var editing: Bool
  @State private var selected: Set<String>
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(
    onInvite: (() -> Void)? = nil,
    onFilterChange: ((_ role: String) -> Void)? = nil,
    onBulkUpdate: ((_ emails: [String], _ role: String?, _ status: String?) -> Void)? = nil,
    onNavigate: ((_ section: String) -> Void)? = nil
  ) {
    self.init(role: "All")
    self.onInvite = onInvite
    self.onFilterChange = onFilterChange
    self.onBulkUpdate = onBulkUpdate
    self.onNavigate = onNavigate
  }

  init(role: String, query: String = "", selected: Set<String> = []) {
    _users = State(initialValue: Self.initialUsers)
    _query = State(initialValue: query)
    _role = State(initialValue: role)
    _editing = State(initialValue: !selected.isEmpty)
    _selected = State(initialValue: selected)
  }

  private var animation: Animation? {
    reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.4)
  }

  private var roleSelection: Binding<String?> {
    Binding(
      get: { role },
      set: { value in
        let next = value ?? "All"
        if next != role { onFilterChange?(next) }
        withAnimation(animation) {
          role = next
          selected = []
        }
      }
    )
  }

  public var body: some View {
    UsersTableShell(home: "users", onNavigate: onNavigate) {
      page
    }
  }

  @ViewBuilder private var page: some View {
    let list = Self.filtered(users, role: role ?? "All", query: query)
    Screen {
      SelectionList(isEditing: $editing, selection: $selected) {
        ZStack(alignment: .bottom) {
          HeaderScrollView {
            HeaderLargeTitle("Users", subtitle: "\(users.count) people")
            VStack(alignment: .leading, spacing: 16) {
              InputGroup {
                InputGroupAddon {
                  Ph.magnifyingGlass.regular.frame(width: 16, height: 16)
                }
                InputGroupInput("Search", text: $query)
                  .submitLabel(.search)
                  .textInputAutocapitalization(.never)
                  .autocorrectionDisabled()
                  .accessibilityLabel(Text("Search users"))
              }
              .padding(.horizontal, 16)
              ChipGroup(selection: roleSelection, scrollable: true) {
                ForEach(["All"] + Self.roles, id: \.self) { item in
                  Chip(LocalizedStringKey(item), value: item)
                }
              }
              .contentMargins(.horizontal, 16, for: .scrollContent)
              .accessibilityLabel(Text("Role"))
              VStack(alignment: .leading, spacing: 8) {
                VStack(spacing: 0) {
                  ForEach(Array(list.enumerated()), id: \.element.id) { index, user in
                    SelectionListItem(value: user.email) {
                      UsersTableRow(user: user, selected: selected.contains(user.email))
                        .contentShape(Rectangle())
                        .onTapGesture {
                          selected.insert(user.email)
                          editing = true
                        }
                    }
                    .overlay(alignment: .top) {
                      if index > 0 {
                        Color.separator.frame(height: 1).padding(.leading, 16)
                      }
                    }
                  }
                  if list.isEmpty {
                    Text("No matching users.")
                      .scaledFont(.sm)
                      .foregroundStyle(Color.labelSecondary)
                      .frame(maxWidth: .infinity)
                      .padding(24)
                  }
                }
                .background(Color.surfaceSecondary, in: RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous))
                .clipShape(RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous))
                Text(selected.isEmpty ? "Tap rows to select" : "\(selected.count) selected")
                  .scaledFont(.xs)
                  .foregroundStyle(Color.labelSecondary)
                  .padding(.horizontal, 4)
                  .contentTransition(.numericText())
              }
              .padding(.horizontal, 16)
            }
            .padding(.top, 4)
            .padding(.bottom, 96)
          } header: {
            Header {
              HeaderTitle("Users")
            } leading: {
              SelectionListTrigger()
            } trailing: {
              Button {
                onInvite?()
              } label: {
                SwiftUI.Label {
                  Text("Invite")
                } icon: {
                  Ph.plus.bold.frame(width: 13, height: 13)
                }
              }
              .buttonStyle(.variant(.default, size: .sm))
            }
          }
          SelectionListBar {
            Button("Make Editor") { bulk(role: "Editor") }
              .buttonStyle(.variant(.secondary, size: .sm, block: true))
            Button("Activate") { bulk(status: "Active") }
              .buttonStyle(.variant(.secondary, size: .sm, block: true))
            Button("Suspend") { bulk(status: "Suspended") }
              .buttonStyle(.variant(.destructive, size: .sm, block: true))
          }
          .disabled(selected.isEmpty)
        }
      }
    }
  }

  private func bulk(role: String? = nil, status: String? = nil) {
    onBulkUpdate?(users.map(\.email).filter(selected.contains), role, status)
    withAnimation(animation) {
      for index in users.indices where selected.contains(users[index].email) {
        if let role { users[index].role = role }
        if let status { users[index].status = status }
      }
      selected = []
      editing = false
    }
  }
}

private struct UsersTableRow: View {
  let user: UsersTable.User
  let selected: Bool

  var body: some View {
    HStack(spacing: 10) {
      Text(verbatim: user.name.split(separator: " ").compactMap(\.first).map(String.init).joined())
        .font(.system(size: 12, weight: .semibold))
        .foregroundStyle(Color.onAccent)
        .frame(width: 32, height: 32)
        .background(user.tint, in: Circle())
        .accessibilityHidden(true)
      VStack(alignment: .leading, spacing: 1) {
        Text(verbatim: user.name)
          .scaledFont(.sm, weight: .semibold)
        Text(verbatim: user.email)
          .scaledFont(.xs)
          .foregroundStyle(Color.labelSecondary)
      }
      .lineLimit(1)
      .frame(maxWidth: .infinity, alignment: .leading)
      VStack(alignment: .trailing, spacing: 3) {
        Badge(LocalizedStringKey(user.role), variant: .secondary)
        Text(LocalizedStringKey(user.status))
          .scaledFont(.xs)
          .foregroundStyle(user.status == "Suspended" ? Color.danger : user.status == "Invited" ? .labelSecondary : .label)
      }
    }
    .foregroundStyle(Color.label)
    .padding(.horizontal, 16)
    .padding(.vertical, 10)
    .frame(minHeight: 56)
    .accessibilityElement(children: .combine)
  }
}

private struct UsersTableShell<Content: View>: View {
  let home: String
  let onNavigate: ((String) -> Void)?
  let content: Content

  @State private var tab: String

  init(home: String, onNavigate: ((String) -> Void)?, @ViewBuilder content: () -> Content) {
    self.home = home
    self.onNavigate = onNavigate
    self.content = content()
    _tab = State(initialValue: home)
  }

  private static var sections: [(value: String, label: LocalizedStringKey, icon: Image, active: Image)] {
    [
      ("users", "Users", Ph.users.regular, Ph.users.fill),
      ("roles", "Roles", Ph.shield.regular, Ph.shield.fill),
      ("log", "Activity", Ph.chartBar.regular, Ph.chartBar.fill),
      ("settings", "Settings", Ph.gear.regular, Ph.gear.fill),
    ]
  }

  var body: some View {
    let selection = Binding<String>(
      get: { tab },
      set: { value in
        guard value != tab else { return }
        onNavigate?(value)
        tab = value
      }
    )
    Screen {
      ZStack {
        content
          .opacity(tab == home ? 1 : 0)
          .allowsHitTesting(tab == home)
          .accessibilityHidden(tab != home)
        if tab != home {
          Empty {
            EmptyHeader {
              EmptyDescription("This section isn't part of the sample. Choose \(Text(Self.sections.first { $0.value == home }?.label ?? "")).")
            }
          }
          .background(Color.surface)
        }
      }
      .frame(maxHeight: .infinity)
      TabBar(selection: selection) {
        ForEach(Self.sections, id: \.value) { section in
          TabBarItem(section.label, value: section.value, icon: section.icon, activeIcon: section.active)
        }
      }
    }
  }
}
