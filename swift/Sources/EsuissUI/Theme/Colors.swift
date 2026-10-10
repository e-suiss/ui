import SwiftUI
import UIKit

struct EsuissRGBA: Sendable {
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
  static func esuissAdaptive(light: EsuissRGBA, dark: EsuissRGBA) -> Color {
    let lightColor = light.uiColor
    let darkColor = dark.uiColor
    return Color(uiColor: UIColor { traits in
      traits.userInterfaceStyle == .dark ? darkColor : lightColor
    })
  }

  public static let esuissSurface = Color.esuissAdaptive(light: .init(0xFFFFFF), dark: .init(0x000000))
  public static let esuissSurfaceSecondary = Color.esuissAdaptive(light: .init(0xF5F5F7), dark: .init(0x161617))
  public static let esuissSurfaceTertiary = Color.esuissAdaptive(light: .init(0xE8E8ED), dark: .init(0x2C2C2E))
  public static let esuissSurfaceRaised = Color.esuissAdaptive(light: .init(0xFFFFFF), dark: .init(0x1D1D1F))
  public static let esuissLabel = Color.esuissAdaptive(light: .init(0x1D1D1F), dark: .init(0xF5F5F7))
  public static let esuissLabelSecondary = Color.esuissAdaptive(light: .init(0x6E6E73), dark: .init(0xA1A1A6))
  public static let esuissLabelTertiary = Color.esuissAdaptive(light: .init(0x86868B), dark: .init(0x86868B))
  public static let esuissLabelQuaternary = Color.esuissAdaptive(light: .init(0xD2D2D7), dark: .init(0x424245))
  public static let esuissControl = Color.esuissAdaptive(light: .init(0x000000, 0.04), dark: .init(0xFFFFFF, 0.1))
  public static let esuissControlHover = Color.esuissAdaptive(light: .init(0x000000, 0.08), dark: .init(0xFFFFFF, 0.16))
  public static let esuissControlPressed = Color.esuissAdaptive(light: .init(0x000000, 0.12), dark: .init(0xFFFFFF, 0.22))
  public static let esuissControlSelected = Color.esuissAdaptive(light: .init(0x1D1D1F), dark: .init(0xF5F5F7))
  public static let esuissControlDisabled = Color.esuissAdaptive(light: .init(0x000000, 0.03), dark: .init(0xFFFFFF, 0.05))
  public static let esuissOnControlSelected = Color.esuissAdaptive(light: .init(0xFFFFFF), dark: .init(0x000000))
  public static let esuissItemHover = Color.esuissAdaptive(light: .init(0x000000, 0.05), dark: .init(0xFFFFFF, 0.08))
  public static let esuissItemPressed = Color.esuissAdaptive(light: .init(0x000000, 0.08), dark: .init(0xFFFFFF, 0.12))
  public static let esuissItemSelected = Color.esuissAdaptive(light: .init(0x000000, 0.06), dark: .init(0xFFFFFF, 0.1))
  public static let esuissSeparator = Color.esuissAdaptive(light: .init(0xD2D2D7), dark: .init(0x424245))
  public static let esuissSeparatorStrong = Color.esuissAdaptive(light: .init(0x86868B), dark: .init(0x6E6E73))
  public static let esuissAccent = Color.esuissAdaptive(light: .init(0x0071E3), dark: .init(0x0071E3))
  public static let esuissAccentHover = Color.esuissAdaptive(light: .init(0x0068D1), dark: .init(0x005EBE))
  public static let esuissAccentPressed = Color.esuissAdaptive(light: .init(0x005BB8), dark: .init(0x004D9E))
  public static let esuissAccentSelected = Color.esuissAdaptive(light: .init(0x0071E3), dark: .init(0x0071E3))
  public static let esuissAccentDisabled = Color.esuissAdaptive(light: .init(0x0071E3, 0.4), dark: .init(0x0071E3, 0.4))
  public static let esuissOnAccent = Color.esuissAdaptive(light: .init(0xFFFFFF), dark: .init(0xFFFFFF))
  public static let esuissAccentSurface = Color.esuissAdaptive(light: .init(0x0071E3, 0.09), dark: .init(0x0071E3, 0.18))
  public static let esuissAccentSurfaceHover = Color.esuissAdaptive(light: .init(0x0071E3, 0.14), dark: .init(0x0071E3, 0.24))
  public static let esuissAccentSurfacePressed = Color.esuissAdaptive(light: .init(0x0071E3, 0.18), dark: .init(0x0071E3, 0.3))
  public static let esuissLink = Color.esuissAdaptive(light: .init(0x0066CC), dark: .init(0x2997FF))
  public static let esuissFocus = Color.esuissAdaptive(light: .init(0x0071E3), dark: .init(0x0071E3))
  public static let esuissScrim = Color.esuissAdaptive(light: .init(0x000000, 0.48), dark: .init(0x000000, 0.48))
  public static let esuissDanger = Color.esuissAdaptive(light: .init(0xD0000A), dark: .init(0xFF5447))
  public static let esuissDangerSurface = Color.esuissAdaptive(light: .init(0xD70015, 0.08), dark: .init(0xFF453A, 0.2))
  public static let esuissDangerSurfaceHover = Color.esuissAdaptive(light: .init(0xD70015, 0.12), dark: .init(0xFF453A, 0.3))
  public static let esuissDangerSurfacePressed = Color.esuissAdaptive(light: .init(0xD70015, 0.16), dark: .init(0xFF453A, 0.36))
  public static let esuissSuccess = Color.esuissAdaptive(light: .init(0x008009), dark: .init(0x30D158))
  public static let esuissSuccessSurface = Color.esuissAdaptive(light: .init(0xEFFAF1), dark: .init(0x30D158, 0.16))
  public static let esuissWarning = Color.esuissAdaptive(light: .init(0xB64400), dark: .init(0xFF9F0A))
  public static let esuissWarningSurface = Color.esuissAdaptive(light: .init(0xFFF5EA), dark: .init(0xFF9F0A, 0.16))
  public static let esuissBlue = Color.esuissAdaptive(light: .init(0x007AFF), dark: .init(0x0A84FF))
  public static let esuissGreen = Color.esuissAdaptive(light: .init(0x34C759), dark: .init(0x30D158))
  public static let esuissOrange = Color.esuissAdaptive(light: .init(0xFF9500), dark: .init(0xFF9F0A))
  public static let esuissRed = Color.esuissAdaptive(light: .init(0xFF3B30), dark: .init(0xFF453A))
  public static let esuissYellow = Color.esuissAdaptive(light: .init(0xFFCC00), dark: .init(0xFFD60A))
  public static let esuissPurple = Color.esuissAdaptive(light: .init(0xAF52DE), dark: .init(0xBF5AF2))
  public static let esuissPink = Color.esuissAdaptive(light: .init(0xFF2D55), dark: .init(0xFF375F))
  public static let esuissIndigo = Color.esuissAdaptive(light: .init(0x5856D6), dark: .init(0x5E5CE6))
  public static let esuissTeal = Color.esuissAdaptive(light: .init(0x30B0C7), dark: .init(0x40C8E0))
  public static let esuissMint = Color.esuissAdaptive(light: .init(0x00C7BE), dark: .init(0x66D4CF))
  public static let esuissCyan = Color.esuissAdaptive(light: .init(0x32ADE6), dark: .init(0x64D2FF))
  public static let esuissBrown = Color.esuissAdaptive(light: .init(0xA2845E), dark: .init(0xAC8E68))
  public static let esuissGray = Color.esuissAdaptive(light: .init(0x8E8E93), dark: .init(0x8E8E93))
}
