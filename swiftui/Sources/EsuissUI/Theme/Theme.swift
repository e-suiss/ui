import SwiftUI
import UIKit

struct RGBA: Sendable {
  let red: CGFloat
  let green: CGFloat
  let blue: CGFloat
  let alpha: CGFloat

  init(_ hex: UInt32, _ alpha: CGFloat = 1) {
    red = CGFloat((hex >> 16) & 0xFF) / 255
    green = CGFloat((hex >> 8) & 0xFF) / 255
    blue = CGFloat(hex & 0xFF) / 255
    self.alpha = alpha
  }

  var uiColor: UIColor {
    UIColor(red: red, green: green, blue: blue, alpha: alpha)
  }
}

extension Color {
  static func adaptive(light: RGBA, dark: RGBA) -> Color {
    let lightColor = light.uiColor
    let darkColor = dark.uiColor
    return Color(uiColor: UIColor { traits in
      traits.userInterfaceStyle == .dark ? darkColor : lightColor
    })
  }
}

public struct TextStyle: Sendable, Hashable {
  public let size: CGFloat
  public let lineHeight: CGFloat
  public let letterSpacing: CGFloat

  public init(size: CGFloat, lineHeight: CGFloat, letterSpacing: CGFloat) {
    self.size = size
    self.lineHeight = lineHeight
    self.letterSpacing = letterSpacing
  }

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

public struct Shadow: Sendable, Hashable {
  public let color: Color
  public let radius: CGFloat
  public let x: CGFloat
  public let y: CGFloat

  public init(color: Color, radius: CGFloat, x: CGFloat = 0, y: CGFloat = 0) {
    self.color = color
    self.radius = radius
    self.x = x
    self.y = y
  }
}

extension View {
  public func shadow(_ shadow: Shadow) -> some View {
    self.shadow(color: shadow.color, radius: shadow.radius, x: shadow.x, y: shadow.y)
  }
}
