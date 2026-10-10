package com.esuiss.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color

@Immutable
data class EsuissColors(
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

val LightColors = EsuissColors(
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

val DarkColors = EsuissColors(
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

val LocalEsuissColors = staticCompositionLocalOf { LightColors }

object EsuissTheme {
    val colors: EsuissColors
        @Composable get() = LocalEsuissColors.current

    val typography: EsuissTypography
        get() = EsuissTypography

    val radius: EsuissRadius
        get() = EsuissRadius

    val shadows: EsuissShadows
        get() = EsuissShadows
}

@Composable
fun EsuissTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit,
) {
    CompositionLocalProvider(
        LocalEsuissColors provides if (darkTheme) DarkColors else LightColors,
        content = content,
    )
}
