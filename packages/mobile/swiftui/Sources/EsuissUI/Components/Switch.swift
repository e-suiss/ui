import SwiftUI

public struct SwitchStyle: ToggleStyle {
  public enum Size: CaseIterable, Sendable {
    case `default`, sm

    var track: CGSize {
      switch self {
      case .default: CGSize(width: 52, height: 24)
      case .sm: CGSize(width: 44, height: 20)
      }
    }

    var thumbHeight: CGFloat {
      switch self {
      case .default: 20
      case .sm: 16
      }
    }

    func thumbWidth(pressed: Bool) -> CGFloat {
      switch self {
      case .default: pressed ? 36 : 32
      case .sm: pressed ? 30 : 26
      }
    }

    func travel(pressed: Bool) -> CGFloat {
      switch self {
      case .default: pressed ? 12 : 16
      case .sm: pressed ? 10 : 14
      }
    }
  }

  let size: Size

  public init(size: Size = .default) {
    self.size = size
  }

  public func makeBody(configuration: Configuration) -> some View {
    HapticButton(style: PressReader { pressed in
      HStack(spacing: 12) {
        SwitchTrack(isOn: configuration.isOn, pressed: pressed, size: size)
        SwitchLabel(label: configuration.label)
      }
      .contentShape(Rectangle().inset(by: -8))
    }) {
      configuration.isOn.toggle()
      return true
    }
    .accessibilityElement(children: .combine)
    .accessibilityRemoveTraits(.isButton)
    .accessibilityAddTraits(.isToggle)
    .accessibilityValue(configuration.isOn ? Text("On") : Text("Off"))
  }
}

private struct SwitchLabel<Label: View>: View {
  let label: Label

  var body: some View {
    if #available(iOS 18, *) {
      SwitchLabelVisibility(label: label)
    } else {
      label
    }
  }
}

@available(iOS 18, *)
private struct SwitchLabelVisibility<Label: View>: View {
  let label: Label

  @Environment(\.labelsVisibility) private var visibility

  var body: some View {
    if visibility != .hidden {
      label
    }
  }
}

private struct SwitchTrack: View {
  let isOn: Bool
  let pressed: Bool
  let size: SwitchStyle.Size

  @Environment(\.isEnabled) private var isEnabled
  @Environment(\.isInvalid) private var invalid
  @Environment(\.colorScheme) private var colorScheme
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  var body: some View {
    let squeezed = pressed && isEnabled
    ZStack(alignment: .leading) {
      Capsule().fill(fill)
      Capsule().strokeBorder(border, lineWidth: 2)
      Capsule()
        .fill(colorScheme == .dark ? EsuissColor.foreground : EsuissColor.background)
        .frame(width: size.thumbWidth(pressed: squeezed), height: size.thumbHeight)
        .shadow(.thumb)
        .offset(x: 2 + (isOn ? size.travel(pressed: squeezed) : 0))
    }
    .frame(width: size.track.width, height: size.track.height)
    .opacity(isEnabled ? 1 : 0.5)
    .animation(reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.2), value: isOn)
    .animation(reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.2), value: squeezed)
  }

  private var fill: Color {
    isOn ? EsuissColor.primary : EsuissColor.input
  }

  private var border: Color {
    if invalid && isEnabled { return EsuissColor.destructive }
    return isOn ? EsuissColor.primary : .clear
  }
}

extension ToggleStyle where Self == SwitchStyle {
  public static func `switch`(size: SwitchStyle.Size) -> SwitchStyle {
    SwitchStyle(size: size)
  }
}
