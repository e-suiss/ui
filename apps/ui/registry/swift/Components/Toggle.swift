import SwiftUI

public enum ToggleVariant: CaseIterable, Sendable {
  case `default`, outline
}

public enum ToggleSize: CaseIterable, Sendable {
  case `default`, sm, lg

  var height: CGFloat {
    switch self {
    case .default: 36
    case .sm: 32
    case .lg: 40
    }
  }

  var horizontalPadding: CGFloat {
    self == .lg ? 16 : 12
  }
}

public struct VariantToggleStyle: ToggleStyle {
  let variant: ToggleVariant
  let size: ToggleSize

  public init(_ variant: ToggleVariant = .default, size: ToggleSize = .default) {
    self.variant = variant
    self.size = size
  }

  public func makeBody(configuration: Configuration) -> some View {
    HapticButton(style: PressReader { pressed in
      ToggleSurface(isOn: configuration.isOn, pressed: pressed, variant: variant, size: size) {
        configuration.label
      }
    }) {
      configuration.isOn.toggle()
      return true
    }
    .accessibilityAddTraits(configuration.isOn ? .isSelected : [])
  }
}

extension ToggleStyle where Self == VariantToggleStyle {
  public static func variant(_ variant: ToggleVariant = .default, size: ToggleSize = .default) -> VariantToggleStyle {
    VariantToggleStyle(variant, size: size)
  }
}

struct ToggleSurface<Content: View>: View {
  let isOn: Bool
  let pressed: Bool
  let variant: ToggleVariant
  let size: ToggleSize
  var shape = AnyShape(RoundedRectangle(cornerRadius: Radius.lg, style: .continuous))
  var bordered = true
  let content: Content

  @Environment(\.isEnabled) private var isEnabled
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  init(
    isOn: Bool,
    pressed: Bool,
    variant: ToggleVariant,
    size: ToggleSize,
    shape: AnyShape? = nil,
    bordered: Bool = true,
    @ViewBuilder content: () -> Content
  ) {
    self.isOn = isOn
    self.pressed = pressed
    self.variant = variant
    self.size = size
    if let shape { self.shape = shape }
    self.bordered = bordered
    self.content = content()
  }

  var body: some View {
    content
      .labelStyle(ButtonLabelStyle(spacing: 4, iconSize: 16))
      .scaledFont(.sm)
      .lineLimit(1)
      .foregroundStyle(foreground)
      .padding(.horizontal, size.horizontalPadding)
      .frame(minWidth: size.height, minHeight: size.height)
      .background(background, in: shape)
      .overlay {
        if variant == .outline && bordered {
          shape.stroke(Color.separator, lineWidth: 1).padding(0.5)
        }
      }
      .contentShape(shape)
      .scaleEffect(pressed && isEnabled && !reduceMotion ? 0.96 : 1)
      .animation(reduceMotion ? nil : .easeOut(duration: 0.15), value: pressed)
  }

  private var foreground: Color {
    if !isEnabled { return .labelQuaternary }
    return isOn ? .link : .label
  }

  private var background: Color {
    if !isEnabled { return isOn ? .controlDisabled : .clear }
    if isOn { return pressed ? .itemPressed : .itemSelected }
    return pressed ? .itemPressed : .clear
  }
}
