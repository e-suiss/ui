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

  public static let surface = Color.adaptive(light: .init(0xFFFFFF), dark: .init(0x000000))
  public static let surfaceSecondary = Color.adaptive(light: .init(0xF5F5F7), dark: .init(0x161617))
  public static let surfaceTertiary = Color.adaptive(light: .init(0xE8E8ED), dark: .init(0x2C2C2E))
  public static let surfaceRaised = Color.adaptive(light: .init(0xFFFFFF), dark: .init(0x1D1D1F))
  public static let label = Color.adaptive(light: .init(0x1D1D1F), dark: .init(0xF5F5F7))
  public static let labelSecondary = Color.adaptive(light: .init(0x6E6E73), dark: .init(0xA1A1A6))
  public static let labelTertiary = Color.adaptive(light: .init(0x86868B), dark: .init(0x86868B))
  public static let labelQuaternary = Color.adaptive(light: .init(0xD2D2D7), dark: .init(0x424245))
  public static let control = Color.adaptive(light: .init(0x000000, 0.04), dark: .init(0xFFFFFF, 0.1))
  public static let controlHover = Color.adaptive(light: .init(0x000000, 0.08), dark: .init(0xFFFFFF, 0.16))
  public static let controlPressed = Color.adaptive(light: .init(0x000000, 0.12), dark: .init(0xFFFFFF, 0.22))
  public static let controlSelected = Color.adaptive(light: .init(0x1D1D1F), dark: .init(0xF5F5F7))
  public static let controlDisabled = Color.adaptive(light: .init(0x000000, 0.03), dark: .init(0xFFFFFF, 0.05))
  public static let onControlSelected = Color.adaptive(light: .init(0xFFFFFF), dark: .init(0x000000))
  public static let itemHover = Color.adaptive(light: .init(0x000000, 0.05), dark: .init(0xFFFFFF, 0.08))
  public static let itemPressed = Color.adaptive(light: .init(0x000000, 0.08), dark: .init(0xFFFFFF, 0.12))
  public static let itemSelected = Color.adaptive(light: .init(0x000000, 0.06), dark: .init(0xFFFFFF, 0.1))
  public static let separator = Color.adaptive(light: .init(0xD2D2D7), dark: .init(0x424245))
  public static let separatorStrong = Color.adaptive(light: .init(0x86868B), dark: .init(0x6E6E73))
  public static let accent = Color.adaptive(light: .init(0x0071E3), dark: .init(0x0071E3))
  public static let accentHover = Color.adaptive(light: .init(0x0068D1), dark: .init(0x005EBE))
  public static let accentPressed = Color.adaptive(light: .init(0x005BB8), dark: .init(0x004D9E))
  public static let accentSelected = Color.adaptive(light: .init(0x0071E3), dark: .init(0x0071E3))
  public static let accentDisabled = Color.adaptive(light: .init(0x0071E3, 0.4), dark: .init(0x0071E3, 0.4))
  public static let onAccent = Color.adaptive(light: .init(0xFFFFFF), dark: .init(0xFFFFFF))
  public static let accentSurface = Color.adaptive(light: .init(0x0071E3, 0.09), dark: .init(0x0071E3, 0.18))
  public static let accentSurfaceHover = Color.adaptive(light: .init(0x0071E3, 0.14), dark: .init(0x0071E3, 0.24))
  public static let accentSurfacePressed = Color.adaptive(light: .init(0x0071E3, 0.18), dark: .init(0x0071E3, 0.3))
  public static let link = Color.adaptive(light: .init(0x0066CC), dark: .init(0x2997FF))
  public static let focus = Color.adaptive(light: .init(0x0071E3), dark: .init(0x0071E3))
  public static let scrim = Color.adaptive(light: .init(0x000000, 0.48), dark: .init(0x000000, 0.48))
  public static let danger = Color.adaptive(light: .init(0xD0000A), dark: .init(0xFF5447))
  public static let dangerSurface = Color.adaptive(light: .init(0xD70015, 0.08), dark: .init(0xFF453A, 0.2))
  public static let dangerSurfaceHover = Color.adaptive(light: .init(0xD70015, 0.12), dark: .init(0xFF453A, 0.3))
  public static let dangerSurfacePressed = Color.adaptive(light: .init(0xD70015, 0.16), dark: .init(0xFF453A, 0.36))
  public static let success = Color.adaptive(light: .init(0x008009), dark: .init(0x30D158))
  public static let successSurface = Color.adaptive(light: .init(0xEFFAF1), dark: .init(0x30D158, 0.16))
  public static let warning = Color.adaptive(light: .init(0xB64400), dark: .init(0xFF9F0A))
  public static let warningSurface = Color.adaptive(light: .init(0xFFF5EA), dark: .init(0xFF9F0A, 0.16))
}
