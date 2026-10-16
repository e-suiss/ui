import PhosphorSwift
import SwiftUI

public struct UsersDetail: View {
  struct User: Identifiable {
    let name: String
    let email: String
    let role: String
    let status: String
    let tint: Color

    var id: String { email }
  }

  struct Session: Identifiable, Equatable {
    let device: String
    let place: String
    let time: String
    let icon: Image

    var id: String { device }
  }

  static let roles = ["Admin", "Editor", "Support", "Viewer"]
  static let tabs = ["Profile", "Sessions", "Security"]

  static var users: [User] {
    [
      User(name: "Jamie Rivera", email: "jamie@example.com", role: "Admin", status: "Active", tint: Palette.indigo500),
      User(name: "Morgan Lee", email: "morgan@example.com", role: "Editor", status: "Active", tint: Palette.orange500),
      User(name: "Riley Chen", email: "riley@example.com", role: "Support", status: "Active", tint: Palette.green500),
      User(name: "Taylor Kim", email: "taylor@example.com", role: "Viewer", status: "Suspended", tint: Palette.blue500),
      User(name: "Avery Brooks", email: "avery@example.com", role: "Editor", status: "Invited", tint: Palette.pink500),
      User(name: "Jordan Park", email: "jordan@example.com", role: "Support", status: "Active", tint: Palette.teal400),
    ]
  }

  static var initialSessions: [Session] {
    [
      Session(device: "Book Pro · Browser", place: "San Francisco, US", time: "Now", icon: Ph.desktop.bold),
      Session(device: "Phone Pro · App", place: "San Francisco, US", time: "2 hr ago", icon: Ph.deviceMobile.bold),
      Session(device: "Desktop · Browser", place: "Seattle, US", time: "3 days ago", icon: Ph.globe.bold),
    ]
  }

  static let security: [(label: LocalizedStringKey, key: String, initial: Bool)] = [
    ("Two-factor authentication", "twoFactor", true),
    ("Require passkey", "passkey", false),
    ("Sign-in alerts", "alerts", true),
  ]

  private var onNavigate: ((String) -> Void)?
  private var onRoleChange: ((String, String) -> Void)?
  private var onSignOut: ((String) -> Void)?
  private var onSignOutAll: (() -> Void)?
  private var onSecurityChange: ((String, String, Bool) -> Void)?
  private var onSendPasswordReset: ((String) -> Void)?
  @State private var selected: Int
  @State private var tab: String?
  @State private var overrides: [Int: String] = [:]
  @State private var sessions: [Session]
  @State private var settings: [Int: [String: Bool]] = [:]
  @State private var column: SplitViewColumn
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(
    onRoleChange: ((_ user: String, _ role: String) -> Void)? = nil,
    onSignOut: ((_ device: String) -> Void)? = nil,
    onSignOutAll: (() -> Void)? = nil,
    onSecurityChange: ((_ user: String, _ setting: String, _ enabled: Bool) -> Void)? = nil,
    onSendPasswordReset: ((_ user: String) -> Void)? = nil,
    onNavigate: ((_ section: String) -> Void)? = nil
  ) {
    self.init(selected: 0)
    self.onRoleChange = onRoleChange
    self.onSignOut = onSignOut
    self.onSignOutAll = onSignOutAll
    self.onNavigate = onNavigate
    self.onSecurityChange = onSecurityChange
    self.onSendPasswordReset = onSendPasswordReset
  }

  init(selected: Int, tab: String = "Profile", column: SplitViewColumn = .list) {
    _selected = State(initialValue: selected)
    _tab = State(initialValue: tab)
    _column = State(initialValue: column)
    _sessions = State(initialValue: Self.initialSessions)
  }

  private var animation: Animation? {
    reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.45)
  }

  private func role(_ index: Int) -> String {
    overrides[index] ?? Self.users[index].role
  }

  public var body: some View {
    UsersDetailShell(home: "users", onNavigate: onNavigate) {
      page
    }
  }

  @ViewBuilder private var page: some View {
    let user = Self.users[selected]
    Screen {
      SplitView(column: $column) {
        SplitViewList("Users") {
          VStack(alignment: .leading, spacing: 0) {
            UsersDetailHeading()
            ForEach(Array(Self.users.enumerated()), id: \.element.id) { index, item in
              SplitViewItem(isActive: index == selected, action: {
                selected = index
                tab = "Profile"
              }) {
                HStack(spacing: 10) {
                  UsersDetailAvatar(user: item, size: 32)
                  VStack(alignment: .leading, spacing: 0) {
                    Text(verbatim: item.name)
                      .scaledFont(.sm)
                    Text(LocalizedStringKey(role(index)))
                      .scaledFont(.xs)
                      .foregroundStyle(EsuissColor.mutedForeground)
                  }
                }
                .accessibilityElement(children: .combine)
              }
            }
          }
        }
        SplitViewDetail {
          detail(user)
            .id(selected)
            .transition(.opacity.combined(with: .offset(y: 8)))
        }
      }
    }
  }

  private func detail(_ user: User) -> some View {
    let current = tab ?? "Profile"
    return VStack(alignment: .leading, spacing: 20) {
      HStack(spacing: 14) {
        UsersDetailAvatar(user: user, size: 64)
        VStack(alignment: .leading, spacing: 2) {
          Text(verbatim: user.name)
            .scaledTextStyle(.xl2, weight: .bold)
            .accessibilityAddTraits(.isHeader)
          Text(verbatim: "\(user.email) · \(role(selected))")
            .scaledFont(.sm)
            .foregroundStyle(EsuissColor.mutedForeground)
        }
      }
      .padding(.top, 8)
      ToggleGroup(
        selection: Binding<String?>(
          get: { tab },
          set: { value in
            guard let value else { return }
            withAnimation(animation) { tab = value }
          }
        ),
        size: .sm,
        spacing: 0
      ) {
        ForEach(Self.tabs, id: \.self) { item in
          ToggleGroupItem(LocalizedStringKey(item), value: item)
            .frame(maxWidth: .infinity)
        }
      }
      .accessibilityLabel(Text("Section"))
      Group {
        switch current {
        case "Sessions": sessionsTab(user)
        case "Security": securityTab(user)
        default: profileTab(user)
        }
      }
      .id(current)
      .transition(.opacity.combined(with: .offset(y: 6)))
    }
    .foregroundStyle(EsuissColor.foreground)
  }

  private func profileTab(_ user: User) -> some View {
    let rows: [(LocalizedStringKey, String)] = [
      ("Full name", user.name),
      ("Email", user.email),
      ("Department", "Product"),
      ("Joined", "March 12, 2024"),
    ]
    let index = selected
    let binding = Binding<String?>(
      get: { role(index) },
      set: { value in
        guard let value, value != role(index) else { return }
        onRoleChange?(user.email, value)
        overrides[index] = value
      }
    )
    return ItemGroup(.inset) {
      ForEach(Array(rows.enumerated()), id: \.offset) { _, row in
        Item(size: .sm) {
          ItemContent {
            ItemTitle { Text(row.0).fontWeight(.regular) }
          }
          ItemActions {
            Text(verbatim: row.1)
              .foregroundStyle(EsuissColor.mutedForeground)
              .lineLimit(1)
          }
        }
        .accessibilityElement(children: .combine)
        ItemSeparator()
      }
      Item(size: .sm) {
        ItemContent {
          ItemTitle { Text("Role").fontWeight(.regular) }
        }
        ItemActions {
          OptionPicker(selection: binding, size: .sm) {
            ForEach(Self.roles, id: \.self) { item in
              OptionPickerItem(LocalizedStringKey(item), value: item)
            }
          }
          .fixedSize()
          .accessibilityLabel(Text("Role"))
        }
      }
      ItemSeparator()
      Item(size: .sm) {
        ItemContent {
          ItemTitle { Text("Status").fontWeight(.regular) }
        }
        ItemActions {
          Text(LocalizedStringKey(user.status))
            .foregroundStyle(EsuissColor.mutedForeground)
        }
      }
      .accessibilityElement(children: .combine)
    }
  }

  private func sessionsTab(_ user: User) -> some View {
    VStack(alignment: .leading, spacing: 12) {
      ItemGroup(.inset) {
        ForEach(Array(sessions.enumerated()), id: \.element.id) { index, session in
          if index > 0 {
            ItemSeparator().padding(.leading, 44)
          }
          Item(size: .sm) {
            ItemMedia {
              session.icon
                .frame(width: 16, height: 16)
                .foregroundStyle(EsuissColor.primaryForeground)
                .frame(width: 30, height: 30)
                .background(Palette.zinc500, in: RoundedRectangle(cornerRadius: 7, style: .continuous))
            }
            ItemContent {
              ItemTitle { Text(verbatim: session.device).fontWeight(.regular) }
              ItemDescription(verbatim: "\(session.place) · \(session.time)")
            }
            ItemActions {
              if index == 0 {
                Text("This device")
                  .scaledFont(.sm)
              } else {
                Button("Sign Out") {
                  onSignOut?(session.device)
                  withAnimation(animation) { sessions.removeAll { $0.device == session.device } }
                }
                .buttonStyle(.variant(.secondary, size: .sm))
              }
            }
          }
          .transition(.opacity)
        }
      }
      if sessions.count > 1 {
        Button("Sign Out All Other Sessions") {
          onSignOutAll?()
          withAnimation(animation) { sessions = Array(sessions.prefix(1)) }
        }
        .buttonStyle(.variant(.destructive, size: .sm))
      }
    }
  }

  private func securityTab(_ user: User) -> some View {
    let index = selected
    return VStack(alignment: .leading, spacing: 12) {
      ItemGroup(.inset) {
        ForEach(Array(Self.security.enumerated()), id: \.offset) { position, item in
          if position > 0 {
            ItemSeparator()
          }
          Item(size: .sm) {
            ItemContent {
              ItemTitle { Text(item.label).fontWeight(.regular) }
            }
            ItemActions {
              Toggle(isOn: Binding(
                get: { settings[index]?[item.key] ?? item.initial },
                set: { value in
                  onSecurityChange?(user.email, item.key, value)
                  settings[index, default: [:]][item.key] = value
                }
              )) {
                Text(item.label)
              }
              .labelsHidden()
              .toggleStyle(SwitchStyle())
              .accessibilityLabel(Text(item.label))
            }
          }
        }
      }
      Button("Send Password Reset Link") {
        onSendPasswordReset?(user.email)
      }
      .buttonStyle(.variant(.destructive, size: .sm))
    }
  }
}

private struct UsersDetailAvatar: View {
  let user: UsersDetail.User
  let size: CGFloat

  var body: some View {
    Text(verbatim: user.name.split(separator: " ").compactMap(\.first).map(String.init).joined())
      .font(.system(size: size * 0.38, weight: .semibold))
      .foregroundStyle(EsuissColor.primaryForeground)
      .frame(width: size, height: size)
      .background(user.tint, in: Circle())
      .accessibilityHidden(true)
  }
}

private struct UsersDetailHeading: View {
  @Environment(\.splitView) private var splitView

  var body: some View {
    if splitView?.wide ?? false {
      Text("Users")
        .scaledFont(.sm, weight: .semibold)
        .foregroundStyle(EsuissColor.mutedForeground)
        .padding(.horizontal, 4)
        .padding(.vertical, 8)
        .accessibilityAddTraits(.isHeader)
    }
  }
}

private struct UsersDetailShell<Content: View>: View {
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
          .background(EsuissColor.background)
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
