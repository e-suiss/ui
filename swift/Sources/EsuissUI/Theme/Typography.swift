import SwiftUI
import UIKit

public struct EsuissTextStyle: Sendable, Hashable {
  public let size: CGFloat
  public let lineHeight: CGFloat
  public let letterSpacing: CGFloat

  public init(size: CGFloat, lineHeight: CGFloat, letterSpacing: CGFloat) {
    self.size = size
    self.lineHeight = lineHeight
    self.letterSpacing = letterSpacing
  }

  public static let xs3 = EsuissTextStyle(size: 11, lineHeight: 13, letterSpacing: 0.066)
  public static let xs2 = EsuissTextStyle(size: 12, lineHeight: 16, letterSpacing: 0)
  public static let xs = EsuissTextStyle(size: 13, lineHeight: 18, letterSpacing: -0.078)
  public static let sm = EsuissTextStyle(size: 15, lineHeight: 20, letterSpacing: -0.24)
  public static let md = EsuissTextStyle(size: 16, lineHeight: 21, letterSpacing: -0.32)
  public static let base = EsuissTextStyle(size: 17, lineHeight: 22, letterSpacing: -0.442)
  public static let lg = EsuissTextStyle(size: 20, lineHeight: 25, letterSpacing: -0.46)
  public static let xl = EsuissTextStyle(size: 22, lineHeight: 28, letterSpacing: -0.264)
  public static let xl2 = EsuissTextStyle(size: 28, lineHeight: 34, letterSpacing: 0.392)
  public static let xl3 = EsuissTextStyle(size: 34, lineHeight: 41, letterSpacing: 0.408)

  public static let allCases: [EsuissTextStyle] = [.xs3, .xs2, .xs, .sm, .md, .base, .lg, .xl, .xl2, .xl3]

  public func font(weight: Font.Weight = .regular) -> Font {
    .system(size: size, weight: weight)
  }

  public var lineSpacing: CGFloat {
    max(0, lineHeight - UIFont.systemFont(ofSize: size).lineHeight)
  }
}

extension Font {
  public static func esuiss(_ style: EsuissTextStyle, weight: Font.Weight = .regular) -> Font {
    style.font(weight: weight)
  }
}

private struct EsuissTextStyleModifier: ViewModifier {
  let style: EsuissTextStyle
  let weight: Font.Weight

  func body(content: Content) -> some View {
    content
      .font(style.font(weight: weight))
      .tracking(style.letterSpacing)
      .lineSpacing(style.lineSpacing)
      .padding(.vertical, style.lineSpacing / 2)
  }
}

extension View {
  public func esuissTextStyle(_ style: EsuissTextStyle, weight: Font.Weight = .regular) -> some View {
    modifier(EsuissTextStyleModifier(style: style, weight: weight))
  }
}
