import PhosphorSwift
import SwiftUI

public struct SettingsAccount: View {
  struct Section: Identifiable {
    let id: String
    let label: LocalizedStringKey
    let icon: Image
  }

  static var sections: [Section] {
    [
      Section(id: "personal", label: "Personal Information", icon: Ph.user.regular),
      Section(id: "security", label: "Sign-In & Security", icon: Ph.key.regular),
      Section(id: "payment", label: "Payment & Shipping", icon: Ph.creditCard.regular),
      Section(id: "subscriptions", label: "Subscriptions", icon: Ph.cloud.regular),
      Section(id: "family", label: "Family Sharing", icon: Ph.users.regular),
      Section(id: "devices", label: "Devices", icon: Ph.deviceMobile.regular),
      Section(id: "privacy", label: "Privacy", icon: Ph.shield.regular),
    ]
  }

  private var onSave: ((String, String) -> Void)?
  @State private var section: String?
  @State private var editing: String?
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(onSave: ((_ field: String, _ value: String) -> Void)? = nil) {
    self.init(section: "security")
    self.onSave = onSave
  }

  init(section: String?, editing: String? = nil) {
    _section = State(initialValue: section)
    _editing = State(initialValue: editing)
  }

  public var body: some View {
    Screen {
      ZStack {
        if let current = Self.sections.first(where: { $0.id == section }) {
          detail(current)
            .transition(reduceMotion ? .opacity : .move(edge: .trailing))
            .zIndex(1)
        } else {
          root
            .transition(reduceMotion ? .opacity : .move(edge: .leading).combined(with: .opacity))
        }
      }
    }
    .animation(reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.45), value: section)
  }

  private var root: some View {
    KeyboardScrollView {
      VStack(spacing: 24) {
        VStack(spacing: 8) {
          Avatar(size: .xl) {
            Text(verbatim: "JR")
              .scaledFont(.xl, weight: .semibold)
              .foregroundStyle(EsuissColor.primaryForeground)
              .frame(maxWidth: .infinity, maxHeight: .infinity)
              .background(
                Palette.indigo500,
                in: Circle()
              )
          }
          Text(verbatim: "Jamie Rivera")
            .scaledTextStyle(.xl, weight: .bold)
          Text(verbatim: "jamie@example.com")
            .scaledFont(.sm)
            .foregroundStyle(EsuissColor.mutedForeground)
        }
        .frame(maxWidth: .infinity)
        .accessibilityElement(children: .combine)
        ItemGroup(.inset) {
          ForEach(Array(Self.sections.enumerated()), id: \.element.id) { index, item in
            if index > 0 {
              Separator().padding(.leading, 54)
            }
            Item(size: .sm, action: { section = item.id }) {
              ItemMedia {
                item.icon
                  .frame(width: 22, height: 22)
                  .foregroundStyle(EsuissColor.primary)
              }
              ItemContent {
                ItemTitle {
                  Text(item.label)
                    .fontWeight(.regular)
                }
              }
              ItemActions {
                Ph.caretRight.bold
                  .frame(width: 14, height: 14)
                  .foregroundStyle(EsuissColor.mutedForeground)
                  .flipsForRightToLeftLayoutDirection(true)
              }
            }
          }
        }
      }
      .padding(.horizontal, 16)
      .padding(.top, 40)
      .padding(.bottom, 24)
    }
  }

  private func detail(_ current: Section) -> some View {
    HeaderScrollView {
      HeaderLargeTitle(current.label)
      Group {
        if current.id == "security" {
          SettingsAccountSecurity(editing: $editing, onSave: onSave)
        } else {
          Text("This section isn't part of the sample. Choose Sign-In & Security.")
            .scaledTextStyle(.lg)
            .foregroundStyle(EsuissColor.mutedForeground)
            .fixedSize(horizontal: false, vertical: true)
        }
      }
      .padding(.horizontal, 16)
      .padding(.top, 8)
      .padding(.bottom, 24)
    } header: {
      Header {
        HeaderTitle(current.label)
      } leading: {
        HeaderBack("Account") {
          editing = nil
          section = nil
        }
      }
    }
    .background(EsuissColor.background)
  }
}

private struct SettingsAccountSecurity: View {
  @Binding var editing: String?
  let onSave: ((String, String) -> Void)?

  @State private var email = "jamie@example.com"
  @State private var phone = "+1 (415) 555-0142"
  @State private var passkeys = true
  @State private var saved: LocalizedStringKey?
  @State private var savedCount = 0

  var body: some View {
    VStack(alignment: .leading, spacing: 14) {
      SettingsAccountCard(
        title: "Email & phone",
        value: $email,
        editing: editing == "email",
        onEdit: { editing = "email" },
        onCancel: { editing = nil },
        onSave: {
          editing = nil
          onSave?("email", email)
          announce("Email & phone saved.")
        }
      )
      SettingsAccountCard(
        title: "Trusted phone number",
        value: $phone,
        editing: editing == "phone",
        onEdit: { editing = "phone" },
        onCancel: { editing = nil },
        onSave: {
          editing = nil
          onSave?("phone", phone)
          announce("Trusted phone number saved.")
        }
      )
      HStack(spacing: 12) {
        VStack(alignment: .leading, spacing: 3) {
          Text("Passkeys")
            .scaledFont(.lg, weight: .semibold)
          Text(passkeys ? "On for 3 devices" : "Off")
            .scaledFont(.base)
            .foregroundStyle(EsuissColor.mutedForeground)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        Toggle(isOn: $passkeys) { Text("Passkeys") }
          .labelsHidden()
          .accessibilityLabel(Text("Passkeys"))
          .toggleStyle(SwitchStyle())
      }
      .modifier(SettingsAccountCardSurface())
      HStack(spacing: 12) {
        VStack(alignment: .leading, spacing: 3) {
          Text("Two-factor authentication")
            .scaledFont(.lg, weight: .semibold)
          Text("Codes are sent to your trusted devices.")
            .scaledTextStyle(.base)
            .foregroundStyle(EsuissColor.mutedForeground)
            .fixedSize(horizontal: false, vertical: true)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        Text("On")
          .scaledFont(.sm, weight: .semibold)
          .foregroundStyle(Color.adaptive(light: Palette.green600, dark: Palette.green400))
      }
      .accessibilityElement(children: .combine)
      .modifier(SettingsAccountCardSurface())
      HStack(spacing: 6) {
        if let saved {
          Ph.check.bold
            .frame(width: 16, height: 16)
            .foregroundStyle(Color.adaptive(light: Palette.green600, dark: Palette.green400))
          Text(saved)
            .scaledFont(.sm)
        }
      }
      .frame(minHeight: 24)
      .transition(.opacity.combined(with: .offset(y: 6)))
      .task(id: savedCount) {
        guard saved != nil else { return }
        try? await Task.sleep(for: .milliseconds(2200))
        guard !Task.isCancelled else { return }
        withAnimation { saved = nil }
      }
    }
  }

  private func announce(_ message: LocalizedStringKey) {
    withAnimation(.easeOut(duration: 0.4)) { saved = message }
    savedCount += 1
  }
}

private struct SettingsAccountCard: View {
  let title: LocalizedStringKey
  @Binding var value: String
  let editing: Bool
  let onEdit: () -> Void
  let onCancel: () -> Void
  let onSave: () -> Void

  @State private var draft = ""
  @FocusState private var focused: Bool
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  var body: some View {
    VStack(alignment: .leading, spacing: 0) {
      HStack(spacing: 12) {
        VStack(alignment: .leading, spacing: 3) {
          Text(title)
            .scaledFont(.lg, weight: .semibold)
            .accessibilityAddTraits(.isHeader)
          if !editing {
            Text(verbatim: value)
              .scaledFont(.base)
              .foregroundStyle(EsuissColor.mutedForeground)
          }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        if !editing {
          Button("Edit ›", action: onEdit)
            .buttonStyle(SettingsAccountLinkStyle())
            .accessibilityLabel(Text("Edit \(Text(title))"))
        }
      }
      if editing {
        VStack(alignment: .leading, spacing: 12) {
          TextField(title, text: $draft)
            .textFieldStyle(.input)
            .focused($focused)
            .submitLabel(.done)
            .onSubmit(save)
          HStack(spacing: 10) {
            Button("Save", action: save)
              .buttonStyle(.variant(.default, size: .sm))
            Button("Cancel", action: onCancel)
              .buttonStyle(.variant(.outline, size: .sm))
          }
        }
        .padding(.top, 14)
        .transition(.opacity.combined(with: .move(edge: .top)))
      }
    }
    .modifier(SettingsAccountCardSurface())
    .animation(reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.4), value: editing)
    .onChange(of: editing, initial: true) { _, open in
      guard open else { return }
      draft = value
      focused = true
    }
  }

  private func save() {
    value = draft
    onSave()
  }
}

private struct SettingsAccountCardSurface: ViewModifier {
  func body(content: Content) -> some View {
    content
      .foregroundStyle(EsuissColor.foreground)
      .padding(.horizontal, 20)
      .padding(.vertical, 18)
      .frame(maxWidth: .infinity, alignment: .leading)
      .background(EsuissColor.muted, in: RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous))
  }
}

private struct SettingsAccountLinkStyle: ButtonStyle {
  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .scaledFont(.base)
      .foregroundStyle(EsuissColor.primary)
      .opacity(configuration.isPressed ? 0.8 : 1)
      .frame(minHeight: 44)
      .contentShape(Rectangle())
  }
}
