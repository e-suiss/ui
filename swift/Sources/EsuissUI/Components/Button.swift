import SwiftUI

public struct EsuissButtonStyle: ButtonStyle {
  public enum Variant: CaseIterable, Sendable {
    case primary, secondary, outline, ghost, destructive, link
  }

  public enum Size: CaseIterable, Sendable {
    case xs, sm, regular, lg, icon, iconXs, iconSm, iconLg

    var height: CGFloat {
      switch self {
      case .xs, .iconXs: 24
      case .sm, .iconSm: 32
      case .regular, .icon: 36
      case .lg, .iconLg: 40
      }
    }

    var horizontalPadding: CGFloat {
      switch self {
      case .xs: 10
      case .sm, .regular: 12
      case .lg: 16
      case .icon, .iconXs, .iconSm, .iconLg: 0
      }
    }

    var fontSize: CGFloat {
      switch self {
      case .xs, .iconXs: 12
      default: 14
      }
    }

    var isIcon: Bool {
      switch self {
      case .icon, .iconXs, .iconSm, .iconLg: true
      default: false
      }
    }
  }

  let variant: Variant
  let size: Size

  public init(_ variant: Variant = .primary, size: Size = .regular) {
    self.variant = variant
    self.size = size
  }

  public func makeBody(configuration: Configuration) -> some View {
    StyledButton(configuration: configuration, variant: variant, size: size)
  }
}

private struct StyledButton: View {
  let configuration: ButtonStyleConfiguration
  let variant: EsuissButtonStyle.Variant
  let size: EsuissButtonStyle.Size

  @Environment(\.colorScheme) private var colorScheme
  @Environment(\.isEnabled) private var isEnabled

  var body: some View {
    configuration.label
      .font(.system(size: size.fontSize, weight: .medium))
      .lineLimit(1)
      .foregroundStyle(foreground)
      .padding(.horizontal, size.horizontalPadding)
      .frame(width: size.isIcon ? size.height : nil, height: size.height)
      .background(background, in: Capsule())
      .overlay {
        if variant == .outline {
          Capsule().strokeBorder(Color.esuissBorder)
        }
      }
      .opacity(isEnabled ? (pressedFades ? 0.8 : 1) : 0.5)
      .contentShape(Capsule())
  }

  private var isDark: Bool { colorScheme == .dark }
  private var pressed: Bool { configuration.isPressed }
  private var pressedFades: Bool { pressed && variant == .secondary }

  private var foreground: Color {
    switch variant {
    case .primary: .esuissPrimaryForeground
    case .destructive: .esuissDestructive
    case .link: .esuissPrimary
    case .secondary, .outline, .ghost: .esuissForeground
    }
  }

  private var background: Color {
    switch variant {
    case .primary:
      .esuissPrimary.opacity(pressed ? 0.8 : 1)
    case .secondary:
      .esuissSecondary
    case .outline:
      pressed ? (isDark ? Color.esuissInput.opacity(0.3) : .esuissMuted) : (isDark ? .clear : .esuissBackground)
    case .ghost:
      pressed ? .esuissMuted.opacity(isDark ? 0.5 : 1) : .clear
    case .destructive:
      .esuissDestructive.opacity((isDark ? 0.2 : 0.1) + (pressed ? 0.1 : 0))
    case .link:
      .clear
    }
  }
}

extension ButtonStyle where Self == EsuissButtonStyle {
  public static func esuiss(
    _ variant: EsuissButtonStyle.Variant = .primary,
    size: EsuissButtonStyle.Size = .regular
  ) -> EsuissButtonStyle {
    EsuissButtonStyle(variant, size: size)
  }
}
