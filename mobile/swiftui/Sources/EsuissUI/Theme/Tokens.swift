import SwiftUI

extension Color {
  public static let surface = Color.adaptive(light: .init(0xFFFFFF), dark: .init(0x000000))
  public static let surfaceSecondary = Color.adaptive(light: .init(0xF5F5F7), dark: .init(0x161617))
  public static let surfaceTertiary = Color.adaptive(light: .init(0xE8E8ED), dark: .init(0x2C2C2E))
  public static let surfaceRaised = Color.adaptive(light: .init(0xFFFFFF), dark: .init(0x1D1D1F))
  public static let label = Color.adaptive(light: .init(0x1D1D1F), dark: .init(0xF5F5F7))
  public static let labelSecondary = Color.adaptive(light: .init(0x6E6E73), dark: .init(0xA1A1A6))
  public static let labelTertiary = Color.adaptive(light: .init(0x86868B), dark: .init(0x86868B))
  public static let labelQuaternary = Color.adaptive(light: .init(0xD2D2D7), dark: .init(0x424245))
  public static let control = Color.adaptive(light: .init(0x000000, 0.04), dark: .init(0xFFFFFF, 0.1))
  public static let controlPressed = Color.adaptive(light: .init(0x000000, 0.12), dark: .init(0xFFFFFF, 0.22))
  public static let controlSelected = Color.adaptive(light: .init(0x1D1D1F), dark: .init(0xF5F5F7))
  public static let controlDisabled = Color.adaptive(light: .init(0x000000, 0.03), dark: .init(0xFFFFFF, 0.05))
  public static let onControlSelected = Color.adaptive(light: .init(0xFFFFFF), dark: .init(0x000000))
  public static let itemPressed = Color.adaptive(light: .init(0x000000, 0.08), dark: .init(0xFFFFFF, 0.12))
  public static let itemSelected = Color.adaptive(light: .init(0x000000, 0.06), dark: .init(0xFFFFFF, 0.1))
  public static let separator = Color.adaptive(light: .init(0xD2D2D7), dark: .init(0x424245))
  public static let separatorStrong = Color.adaptive(light: .init(0x86868B), dark: .init(0x6E6E73))
  public static let accent = Color.adaptive(light: .init(0x0071E3), dark: .init(0x0071E3))
  public static let accentPressed = Color.adaptive(light: .init(0x005BB8), dark: .init(0x004D9E))
  public static let accentSelected = Color.adaptive(light: .init(0x0071E3), dark: .init(0x0071E3))
  public static let accentDisabled = Color.adaptive(light: .init(0x0071E3, 0.4), dark: .init(0x0071E3, 0.4))
  public static let onAccent = Color.adaptive(light: .init(0xFFFFFF), dark: .init(0xFFFFFF))
  public static let accentSurface = Color.adaptive(light: .init(0x0071E3, 0.09), dark: .init(0x0071E3, 0.18))
  public static let accentSurfacePressed = Color.adaptive(light: .init(0x0071E3, 0.18), dark: .init(0x0071E3, 0.3))
  public static let link = Color.adaptive(light: .init(0x0066CC), dark: .init(0x2997FF))
  public static let focus = Color.adaptive(light: .init(0x0071E3), dark: .init(0x0071E3))
  public static let scrim = Color.adaptive(light: .init(0x000000, 0.48), dark: .init(0x000000, 0.48))
  public static let media = Color.adaptive(light: .init(0x000000), dark: .init(0x000000))
  public static let onMedia = Color.adaptive(light: .init(0xFFFFFF), dark: .init(0xFFFFFF))
  public static let danger = Color.adaptive(light: .init(0xD0000A), dark: .init(0xFF5447))
  public static let dangerSurface = Color.adaptive(light: .init(0xD70015, 0.08), dark: .init(0xFF453A, 0.2))
  public static let dangerSurfacePressed = Color.adaptive(light: .init(0xD70015, 0.16), dark: .init(0xFF453A, 0.36))
  public static let success = Color.adaptive(light: .init(0x008009), dark: .init(0x30D158))
  public static let successSurface = Color.adaptive(light: .init(0xEFFAF1), dark: .init(0x30D158, 0.16))
  public static let warning = Color.adaptive(light: .init(0xB64400), dark: .init(0xFF9F0A))
  public static let warningSurface = Color.adaptive(light: .init(0xFFF5EA), dark: .init(0xFF9F0A, 0.16))
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
}

extension Shadow {
  public static let md = Shadow(color: .black.opacity(0.08), radius: 6, x: 2, y: 4)
  public static let lg = Shadow(color: .black.opacity(0.12), radius: 12, y: 4)
}
