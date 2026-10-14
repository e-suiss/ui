import PhosphorSwift
import SwiftUI

public struct RolesEditor: View {
  struct Permission {
    let name: String
    let description: String
  }

  struct PermissionGroup {
    let name: String
    let permissions: [Permission]
  }

  static var groups: [PermissionGroup] {
    [
      PermissionGroup(name: "Content", permissions: [
        Permission(name: "Create drafts", description: "Can start new content drafts."),
        Permission(name: "Publish", description: "Can make content public."),
        Permission(name: "Delete", description: "Can permanently delete content."),
      ]),
      PermissionGroup(name: "Customers", permissions: [
        Permission(name: "Customer data", description: "Sees names, emails and order history."),
        Permission(name: "Export", description: "Downloads the customer list as CSV."),
      ]),
    ]
  }

  static let roles = ["Editor", "Support", "Viewer"]
  static let members = ["Editor": 2, "Support": 2, "Viewer": 1]
  static let defaults: [String: [Bool]] = [
    "Editor": [true, true, false, true, false],
    "Support": [false, false, false, true, false],
    "Viewer": [false, false, false, false, false],
  ]

  static var permissions: [String] {
    groups.flatMap { $0.permissions.map(\.name) }
  }

  private var onNavigate: ((String) -> Void)?
  private var onTogglePermission: ((String, String, Bool) -> Void)?
  private var onSave: (([String: [String]]) -> Void)?
  private var onRevert: (() -> Void)?
  private var onNewRole: (() -> Void)?
  @State private var role: String
  @State private var state: [String: [Bool]]
  @State private var base: [String: [Bool]]
  @State private var column: SplitViewColumn
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(
    onTogglePermission: ((_ role: String, _ permission: String, _ enabled: Bool) -> Void)? = nil,
    onSave: ((_ permissions: [String: [String]]) -> Void)? = nil,
    onRevert: (() -> Void)? = nil,
    onNewRole: (() -> Void)? = nil,
    onNavigate: ((_ section: String) -> Void)? = nil
  ) {
    self.init(role: "Editor")
    self.onTogglePermission = onTogglePermission
    self.onSave = onSave
    self.onRevert = onRevert
    self.onNavigate = onNavigate
    self.onNewRole = onNewRole
  }

  init(role: String, column: SplitViewColumn = .list, state: [String: [Bool]]? = nil) {
    _role = State(initialValue: role)
    _column = State(initialValue: column)
    _state = State(initialValue: state ?? Self.defaults)
    _base = State(initialValue: Self.defaults)
  }

  private var animation: Animation? {
    reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.4)
  }

  public var body: some View {
    RolesEditorShell(home: "roles", onNavigate: onNavigate) {
      page
    }
  }

  @ViewBuilder private var page: some View {
    Screen {
      SplitView(column: $column) {
        SplitViewList("Roles") {
          VStack(alignment: .leading, spacing: 0) {
            RolesEditorHeading()
            ForEach(Self.roles, id: \.self) { name in
              SplitViewItem(isActive: name == role, action: { role = name }) {
                Text(LocalizedStringKey(name))
                  .scaledFont(.base)
                Text("\(state[name, default: []].filter { $0 }.count) permissions")
                  .scaledFont(.xs)
                  .foregroundStyle(Color.labelSecondary)
              }
            }
            Button {
              onNewRole?()
            } label: {
              SwiftUI.Label {
                Text("New Role")
              } icon: {
                Ph.plus.bold.frame(width: 13, height: 13)
              }
            }
            .buttonStyle(.variant(.secondary, size: .sm))
            .padding(.top, 10)
          }
        }
        SplitViewDetail {
          detail
            .id(role)
            .transition(.opacity.combined(with: .offset(y: 6)))
        }
      }
    }
  }

  static func enabled(_ state: [String: [Bool]]) -> [String: [String]] {
    state.mapValues { flags in
      zip(permissions, flags).filter(\.1).map(\.0)
    }
  }

  private var detail: some View {
    let members = Self.members[role] ?? 0
    var offsets: [Int] = []
    var running = 0
    for group in Self.groups {
      offsets.append(running)
      running += group.permissions.count
    }
    return VStack(alignment: .leading, spacing: 18) {
      HStack(alignment: .top, spacing: 12) {
        VStack(alignment: .leading, spacing: 2) {
          Text(LocalizedStringKey(role))
            .scaledTextStyle(.xl3, weight: .semibold)
            .accessibilityAddTraits(.isHeader)
          Text(members == 1 ? "\(members) user has this role" : "\(members) users have this role")
            .scaledFont(.sm)
            .foregroundStyle(Color.labelSecondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        if state != base {
          HStack(spacing: 8) {
            Button("Revert") {
              onRevert?()
              withAnimation(animation) { state = base }
            }
            .buttonStyle(.variant(.secondary, size: .sm))
            Button("Save") {
              onSave?(Self.enabled(state))
              withAnimation(animation) { base = state }
            }
            .buttonStyle(.variant(.default, size: .sm))
          }
          .padding(.top, 6)
          .transition(.opacity.combined(with: .scale(scale: 0.9)))
        }
      }
      .padding(.top, 8)
      ForEach(Array(Self.groups.enumerated()), id: \.offset) { groupIndex, group in
        VStack(alignment: .leading, spacing: 8) {
          Text(LocalizedStringKey(group.name))
            .scaledFont(.sm, weight: .semibold)
            .padding(.horizontal, 4)
            .accessibilityAddTraits(.isHeader)
          ItemGroup(.inset) {
            ForEach(Array(group.permissions.enumerated()), id: \.offset) { position, permission in
              if position > 0 {
                ItemSeparator()
              }
              permissionRow(permission, slot: offsets[groupIndex] + position)
            }
          }
        }
      }
    }
    .foregroundStyle(Color.label)
  }

  private func permissionRow(_ permission: Permission, slot: Int) -> some View {
    let current = role
    let binding = Binding<Bool>(
      get: { state[current]?[slot] ?? false },
      set: { value in
        onTogglePermission?(current, permission.name, value)
        withAnimation(animation) { state[current]?[slot] = value }
      }
    )
    return Item(size: .sm) {
      ItemContent {
        ItemTitle { Text(LocalizedStringKey(permission.name)).fontWeight(.regular) }
        ItemDescription(LocalizedStringKey(permission.description))
      }
      ItemActions {
        Toggle(isOn: binding) { Text(LocalizedStringKey(permission.name)) }
          .labelsHidden()
          .toggleStyle(SwitchStyle())
          .accessibilityLabel(Text(LocalizedStringKey(permission.name)))
      }
    }
  }
}

private struct RolesEditorHeading: View {
  @Environment(\.splitView) private var splitView

  var body: some View {
    if splitView?.wide ?? false {
      Text("Roles")
        .scaledFont(.sm, weight: .semibold)
        .foregroundStyle(Color.labelSecondary)
        .padding(.horizontal, 4)
        .padding(.vertical, 8)
        .accessibilityAddTraits(.isHeader)
    }
  }
}

private struct RolesEditorShell<Content: View>: View {
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
