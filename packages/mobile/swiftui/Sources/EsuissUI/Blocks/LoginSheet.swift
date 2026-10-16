import PhosphorSwift
import SwiftUI

public struct LoginSheet: View {
  private var onContinueWithEmail: (() -> Void)?
  private var onContinue: ((Bool) -> Void)?
  @State private var open: Bool
  @State private var done: Bool
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(onContinue: ((_ shareEmail: Bool) -> Void)? = nil, onContinueWithEmail: (() -> Void)? = nil) {
    self.init(open: false, done: false)
    self.onContinue = onContinue
    self.onContinueWithEmail = onContinueWithEmail
  }

  init(open: Bool, done: Bool) {
    _open = State(initialValue: open)
    _done = State(initialValue: done)
  }

  public var body: some View {
    Screen {
      VStack(spacing: 0) {
        Palette.green500
          .frame(width: 84, height: 84)
          .clipShape(RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous))
          .padding(.bottom, 20)
          .accessibilityHidden(true)
        Text(done ? "Welcome, Jamie" : "Trail Routes")
          .scaledTextStyle(.xl2, weight: .bold)
        Text(done ? "Your account was created with suiss." : "Save your routes and share them with friends.")
          .scaledTextStyle(.base)
          .foregroundStyle(EsuissColor.mutedForeground)
          .padding(.top, 8)
      }
      .multilineTextAlignment(.center)
      .fixedSize(horizontal: false, vertical: true)
      .padding(.horizontal, 28)
      .padding(.top, 90)
      .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
      BottomBar(separator: false) {
        BottomBarContent {
          if done {
            Button("Sign out ›") { done = false }
              .buttonStyle(LoginSheetLinkStyle())
              .padding(.bottom, 12)
          } else {
            Button("Sign in with suiss") { open = true }
              .buttonStyle(LoginSheetLabelStyle())
            Button("Continue with email") { onContinueWithEmail?() }
              .buttonStyle(.variant(.secondary, size: .xl, block: true))
          }
        }
        .padding(.bottom, 12)
      }
    }
    .animation(reduceMotion ? nil : .easeInOut(duration: 0.3), value: done)
    .drawer(isPresented: $open) {
      LoginSheetPanel(onContinue: onContinue) {
        open = false
        done = true
      }
    }
  }
}

struct LoginSheetPanel: View {
  var onContinue: ((Bool) -> Void)?
  let onComplete: () -> Void

  @State private var email = "hide"
  @State private var busy = false
  @State private var task: Task<Void, Never>?
  @Environment(\.overlayDismiss) private var dismiss

  var body: some View {
    VStack(spacing: 14) {
      HStack {
        Color.clear.frame(width: 28, height: 28)
        Text(verbatim: "suiss")
          .scaledFont(.lg, weight: .bold)
          .frame(maxWidth: .infinity)
        Button {
          dismiss?()
        } label: {
          Ph.x.bold.frame(width: 14, height: 14)
        }
        .buttonStyle(.variant(.secondary, size: .iconSm))
        .foregroundStyle(EsuissColor.mutedForeground)
        .accessibilityLabel(Text("Close"))
      }
      Text("Use your suiss Account with Trail Routes")
        .scaledTextStyle(.xl, weight: .bold)
        .multilineTextAlignment(.center)
        .fixedSize(horizontal: false, vertical: true)
        .accessibilityAddTraits(.isHeader)
      VStack(spacing: 0) {
        HStack(spacing: 12) {
          Ph.user.regular
            .frame(width: 20, height: 20)
            .foregroundStyle(EsuissColor.mutedForeground)
          VStack(alignment: .leading, spacing: 0) {
            Text("Name")
              .scaledFont(.xs)
              .foregroundStyle(EsuissColor.mutedForeground)
            Text(verbatim: "Jamie Rivera")
              .scaledFont(.base)
          }
          Spacer(minLength: 0)
        }
        .padding(.horizontal, 14)
        .padding(.vertical, 10)
        .accessibilityElement(children: .combine)
        EsuissColor.border.frame(height: 1).padding(.leading, 46)
        RadioGroup(selection: $email) {
          VStack(spacing: 0) {
            option("share", label: "Share My Email", hint: Text(verbatim: "jamie@example.com"), icon: true)
            EsuissColor.border.frame(height: 1).padding(.leading, 46)
            option("hide", label: "Hide My Email", hint: Text("A unique address that forwards to you"), icon: false)
          }
        }
      }
      .background(EsuissColor.muted, in: RoundedRectangle(cornerRadius: Radius.xl, style: .continuous))
      Button {
        onContinue?(email == "share")
        busy = true
        task?.cancel()
        task = Task {
          guard (try? await Task.sleep(for: .milliseconds(1000))) != nil else { return }
          busy = false
          onComplete()
        }
      } label: {
        if busy {
          Spinner(dimension: 20)
        } else {
          Text("Continue with face scan")
        }
      }
      .buttonStyle(.variant(.default, size: .xl, block: true))
      .disabled(busy)
    }
    .foregroundStyle(EsuissColor.foreground)
    .padding(.horizontal, 20)
    .padding(.top, 14)
    .padding(.bottom, 16)
    .background(EsuissColor.popover)
    .onDisappear { task?.cancel() }
  }

  private func option(_ value: String, label: LocalizedStringKey, hint: Text, icon: Bool) -> some View {
    HStack(spacing: 12) {
      if icon {
        Ph.envelopeSimple.regular
          .frame(width: 20, height: 20)
          .foregroundStyle(EsuissColor.mutedForeground)
      }
      VStack(alignment: .leading, spacing: 0) {
        Text(label)
          .scaledFont(.base)
        hint
          .scaledFont(.xs)
          .foregroundStyle(EsuissColor.mutedForeground)
      }
      .frame(maxWidth: .infinity, alignment: .leading)
      RadioGroupItem(value: value)
    }
    .padding(.leading, icon ? 14 : 46)
    .padding(.trailing, 14)
    .padding(.vertical, 10)
    .contentShape(Rectangle())
    .onTapGesture { email = value }
    .accessibilityElement(children: .combine)
    .accessibilityAddTraits(email == value ? [.isButton, .isSelected] : .isButton)
  }
}

private struct LoginSheetLabelStyle: ButtonStyle {
  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .scaledFont(.lg, weight: .semibold)
      .foregroundStyle(EsuissColor.background)
      .frame(maxWidth: .infinity, minHeight: 56)
      .background(EsuissColor.foreground, in: RoundedRectangle(cornerRadius: Radius.xl, style: .continuous))
      .opacity(configuration.isPressed ? 0.8 : 1)
      .contentShape(Rectangle())
  }
}

private struct LoginSheetLinkStyle: ButtonStyle {
  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .scaledFont(.base)
      .foregroundStyle(EsuissColor.primary)
      .opacity(configuration.isPressed ? 0.8 : 1)
      .frame(minHeight: 44)
      .contentShape(Rectangle())
  }
}
