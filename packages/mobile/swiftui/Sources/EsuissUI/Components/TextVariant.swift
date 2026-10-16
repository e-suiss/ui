import SwiftUI

public enum TextVariant: CaseIterable, Sendable {
  case `default`, h1, h2, h3, h4, p, blockquote, code, lead, large, small, muted

  var style: TextStyle {
    switch self {
    case .h1: .xl3
    case .h2: .xl2
    case .h3: .xl
    case .h4, .lead, .large: .lg
    case .code, .small, .muted: .sm
    default: .base
    }
  }

  var weight: Font.Weight {
    switch self {
    case .h1, .h2: .bold
    case .h3, .h4, .large, .code: .semibold
    case .small: .medium
    default: .regular
    }
  }

  var color: Color {
    switch self {
    case .lead, .muted: EsuissColor.mutedForeground
    default: EsuissColor.foreground
    }
  }

  var isHeading: Bool {
    switch self {
    case .h1, .h2, .h3, .h4: true
    default: false
    }
  }
}

private struct TextVariantModifier: ViewModifier {
  let variant: TextVariant

  func body(content: Content) -> some View {
    switch variant {
    case .blockquote:
      styled(content)
        .italic()
        .padding(.leading, 12)
        .overlay(alignment: .leading) {
          Rectangle().fill(EsuissColor.border).frame(width: 2)
        }
        .padding(.top, 16)
    case .code:
      styled(content)
        .monospaced()
        .padding(.horizontal, 4)
        .padding(.vertical, 2)
        .background(EsuissColor.muted, in: RoundedRectangle(cornerRadius: Radius.sm, style: .continuous))
    case .p:
      styled(content).padding(.top, 12)
    default:
      styled(content)
    }
  }

  private func styled(_ content: Content) -> some View {
    content
      .scaledTextStyle(variant.style, weight: variant.weight)
      .foregroundStyle(variant.color)
      .accessibilityAddTraits(variant.isHeading ? .isHeader : [])
  }
}

extension View {
  public func textVariant(_ variant: TextVariant) -> some View {
    modifier(TextVariantModifier(variant: variant))
  }
}
