import SwiftUI

public enum EsuissColor {
  public static let background = Color.adaptive(light: .init(0xFFFFFF), dark: .init(0x000000))
  public static let foreground = Color.adaptive(light: .init(0x1D1D1F), dark: .init(0xF5F5F7))
  public static let card = Color.adaptive(light: .init(0xFFFFFF), dark: .init(0x1D1D1F))
  public static let cardForeground = Color.adaptive(light: .init(0x1D1D1F), dark: .init(0xF5F5F7))
  public static let popover = Color.adaptive(light: .init(0xFFFFFF), dark: .init(0x1D1D1F))
  public static let popoverForeground = Color.adaptive(light: .init(0x1D1D1F), dark: .init(0xF5F5F7))
  public static let primary = Color.adaptive(light: .init(0x0071E3), dark: .init(0x2997FF))
  public static let primaryForeground = Color.adaptive(light: .init(0xFFFFFF), dark: .init(0xFFFFFF))
  public static let secondary = Color.adaptive(light: .init(0x000000, 0.04), dark: .init(0xFFFFFF, 0.1))
  public static let secondaryForeground = Color.adaptive(light: .init(0x1D1D1F), dark: .init(0xF5F5F7))
  public static let muted = Color.adaptive(light: .init(0xF5F5F7), dark: .init(0x161617))
  public static let mutedForeground = Color.adaptive(light: .init(0x6E6E73), dark: .init(0xA1A1A6))
  public static let accent = Color.adaptive(light: .init(0x000000, 0.06), dark: .init(0xFFFFFF, 0.1))
  public static let accentForeground = Color.adaptive(light: .init(0x1D1D1F), dark: .init(0xF5F5F7))
  public static let destructive = Color.adaptive(light: .init(0xD0000A), dark: .init(0xFF5447))
  public static let border = Color.adaptive(light: .init(0xD2D2D7), dark: .init(0x424245))
  public static let input = Color.adaptive(light: .init(0x86868B), dark: .init(0x6E6E73))
  public static let ring = Color.adaptive(light: .init(0x0071E3), dark: .init(0x0071E3))
  public static let chart1 = Color.adaptive(light: .init(0x007AFF), dark: .init(0x0A84FF))
  public static let chart2 = Color.adaptive(light: .init(0x30B0C7), dark: .init(0x40C8E0))
  public static let chart3 = Color.adaptive(light: .init(0x5856D6), dark: .init(0x5E5CE6))
  public static let chart4 = Color.adaptive(light: .init(0xFF9500), dark: .init(0xFF9F0A))
  public static let chart5 = Color.adaptive(light: .init(0x8E8E93), dark: .init(0x8E8E93))
  public static let sidebar = Color.adaptive(light: .init(0xF5F5F7), dark: .init(0x161617))
  public static let sidebarForeground = Color.adaptive(light: .init(0x1D1D1F), dark: .init(0xF5F5F7))
  public static let sidebarPrimary = Color.adaptive(light: .init(0x0071E3), dark: .init(0x2997FF))
  public static let sidebarPrimaryForeground = Color.adaptive(light: .init(0xFFFFFF), dark: .init(0xFFFFFF))
  public static let sidebarAccent = Color.adaptive(light: .init(0x000000, 0.06), dark: .init(0xFFFFFF, 0.1))
  public static let sidebarAccentForeground = Color.adaptive(light: .init(0x1D1D1F), dark: .init(0xF5F5F7))
  public static let sidebarBorder = Color.adaptive(light: .init(0xD2D2D7), dark: .init(0x424245))
  public static let sidebarRing = Color.adaptive(light: .init(0x0071E3), dark: .init(0x0071E3))
}

public enum Palette {
  public static let black = Color.fixed(.init(0x000000))
  public static let white = Color.fixed(.init(0xFFFFFF))
  public static let red500 = Color.fixed(.init(0xFB2C36))
  public static let orange500 = Color.fixed(.init(0xFF6900))
  public static let amber400 = Color.fixed(.init(0xFFB900))
  public static let amber500 = Color.fixed(.init(0xFE9A00))
  public static let amber600 = Color.fixed(.init(0xE17100))
  public static let yellow500 = Color.fixed(.init(0xF0B100))
  public static let green400 = Color.fixed(.init(0x05DF72))
  public static let green500 = Color.fixed(.init(0x00C950))
  public static let green600 = Color.fixed(.init(0x00A63E))
  public static let teal400 = Color.fixed(.init(0x00D5BE))
  public static let teal500 = Color.fixed(.init(0x00BBA7))
  public static let cyan500 = Color.fixed(.init(0x00B8DB))
  public static let blue500 = Color.fixed(.init(0x2B7FFF))
  public static let indigo500 = Color.fixed(.init(0x615FFF))
  public static let purple500 = Color.fixed(.init(0xAD46FF))
  public static let pink500 = Color.fixed(.init(0xF6339A))
  public static let zinc500 = Color.fixed(.init(0x71717B))
}

public enum Radius {
  public static let xs: CGFloat = 3
  public static let sm: CGFloat = 5
  public static let md: CGFloat = 8
  public static let lg: CGFloat = 10
  public static let xl: CGFloat = 12
  public static let xl2: CGFloat = 18
  public static let xl3: CGFloat = 28
  public static let full: CGFloat = 9999
}

extension TextStyle {
  public static let xs = TextStyle(size: 12, lineHeight: 16)
  public static let sm = TextStyle(size: 14, lineHeight: 20)
  public static let base = TextStyle(size: 16, lineHeight: 24)
  public static let lg = TextStyle(size: 18, lineHeight: 28)
  public static let xl = TextStyle(size: 20, lineHeight: 28)
  public static let xl2 = TextStyle(size: 24, lineHeight: 32)
  public static let xl3 = TextStyle(size: 30, lineHeight: 36)

  public static let allCases: [TextStyle] = [.xs, .sm, .base, .lg, .xl, .xl2, .xl3]
}

extension Shadow {
  public static let md = Shadow(.init(color: .black.opacity(0.1), radius: 3, y: 4), .init(color: .black.opacity(0.1), radius: 2, y: 2))
  public static let lg = Shadow(.init(color: .black.opacity(0.1), radius: 7.5, y: 10), .init(color: .black.opacity(0.1), radius: 3, y: 4))
}
