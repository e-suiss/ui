package com.esuiss.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.Orientation
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.Stable
import androidx.compose.runtime.compositionLocalOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.draw.drawWithContent
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.RectangleShape
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.translate
import androidx.compose.ui.graphics.drawOutline
import androidx.compose.ui.graphics.takeOrElse
import androidx.compose.ui.layout.Layout
import androidx.compose.ui.layout.Placeable
import androidx.compose.ui.layout.layout
import androidx.compose.ui.layout.layoutId
import androidx.compose.ui.semantics.isTraversalGroup
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.Constraints
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.constrainHeight
import androidx.compose.ui.unit.constrainWidth
import androidx.compose.ui.unit.dp
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography

enum class ButtonGroupOrientation { Horizontal, Vertical }

@Stable
internal class ButtonGroupState(val orientation: ButtonGroupOrientation) {
    var nested by mutableIntStateOf(0)
    var outlined by mutableIntStateOf(0)
}

internal val LocalButtonGroup = compositionLocalOf<ButtonGroupState?> { null }

internal object ButtonGroupFill

private object ButtonGroupDivider

internal fun ButtonGroupState?.itemShape(default: Shape): Shape = if (this == null) default else RectangleShape

internal fun Modifier.buttonGroupEdge(group: ButtonGroupState?, color: Color): Modifier {
    if (group == null) return this
    return drawBehind {
        val stroke = 1.dp.toPx()
        if (group.orientation == ButtonGroupOrientation.Horizontal) {
            val x = if (layoutDirection == LayoutDirection.Rtl) 0f else size.width - stroke
            drawRect(color, Offset(x, 0f), Size(stroke, size.height))
        } else {
            drawRect(color, Offset(0f, size.height - stroke), Size(size.width, stroke))
        }
    }
}

@Composable
internal fun RegisterButtonGroupOutline(group: ButtonGroupState?, outlined: Boolean) {
    DisposableEffect(group, outlined) {
        if (group != null && outlined) group.outlined += 1
        onDispose {
            if (group != null && outlined) group.outlined -= 1
        }
    }
}

@Composable
fun ButtonGroup(
    modifier: Modifier = Modifier,
    orientation: ButtonGroupOrientation = ButtonGroupOrientation.Horizontal,
    content: @Composable () -> Unit,
) {
    val parent = LocalButtonGroup.current
    DisposableEffect(parent) {
        parent?.let { it.nested += 1 }
        onDispose { parent?.let { it.nested -= 1 } }
    }
    val state = remember(orientation) { ButtonGroupState(orientation) }
    val colors = EsuissTheme.colors
    val joined = state.nested == 0
    val horizontal = orientation == ButtonGroupOrientation.Horizontal
    val shape = if (horizontal) CircleShape else RoundedCornerShape(Radius.xl2)
    val outline = colors.separator
    Layout(
        content = {
            CompositionLocalProvider(LocalButtonGroup provides state, content = content)
        },
        modifier = modifier
            .semantics { isTraversalGroup = true }
            .then(
                if (joined) {
                    Modifier
                        .clip(shape)
                        .drawWithContent {
                            drawContent()
                            if (state.outlined > 0) {
                                val stroke = 1.dp.toPx()
                                val inset = stroke / 2
                                val path = shape.createOutline(
                                    Size(size.width - stroke, size.height - stroke),
                                    layoutDirection,
                                    this,
                                )
                                translate(inset, inset) {
                                    drawOutline(path, outline, style = Stroke(stroke))
                                }
                            }
                        }
                } else {
                    Modifier
                },
            ),
    ) { measurables, constraints ->
        val gap = if (joined) 0 else 8.dp.roundToPx()
        val items = measurables.filter { it.layoutId != ButtonGroupDivider }
        if (horizontal) {
            val height = if (constraints.hasFixedHeight) {
                constraints.maxHeight
            } else {
                constraints.constrainHeight(items.maxOfOrNull { it.maxIntrinsicHeight(Constraints.Infinity) } ?: 0)
            }
            val fills = measurables.count { it.layoutId == ButtonGroupFill }
            val placeables = arrayOfNulls<Placeable>(measurables.size)
            var used = 0
            measurables.forEachIndexed { index, measurable ->
                if (measurable.layoutId != ButtonGroupFill) {
                    val placeable = measurable.measure(Constraints(minHeight = height, maxHeight = height))
                    placeables[index] = placeable
                    used += placeable.width
                }
            }
            val gaps = gap * (items.size - 1).coerceAtLeast(0)
            val remaining = if (constraints.hasBoundedWidth) {
                (constraints.maxWidth - used - gaps).coerceAtLeast(0)
            } else {
                0
            }
            measurables.forEachIndexed { index, measurable ->
                if (measurable.layoutId == ButtonGroupFill) {
                    val placeable = if (constraints.hasBoundedWidth) {
                        val width = remaining / fills
                        measurable.measure(Constraints(width, width, height, height))
                    } else {
                        measurable.measure(Constraints(minHeight = height, maxHeight = height))
                    }
                    placeables[index] = placeable
                    used += placeable.width
                }
            }
            val width = constraints.constrainWidth(used + gaps)
            layout(width, height) {
                var x = 0
                measurables.forEachIndexed { index, measurable ->
                    val placeable = placeables[index] ?: return@forEachIndexed
                    val divider = measurable.layoutId == ButtonGroupDivider
                    placeable.placeRelative(x, 0, zIndex = if (divider) 1f else 0f)
                    if (!divider) x += placeable.width + gap
                }
            }
        } else {
            val width = if (constraints.hasFixedWidth) {
                constraints.maxWidth
            } else {
                constraints.constrainWidth(items.maxOfOrNull { it.maxIntrinsicWidth(Constraints.Infinity) } ?: 0)
            }
            val placeables = measurables.map { it.measure(Constraints(minWidth = width, maxWidth = width)) }
            val gaps = gap * (items.size - 1).coerceAtLeast(0)
            val height = constraints.constrainHeight(
                placeables.filterIndexed { index, _ -> measurables[index].layoutId != ButtonGroupDivider }.sumOf { it.height } + gaps,
            )
            layout(width, height) {
                var y = 0
                measurables.forEachIndexed { index, measurable ->
                    val divider = measurable.layoutId == ButtonGroupDivider
                    placeables[index].placeRelative(0, y, zIndex = if (divider) 1f else 0f)
                    if (!divider) y += placeables[index].height + gap
                }
            }
        }
    }
}

@Composable
fun ButtonGroupText(
    modifier: Modifier = Modifier,
    content: @Composable RowScope.() -> Unit,
) {
    val colors = EsuissTheme.colors
    val shape = LocalButtonGroup.current.itemShape(CircleShape)
    Row(
        modifier = modifier
            .clip(shape)
            .background(colors.control, shape)
            .padding(horizontal = 10.dp),
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        CompositionLocalProvider(
            LocalButtonGroup provides null,
            LocalContentStyle provides Typography.sm.copy(color = colors.label),
            LocalContentColor provides colors.label,
            LocalIconSize provides 16.dp,
        ) {
            content()
        }
    }
}

@Composable
fun ButtonGroupSeparator(
    modifier: Modifier = Modifier,
    orientation: Orientation = Orientation.Vertical,
    color: Color = Color.Unspecified,
) {
    val line = color.takeOrElse { EsuissTheme.colors.label.copy(alpha = 0.2f) }
    Box(
        modifier = modifier
            .layoutId(ButtonGroupDivider)
            .then(
                if (orientation == Orientation.Vertical) {
                    Modifier.layout { measurable, constraints ->
                        val placeable = measurable.measure(constraints.copy(minWidth = 0, maxWidth = 0))
                        layout(0, placeable.height) { placeable.place(0, 0) }
                    }
                } else {
                    Modifier.layout { measurable, constraints ->
                        val placeable = measurable.measure(constraints.copy(minHeight = 0, maxHeight = 0))
                        layout(placeable.width, 0) { placeable.place(0, 0) }
                    }
                },
            )
            .drawBehind {
                val stroke = 1.dp.toPx()
                val inset = 9.dp.toPx()
                if (orientation == Orientation.Vertical) {
                    val x = if (layoutDirection == LayoutDirection.Rtl) -stroke else 0f
                    drawRect(line, Offset(x, inset), Size(stroke, (size.height - inset * 2).coerceAtLeast(0f)))
                } else {
                    drawRect(line, Offset(inset, 0f), Size((size.width - inset * 2).coerceAtLeast(0f), stroke))
                }
            },
    )
}
