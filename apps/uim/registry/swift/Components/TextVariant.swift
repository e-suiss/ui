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
    case .lead, .muted: .labelSecondary
    default: .label
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
          Rectangle().fill(Color.separator).frame(width: 2)
        }
        .padding(.top, 16)
    case .code:
      styled(content)
        .monospaced()
        .padding(.horizontal, 4)
        .padding(.vertical, 2)
        .background(Color.surfaceSecondary, in: RoundedRectangle(cornerRadius: Radius.sm, style: .continuous))
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

private struct ScaledTextStyleModifier: ViewModifier {
  let style: TextStyle
  let weight: Font.Weight

  @ScaledMetric(relativeTo: .body) private var scale: CGFloat = 1

  func body(content: Content) -> some View {
    let size = style.size * scale
    let lineSpacing = max(0, style.lineHeight * scale - UIFont.systemFont(ofSize: size).lineHeight)
    content
      .font(.system(size: size, weight: weight))
      .tracking(style.letterSpacing)
      .lineSpacing(lineSpacing)
      .padding(.vertical, lineSpacing / 2)
  }
}

extension View {
  func scaledTextStyle(_ style: TextStyle, weight: Font.Weight = .regular) -> some View {
    modifier(ScaledTextStyleModifier(style: style, weight: weight))
  }

  func scaledFont(_ style: TextStyle, weight: Font.Weight = .regular) -> some View {
    modifier(ScaledFontModifier(style: style, weight: weight))
  }
}

private struct ScaledFontModifier: ViewModifier {
  let style: TextStyle
  let weight: Font.Weight

  @ScaledMetric(relativeTo: .body) private var scale: CGFloat = 1

  func body(content: Content) -> some View {
    content
      .font(.system(size: style.size * scale, weight: weight))
      .tracking(style.letterSpacing)
  }
}
