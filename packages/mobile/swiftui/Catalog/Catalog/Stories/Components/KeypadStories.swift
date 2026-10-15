import EsuissUI
import PhosphorSwift
import SwiftUI

enum KeypadStories {
  static let group = StoryGroup(.components, "Keypad", stories: [
    Story("Default") {
      KeypadLog(accessory: .none)
    },
    Story("Decimal") {
      KeypadLog(accessory: .decimal("."))
    },
    Story("Biometric") {
      KeypadLog(accessory: .biometric(Ph.fingerprint.regular))
    },
    Story("Disabled") {
      KeypadLog(accessory: .biometric(Ph.fingerprint.regular))
        .disabled(true)
    },
  ])
}

private struct KeypadLog: View {
  let accessory: KeypadAccessory

  @State private var last: KeypadKey?

  var body: some View {
    VStack(spacing: 24) {
      Group {
        if let last {
          Text(verbatim: "Last key: \(name(last))")
        } else {
          Text("Press a key")
        }
      }
      .textStyle(.sm)
      .foregroundStyle(EsuissColor.mutedForeground)
      .accessibilityAddTraits(.updatesFrequently)
      Keypad(accessory: accessory) { key in
        last = key
      }
    }
    .frame(maxWidth: .infinity)
  }

  private func name(_ key: KeypadKey) -> String {
    switch key {
    case .digit(let value): "\(value)"
    case .decimal: "decimal"
    case .delete: "delete"
    case .biometric: "biometric"
    }
  }
}
