package com.esuiss.ui.charts

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.esuiss.ui.components.Card
import com.esuiss.ui.components.CardContent
import com.esuiss.ui.components.CardHeader
import com.esuiss.ui.components.CardSize
import com.esuiss.ui.components.CardVariant
import com.esuiss.ui.theme.Colors
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Palette
import kotlin.math.min

private class RadialRingsRing(val label: String, val value: Double, val goal: Double, val color: Colors.() -> Color)

private val rings = listOf(
    RadialRingsRing("Move", 720.0, 600.0) { Palette.red500 },
    RadialRingsRing("Exercise", 62.0, 30.0) { Palette.green500 },
    RadialRingsRing("Stand", 12.0, 12.0) { Palette.cyan500 },
)

internal fun DrawScope.drawActivityRing(color: Color, radius: Float, bar: Float, progress: Float) {
    val center = Offset(size.width / 2, size.height / 2)
    val topLeft = Offset(center.x - radius, center.y - radius)
    val arc = Size(radius * 2, radius * 2)
    drawCircle(color.copy(alpha = color.alpha * 0.22f), radius, center, style = Stroke(bar))
    if (progress > 0.001f) {
        drawArc(color, -90f, 360f * progress, false, topLeft, arc, style = Stroke(bar, cap = StrokeCap.Round))
    }
}

@Composable
fun RadialChartRings(modifier: Modifier = Modifier) {
    val colors = EsuissTheme.colors
    Card(modifier, variant = CardVariant.Filled, size = CardSize.Sm) {
        CardHeader("Activity rings", description = "Move, exercise and stand")
        CardContent {
            Box(Modifier.fillMaxWidth(), contentAlignment = Alignment.Center) {
                RingsCanvas(
                    values = rings.map { min(1.0, it.value / it.goal).toFloat() },
                    colors = rings.map { it.color(colors) },
                    size = 200.dp,
                    bar = 16.dp,
                    gap = 2.dp,
                    modifier = Modifier.clearAndSetSemantics {
                        contentDescription = rings.joinToString(", ") { "${it.label} ${it.value.toInt()} of ${it.goal.toInt()}" }
                    },
                )
            }
        }
    }
}

@Composable
internal fun RingsCanvas(values: List<Float>, colors: List<Color>, size: Dp, bar: Dp, gap: Dp, modifier: Modifier = Modifier) {
    Canvas(modifier.size(size)) {
        val stroke = bar.toPx()
        values.forEachIndexed { index, progress ->
            val radius = this.size.width / 2 - stroke / 2 - index * (stroke + gap.toPx())
            drawActivityRing(colors[index], radius, stroke, progress.coerceIn(0f, 1f))
        }
    }
}
