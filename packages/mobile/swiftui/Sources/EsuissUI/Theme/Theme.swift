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

  static func fixed(_ color: RGBA) -> Color {
    Color(uiColor: color.uiColor)
  }

  public static func adaptive(light: Color, dark: Color) -> Color {
    let lightColor = UIColor(light)
    let darkColor = UIColor(dark)
    return Color(uiColor: UIColor { traits in
      traits.userInterfaceStyle == .dark ? darkColor : lightColor
    })
  }
}

public struct TextStyle: Sendable, Hashable {
  public let size: CGFloat
  public let lineHeight: CGFloat

  public init(size: CGFloat, lineHeight: CGFloat) {
    self.size = size
    self.lineHeight = lineHeight
  }

  public func font(weight: Font.Weight = .regular) -> Font {
    .system(size: size, weight: weight)
  }

  public var lineSpacing: CGFloat {
    max(0, lineHeight - UIFont.systemFont(ofSize: size).lineHeight)
  }
}

extension Hashable where Self == Font {
  public static func textStyle(_ style: TextStyle, weight: Font.Weight = .regular) -> Font {
    style.font(weight: weight)
  }
}

private struct TextStyleModifier: ViewModifier {
  let style: TextStyle
  let weight: Font.Weight

  func body(content: Content) -> some View {
    content
      .font(style.font(weight: weight))
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
  public struct Layer: Sendable, Hashable {
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

    static let none = Layer(color: .clear, radius: 0)
  }

  public let layers: [Layer]

  public init(_ layers: Layer...) {
    self.layers = layers
  }

  public init(color: Color, radius: CGFloat, x: CGFloat = 0, y: CGFloat = 0) {
    layers = [Layer(color: color, radius: radius, x: x, y: y)]
  }
}

extension View {
  public func shadow(_ shadow: Shadow) -> some View {
    let first = shadow.layers.first ?? .none
    let second = shadow.layers.dropFirst().first ?? .none
    return self
      .shadow(color: first.color, radius: first.radius, x: first.x, y: first.y)
      .shadow(color: second.color, radius: second.radius, x: second.x, y: second.y)
  }
}
