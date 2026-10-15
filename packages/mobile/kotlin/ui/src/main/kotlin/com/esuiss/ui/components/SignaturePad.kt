package com.esuiss.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.gestures.awaitEachGesture
import androidx.compose.foundation.gestures.awaitFirstDown
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.ImageBitmap
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.CanvasDrawScope
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.Canvas as GraphicsCanvas
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.layout
import androidx.compose.ui.input.pointer.positionChange
import androidx.compose.ui.semantics.CustomAccessibilityAction
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.customActions
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.unit.Density
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography
import java.util.Locale

@Immutable
class SignatureStroke(val points: List<Offset>)

fun List<SignatureStroke>.toPath(scale: Float = 1f): Path {
    val path = Path()
    forEach { stroke ->
        val points = stroke.points
        if (points.isEmpty()) return@forEach
        val first = points.first() * scale
        path.moveTo(first.x, first.y)
        if (points.size == 1) {
            path.lineTo(first.x + 0.01f, first.y)
            return@forEach
        }
        for (i in 1 until points.size) {
            val previous = points[i - 1] * scale
            val current = points[i] * scale
            val middle = (previous + current) / 2f
            if (i == 1) path.lineTo(middle.x, middle.y) else path.quadraticTo(previous.x, previous.y, middle.x, middle.y)
        }
        val last = points.last() * scale
        path.lineTo(last.x, last.y)
    }
    return path
}

fun List<SignatureStroke>.toSvg(width: Float, height: Float, strokeWidth: Float = 3f, color: String = "#000000"): String {
    fun format(value: Float) = String.format(Locale.US, "%.1f", value)
    val paths = joinToString("") { stroke ->
        val points = stroke.points
        if (points.isEmpty()) return@joinToString ""
        val data = StringBuilder("M${format(points[0].x)} ${format(points[0].y)}")
        if (points.size == 1) data.append(" l0.01 0")
        for (i in 1 until points.size) {
            val previous = points[i - 1]
            val middle = (previous + points[i]) / 2f
            if (i == 1) data.append(" L${format(middle.x)} ${format(middle.y)}")
            else data.append(" Q${format(previous.x)} ${format(previous.y)} ${format(middle.x)} ${format(middle.y)}")
        }
        if (points.size > 1) data.append(" L${format(points.last().x)} ${format(points.last().y)}")
        "<path d=\"$data\"/>"
    }
    return "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 ${format(width)} ${format(height)}\" width=\"${format(width)}\" height=\"${format(height)}\">" +
        "<g fill=\"none\" stroke=\"$color\" stroke-width=\"${format(strokeWidth)}\" stroke-linecap=\"round\" stroke-linejoin=\"round\">$paths</g></svg>"
}

fun List<SignatureStroke>.toImageBitmap(
    width: Dp,
    height: Dp,
    density: Density,
    color: Color = Color.Black,
    strokeWidth: Dp = 3.dp,
    background: Color = Color.Transparent,
): ImageBitmap {
    val bitmap = with(density) { ImageBitmap(width.roundToPx().coerceAtLeast(1), height.roundToPx().coerceAtLeast(1)) }
    val scope = CanvasDrawScope()
    val size = Size(bitmap.width.toFloat(), bitmap.height.toFloat())
    scope.draw(density, LayoutDirection.Ltr, GraphicsCanvas(bitmap), size) {
        if (background != Color.Transparent) drawRect(background)
        drawSignature(this@toImageBitmap, density.density, color, strokeWidth.toPx())
    }
    return bitmap
}

private fun DrawScope.drawSignature(strokes: List<SignatureStroke>, scale: Float, color: Color, width: Float) {
    drawPath(strokes.toPath(scale), color, style = Stroke(width, cap = StrokeCap.Round, join = StrokeJoin.Round))
}

@Composable
fun SignaturePad(
    modifier: Modifier = Modifier,
    value: List<SignatureStroke>? = null,
    onValueChange: ((List<SignatureStroke>) -> Unit)? = null,
    defaultValue: List<SignatureStroke> = emptyList(),
    strokeWidth: Dp = 3.dp,
    enabled: Boolean = true,
    placeholder: String = "Sign here",
    clearLabel: String = "Clear",
    showClearButton: Boolean = true,
) {
    val colors = EsuissTheme.colors
    var uncontrolled by remember { mutableStateOf(defaultValue) }
    val strokes = value ?: uncontrolled
    val latest by rememberUpdatedState(strokes)
    val change by rememberUpdatedState<(List<SignatureStroke>) -> Unit>({ next ->
        if (value == null) uncontrolled = next
        onValueChange?.invoke(next)
    })
    val live = remember { mutableStateListOf<Offset>() }
    val empty = strokes.isEmpty() && live.isEmpty()
    val shape = RoundedCornerShape(Radius.xl)
    val ink = colors.foreground
    val guide = colors.input
    Box(
        modifier = modifier
            .fillMaxWidth()
            .height(200.dp)
            .alpha(if (enabled) 1f else 0.5f)
            .clip(shape)
            .background(colors.background, shape)
            .border(1.dp, colors.border, shape)
            .semantics {
                contentDescription = "Signature pad"
                stateDescription = if (strokes.isEmpty()) "Empty" else "Signed"
                if (enabled && strokes.isNotEmpty()) {
                    customActions = listOf(
                        CustomAccessibilityAction(clearLabel) {
                            change(emptyList())
                            true
                        },
                    )
                }
            },
    ) {
        Canvas(
            modifier = Modifier
                .matchParentSize()
                .then(
                    if (!enabled) {
                        Modifier
                    } else {
                        Modifier.pointerInput(Unit) {
                            awaitEachGesture {
                                val down = awaitFirstDown()
                                down.consume()
                                val scale = density
                                live.clear()
                                live.add(down.position / scale)
                                while (true) {
                                    val event = awaitPointerEvent()
                                    val pointer = event.changes.firstOrNull { it.id == down.id } ?: break
                                    if (!pointer.pressed) break
                                    if (pointer.positionChange() != Offset.Zero) {
                                        live.add(pointer.position / scale)
                                        pointer.consume()
                                    }
                                }
                                val stroke = SignatureStroke(live.toList())
                                live.clear()
                                change(latest + stroke)
                            }
                        }
                    },
                ),
        ) {
            val inset = 24.dp.toPx()
            val baseline = size.height * 0.72f
            drawLine(
                guide,
                Offset(inset, baseline),
                Offset(size.width - inset, baseline),
                strokeWidth = 1.dp.toPx(),
                pathEffect = PathEffect.dashPathEffect(floatArrayOf(4.dp.toPx(), 4.dp.toPx())),
            )
            val width = strokeWidth.toPx()
            drawSignature(strokes, density, ink, width)
            if (live.isNotEmpty()) drawSignature(listOf(SignatureStroke(live.toList())), density, ink, width)
        }
        if (empty) {
            BasicText(
                placeholder,
                modifier = Modifier.layout { measurable, constraints ->
                    val placeable = measurable.measure(constraints.copy(minWidth = 0, minHeight = 0))
                    layout(constraints.maxWidth, constraints.maxHeight) {
                        placeable.place(24.dp.roundToPx(), (constraints.maxHeight * 0.72f).toInt() + 8.dp.roundToPx())
                    }
                },
                style = Typography.sm.copy(color = colors.mutedForeground),
            )
        }
        if (showClearButton && enabled && strokes.isNotEmpty()) {
            Button(
                text = clearLabel,
                onClick = { change(emptyList()) },
                modifier = Modifier
                    .align(Alignment.TopEnd)
                    .padding(8.dp),
                variant = ButtonVariant.Ghost,
                size = ButtonSize.Sm,
            )
        }
    }
}
