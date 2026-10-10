import SwiftUI

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

  public static let md = Shadow(color: .black.opacity(0.08), radius: 6, x: 2, y: 4)
  public static let lg = Shadow(color: .black.opacity(0.12), radius: 12, y: 4)
}

extension View {
  public func shadow(_ shadow: Shadow) -> some View {
    self.shadow(color: shadow.color, radius: shadow.radius, x: shadow.x, y: shadow.y)
  }
}
