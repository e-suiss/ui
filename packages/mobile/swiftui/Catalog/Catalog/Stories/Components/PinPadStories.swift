import EsuissUI
import PhosphorSwift
import SwiftUI

enum PinPadStories {
  static let group = StoryGroup(.components, "Pin Pad", stories: [
    Story("Default") {
      PinPadDemo()
    },
    Story("Filled") {
      PinPadDemo(value: "1234")
    },
    Story("ErrorState", name: "Error") {
      PinPadDemo(value: "654321", error: true)
    },
    Story("Verify") {
      PinPadVerify()
    },
    Story("Disabled") {
      PinPadDemo(value: "12", biometric: true)
        .disabled(true)
    },
    Story("Biometric") {
      PinPadBiometric(faceID: false)
    },
    Story("FaceBiometric") {
      PinPadBiometric(faceID: true)
    },
    Story("FourDigits") {
      PinPadDemo(value: "1", length: 4)
    },
  ])
}

private struct PinPadDemo: View {
  let length: Int
  let error: Bool
  let biometric: Bool

  @State private var value: String

  init(value: String = "", length: Int = 6, error: Bool = false, biometric: Bool = false) {
    self.length = length
    self.error = error
    self.biometric = biometric
    _value = State(initialValue: value)
  }

  var body: some View {
    PinPad(value: $value, length: length, error: error, onBiometric: biometric ? {} : nil)
      .frame(maxWidth: .infinity)
  }
}

private struct PinPadVerify: View {
  private static let passcode = "123456"

  @State private var value = ""
  @State private var error = false
  @State private var status = "Enter 123456"

  var body: some View {
    VStack(spacing: 24) {
      Text(verbatim: status)
        .textStyle(.sm)
        .foregroundStyle(error ? Color.danger : .labelSecondary)
        .accessibilityAddTraits(.updatesFrequently)
      PinPad(value: $value, error: error, onComplete: complete)
      .onChange(of: value) { _, next in
        if !next.isEmpty { error = false }
      }
    }
    .frame(maxWidth: .infinity)
  }

  private func complete(_ code: String) {
    if code == Self.passcode {
      status = "Unlocked"
    } else {
      error = true
      status = "Wrong passcode. Try again."
      Task {
        try? await Task.sleep(for: .milliseconds(600))
        value = ""
      }
    }
  }
}

private struct PinPadBiometric: View {
  let faceID: Bool

  @State private var value = ""
  @State private var log = 0

  var body: some View {
    VStack(spacing: 24) {
      Group {
        if log > 0 {
          Text(verbatim: "Biometric requested (\(log))")
        } else {
          Text("Biometric key")
        }
      }
      .textStyle(.sm)
      .foregroundStyle(Color.labelSecondary)
      PinPad(
        value: $value,
        biometricIcon: faceID ? Ph.scanSmiley.regular : Ph.fingerprint.regular,
        biometricLabel: faceID ? "Use Face ID" : "Use Touch ID",
        onBiometric: { log += 1 }
      )
    }
    .frame(maxWidth: .infinity)
  }
}
