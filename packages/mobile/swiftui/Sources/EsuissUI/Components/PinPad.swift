import PhosphorSwift
import SwiftUI

enum PinPadMath {
  static func clamp(_ length: Int) -> Int {
    min(max(length, 4), 8)
  }

  static func press(_ key: KeypadKey, value: String, length: Int) -> String? {
    switch key {
    case .digit(let digit):
      guard value.count < length else { return nil }
      return value + String(digit)
    case .delete:
      guard !value.isEmpty else { return nil }
      return String(value.dropLast())
    case .decimal, .biometric:
      return nil
    }
  }
}

public struct PinPad: View {
  @Binding var value: String
  let length: Int
  let error: Bool
  let biometricIcon: Image
  let biometricLabel: LocalizedStringKey
  let deleteLabel: LocalizedStringKey
  let onBiometric: (() -> Void)?
  let onComplete: ((String) -> Void)?

  @Environment(\.isEnabled) private var isEnabled
  @State private var shakes = 0

  public init(
    value: Binding<String>,
    length: Int = 6,
    error: Bool = false,
    biometricIcon: Image = Ph.fingerprint.regular,
    biometricLabel: LocalizedStringKey = "Use biometrics",
    deleteLabel: LocalizedStringKey = "Delete",
    onBiometric: (() -> Void)? = nil,
    onComplete: ((String) -> Void)? = nil
  ) {
    _value = value
    self.length = PinPadMath.clamp(length)
    self.error = error
    self.biometricIcon = biometricIcon
    self.biometricLabel = biometricLabel
    self.deleteLabel = deleteLabel
    self.onBiometric = onBiometric
    self.onComplete = onComplete
  }

  public var body: some View {
    let count = min(value.count, length)
    VStack(spacing: 40) {
      PinPadDots(count: count, length: length, error: error)
        .shake(trigger: shakes)
      Keypad(
        accessory: onBiometric == nil ? .none : .biometric(biometricIcon, label: biometricLabel),
        deleteLabel: deleteLabel,
        canDelete: !value.isEmpty,
        press: press
      )
    }
    .onChange(of: error) { old, new in
      if !old && new { shakes += 1 }
    }
    .hapticFeedback(.error, trigger: error) { old, new in !old && new }
  }

  private func press(_ key: KeypadKey) -> Bool {
    guard isEnabled else { return false }
    if key == .biometric {
      onBiometric?()
      return onBiometric != nil
    }
    guard let next = PinPadMath.press(key, value: value, length: length) else { return false }
    value = next
    if case .digit = key, next.count == length {
      onComplete?(next)
    }
    return true
  }
}

private struct PinPadDots: View {
  let count: Int
  let length: Int
  let error: Bool

  @Environment(\.isEnabled) private var isEnabled

  var body: some View {
    HStack(spacing: 16) {
      ForEach(0..<length, id: \.self) { index in
        let filled = index < count
        Circle()
          .fill(filled ? tint : Color.clear)
          .overlay {
            Circle().strokeBorder(filled ? tint : border, lineWidth: 1.5)
          }
          .frame(width: 14, height: 14)
      }
    }
    .animation(.easeOut(duration: 0.15), value: count)
    .animation(.easeOut(duration: 0.2), value: error)
    .frame(minHeight: 24)
    .accessibilityElement(children: .ignore)
    .accessibilityLabel(Text("\(count) of \(length) entered"))
  }

  private var tint: Color {
    if error { return .danger }
    return isEnabled ? .label : .labelQuaternary
  }

  private var border: Color {
    if error { return .danger }
    return isEnabled ? .separatorStrong : .labelQuaternary
  }
}
