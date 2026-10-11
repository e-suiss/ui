import PhosphorSwift
import SwiftUI

public enum KeypadKey: Hashable, Sendable {
  case digit(Int)
  case decimal
  case delete
  case biometric
}

public enum KeypadAccessory {
  case none
  case decimal(String, label: LocalizedStringKey = "Decimal separator")
  case biometric(Image, label: LocalizedStringKey = "Use biometrics")
}

public struct Keypad: View {
  let accessory: KeypadAccessory
  let deleteLabel: LocalizedStringKey
  let canDelete: Bool
  let press: (KeypadKey) -> Bool

  public init(
    accessory: KeypadAccessory = .none,
    deleteLabel: LocalizedStringKey = "Delete",
    deleteDisabled: Bool = false,
    onKeyPress: @escaping (KeypadKey) -> Void
  ) {
    self.accessory = accessory
    self.deleteLabel = deleteLabel
    canDelete = !deleteDisabled
    press = { key in
      onKeyPress(key)
      return true
    }
  }

  init(
    accessory: KeypadAccessory,
    deleteLabel: LocalizedStringKey,
    canDelete: Bool,
    press: @escaping (KeypadKey) -> Bool
  ) {
    self.accessory = accessory
    self.deleteLabel = deleteLabel
    self.canDelete = canDelete
    self.press = press
  }

  @ScaledMetric(relativeTo: .title) private var scale: CGFloat = 1

  public var body: some View {
    let size = min(max(72 * scale, 64), 80)
    VStack(spacing: 16) {
      ForEach(0..<3) { row in
        HStack(spacing: 24) {
          ForEach(1..<4) { column in
            digit(row * 3 + column, size: size)
          }
        }
      }
      HStack(spacing: 24) {
        accessoryKey(size: size)
        digit(0, size: size)
        key(.delete, size: size, filled: false) {
          Ph.backspace.regular
            .resizable()
            .frame(width: 28, height: 28)
        }
        .disabled(!canDelete)
        .accessibilityLabel(Text(deleteLabel))
      }
    }
    .accessibilityElement(children: .contain)
  }

  private func digit(_ value: Int, size: CGFloat) -> some View {
    key(.digit(value), size: size, filled: true) {
      Text(verbatim: "\(value)")
        .scaledFont(.xl2)
        .monospacedDigit()
    }
    .accessibilityLabel(Text(verbatim: "\(value)"))
  }

  @ViewBuilder
  private func accessoryKey(size: CGFloat) -> some View {
    switch accessory {
    case .none:
      Color.clear.frame(width: size, height: size)
        .accessibilityHidden(true)
    case .decimal(let separator, let label):
      key(.decimal, size: size, filled: false) {
        Text(verbatim: separator)
          .scaledFont(.xl2)
      }
      .accessibilityLabel(Text(label))
    case .biometric(let icon, let label):
      key(.biometric, size: size, filled: false) {
        icon
          .resizable()
          .frame(width: 28, height: 28)
      }
      .accessibilityLabel(Text(label))
    }
  }

  private func key<Label: View>(
    _ key: KeypadKey,
    size: CGFloat,
    filled: Bool,
    @ViewBuilder label: @escaping () -> Label
  ) -> some View {
    HapticButton(style: PressReader { pressed in
      KeypadFace(pressed: pressed, filled: filled, size: size, label: label)
    }) {
      press(key)
    }
  }
}

private struct KeypadFace<Label: View>: View {
  let pressed: Bool
  let filled: Bool
  let size: CGFloat
  let label: () -> Label

  @Environment(\.isEnabled) private var isEnabled

  var body: some View {
    label()
      .foregroundStyle(isEnabled ? Color.label : .labelQuaternary)
      .frame(width: size, height: size)
      .background(fill, in: Circle())
      .contentShape(Circle())
      .animation(.easeOut(duration: 0.12), value: pressed)
  }

  private var fill: Color {
    if pressed { return .controlPressed }
    if !filled { return .clear }
    return isEnabled ? .control : .controlDisabled
  }
}

private struct ShakeModifier: ViewModifier {
  let trigger: Int

  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  func body(content: Content) -> some View {
    let still = reduceMotion
    content.keyframeAnimator(initialValue: CGFloat(0), trigger: trigger) { view, offset in
      view.offset(x: still ? 0 : offset)
    } keyframes: { _ in
      KeyframeTrack {
        LinearKeyframe(-8, duration: 0.08)
        LinearKeyframe(7, duration: 0.08)
        LinearKeyframe(-5, duration: 0.08)
        LinearKeyframe(3, duration: 0.08)
        LinearKeyframe(0, duration: 0.08, timingCurve: .easeOut)
      }
    }
  }
}

extension View {
  func shake(trigger: Int) -> some View {
    modifier(ShakeModifier(trigger: trigger))
  }
}
