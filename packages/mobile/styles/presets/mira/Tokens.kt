package com.esuiss.ui.theme

import androidx.compose.runtime.Immutable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
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
    val menu: Color,
    val menuForeground: Color,
    val menuMutedForeground: Color,
    val menuAccent: Color,
    val menuAccentForeground: Color,
    val menuBorder: Color,
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
    menu = Color(0xFFFFFFFF),
    menuForeground = Color(0xFF1D1D1F),
    menuMutedForeground = Color(0xFF6E6E73),
    menuAccent = Color(0xFF000000).copy(alpha = 0.06f),
    menuAccentForeground = Color(0xFF1D1D1F),
    menuBorder = Color(0xFFD2D2D7),
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
    menu = Color(0xFF1D1D1F),
    menuForeground = Color(0xFFF5F5F7),
    menuMutedForeground = Color(0xFFA1A1A6),
    menuAccent = Color(0xFFFFFFFF).copy(alpha = 0.1f),
    menuAccentForeground = Color(0xFFF5F5F7),
    menuBorder = Color(0xFF424245),
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
    val xs = textStyle(12.0, 16.0)
    val sm = textStyle(14.0, 20.0)
    val base = textStyle(16.0, 24.0)
    val lg = textStyle(18.0, 28.0)
    val xl = textStyle(20.0, 28.0)
    val xl2 = textStyle(24.0, 32.0)
    val xl3 = textStyle(30.0, 36.0)

    val all = listOf(xs, sm, base, lg, xl, xl2, xl3)
}

object Shadows {
    val md = Shadow(ShadowLayer(0.dp, 4.dp, 6.dp, (-1).dp, Color.Black.copy(alpha = 0.1f)), ShadowLayer(0.dp, 2.dp, 4.dp, (-2).dp, Color.Black.copy(alpha = 0.1f)))
    val lg = Shadow(ShadowLayer(0.dp, 10.dp, 15.dp, (-3).dp, Color.Black.copy(alpha = 0.1f)), ShadowLayer(0.dp, 4.dp, 6.dp, (-4).dp, Color.Black.copy(alpha = 0.1f)))
}

object Metrics {
    object Radius {
        val button = 8.dp
        val input = 8.dp
        val textarea = 8.dp
        val card = 10.dp
        val dialog = 14.dp
        val popover = 10.dp
        val menu = 10.dp
        val menuItem = 8.dp
        val badge = 9999.dp
        val checkbox = 4.dp
        val tabs = 10.dp
        val tabsTrigger = 8.dp
        val toggle = 8.dp
        val alert = 10.dp
        val item = 8.dp
    }

    object Height {
        val buttonXs = 20.dp
        val buttonSm = 24.dp
        val button = 28.dp
        val buttonLg = 32.dp
        val input = 28.dp
    }

    object PaddingX {
        val buttonXs = 8.dp
        val buttonSm = 8.dp
        val button = 8.dp
        val buttonLg = 10.dp
        val input = 8.dp
        val menuItem = 8.dp
    }

    object PaddingY {
        val menuItem = 4.dp
    }

    object Padding {
        val dialog = 16.dp
        val popover = 10.dp
        val menu = 4.dp
    }

    object Weight {
        val button = FontWeight.Medium
        val title = FontWeight.Medium
    }

    object Elevation {
        val card = Shadow()
        val dialog = Shadow()
        val popover = Shadow(ShadowLayer(0.dp, 4.dp, 6.dp, (-1).dp, Color.Black.copy(alpha = 0.1f)), ShadowLayer(0.dp, 2.dp, 4.dp, (-2).dp, Color.Black.copy(alpha = 0.1f)))
        val menu = Shadow(ShadowLayer(0.dp, 4.dp, 6.dp, (-1).dp, Color.Black.copy(alpha = 0.1f)), ShadowLayer(0.dp, 2.dp, 4.dp, (-2).dp, Color.Black.copy(alpha = 0.1f)))
    }
}
