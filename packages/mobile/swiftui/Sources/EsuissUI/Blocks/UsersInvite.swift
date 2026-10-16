import PhosphorSwift
import SwiftUI

public struct UsersInvite: View {
  struct Invite: Identifiable, Equatable {
    let email: String
    let role: String
    let sent: String

    var id: String { email }
  }

  static let roles = ["Admin", "Editor", "Support", "Viewer"]

  static var initialPending: [Invite] {
    [
      Invite(email: "casey@example.com", role: "Support", sent: "2 days ago"),
      Invite(email: "drew@example.com", role: "Viewer", sent: "5 days ago"),
    ]
  }

  static func email(_ value: String) -> String? {
    var email = value.trimmingCharacters(in: .whitespaces)
    if email.hasSuffix(",") { email.removeLast() }
    return email.wholeMatch(of: /.+@.+\..+/) != nil ? email : nil
  }

  private var onNavigate: ((String) -> Void)?
  private var onInvite: (([String], String, Bool) -> Void)?
  private var onResend: ((String) -> Void)?
  private var onCancelInvite: ((String) -> Void)?
  @State private var emails: [String]
  @State private var draft: String
  @State private var role: String?
  @State private var welcome = true
  @State private var pending: [Invite]
  @State private var toasts = ToastManager()
  @FocusState private var focused: Bool
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(
    onInvite: ((_ emails: [String], _ role: String, _ welcome: Bool) -> Void)? = nil,
    onResend: ((_ email: String) -> Void)? = nil,
    onCancelInvite: ((_ email: String) -> Void)? = nil,
    onNavigate: ((_ section: String) -> Void)? = nil
  ) {
    self.init(emails: ["avery@example.com"])
    self.onNavigate = onNavigate
    self.onInvite = onInvite
    self.onResend = onResend
    self.onCancelInvite = onCancelInvite
  }

  init(emails: [String], draft: String = "", role: String = "Editor", pending: [Invite]? = nil) {
    _emails = State(initialValue: emails)
    _draft = State(initialValue: draft)
    _role = State(initialValue: role)
    _pending = State(initialValue: pending ?? Self.initialPending)
  }

  private var animation: Animation? {
    reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.4)
  }

  public var body: some View {
    UsersInviteShell(home: "users", onNavigate: onNavigate) {
      page
    }
  }

  @ViewBuilder private var page: some View {
    let current = role ?? "Editor"
    Screen {
      HeaderScrollView {
        HeaderLargeTitle("Invite users", subtitle: "Invitees get a link by email.")
        VStack(alignment: .leading, spacing: 20) {
          ItemGroup(.inset) {
            emailRow
            ItemSeparator()
            Item(size: .sm) {
              ItemContent {
                ItemTitle { Text("Role").fontWeight(.regular) }
              }
              ItemActions {
                OptionPicker(selection: $role, size: .sm) {
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
                ItemTitle { Text("Send welcome email").fontWeight(.regular) }
              }
              ItemActions {
                Toggle(isOn: $welcome) { Text("Send welcome email") }
                  .labelsHidden()
                  .toggleStyle(SwitchStyle())
                  .accessibilityLabel(Text("Send welcome email"))
              }
            }
          }
          HStack(spacing: 10) {
            Text(emails.isEmpty ? "Type an email and press Return." : emails.count == 1 ? "1 person will be invited as \(current)." : "\(emails.count) people will be invited as \(current).")
              .scaledFont(.sm)
              .foregroundStyle(EsuissColor.mutedForeground)
              .fixedSize(horizontal: false, vertical: true)
              .frame(maxWidth: .infinity, alignment: .leading)
              .contentTransition(.opacity)
            Button("Send Invites") {
              send(role: current)
            }
            .buttonStyle(.variant(.default, size: .sm))
            .disabled(emails.isEmpty)
          }
          .padding(.horizontal, 4)
          VStack(alignment: .leading, spacing: 8) {
            Text("Pending invitations")
              .scaledFont(.sm, weight: .semibold)
              .padding(.horizontal, 4)
              .accessibilityAddTraits(.isHeader)
            if pending.isEmpty {
              Text("No pending invitations.")
                .scaledFont(.sm)
                .foregroundStyle(EsuissColor.mutedForeground)
                .padding(.horizontal, 4)
            } else {
              ItemGroup(.inset) {
                ForEach(Array(pending.enumerated()), id: \.element.id) { index, invite in
                  if index > 0 {
                    ItemSeparator().padding(.leading, 40)
                  }
                  pendingRow(invite)
                    .transition(.opacity.combined(with: .offset(y: 6)))
                }
              }
            }
          }
        }
        .padding(.horizontal, 16)
        .padding(.top, 8)
        .padding(.bottom, 24)
      } header: {
        Header {
          HeaderTitle("Invite users")
        }
      }
    }
    .toaster(toasts)
  }

  private var emailRow: some View {
    HStack(alignment: .top, spacing: 12) {
      Text("Email")
        .scaledFont(.base)
        .frame(width: 70, alignment: .leading)
        .padding(.top, 5)
        .accessibilityHidden(true)
      ComboboxFlowLayout(spacing: 6) {
        ForEach(emails, id: \.self) { email in
          Chip(size: .sm, onRemove: {
            withAnimation(animation) { emails.removeAll { $0 == email } }
          }) {
            Text(verbatim: email)
          }
          .transition(.scale(scale: 0.8).combined(with: .opacity))
        }
        TextField(
          "Email",
          text: $draft,
          prompt: (emails.isEmpty ? Text(verbatim: "name@example.com") : Text("Add another")).foregroundStyle(EsuissColor.mutedForeground)
        )
          .scaledFont(.sm)
          .keyboardType(.emailAddress)
          .textContentType(.emailAddress)
          .textInputAutocapitalization(.never)
          .autocorrectionDisabled()
          .submitLabel(.next)
          .focused($focused)
          .frame(minWidth: 140, minHeight: 28)
          .onSubmit {
            commit(draft)
            focused = true
          }
          .onChange(of: draft) { _, value in
            if value.hasSuffix(",") || value.hasSuffix(" ") { commit(value) }
          }
          .onChange(of: focused) { _, value in
            if !value && !draft.isEmpty { commit(draft) }
          }
          .accessibilityLabel(Text("Email"))
      }
      .frame(maxWidth: .infinity, alignment: .leading)
    }
    .foregroundStyle(EsuissColor.foreground)
    .padding(.horizontal, 16)
    .padding(.vertical, 8)
    .frame(minHeight: 44)
  }

  private func pendingRow(_ invite: Invite) -> some View {
    HStack(spacing: 12) {
      Ph.envelopeSimple.bold
        .frame(width: 16, height: 16)
        .foregroundStyle(EsuissColor.primaryForeground)
        .frame(width: 28, height: 28)
        .background(Palette.zinc500, in: RoundedRectangle(cornerRadius: 7, style: .continuous))
        .accessibilityHidden(true)
      VStack(alignment: .leading, spacing: 1) {
        Text(verbatim: invite.email)
          .scaledFont(.sm)
          .lineLimit(1)
          .truncationMode(.middle)
        Text(verbatim: "\(invite.role) · \(invite.sent)")
          .scaledFont(.xs)
          .foregroundStyle(EsuissColor.mutedForeground)
      }
      .frame(maxWidth: .infinity, alignment: .leading)
      .accessibilityElement(children: .combine)
      Button("Resend") {
        onResend?(invite.email)
        toasts.success("Resent to \(invite.email)")
      }
      .buttonStyle(.variant(.secondary, size: .xs))
      Button("Cancel") {
        onCancelInvite?(invite.email)
        withAnimation(animation) { pending.removeAll { $0.email == invite.email } }
      }
      .buttonStyle(.variant(.destructive, size: .xs))
      .accessibilityLabel(Text("Cancel invitation to \(invite.email)"))
    }
    .foregroundStyle(EsuissColor.foreground)
    .padding(.horizontal, 16)
    .padding(.vertical, 10)
    .frame(minHeight: 44)
  }

  private func commit(_ value: String) {
    if let email = Self.email(value), !emails.contains(email) {
      withAnimation(animation) { emails.append(email) }
    }
    draft = ""
  }

  private func send(role: String) {
    if !draft.isEmpty { commit(draft) }
    guard !emails.isEmpty else { return }
    onInvite?(emails, role, welcome)
    let count = emails.count
    withAnimation(animation) {
      pending.removeAll { emails.contains($0.email) }
      pending.insert(contentsOf: emails.map { Invite(email: $0, role: role, sent: "Just now") }, at: 0)
      emails = []
    }
    toasts.success(count == 1 ? "1 invitation sent" : "\(count) invitations sent")
  }
}

private struct UsersInviteShell<Content: View>: View {
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
