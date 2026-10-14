import PhosphorSwift
import SwiftUI

extension Shadow {
  static let control = Shadow(color: .black.opacity(0.08), radius: 0.5, y: 0.5)
  static let thumb = Shadow(color: .black.opacity(0.12), radius: 1.5, y: 1)
}

struct SelectionIndicator<Mark: View>: View {
  let checked: Bool
  let pressed: Bool
  let cornerRadius: CGFloat
  let mark: Mark

  @Environment(\.isEnabled) private var isEnabled
  @Environment(\.isInvalid) private var invalid
  @Environment(\.colorScheme) private var colorScheme

  init(checked: Bool, pressed: Bool, cornerRadius: CGFloat, @ViewBuilder mark: () -> Mark) {
    self.checked = checked
    self.pressed = pressed
    self.cornerRadius = cornerRadius
    self.mark = mark()
  }

  var body: some View {
    let shape = RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
    ZStack {
      shape.fill(fill)
      shape.strokeBorder(border, lineWidth: 1)
      if checked {
        mark
      }
    }
    .frame(width: 16, height: 16)
    .shadow(raised ? .control : Shadow(color: .clear, radius: 0))
  }

  private var isDark: Bool { colorScheme == .dark }

  private var raised: Bool { !checked && isEnabled && !isDark }

  private var fill: Color {
    if checked {
      return !isEnabled ? .accentDisabled : pressed ? .accentPressed : .accent
    }
    if !isEnabled { return .controlDisabled }
    if isDark { return pressed ? .labelTertiary.opacity(0.6) : .labelQuaternary }
    return pressed ? .control : .surface
  }

  private var border: Color {
    if checked {
      return !isEnabled ? .clear : pressed ? .accentPressed : .accent
    }
    if !isEnabled { return isDark ? .clear : .label.opacity(0.1) }
    if invalid { return .danger }
    return isDark ? .clear : .label.opacity(0.25)
  }
}

struct PressReader<Content: View>: ButtonStyle {
  let content: (Bool) -> Content

  init(@ViewBuilder content: @escaping (Bool) -> Content) {
    self.content = content
  }

  func makeBody(configuration: Configuration) -> some View {
    content(configuration.isPressed)
  }
}

public struct CheckboxStyle: ToggleStyle {
  public init() {}

  public func makeBody(configuration: Configuration) -> some View {
    HapticButton(style: PressReader { pressed in
      HStack(spacing: 12) {
        SelectionIndicator(
          checked: configuration.isOn || configuration.isMixed,
          pressed: pressed,
          cornerRadius: 4
        ) {
          (configuration.isMixed ? Ph.minus.regular : Ph.check.regular)
            .frame(width: 14, height: 14)
            .foregroundStyle(Color.onAccent)
        }
        configuration.label
      }
      .contentShape(Rectangle().inset(by: -8))
    }) {
      configuration.isOn.toggle()
      return true
    }
    .accessibilityElement(children: .combine)
    .accessibilityRemoveTraits(.isButton)
    .accessibilityAddTraits(.isToggle)
    .accessibilityValue(
      configuration.isMixed
        ? Text("Mixed")
        : configuration.isOn ? Text("Checked") : Text("Unchecked")
    )
  }
}

extension ToggleStyle where Self == CheckboxStyle {
  public static var checkbox: CheckboxStyle { CheckboxStyle() }
}
