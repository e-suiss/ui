package com.esuiss.ui.components

import android.provider.Settings
import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.gestures.Orientation
import androidx.compose.foundation.text.selection.TextSelectionColors
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawWithContent
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.layout.Layout
import androidx.compose.ui.layout.layout
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.Constraints
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.constrainHeight
import androidx.compose.ui.unit.constrainWidth
import androidx.compose.ui.unit.dp
import com.esuiss.ui.theme.Colors
import com.esuiss.ui.theme.Shadow

internal val FormShadowXs = Shadow(0.dp, 1.dp, 2.dp, Color.Black.copy(alpha = 0.05f))

internal val FormShadowSm = Shadow(0.dp, 1.dp, 3.dp, Color.Black.copy(alpha = 0.1f))

internal val FormEasing = CubicBezierEasing(0.32f, 0.72f, 0f, 1f)

internal fun Modifier.formTouchTarget(): Modifier = layout { measurable, constraints ->
    val minimum = 48.dp.roundToPx()
    val placeable = measurable.measure(constraints)
    val width = constraints.constrainWidth(maxOf(placeable.width, minimum))
    val height = constraints.constrainHeight(maxOf(placeable.height, minimum))
    layout(width, height) {
        placeable.place((width - placeable.width) / 2, (height - placeable.height) / 2)
    }
}

@Composable
internal fun formReducedMotion(): Boolean {
    val context = LocalContext.current
    return remember(context) {
        Settings.Global.getFloat(context.contentResolver, Settings.Global.ANIMATOR_DURATION_SCALE, 1f) == 0f
    }
}

internal fun formSelectionColors(colors: Colors) = TextSelectionColors(
    handleColor = colors.accent,
    backgroundColor = colors.accent.copy(alpha = 0.3f),
)

internal fun Modifier.formInputSurface(
    colors: Colors,
    shape: Shape,
    focused: Boolean,
    invalid: Boolean,
    enabled: Boolean,
): Modifier {
    val background = when {
        !enabled -> colors.controlDisabled
        invalid -> colors.danger.copy(alpha = if (colors.isDark) 0.1f else 0.05f)
        else -> colors.control
    }
    val border = when {
        invalid -> colors.danger
        focused -> colors.focus
        else -> Color.Transparent
    }
    return clip(shape).background(background, shape).border(1.dp, border, shape)
}

@Composable
internal fun FormDividedStack(
    orientation: Orientation,
    dividerColor: Color,
    modifier: Modifier = Modifier,
    dividerInsetStart: Dp = 0.dp,
    content: @Composable () -> Unit,
) {
    val boundaries = remember { mutableStateOf(IntArray(0)) }
    val vertical = orientation == Orientation.Vertical
    Layout(
        content = content,
        modifier = modifier.drawWithContent {
            drawContent()
            val stroke = 1.dp.toPx()
            val inset = dividerInsetStart.toPx()
            boundaries.value.forEach { position ->
                if (vertical) {
                    val start = if (layoutDirection == LayoutDirection.Rtl) 0f else inset
                    drawRect(dividerColor, Offset(start, position.toFloat()), Size(size.width - inset, stroke))
                } else {
                    val x = if (layoutDirection == LayoutDirection.Rtl) size.width - position - stroke else position.toFloat()
                    drawRect(dividerColor, Offset(x, 0f), Size(stroke, size.height))
                }
            }
        },
    ) { measurables, constraints ->
        if (vertical) {
            val width = if (constraints.hasFixedWidth) {
                constraints.maxWidth
            } else {
                constraints.constrainWidth(measurables.maxOfOrNull { it.maxIntrinsicWidth(Constraints.Infinity) } ?: 0)
            }
            val placeables = measurables.map {
                it.measure(Constraints(minWidth = width, maxWidth = width))
            }
            val offsets = IntArray(placeables.size)
            var y = 0
            placeables.forEachIndexed { index, placeable ->
                offsets[index] = y
                y += placeable.height
            }
            val next = offsets.drop(1).toIntArray()
            if (!next.contentEquals(boundaries.value)) boundaries.value = next
            layout(width, constraints.constrainHeight(y)) {
                placeables.forEachIndexed { index, placeable -> placeable.placeRelative(0, offsets[index]) }
            }
        } else {
            val height = if (constraints.hasFixedHeight) {
                constraints.maxHeight
            } else {
                constraints.constrainHeight(measurables.maxOfOrNull { it.maxIntrinsicHeight(Constraints.Infinity) } ?: 0)
            }
            val placeables = measurables.map {
                it.measure(Constraints(minHeight = height, maxHeight = height))
            }
            val offsets = IntArray(placeables.size)
            var x = 0
            placeables.forEachIndexed { index, placeable ->
                offsets[index] = x
                x += placeable.width
            }
            val next = offsets.drop(1).toIntArray()
            if (!next.contentEquals(boundaries.value)) boundaries.value = next
            layout(constraints.constrainWidth(x), height) {
                placeables.forEachIndexed { index, placeable -> placeable.placeRelative(offsets[index], 0) }
            }
        }
    }
}
