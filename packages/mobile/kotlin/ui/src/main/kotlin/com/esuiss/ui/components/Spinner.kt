package com.esuiss.ui.components

import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.runtime.State
import androidx.compose.runtime.remember
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.rotate
import androidx.compose.ui.graphics.takeOrElse
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.ProgressBarRangeInfo
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.progressBarRangeInfo
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.esuiss.ui.theme.EsuissTheme
import kotlin.math.floor

internal const val SpinnerSpokes = 8

internal fun spinnerSpokeOpacity(index: Int): Float = 0.2f + 0.8f * index / (SpinnerSpokes - 1)

internal fun DrawScope.drawSpinnerSpokes(color: Color, rotation: Float = 0f, opacity: (Int) -> Float) {
    val unit = size.minDimension / 24f
    val center = Offset(size.width / 2f, size.height / 2f)
    rotate(rotation, center) {
        for (index in 0 until SpinnerSpokes) {
            val alpha = opacity(index).coerceIn(0f, 1f)
            if (alpha <= 0f) continue
            rotate(index * 360f / SpinnerSpokes, center) {
                drawRoundRect(
                    color = color,
                    topLeft = Offset(center.x - 1.56f * unit, center.y - 11.5f * unit),
                    size = Size(3.12f * unit, 7.2f * unit),
                    cornerRadius = CornerRadius(1.56f * unit),
                    alpha = alpha * color.alpha,
                )
            }
        }
    }
}

@Composable
fun Spinner(
    modifier: Modifier = Modifier,
    size: Dp = 16.dp,
    color: Color = Color.Unspecified,
    contentDescription: String = "Loading",
) {
    val tint = color.takeOrElse { LocalContentColor.current.takeOrElse { EsuissTheme.colors.foreground } }
    val reduced = formReducedMotion()
    val step: State<Float> = if (reduced) {
        remember { mutableFloatStateOf(0f) }
    } else {
        rememberInfiniteTransition(label = "spinner").animateFloat(
            initialValue = 0f,
            targetValue = SpinnerSpokes.toFloat(),
            animationSpec = infiniteRepeatable(tween(800, easing = LinearEasing), RepeatMode.Restart),
            label = "step",
        )
    }
    Canvas(
        modifier = modifier
            .size(size)
            .semantics {
                this.contentDescription = contentDescription
                progressBarRangeInfo = ProgressBarRangeInfo.Indeterminate
                liveRegion = LiveRegionMode.Polite
            },
    ) {
        val rotation = (floor(step.value) % SpinnerSpokes) * 360f / SpinnerSpokes
        drawSpinnerSpokes(tint, rotation) { spinnerSpokeOpacity(it) }
    }
}
