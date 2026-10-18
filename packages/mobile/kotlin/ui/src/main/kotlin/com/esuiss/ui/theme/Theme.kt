package com.esuiss.ui.theme

import android.content.res.AssetManager
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.dropShadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.graphics.shadow.Shadow as DropShadow
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.LineHeightStyle
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.DpOffset
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

data class FontFile(val path: String, val weight: Int)

internal object LoadedFonts {
    var sans: FontFamily? = null
    var heading: FontFamily? = null

    fun load(assets: AssetManager) {
        if (sans == null && Fonts.sans.isNotEmpty()) sans = family(Fonts.sans, assets)
        if (heading == null && Fonts.heading.isNotEmpty()) heading = family(Fonts.heading, assets)
    }

    private fun family(files: List<FontFile>, assets: AssetManager) =
        FontFamily(files.map { Font(it.path, assets, FontWeight(it.weight)) })
}

internal val headingFontFamily: FontFamily?
    get() = LoadedFonts.heading ?: LoadedFonts.sans

internal fun textStyle(size: Double, lineHeight: Double) = TextStyle(
    fontFamily = LoadedFonts.sans,
    fontSize = size.sp,
    lineHeight = lineHeight.sp,
    lineHeightStyle = LineHeightStyle(
        alignment = LineHeightStyle.Alignment.Center,
        trim = LineHeightStyle.Trim.None,
    ),
)

@Immutable
data class ShadowLayer(
    val offsetX: Dp,
    val offsetY: Dp,
    val blur: Dp,
    val spread: Dp,
    val color: Color,
)

@Immutable
data class Shadow(val layers: List<ShadowLayer>) {
    constructor(vararg layers: ShadowLayer) : this(layers.toList())

    constructor(offsetX: Dp, offsetY: Dp, blur: Dp, color: Color) : this(ShadowLayer(offsetX, offsetY, blur, 0.dp, color))

    fun alpha(fraction: Float) = Shadow(layers.map { it.copy(color = it.color.copy(alpha = it.color.alpha * fraction)) })
}

fun Modifier.shadow(shadow: Shadow, shape: Shape): Modifier = shadow.layers.fold(this) { modifier, layer ->
    modifier.dropShadow(
        shape,
        DropShadow(
            radius = layer.blur,
            spread = layer.spread,
            color = layer.color,
            offset = DpOffset(layer.offsetX, layer.offsetY),
        ),
    )
}

val LocalColors = staticCompositionLocalOf { LightColors }

object EsuissTheme {
    val colors: Colors
        @Composable get() = LocalColors.current

    val typography: Typography
        get() = Typography

    val radius: Radius
        get() = Radius

    val shadows: Shadows
        get() = Shadows
}

@Composable
fun EsuissTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit,
) {
    LoadedFonts.load(LocalContext.current.assets)
    CompositionLocalProvider(
        LocalColors provides if (darkTheme) DarkColors else LightColors,
        content = content,
    )
}
