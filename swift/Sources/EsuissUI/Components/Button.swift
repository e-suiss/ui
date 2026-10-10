import SwiftUI

public struct EsuissButtonStyle: ButtonStyle {
  public enum Variant: CaseIterable, Sendable {
    case `default`, outline, secondary, tinted, ghost, plain, destructive, link
  }

  public enum Size: CaseIterable, Sendable {
    case `default`, xs, sm, lg, xl, icon, iconXs, iconSm, iconLg, iconXl

    var height: CGFloat {
      switch self {
      case .xs, .iconXs: 24
      case .sm, .iconSm: 32
      case .default, .icon: 36
      case .lg, .iconLg: 44
      case .xl, .iconXl: 56
      }
    }

    var horizontalPadding: CGFloat {
      switch self {
      case .xs: 11
      case .sm: 12
      case .default: 16
      case .lg: 22
      case .xl: 31
      case .icon, .iconXs, .iconSm, .iconLg, .iconXl: 0
      }
    }

    var spacing: CGFloat {
      switch self {
      case .xs, .sm, .iconXs, .iconSm: 4
      case .xl, .iconXl: 8
      default: 6
      }
    }

    var textStyle: EsuissTextStyle {
      switch self {
      case .xs, .iconXs: .xs2
      case .lg, .xl: .base
      default: .sm
      }
    }

    public var iconSize: CGFloat {
      switch self {
      case .xs, .iconXs: 12
      default: 16
      }
    }

    var blockRadius: CGFloat {
      switch self {
      case .xs, .iconXs: EsuissRadius.sm
      case .lg, .iconLg: EsuissRadius.lg
      case .xl, .iconXl: EsuissRadius.xl
      default: EsuissRadius.md
      }
    }

    var isIcon: Bool {
      switch self {
      case .icon, .iconXs, .iconSm, .iconLg, .iconXl: true
      default: false
      }
    }
  }

  let variant: Variant
  let size: Size
  let block: Bool

  public init(_ variant: Variant = .default, size: Size = .default, block: Bool = false) {
    self.variant = variant
    self.size = size
    self.block = block
  }

  public func makeBody(configuration: Configuration) -> some View {
    StyledButton(configuration: configuration, variant: variant, size: size, block: block)
  }
}

private struct StyledButton: View {
  let configuration: ButtonStyleConfiguration
  let variant: EsuissButtonStyle.Variant
  let size: EsuissButtonStyle.Size
  let block: Bool

  @Environment(\.colorScheme) private var colorScheme
  @Environment(\.isEnabled) private var isEnabled

  var body: some View {
    let shape = RoundedRectangle(
      cornerRadius: block ? size.blockRadius : EsuissRadius.full,
      style: .continuous
    )
    configuration.label
      .labelStyle(EsuissButtonLabelStyle(spacing: size.spacing, iconSize: size.iconSize))
    .font(size.textStyle.font())
    .tracking(size.textStyle.letterSpacing)
    .underline(variant == .link && pressed && isEnabled)
    .lineLimit(1)
    .foregroundStyle(foreground)
    .padding(.horizontal, size.horizontalPadding)
    .frame(width: size.isIcon && !block ? size.height : nil, height: size.height)
    .frame(maxWidth: block ? .infinity : nil)
    .background(background, in: shape)
    .overlay {
      if variant == .outline {
        shape.strokeBorder(Color.esuissSeparator)
      }
    }
    .contentShape(shape)
  }

  private var isDark: Bool { colorScheme == .dark }
  private var pressed: Bool { configuration.isPressed }

  private var foreground: Color {
    switch variant {
    case .default:
      .esuissOnAccent
    case .outline, .secondary, .ghost:
      isEnabled ? .esuissLabel : .esuissLabelQuaternary
    case .tinted, .plain:
      isEnabled ? .esuissLink : .esuissLink.opacity(0.4)
    case .destructive:
      isEnabled ? .esuissDanger : .esuissDanger.opacity(0.4)
    case .link:
      isEnabled ? .esuissLink : .esuissLabelQuaternary
    }
  }

  private var background: Color {
    switch variant {
    case .default:
      !isEnabled ? .esuissAccentDisabled : pressed ? .esuissAccentPressed : .esuissAccent
    case .outline:
      isEnabled && pressed ? .esuissItemPressed : isDark ? .clear : .esuissSurface
    case .secondary:
      !isEnabled ? .esuissControlDisabled : pressed ? .esuissControlPressed : .esuissControl
    case .tinted:
      isEnabled && pressed ? .esuissAccentSurfacePressed : .esuissAccentSurface
    case .ghost:
      isEnabled && pressed ? .esuissItemHover : .clear
    case .plain:
      isEnabled && pressed ? .esuissItemPressed : .clear
    case .destructive:
      isEnabled && pressed ? .esuissDangerSurfacePressed : .esuissDangerSurface
    case .link:
      .clear
    }
  }
}

struct EsuissButtonLabelStyle: LabelStyle {
  let spacing: CGFloat
  let iconSize: CGFloat

  func makeBody(configuration: Configuration) -> some View {
    HStack(spacing: spacing) {
      configuration.icon
        .frame(width: iconSize, height: iconSize)
      configuration.title
    }
  }
}

extension ButtonStyle where Self == EsuissButtonStyle {
  public static func esuiss(
    _ variant: EsuissButtonStyle.Variant = .default,
    size: EsuissButtonStyle.Size = .default,
    block: Bool = false
  ) -> EsuissButtonStyle {
    EsuissButtonStyle(variant, size: size, block: block)
  }
}
