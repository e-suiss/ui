import SwiftUI
import UIKit

public struct TextStyle: Sendable, Hashable {
  public let size: CGFloat
  public let lineHeight: CGFloat
  public let letterSpacing: CGFloat

  public init(size: CGFloat, lineHeight: CGFloat, letterSpacing: CGFloat) {
    self.size = size
    self.lineHeight = lineHeight
    self.letterSpacing = letterSpacing
  }

  public static let xs3 = TextStyle(size: 11, lineHeight: 13, letterSpacing: 0.066)
  public static let xs2 = TextStyle(size: 12, lineHeight: 16, letterSpacing: 0)
  public static let xs = TextStyle(size: 13, lineHeight: 18, letterSpacing: -0.078)
  public static let sm = TextStyle(size: 15, lineHeight: 20, letterSpacing: -0.24)
  public static let md = TextStyle(size: 16, lineHeight: 21, letterSpacing: -0.32)
  public static let base = TextStyle(size: 17, lineHeight: 22, letterSpacing: -0.442)
  public static let lg = TextStyle(size: 20, lineHeight: 25, letterSpacing: -0.46)
  public static let xl = TextStyle(size: 22, lineHeight: 28, letterSpacing: -0.264)
  public static let xl2 = TextStyle(size: 28, lineHeight: 34, letterSpacing: 0.392)
  public static let xl3 = TextStyle(size: 34, lineHeight: 41, letterSpacing: 0.408)

  public static let allCases: [TextStyle] = [.xs3, .xs2, .xs, .sm, .md, .base, .lg, .xl, .xl2, .xl3]

  public func font(weight: Font.Weight = .regular) -> Font {
    .system(size: size, weight: weight)
  }

  public var lineSpacing: CGFloat {
    max(0, lineHeight - UIFont.systemFont(ofSize: size).lineHeight)
  }
}

extension Font {
  public static func textStyle(_ style: EsuissUI.TextStyle, weight: Font.Weight = .regular) -> Font {
    style.font(weight: weight)
  }
}

private struct TextStyleModifier: ViewModifier {
  let style: TextStyle
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
  public func textStyle(_ style: TextStyle, weight: Font.Weight = .regular) -> some View {
    modifier(TextStyleModifier(style: style, weight: weight))
  }
}
