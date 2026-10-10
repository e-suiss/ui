package com.esuiss.ui.theme

import androidx.compose.runtime.Immutable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.graphics.shadow.Shadow
import androidx.compose.ui.draw.dropShadow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.DpOffset
import androidx.compose.ui.unit.dp

@Immutable
data class EsuissShadow(
    val offsetX: Dp,
    val offsetY: Dp,
    val blur: Dp,
    val color: Color,
)

object EsuissShadows {
    val md = EsuissShadow(2.dp, 4.dp, 12.dp, Color.Black.copy(alpha = 0.08f))
    val lg = EsuissShadow(0.dp, 4.dp, 24.dp, Color.Black.copy(alpha = 0.12f))
}

fun Modifier.esuissShadow(shadow: EsuissShadow, shape: Shape): Modifier = dropShadow(
    shape,
    Shadow(
        radius = shadow.blur,
        color = shadow.color,
        offset = DpOffset(shadow.offsetX, shadow.offsetY),
    ),
)
