import SwiftUI

public struct VariantButtonStyle: ButtonStyle {
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

    var textStyle: TextStyle {
      switch self {
      case .xs, .iconXs: .xs
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
      case .xs, .iconXs: Radius.sm
      case .lg, .iconLg: Radius.lg
      case .xl, .iconXl: Radius.xl
      default: Radius.md
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
  var metrics: ButtonMetrics?

  public init(_ variant: Variant = .default, size: Size = .default, block: Bool = false) {
    self.variant = variant
    self.size = size
    self.block = block
  }

  init(_ variant: Variant, size: Size, metrics: ButtonMetrics) {
    self.variant = variant
    self.size = size
    self.block = false
    self.metrics = metrics
  }

  public func makeBody(configuration: Configuration) -> some View {
    StyledButton(configuration: configuration, variant: variant, size: size, block: block, metrics: metrics)
  }
}

struct ButtonMetrics: Sendable {
  var horizontalPadding: CGFloat
  var spacing: CGFloat
  var iconSize: CGFloat
  var textStyle: TextStyle
}

private struct StyledButton: View {
  let configuration: ButtonStyleConfiguration
  let variant: VariantButtonStyle.Variant
  let size: VariantButtonStyle.Size
  let block: Bool
  let metrics: ButtonMetrics?

  @Environment(\.colorScheme) private var colorScheme
  @Environment(\.isEnabled) private var isEnabled
  @Environment(\.buttonGroup) private var group

  var body: some View {
    let joined = group != nil && variant != .ghost && variant != .plain
    let rounded = RoundedRectangle(
      cornerRadius: block ? size.blockRadius : Radius.full,
      style: .continuous
    )
    let shape = joined ? AnyShape(Rectangle()) : AnyShape(rounded)
    configuration.label
      .labelStyle(ButtonLabelStyle(spacing: metrics?.spacing ?? size.spacing, iconSize: metrics?.iconSize ?? size.iconSize))
    .scaledFont(metrics?.textStyle ?? size.textStyle)
    .underline(variant == .link && pressed && isEnabled)
    .lineLimit(1)
    .foregroundStyle(foreground)
    .padding(.horizontal, metrics?.horizontalPadding ?? size.horizontalPadding)
    .frame(width: size.isIcon && !block ? size.height : nil, height: size.height)
    .frame(maxWidth: block || group == .vertical ? .infinity : nil)
    .background(background, in: shape)
    .overlay {
      if variant == .outline && !joined {
        rounded.strokeBorder(EsuissColor.border)
      }
    }
    .contentShape(shape)
    .opacity(isEnabled ? (pressed ? 0.8 : 1) : 0.5)
    .anchorPreference(key: ButtonGroupFramesKey.self, value: .bounds) { anchor in
      joined ? [ButtonGroupFrame(bounds: anchor, outlined: variant == .outline)] : []
    }
  }

  private var isDark: Bool { colorScheme == .dark }
  private var pressed: Bool { configuration.isPressed }

  private var foreground: Color {
    switch variant {
    case .default:
      EsuissColor.primaryForeground
    case .outline, .ghost:
      EsuissColor.foreground
    case .secondary:
      EsuissColor.secondaryForeground
    case .tinted, .plain, .link:
      EsuissColor.primary
    case .destructive:
      EsuissColor.destructive
    }
  }

  private var background: Color {
    switch variant {
    case .default:
      EsuissColor.primary
    case .outline:
      isDark ? .clear : EsuissColor.background
    case .secondary:
      EsuissColor.secondary
    case .tinted:
      Color.adaptive(light: EsuissColor.primary.opacity(0.1), dark: EsuissColor.primary.opacity(0.2))
    case .ghost, .plain, .link:
      .clear
    case .destructive:
      Color.adaptive(light: EsuissColor.destructive.opacity(0.1), dark: EsuissColor.destructive.opacity(0.2))
    }
  }
}

struct ButtonLabelStyle: LabelStyle {
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

extension ButtonStyle where Self == VariantButtonStyle {
  public static func variant(
    _ variant: VariantButtonStyle.Variant = .default,
    size: VariantButtonStyle.Size = .default,
    block: Bool = false
  ) -> VariantButtonStyle {
    VariantButtonStyle(variant, size: size, block: block)
  }
}
