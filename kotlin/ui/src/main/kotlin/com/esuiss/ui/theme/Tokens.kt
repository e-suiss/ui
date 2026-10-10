package com.esuiss.ui.theme

import androidx.compose.runtime.Immutable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

@Immutable
data class Colors(
    val surface: Color,
    val surfaceSecondary: Color,
    val surfaceTertiary: Color,
    val surfaceRaised: Color,
    val label: Color,
    val labelSecondary: Color,
    val labelTertiary: Color,
    val labelQuaternary: Color,
    val control: Color,
    val controlHover: Color,
    val controlPressed: Color,
    val controlSelected: Color,
    val controlDisabled: Color,
    val onControlSelected: Color,
    val itemHover: Color,
    val itemPressed: Color,
    val itemSelected: Color,
    val separator: Color,
    val separatorStrong: Color,
    val accent: Color,
    val accentHover: Color,
    val accentPressed: Color,
    val accentSelected: Color,
    val accentDisabled: Color,
    val onAccent: Color,
    val accentSurface: Color,
    val accentSurfaceHover: Color,
    val accentSurfacePressed: Color,
    val link: Color,
    val focus: Color,
    val scrim: Color,
    val danger: Color,
    val dangerSurface: Color,
    val dangerSurfaceHover: Color,
    val dangerSurfacePressed: Color,
    val success: Color,
    val successSurface: Color,
    val warning: Color,
    val warningSurface: Color,
    val blue: Color,
    val green: Color,
    val orange: Color,
    val red: Color,
    val yellow: Color,
    val purple: Color,
    val pink: Color,
    val indigo: Color,
    val teal: Color,
    val mint: Color,
    val cyan: Color,
    val brown: Color,
    val gray: Color,
    val isDark: Boolean,
)

val LightColors = Colors(
    surface = Color(0xFFFFFFFF),
    surfaceSecondary = Color(0xFFF5F5F7),
    surfaceTertiary = Color(0xFFE8E8ED),
    surfaceRaised = Color(0xFFFFFFFF),
    label = Color(0xFF1D1D1F),
    labelSecondary = Color(0xFF6E6E73),
    labelTertiary = Color(0xFF86868B),
    labelQuaternary = Color(0xFFD2D2D7),
    control = Color(0xFF000000).copy(alpha = 0.04f),
    controlHover = Color(0xFF000000).copy(alpha = 0.08f),
    controlPressed = Color(0xFF000000).copy(alpha = 0.12f),
    controlSelected = Color(0xFF1D1D1F),
    controlDisabled = Color(0xFF000000).copy(alpha = 0.03f),
    onControlSelected = Color(0xFFFFFFFF),
    itemHover = Color(0xFF000000).copy(alpha = 0.05f),
    itemPressed = Color(0xFF000000).copy(alpha = 0.08f),
    itemSelected = Color(0xFF000000).copy(alpha = 0.06f),
    separator = Color(0xFFD2D2D7),
    separatorStrong = Color(0xFF86868B),
    accent = Color(0xFF0071E3),
    accentHover = Color(0xFF0068D1),
    accentPressed = Color(0xFF005BB8),
    accentSelected = Color(0xFF0071E3),
    accentDisabled = Color(0xFF0071E3).copy(alpha = 0.4f),
    onAccent = Color(0xFFFFFFFF),
    accentSurface = Color(0xFF0071E3).copy(alpha = 0.09f),
    accentSurfaceHover = Color(0xFF0071E3).copy(alpha = 0.14f),
    accentSurfacePressed = Color(0xFF0071E3).copy(alpha = 0.18f),
    link = Color(0xFF0066CC),
    focus = Color(0xFF0071E3),
    scrim = Color(0xFF000000).copy(alpha = 0.48f),
    danger = Color(0xFFD0000A),
    dangerSurface = Color(0xFFD70015).copy(alpha = 0.08f),
    dangerSurfaceHover = Color(0xFFD70015).copy(alpha = 0.12f),
    dangerSurfacePressed = Color(0xFFD70015).copy(alpha = 0.16f),
    success = Color(0xFF008009),
    successSurface = Color(0xFFEFFAF1),
    warning = Color(0xFFB64400),
    warningSurface = Color(0xFFFFF5EA),
    blue = Color(0xFF007AFF),
    green = Color(0xFF34C759),
    orange = Color(0xFFFF9500),
    red = Color(0xFFFF3B30),
    yellow = Color(0xFFFFCC00),
    purple = Color(0xFFAF52DE),
    pink = Color(0xFFFF2D55),
    indigo = Color(0xFF5856D6),
    teal = Color(0xFF30B0C7),
    mint = Color(0xFF00C7BE),
    cyan = Color(0xFF32ADE6),
    brown = Color(0xFFA2845E),
    gray = Color(0xFF8E8E93),
    isDark = false,
)

val DarkColors = Colors(
    surface = Color(0xFF000000),
    surfaceSecondary = Color(0xFF161617),
    surfaceTertiary = Color(0xFF2C2C2E),
    surfaceRaised = Color(0xFF1D1D1F),
    label = Color(0xFFF5F5F7),
    labelSecondary = Color(0xFFA1A1A6),
    labelTertiary = Color(0xFF86868B),
    labelQuaternary = Color(0xFF424245),
    control = Color(0xFFFFFFFF).copy(alpha = 0.1f),
    controlHover = Color(0xFFFFFFFF).copy(alpha = 0.16f),
    controlPressed = Color(0xFFFFFFFF).copy(alpha = 0.22f),
    controlSelected = Color(0xFFF5F5F7),
    controlDisabled = Color(0xFFFFFFFF).copy(alpha = 0.05f),
    onControlSelected = Color(0xFF000000),
    itemHover = Color(0xFFFFFFFF).copy(alpha = 0.08f),
    itemPressed = Color(0xFFFFFFFF).copy(alpha = 0.12f),
    itemSelected = Color(0xFFFFFFFF).copy(alpha = 0.1f),
    separator = Color(0xFF424245),
    separatorStrong = Color(0xFF6E6E73),
    accent = Color(0xFF0071E3),
    accentHover = Color(0xFF005EBE),
    accentPressed = Color(0xFF004D9E),
    accentSelected = Color(0xFF0071E3),
    accentDisabled = Color(0xFF0071E3).copy(alpha = 0.4f),
    onAccent = Color(0xFFFFFFFF),
    accentSurface = Color(0xFF0071E3).copy(alpha = 0.18f),
    accentSurfaceHover = Color(0xFF0071E3).copy(alpha = 0.24f),
    accentSurfacePressed = Color(0xFF0071E3).copy(alpha = 0.3f),
    link = Color(0xFF2997FF),
    focus = Color(0xFF0071E3),
    scrim = Color(0xFF000000).copy(alpha = 0.48f),
    danger = Color(0xFFFF5447),
    dangerSurface = Color(0xFFFF453A).copy(alpha = 0.2f),
    dangerSurfaceHover = Color(0xFFFF453A).copy(alpha = 0.3f),
    dangerSurfacePressed = Color(0xFFFF453A).copy(alpha = 0.36f),
    success = Color(0xFF30D158),
    successSurface = Color(0xFF30D158).copy(alpha = 0.16f),
    warning = Color(0xFFFF9F0A),
    warningSurface = Color(0xFFFF9F0A).copy(alpha = 0.16f),
    blue = Color(0xFF0A84FF),
    green = Color(0xFF30D158),
    orange = Color(0xFFFF9F0A),
    red = Color(0xFFFF453A),
    yellow = Color(0xFFFFD60A),
    purple = Color(0xFFBF5AF2),
    pink = Color(0xFFFF375F),
    indigo = Color(0xFF5E5CE6),
    teal = Color(0xFF40C8E0),
    mint = Color(0xFF66D4CF),
    cyan = Color(0xFF64D2FF),
    brown = Color(0xFFAC8E68),
    gray = Color(0xFF8E8E93),
    isDark = true,
)

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
