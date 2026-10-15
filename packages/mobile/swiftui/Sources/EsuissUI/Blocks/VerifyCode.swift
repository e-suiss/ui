import PhosphorSwift
import SwiftUI

public struct VerifyCode: View {
  enum Status: Sendable {
    case idle, error, ok
  }

  static let demoCode = "482913"

  private var onHelp: (() -> Void)?
  private var onVerify: (String) async -> Bool = { $0 == "482913" }
  @State private var code: String
  @State private var status: Status
  @State private var left: Int
  @State private var shakes = 0
  @State private var focused = true
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(
    onVerify: @escaping (String) async -> Bool = { $0 == "482913" },
    onHelp: (() -> Void)? = nil
  ) {
    self.init(code: "", status: .idle, left: 30)
    self.onVerify = onVerify
    self.onHelp = onHelp
  }

  init(code: String, status: Status, left: Int) {
    _code = State(initialValue: code)
    _status = State(initialValue: status)
    _left = State(initialValue: left)
  }

  public var body: some View {
    Screen {
      if status == .ok {
        verified
          .transition(.opacity.combined(with: .offset(y: 18)))
      } else {
        form
      }
    }
    .animation(reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.6), value: status == .ok)
    .task(id: left) {
      guard left > 0 else { return }
      try? await Task.sleep(for: .seconds(1))
      guard !Task.isCancelled else { return }
      left -= 1
    }
  }

  private var form: some View {
    KeyboardScrollView {
      VStack(spacing: 0) {
        Ph.lockSimple.bold
          .frame(width: 30, height: 30)
          .foregroundStyle(EsuissColor.primary)
          .frame(width: 64, height: 64)
          .background(EsuissColor.muted, in: Circle())
          .accessibilityHidden(true)
        Text("Two-factor authentication")
          .scaledTextStyle(.xl2, weight: .bold)
          .padding(.top, 20)
        Text("Enter the 6-digit code sent to your trusted devices.")
          .scaledTextStyle(.lg)
          .foregroundStyle(EsuissColor.mutedForeground)
          .padding(.top, 12)
          .padding(.bottom, 30)
        InputOTP(text: $code, length: 6) {
          InputOTPGroup {
            ForEach(0..<3, id: \.self) { InputOTPSlot(index: $0) }
          }
          .padding(.trailing, 8)
          InputOTPGroup {
            ForEach(3..<6, id: \.self) { InputOTPSlot(index: $0) }
          }
        }
        .invalid(status == .error)
        .environment(\.inputOTPFocus, $focused)
        .shake(trigger: shakes)
        .hapticFeedback(.error, trigger: shakes)
        .onChange(of: code) { _, value in
          if status == .error && !value.isEmpty { status = .idle }
          if value.count == 6 { complete(value) }
        }
        .accessibilityLabel(Text("Verification code"))
        Text(status == .error ? "Incorrect code." : "Demo code: \(Self.demoCode)")
          .scaledFont(.sm)
          .foregroundStyle(status == .error ? EsuissColor.destructive : EsuissColor.mutedForeground)
          .frame(minHeight: 20)
          .padding(.top, 14)
        VStack(spacing: 10) {
          if left > 0 {
            Text("Resend code · 0:\(String(format: "%02d", left))")
              .scaledFont(.sm)
              .monospacedDigit()
              .foregroundStyle(EsuissColor.mutedForeground)
              .frame(minHeight: 32)
          } else {
            Button("Resend code ›") { left = 30 }
              .buttonStyle(VerifyCodeLinkStyle())
          }
          Button("Didn't get a verification code? ›") { onHelp?() }
            .buttonStyle(VerifyCodeLinkStyle())
        }
        .padding(.top, 24)
      }
      .multilineTextAlignment(.center)
      .fixedSize(horizontal: false, vertical: true)
      .frame(maxWidth: .infinity)
      .padding(.horizontal, 24)
      .padding(.top, 72)
      .padding(.bottom, 24)
    }
  }

  private var verified: some View {
    VStack(spacing: 14) {
      Ph.check.bold
        .frame(width: 38, height: 38)
        .foregroundStyle(EsuissColor.primaryForeground)
        .frame(width: 76, height: 76)
        .background(Palette.green500, in: Circle())
        .accessibilityHidden(true)
      Text("Verified.")
        .scaledTextStyle(.xl2, weight: .bold)
      Text("This device is now trusted. You won't be asked for a code next time.")
        .scaledTextStyle(.lg)
        .foregroundStyle(EsuissColor.mutedForeground)
      Button("Start over ›") {
        code = ""
        status = .idle
      }
      .buttonStyle(VerifyCodeLinkStyle(style: .lg))
    }
    .multilineTextAlignment(.center)
    .fixedSize(horizontal: false, vertical: true)
    .padding(24)
    .frame(maxWidth: .infinity, maxHeight: .infinity)
  }

  private func complete(_ value: String) {
    Task {
      try? await Task.sleep(for: .milliseconds(200))
      if await onVerify(value) {
        focused = false
        status = .ok
        return
      }
      status = .error
      shakes += 1
      try? await Task.sleep(for: .milliseconds(800))
      code = ""
      status = .idle
    }
  }
}

private struct VerifyCodeLinkStyle: ButtonStyle {
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
