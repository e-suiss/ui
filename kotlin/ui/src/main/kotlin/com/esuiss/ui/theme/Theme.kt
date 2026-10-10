package com.esuiss.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

@Immutable
data class EsuissColors(
    val background: Color,
    val foreground: Color,
    val card: Color,
    val popover: Color,
    val primary: Color,
    val primaryForeground: Color,
    val secondary: Color,
    val muted: Color,
    val mutedForeground: Color,
    val accent: Color,
    val destructive: Color,
    val border: Color,
    val input: Color,
    val ring: Color,
    val isDark: Boolean,
)

val LightColors = EsuissColors(
    background = Color(0xFFFFFFFF),
    foreground = Color(0xFF000000),
    card = Color(0xFFFFFFFF),
    popover = Color(0xFFFFFFFF),
    primary = Color(0xFF0088FF),
    primaryForeground = Color(0xFFFFFFFF),
    secondary = Color(118, 118, 128).copy(alpha = 0.12f),
    muted = Color(0xFFF2F2F7),
    mutedForeground = Color(60, 60, 67).copy(alpha = 0.6f),
    accent = Color(118, 118, 128).copy(alpha = 0.12f),
    destructive = Color(0xFFFF383C),
    border = Color(60, 60, 67).copy(alpha = 0.12f),
    input = Color(0xFFC6C6C8),
    ring = Color(0xFF0088FF),
    isDark = false,
)

val DarkColors = EsuissColors(
    background = Color(0xFF000000),
    foreground = Color(0xFFFFFFFF),
    card = Color(0xFF1C1C1E),
    popover = Color(0xFF2C2C2E),
    primary = Color(0xFF0091FF),
    primaryForeground = Color(0xFFFFFFFF),
    secondary = Color(118, 118, 128).copy(alpha = 0.24f),
    muted = Color(0xFF1C1C1E),
    mutedForeground = Color(235, 235, 245).copy(alpha = 0.6f),
    accent = Color(118, 118, 128).copy(alpha = 0.24f),
    destructive = Color(0xFFFF4245),
    border = Color(84, 84, 88).copy(alpha = 0.5f),
    input = Color(0xFF38383A),
    ring = Color(0xFF0091FF),
    isDark = true,
)

object EsuissRadius {
    val sm = 7.2.dp
    val md = 9.6.dp
    val lg = 12.dp
    val xl = 16.8.dp
    val xl2 = 21.6.dp
    val xl3 = 26.4.dp
    val xl4 = 31.2.dp
}

val LocalEsuissColors = staticCompositionLocalOf { LightColors }

object EsuissTheme {
    val colors: EsuissColors
        @Composable get() = LocalEsuissColors.current
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
