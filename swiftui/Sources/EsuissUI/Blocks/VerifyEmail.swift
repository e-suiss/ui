import PhosphorSwift
import SwiftUI

public struct VerifyEmail: View {
  static let email = "jamie@suiss.com"

  private var onChangeAddress: (() -> Void)?
  private var onOpenMail: (() -> Void)?
  @State private var verified: Bool
  @State private var left: Int
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(onOpenMail: (() -> Void)? = nil, onChangeAddress: (() -> Void)? = nil) {
    self.init(verified: false, left: 0)
    self.onOpenMail = onOpenMail
    self.onChangeAddress = onChangeAddress
  }

  init(verified: Bool, left: Int) {
    _verified = State(initialValue: verified)
    _left = State(initialValue: left)
  }

  public var body: some View {
    Screen {
      if verified {
        done
          .transition(.opacity.combined(with: .offset(y: 18)))
      } else {
        KeyboardScrollView {
          inbox
        }
        BottomBar(separator: false) {
          BottomBarContent {
            Button("Open Mail") {
              onOpenMail?()
              verified = true
            }
              .buttonStyle(.variant(.default, size: .lg, block: true))
            Button {
              left = 45
            } label: {
              Text(left > 0 ? "Sent again · \(left)" : "Resend")
                .monospacedDigit()
            }
            .buttonStyle(.variant(.outline, size: .lg, block: true))
            .disabled(left > 0)
          }
        }
      }
    }
    .animation(reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.6), value: verified)
    .task(id: left) {
      guard left > 0 else { return }
      try? await Task.sleep(for: .seconds(1))
      guard !Task.isCancelled else { return }
      left -= 1
    }
  }

  private var inbox: some View {
    VStack(spacing: 0) {
      ZStack(alignment: .topTrailing) {
        Ph.envelopeSimple.regular
          .frame(width: 40, height: 40)
          .foregroundStyle(Color.onAccent)
          .frame(width: 96, height: 72)
          .background(
            Color.accent,
            in: RoundedRectangle(cornerRadius: Radius.xl, style: .continuous)
          )
          .shadow(Shadow(color: Color.accent.opacity(0.45), radius: 15, y: 10))
        Text(verbatim: "1")
          .scaledFont(.sm, weight: .semibold)
          .foregroundStyle(Color.onAccent)
          .frame(width: 26, height: 26)
          .background(Color.red, in: Circle())
          .padding(3)
          .background(Color.surface, in: Circle())
          .offset(x: 11, y: -11)
      }
      .accessibilityElement(children: .ignore)
      .accessibilityLabel(Text("1 new message"))
      Text("Check your inbox.")
        .scaledTextStyle(.xl2, weight: .bold)
        .padding(.top, 26)
      Text("We sent a verification link to \(Text(verbatim: Self.email).fontWeight(.semibold).foregroundStyle(Color.label)). Tap the link to activate your account.")
        .scaledTextStyle(.lg)
        .foregroundStyle(Color.labelSecondary)
        .padding(.top, 12)
      VStack(spacing: 0) {
        Text("Didn't get it? Check your junk folder or")
          .scaledFont(.sm)
          .foregroundStyle(Color.labelSecondary)
        Button("change the address ›") { onChangeAddress?() }
          .buttonStyle(VerifyEmailLinkStyle())
      }
      .padding(.top, 26)
    }
    .multilineTextAlignment(.center)
    .fixedSize(horizontal: false, vertical: true)
    .frame(maxWidth: .infinity)
    .padding(.horizontal, 24)
    .padding(.top, 96)
    .padding(.bottom, 24)
  }

  private var done: some View {
    VStack(spacing: 14) {
      Ph.check.bold
        .frame(width: 38, height: 38)
        .foregroundStyle(Color.onAccent)
        .frame(width: 76, height: 76)
        .background(Color.success, in: Circle())
        .accessibilityHidden(true)
      Text("Your email is verified.")
        .scaledTextStyle(.xl2, weight: .bold)
      Text("\(Self.email) is now your suiss Account.")
        .scaledTextStyle(.lg)
        .foregroundStyle(Color.labelSecondary)
      Button("Start over ›") { verified = false }
        .buttonStyle(VerifyEmailLinkStyle(style: .lg))
    }
    .multilineTextAlignment(.center)
    .fixedSize(horizontal: false, vertical: true)
    .padding(24)
    .frame(maxWidth: .infinity, maxHeight: .infinity)
  }
}

private struct VerifyEmailLinkStyle: ButtonStyle {
  var style: TextStyle = .sm

  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .scaledFont(style)
      .foregroundStyle(Color.link)
      .opacity(configuration.isPressed ? 0.5 : 1)
      .frame(minHeight: 32)
      .contentShape(Rectangle())
  }
}
