import PhosphorSwift
import SwiftUI

public struct LoginPasskey: View {
  enum Status: Sendable {
    case idle, scan, ok, done
  }

  private var onChangeAccount: (() -> Void)?
  private var onUsePassword: (() -> Void)?
  private var onContinue: (() -> Void)?
  @State private var status: Status
  @State private var task: Task<Void, Never>?
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(
    onContinue: (() -> Void)? = nil,
    onChangeAccount: (() -> Void)? = nil,
    onUsePassword: (() -> Void)? = nil
  ) {
    self.init(status: .idle)
    self.onContinue = onContinue
    self.onChangeAccount = onChangeAccount
    self.onUsePassword = onUsePassword
  }

  init(status: Status) {
    _status = State(initialValue: status)
  }

  public var body: some View {
    Screen {
      if status == .done {
        welcome
          .transition(.opacity.combined(with: .offset(y: 18)))
      } else {
        intro
      }
    }
    .animation(reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.6), value: status == .done)
    .dialog(isPresented: scanning) {
      LoginPasskeyScan(verified: status == .ok, onCancel: cancel)
    }
    .onDisappear { task?.cancel() }
  }

  private var scanning: Binding<Bool> {
    Binding(
      get: { status == .scan || status == .ok },
      set: { if !$0 { cancel() } }
    )
  }

  private var intro: some View {
    VStack(spacing: 0) {
      KeyboardScrollView {
        VStack(spacing: 0) {
          Ph.key.bold
            .frame(width: 34, height: 34)
            .foregroundStyle(EsuissColor.primary)
            .frame(width: 72, height: 72)
            .background(EsuissColor.muted, in: Circle())
            .accessibilityHidden(true)
          Text("Sign in without a password.")
            .scaledTextStyle(.xl2, weight: .bold)
            .padding(.top, 22)
          Text("With a passkey, your face or fingerprint is all it takes. Nothing to remember, nothing to type.")
            .scaledTextStyle(.lg)
            .foregroundStyle(EsuissColor.mutedForeground)
            .padding(.top, 12)
          account
            .padding(.top, 28)
          Button(action: start) {
            Label {
              Text("Continue with passkey")
            } icon: {
              Ph.scanSmiley.regular
            }
          }
          .buttonStyle(.variant(.default, size: .lg))
          .padding(.top, 22)
          Button("Sign in with password ›") { onUsePassword?() }
            .buttonStyle(LoginPasskeyLinkStyle())
            .padding(.top, 10)
          Text("Passkeys are end-to-end encrypted and sync across all your devices with suiss Keychain.")
            .scaledTextStyle(.xs)
            .foregroundStyle(EsuissColor.mutedForeground)
            .padding(.top, 40)
        }
        .multilineTextAlignment(.center)
        .fixedSize(horizontal: false, vertical: true)
        .frame(maxWidth: .infinity)
        .padding(.horizontal, 24)
        .padding(.top, 72)
        .padding(.bottom, 24)
      }
    }
  }

  private var account: some View {
    HStack(spacing: 10) {
      Avatar(size: .sm) {
        LoginPasskeyInitials(style: .xs)
      }
      .frame(width: 28, height: 28)
      Text(verbatim: "jamie@example.com")
        .scaledFont(.base)
        .foregroundStyle(EsuissColor.foreground)
        .lineLimit(1)
      Button("Change ›") { onChangeAccount?() }
        .buttonStyle(LoginPasskeyLinkStyle())
    }
    .padding(.leading, 8)
    .padding(.trailing, 16)
    .padding(.vertical, 2)
    .background(EsuissColor.muted, in: Capsule())
  }

  private var welcome: some View {
    VStack(spacing: 14) {
      Avatar(size: .xl) {
        LoginPasskeyInitials(style: .xl2)
      }
      Text("Welcome, Jamie.")
        .scaledTextStyle(.xl3, weight: .bold)
      Text("You signed in with a passkey. No password needed.")
        .scaledTextStyle(.lg)
        .foregroundStyle(EsuissColor.mutedForeground)
      Button("Sign out ›") { status = .idle }
        .buttonStyle(LoginPasskeyLinkStyle(style: .lg))
    }
    .multilineTextAlignment(.center)
    .fixedSize(horizontal: false, vertical: true)
    .padding(24)
    .frame(maxWidth: .infinity, maxHeight: .infinity)
  }

  private func start() {
    onContinue?()
    status = .scan
    task?.cancel()
    task = Task {
      try? await Task.sleep(for: .milliseconds(1500))
      guard !Task.isCancelled else { return }
      status = .ok
      try? await Task.sleep(for: .milliseconds(900))
      guard !Task.isCancelled else { return }
      status = .done
    }
  }

  private func cancel() {
    task?.cancel()
    task = nil
    if status != .done { status = .idle }
  }
}

struct LoginPasskeyScan: View {
  let verified: Bool
  let onCancel: () -> Void

  var body: some View {
    DialogContent(showCloseButton: false) {
      VStack(spacing: 14) {
        LoginPasskeyGlyph(verified: verified)
        VStack(spacing: 3) {
          DialogTitle(verified ? "Verified" : "Face scan")
          DialogDescription("Passkey for suiss.com")
        }
        .multilineTextAlignment(.center)
        Button("Cancel", action: onCancel)
          .buttonStyle(.variant(.plain))
          .opacity(verified ? 0 : 1)
          .disabled(verified)
      }
      .frame(width: 212)
      .frame(maxWidth: .infinity)
    }
    .frame(width: 260)
  }
}

private struct LoginPasskeyGlyph: View {
  let verified: Bool

  @State private var pulse = false
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  var body: some View {
    ZStack {
      Ph.scanSmiley.light
        .foregroundStyle(EsuissColor.foreground)
        .opacity(verified ? 0 : pulse ? 0.5 : 1)
        .scaleEffect(verified ? 0.6 : 1)
      Ph.check.bold
        .frame(width: 32, height: 32)
        .foregroundStyle(EsuissColor.primaryForeground)
        .frame(width: 60, height: 60)
        .background(Palette.green500, in: Circle())
        .scaleEffect(verified ? 1 : 0.4)
        .opacity(verified ? 1 : 0)
    }
    .frame(width: 72, height: 72)
    .animation(reduceMotion ? nil : .spring(response: 0.55, dampingFraction: 0.6), value: verified)
    .onAppear {
      guard !reduceMotion else { return }
      withAnimation(.easeInOut(duration: 0.6).repeatForever(autoreverses: true)) { pulse = true }
    }
    .accessibilityHidden(true)
  }
}

private struct LoginPasskeyInitials: View {
  let style: TextStyle

  var body: some View {
    Text(verbatim: "JR")
      .scaledFont(style, weight: .semibold)
      .foregroundStyle(EsuissColor.primaryForeground)
      .frame(maxWidth: .infinity, maxHeight: .infinity)
      .background(
        Palette.indigo500,
        in: Circle()
      )
  }
}

private struct LoginPasskeyLinkStyle: ButtonStyle {
  var style: TextStyle = .sm

  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .scaledFont(style)
      .foregroundStyle(EsuissColor.primary)
      .opacity(configuration.isPressed ? 0.8 : 1)
      .frame(minHeight: 32)
      .contentShape(Rectangle())
  }
}
