import PhosphorSwift
import SwiftUI

public struct VerifyDevice: View {
  enum Phase: Sendable {
    case ask, code, deny, ok
  }

  static let demoCode = "482913"
  static let backdrop = URL(string: "https://images.unsplash.com/photo-1714578187196-29775454aa39?w=900&q=80&auto=format&fit=crop")

  private var onVerify: (String) async -> Bool = { $0 == "482913" }
  @State private var phase: Phase
  @State private var code: String
  @State private var error: Bool
  @State private var shakes = 0
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(onVerify: @escaping (String) async -> Bool = { $0 == "482913" }) {
    self.init(phase: .ask)
    self.onVerify = onVerify
  }

  init(phase: Phase, code: String = "", error: Bool = false) {
    _phase = State(initialValue: phase)
    _code = State(initialValue: code)
    _error = State(initialValue: error)
  }

  public var body: some View {
    Screen {
      if phase == .ok {
        approved
          .transition(.opacity.combined(with: .offset(y: 18)))
      } else {
        KeyboardScrollView {
          VStack(alignment: .leading, spacing: 24) {
            prompt
            device
          }
          .padding(.horizontal, 20)
          .padding(.top, 40)
          .padding(.bottom, 24)
        }
      }
    }
    .animation(reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.6), value: phase)
  }

  private var title: LocalizedStringKey {
    switch phase {
    case .code: "Enter the verification code."
    case .deny: "Sign-in denied."
    default: "Approve from your other device."
    }
  }

  private var message: LocalizedStringKey {
    switch phase {
    case .code: "Type the 6-digit code shown on your trusted device."
    case .deny: "If this wasn't you, your account is safe. There's nothing else you need to do."
    default: "We sent a sign-in request to your trusted devices. Tap Allow on the alert below."
    }
  }

  private var prompt: some View {
    VStack(alignment: .leading, spacing: 14) {
      (phase == .code ? Ph.lockSimple.bold : Ph.deviceMobile.bold)
        .frame(width: 26, height: 26)
        .foregroundStyle(EsuissColor.primary)
        .frame(width: 56, height: 56)
        .background(EsuissColor.muted, in: Circle())
        .accessibilityHidden(true)
      Text(title)
        .scaledTextStyle(.xl2, weight: .bold)
        .fixedSize(horizontal: false, vertical: true)
      Text(message)
        .scaledTextStyle(.lg)
        .foregroundStyle(EsuissColor.mutedForeground)
        .fixedSize(horizontal: false, vertical: true)
      Group {
        switch phase {
        case .code:
          VStack(alignment: .leading, spacing: 10) {
            InputOTP(text: $code, length: 6) {
              InputOTPGroup {
                ForEach(0..<6, id: \.self) { InputOTPSlot(index: $0) }
              }
            }
            .invalid(error)
            .shake(trigger: shakes)
            .hapticFeedback(.error, trigger: shakes)
            .onChange(of: code) { _, value in
              if !value.isEmpty { error = false }
              if value.count == 6 { complete(value) }
            }
            .accessibilityLabel(Text("Verification code"))
            if error {
              Text("Incorrect code.")
                .scaledFont(.sm)
                .foregroundStyle(EsuissColor.destructive)
            }
          }
        case .deny:
          Button("Try again ›") { phase = .ask }
            .buttonStyle(VerifyDeviceLinkStyle())
        default:
          HStack(spacing: 10) {
            Spinner()
            Text("Waiting for approval…")
              .scaledFont(.sm)
          }
          .foregroundStyle(EsuissColor.mutedForeground)
        }
      }
      .frame(minHeight: 64, alignment: .topLeading)
      .padding(.top, 10)
      .transition(.opacity.combined(with: .offset(y: 6)))
    }
  }

  private var device: some View {
    Palette.black
      .overlay {
        AsyncImage(url: Self.backdrop) { phase in
          if let image = phase.image {
            image.resizable().scaledToFill().blur(radius: 16).saturation(1.2).opacity(0.85)
          }
        }
      }
      .overlay { Palette.black.opacity(0.18) }
      .overlay {
        alert
          .id(phase)
          .transition(.opacity.combined(with: .offset(y: 6)))
      }
      .frame(maxWidth: .infinity)
      .frame(height: 440)
      .clipShape(RoundedRectangle(cornerRadius: Radius.xl3, style: .continuous))
      .accessibilityElement(children: .contain)
      .accessibilityLabel(Text("Trusted device"))
  }

  private var alert: some View {
    VStack(spacing: 0) {
      switch phase {
      case .code:
        VStack(spacing: 0) {
          Text("suiss Account Verification Code")
            .scaledTextStyle(.lg, weight: .semibold)
          Text(verbatim: "482 913")
            .font(.system(size: TextStyle.xl3.size, weight: .semibold))
            .tracking(4)
            .monospacedDigit()
            .padding(.top, 10)
            .padding(.bottom, 4)
          Text("Enter this code on the device you're signing in to.")
            .scaledTextStyle(.sm)
            .foregroundStyle(EsuissColor.mutedForeground)
        }
        .padding(EdgeInsets(top: 20, leading: 16, bottom: 18, trailing: 16))
        VerifyDeviceAction(title: "OK", primary: true) {}
      case .deny:
        VStack(spacing: 4) {
          Text("Sign-in blocked")
            .scaledTextStyle(.lg, weight: .semibold)
          Text("If this wasn't you, change your password.")
            .scaledTextStyle(.sm)
            .foregroundStyle(EsuissColor.mutedForeground)
        }
        .padding(EdgeInsets(top: 20, leading: 16, bottom: 18, trailing: 16))
        VerifyDeviceAction(title: "Show request again", primary: false) { phase = .ask }
      default:
        VStack(spacing: 4) {
          Text("suiss Account Sign-in Requested")
            .scaledTextStyle(.lg, weight: .semibold)
          Text("Your suiss Account is being used to sign in to a device near San Francisco.")
            .scaledTextStyle(.sm)
            .foregroundStyle(EsuissColor.mutedForeground)
          VerifyDeviceMap()
            .padding(.top, 10)
        }
        .padding(EdgeInsets(top: 20, leading: 16, bottom: 16, trailing: 16))
        VerifyDeviceAction(title: "Allow", primary: true) { phase = .code }
        VerifyDeviceAction(title: "Don't Allow", primary: false) { phase = .deny }
      }
    }
    .multilineTextAlignment(.center)
    .fixedSize(horizontal: false, vertical: true)
    .foregroundStyle(EsuissColor.foreground)
    .frame(width: 270)
    .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: Radius.xl, style: .continuous))
    .background(EsuissColor.popover.opacity(0.86), in: RoundedRectangle(cornerRadius: Radius.xl, style: .continuous))
    .clipShape(RoundedRectangle(cornerRadius: Radius.xl, style: .continuous))
    .shadow(Shadow(color: Palette.black.opacity(0.3), radius: 30, y: 20))
  }

  private var approved: some View {
    VStack(spacing: 14) {
      Ph.check.bold
        .frame(width: 38, height: 38)
        .foregroundStyle(EsuissColor.primaryForeground)
        .frame(width: 76, height: 76)
        .background(Palette.green500, in: Circle())
        .accessibilityHidden(true)
      Text("Sign-in approved.")
        .scaledTextStyle(.xl2, weight: .bold)
      Text("This device was added to your suiss Account.")
        .scaledTextStyle(.lg)
        .foregroundStyle(EsuissColor.mutedForeground)
      Button("Start over ›") {
        code = ""
        phase = .ask
      }
      .buttonStyle(VerifyDeviceLinkStyle(style: .lg))
    }
    .multilineTextAlignment(.center)
    .fixedSize(horizontal: false, vertical: true)
    .padding(24)
    .frame(maxWidth: .infinity, maxHeight: .infinity)
  }

  private func complete(_ value: String) {
    Task {
      if await onVerify(value) {
        phase = .ok
        return
      }
      error = true
      shakes += 1
      try? await Task.sleep(for: .milliseconds(800))
      code = ""
    }
  }
}

private struct VerifyDeviceMap: View {
  var body: some View {
    ZStack {
      Color.adaptive(light: EsuissColor.primary.opacity(0.1), dark: EsuissColor.primary.opacity(0.2))
      Circle()
        .fill(EsuissColor.primary.opacity(0.25))
        .frame(width: 48, height: 48)
      Circle()
        .fill(EsuissColor.primary)
        .frame(width: 10, height: 10)
    }
    .frame(height: 96)
    .clipShape(RoundedRectangle(cornerRadius: Radius.lg, style: .continuous))
    .accessibilityHidden(true)
  }
}

private struct VerifyDeviceAction: View {
  let title: LocalizedStringKey
  let primary: Bool
  let action: () -> Void

  var body: some View {
    Button(action: action) {
      Text(title)
        .scaledFont(.lg, weight: primary ? .semibold : .regular)
        .foregroundStyle(EsuissColor.primary)
        .frame(maxWidth: .infinity, minHeight: 44)
        .contentShape(Rectangle())
    }
    .buttonStyle(VerifyDeviceActionStyle())
    .overlay(alignment: .top) {
      EsuissColor.input.frame(height: 1)
    }
  }
}

private struct VerifyDeviceActionStyle: ButtonStyle {
  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .opacity(configuration.isPressed ? 0.8 : 1)
  }
}

private struct VerifyDeviceLinkStyle: ButtonStyle {
  var style: TextStyle = .base

  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .scaledFont(style)
      .foregroundStyle(EsuissColor.primary)
      .opacity(configuration.isPressed ? 0.8 : 1)
      .frame(minHeight: 32)
      .contentShape(Rectangle())
  }
}
