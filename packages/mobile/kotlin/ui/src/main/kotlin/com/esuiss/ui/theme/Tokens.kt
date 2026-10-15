package com.esuiss.ui.theme

import androidx.compose.runtime.Immutable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

@Immutable
data class Colors(
    val background: Color,
    val foreground: Color,
    val card: Color,
    val cardForeground: Color,
    val popover: Color,
    val popoverForeground: Color,
    val primary: Color,
    val primaryForeground: Color,
    val secondary: Color,
    val secondaryForeground: Color,
    val muted: Color,
    val mutedForeground: Color,
    val accent: Color,
    val accentForeground: Color,
    val destructive: Color,
    val border: Color,
    val input: Color,
    val ring: Color,
    val chart1: Color,
    val chart2: Color,
    val chart3: Color,
    val chart4: Color,
    val chart5: Color,
    val sidebar: Color,
    val sidebarForeground: Color,
    val sidebarPrimary: Color,
    val sidebarPrimaryForeground: Color,
    val sidebarAccent: Color,
    val sidebarAccentForeground: Color,
    val sidebarBorder: Color,
    val sidebarRing: Color,
    val isDark: Boolean,
)

val LightColors = Colors(
    background = Color(0xFFFFFFFF),
    foreground = Color(0xFF1D1D1F),
    card = Color(0xFFFFFFFF),
    cardForeground = Color(0xFF1D1D1F),
    popover = Color(0xFFFFFFFF),
    popoverForeground = Color(0xFF1D1D1F),
    primary = Color(0xFF0071E3),
    primaryForeground = Color(0xFFFFFFFF),
    secondary = Color(0xFF000000).copy(alpha = 0.04f),
    secondaryForeground = Color(0xFF1D1D1F),
    muted = Color(0xFFF5F5F7),
    mutedForeground = Color(0xFF6E6E73),
    accent = Color(0xFF000000).copy(alpha = 0.06f),
    accentForeground = Color(0xFF1D1D1F),
    destructive = Color(0xFFD0000A),
    border = Color(0xFFD2D2D7),
    input = Color(0xFF86868B),
    ring = Color(0xFF0071E3),
    chart1 = Color(0xFF007AFF),
    chart2 = Color(0xFF30B0C7),
    chart3 = Color(0xFF5856D6),
    chart4 = Color(0xFFFF9500),
    chart5 = Color(0xFF8E8E93),
    sidebar = Color(0xFFF5F5F7),
    sidebarForeground = Color(0xFF1D1D1F),
    sidebarPrimary = Color(0xFF0071E3),
    sidebarPrimaryForeground = Color(0xFFFFFFFF),
    sidebarAccent = Color(0xFF000000).copy(alpha = 0.06f),
    sidebarAccentForeground = Color(0xFF1D1D1F),
    sidebarBorder = Color(0xFFD2D2D7),
    sidebarRing = Color(0xFF0071E3),
    isDark = false,
)

val DarkColors = Colors(
    background = Color(0xFF000000),
    foreground = Color(0xFFF5F5F7),
    card = Color(0xFF1D1D1F),
    cardForeground = Color(0xFFF5F5F7),
    popover = Color(0xFF1D1D1F),
    popoverForeground = Color(0xFFF5F5F7),
    primary = Color(0xFF2997FF),
    primaryForeground = Color(0xFFFFFFFF),
    secondary = Color(0xFFFFFFFF).copy(alpha = 0.1f),
    secondaryForeground = Color(0xFFF5F5F7),
    muted = Color(0xFF161617),
    mutedForeground = Color(0xFFA1A1A6),
    accent = Color(0xFFFFFFFF).copy(alpha = 0.1f),
    accentForeground = Color(0xFFF5F5F7),
    destructive = Color(0xFFFF5447),
    border = Color(0xFF424245),
    input = Color(0xFF6E6E73),
    ring = Color(0xFF0071E3),
    chart1 = Color(0xFF0A84FF),
    chart2 = Color(0xFF40C8E0),
    chart3 = Color(0xFF5E5CE6),
    chart4 = Color(0xFFFF9F0A),
    chart5 = Color(0xFF8E8E93),
    sidebar = Color(0xFF161617),
    sidebarForeground = Color(0xFFF5F5F7),
    sidebarPrimary = Color(0xFF2997FF),
    sidebarPrimaryForeground = Color(0xFFFFFFFF),
    sidebarAccent = Color(0xFFFFFFFF).copy(alpha = 0.1f),
    sidebarAccentForeground = Color(0xFFF5F5F7),
    sidebarBorder = Color(0xFF424245),
    sidebarRing = Color(0xFF0071E3),
    isDark = true,
)

object Palette {
    val black = Color(0xFF000000)
    val white = Color(0xFFFFFFFF)
    val red500 = Color(0xFFFB2C36)
    val orange500 = Color(0xFFFF6900)
    val amber400 = Color(0xFFFFB900)
    val amber500 = Color(0xFFFE9A00)
    val amber600 = Color(0xFFE17100)
    val yellow500 = Color(0xFFF0B100)
    val green400 = Color(0xFF05DF72)
    val green500 = Color(0xFF00C950)
    val green600 = Color(0xFF00A63E)
    val teal400 = Color(0xFF00D5BE)
    val teal500 = Color(0xFF00BBA7)
    val cyan500 = Color(0xFF00B8DB)
    val blue500 = Color(0xFF2B7FFF)
    val indigo500 = Color(0xFF615FFF)
    val purple500 = Color(0xFFAD46FF)
    val pink500 = Color(0xFFF6339A)
    val zinc500 = Color(0xFF71717B)
}

object Radius {
    val xs = 3.dp
    val sm = 5.dp
    val md = 8.dp
    val lg = 10.dp
    val xl = 12.dp
    val xl2 = 18.dp
    val xl3 = 28.dp
    val full = 9999.dp
}

object Typography {
    val xs3 = textStyle(11.0, 13.0, 0.006)
    val xs2 = textStyle(12.0, 16.0, 0.0)
    val xs = textStyle(13.0, 18.0, -0.006)
    val sm = textStyle(15.0, 20.0, -0.016)
    val md = textStyle(16.0, 21.0, -0.02)
    val base = textStyle(17.0, 22.0, -0.026)
    val lg = textStyle(20.0, 25.0, -0.023)
    val xl = textStyle(22.0, 28.0, -0.012)
    val xl2 = textStyle(28.0, 34.0, 0.014)
    val xl3 = textStyle(34.0, 41.0, 0.012)

    val all = listOf(xs3, xs2, xs, sm, md, base, lg, xl, xl2, xl3)
}

object Shadows {
    val md = Shadow(2.dp, 4.dp, 12.dp, Color.Black.copy(alpha = 0.08f))
    val lg = Shadow(0.dp, 4.dp, 24.dp, Color.Black.copy(alpha = 0.12f))
}
