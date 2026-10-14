import EsuissUI
import SwiftUI

enum OtpAutofillStories {
  static let group = StoryGroup(.interactions, "OTP Autofill", stories: [
    Story("Default") {
      OtpAutofillVerification(incoming: otpAutofillCode)
    },
    Story("WrongCode") {
      OtpAutofillVerification(incoming: "113355")
    },
    Story("FourDigits") {
      OtpAutofill(length: 4, onVerify: { $0 == "2468" }) { state in
        OtpAutofillInput {
          InputOTPGroup {
            InputOTPSlot(index: 0)
            InputOTPSlot(index: 1)
            InputOTPSlot(index: 2)
            InputOTPSlot(index: 3)
          }
        }
        .accessibilityLabel(Text("Verification code"))
        OtpAutofillStatus(state: state)
        OtpAutofillSuggestion(code: "2468", source: "From Messages")
      }
      .frame(maxWidth: .infinity)
    },
  ])
}

private let otpAutofillCode = "482913"

private struct OtpAutofillStatus: View {
  let state: OtpAutofillState

  var body: some View {
    Text(text)
      .textStyle(.sm)
      .foregroundStyle(color)
      .frame(minHeight: 20)
      .accessibilityAddTraits(.updatesFrequently)
  }

  private var text: LocalizedStringKey {
    switch state {
    case .verifying: "Verifying…"
    case .verified: "Verified"
    case .invalid: "That code didn't work. Try again."
    case .idle, .filling: ""
    }
  }

  private var color: Color {
    switch state {
    case .verified: .success
    case .invalid: .danger
    default: .labelSecondary
    }
  }
}

private struct OtpAutofillVerification: View {
  let incoming: String

  @State private var suggestion: String?
  @State private var sending = false

  var body: some View {
    VStack(spacing: 8) {
      Text("Enter the code")
        .textStyle(.xl2, weight: .bold)
        .foregroundStyle(Color.label)
        .multilineTextAlignment(.center)
      Text("We sent a 6-digit code to +1 555 0100.")
        .textStyle(.sm)
        .foregroundStyle(Color.labelSecondary)
        .multilineTextAlignment(.center)
      OtpAutofill(length: 6, onVerify: { code in
        try? await Task.sleep(for: .milliseconds(700))
        return code == otpAutofillCode
      }) { state in
        OtpAutofillInput(autoFocus: true) {
          InputOTPGroup {
            InputOTPSlot(index: 0)
            InputOTPSlot(index: 1)
            InputOTPSlot(index: 2)
          }
          InputOTPSeparator()
          InputOTPGroup {
            InputOTPSlot(index: 3)
            InputOTPSlot(index: 4)
            InputOTPSlot(index: 5)
          }
        }
        .accessibilityLabel(Text("Verification code"))
        OtpAutofillStatus(state: state)
        OtpAutofillSuggestion(code: suggestion)
      }
      .padding(.top, 16)
      Button {
        Task { await send() }
      } label: {
        Text(sending ? "Sending…" : "Resend code")
      }
      .buttonStyle(.variant(.plain))
      .disabled(sending)
    }
    .frame(maxWidth: .infinity)
    .task {
      await send()
    }
  }

  private func send() async {
    sending = true
    suggestion = nil
    try? await Task.sleep(for: .milliseconds(1200))
    suggestion = incoming
    sending = false
  }
}
