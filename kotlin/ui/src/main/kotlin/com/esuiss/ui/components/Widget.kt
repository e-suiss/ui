package com.esuiss.ui.components

import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.snap
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.Stable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.setValue
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.draw.drawWithContent
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.Layout
import androidx.compose.ui.layout.Placeable
import androidx.compose.ui.layout.layoutId
import androidx.compose.ui.semantics.CustomAccessibilityAction
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.customActions
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.constrainHeight
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.em
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography

enum class WidgetSize(val width: Dp, val height: Dp, internal val label: String) {
    Auto(0.dp, 0.dp, "auto"),
    Small(168.dp, 168.dp, "small"),
    Medium(352.dp, 168.dp, "medium"),
    Large(352.dp, 352.dp, "large"),
    ExtraLarge(720.dp, 352.dp, "extra large"),
}

enum class WidgetHandlePlacement { Inside, Outside }

enum class WidgetAlign { Start, Center }

enum class WidgetIconSize { Default, Sm, Lg }

@Stable
interface WidgetScope {
    val size: WidgetSize
}

private class WidgetScopeImpl(override val size: WidgetSize) : WidgetScope

private val LocalWidgetAlign = staticCompositionLocalOf { WidgetAlign.Start }

private val DefaultWidgetSizes = listOf(WidgetSize.Small, WidgetSize.Medium, WidgetSize.Large, WidgetSize.ExtraLarge)

private const val WidgetStretch = 48f

private fun nearestSize(width: Float, height: Float, sizes: List<WidgetSize>): WidgetSize? =
    sizes.minByOrNull {
        val dx = width - it.width.value
        val dy = height - it.height.value
        dx * dx + dy * dy
    }

private fun sizesThatFit(sizes: List<WidgetSize>, room: Dp): List<WidgetSize> {
    val fixed = sizes.filter { it != WidgetSize.Auto }
    val fitting = fixed.filter { it.width <= room }
    if (fitting.isNotEmpty()) return fitting
    return listOfNotNull(fixed.minByOrNull { it.width })
}

private object WidgetContentSlot

private object WidgetFooterSlot

private object WidgetActionSlot

@Composable
fun Widget(
    modifier: Modifier = Modifier,
    size: WidgetSize? = null,
    defaultSize: WidgetSize? = null,
    onSizeChange: ((WidgetSize) -> Unit)? = null,
    sizes: List<WidgetSize> = DefaultWidgetSizes,
    resizable: Boolean = false,
    handle: WidgetHandlePlacement = WidgetHandlePlacement.Outside,
    align: WidgetAlign = WidgetAlign.Start,
    content: @Composable WidgetScope.() -> Unit,
) {
    val initial = defaultSize ?: if (resizable) WidgetSize.Small else WidgetSize.Auto
    var uncontrolled by remember { mutableStateOf(initial) }
    val current = size ?: uncontrolled
    val sizeChange by rememberUpdatedState(onSizeChange)
    val select: (WidgetSize) -> Unit = { next ->
        if (size == null) uncontrolled = next
        sizeChange?.invoke(next)
    }
    BoxWithConstraints {
        val room = maxWidth
        val reachable = sizesThatFit(sizes, room)
        var drag by remember { mutableStateOf<Offset?>(null) }
        var preview by remember { mutableStateOf<WidgetSize?>(null) }
        val haptics = rememberHaptics()
        val reduced = formReducedMotion()
        val auto = current == WidgetSize.Auto
        val targetWidth = if (auto) room else minOf(current.width, room)
        val targetHeight = current.height
        val dragging = drag != null
        val spec = if (dragging || reduced) snap<Dp>() else tween(500, easing = FormEasing)
        val boundsWidth = reachable.maxOfOrNull { it.width } ?: WidgetSize.Small.width
        val boundsHeight = reachable.maxOfOrNull { it.height } ?: WidgetSize.Small.height
        val dragWidth = drag?.let {
            (targetWidth.value + it.x).coerceIn(WidgetSize.Small.width.value, minOf(boundsWidth.value + WidgetStretch, room.value)).dp
        }
        val dragHeight = drag?.let {
            (targetHeight.value + it.y).coerceIn(WidgetSize.Small.height.value, boundsHeight.value + WidgetStretch).dp
        }
        val width by animateDpAsState(dragWidth ?: targetWidth, spec, label = "width")
        val height by animateDpAsState(dragHeight ?: targetHeight, spec, label = "height")
        val colors = EsuissTheme.colors
        val surface = @Composable {
            WidgetSurface(
                modifier = modifier
                    .then(if (auto && !resizable) Modifier.fillMaxWidth() else Modifier.size(width, height)),
                size = current,
                align = align,
                content = content,
            )
        }
        if (!resizable) {
            surface()
            return@BoxWithConstraints
        }
        val accent = colors.accent
        val idle = colors.labelQuaternary
        val outline = colors.label.copy(alpha = 0.25f)
        Box(
            modifier = Modifier.drawWithContent {
                drawContent()
                val shown = preview ?: return@drawWithContent
                val stroke = 1.dp.toPx()
                drawRoundRect(
                    color = outline,
                    size = Size(minOf(shown.width, room).toPx(), shown.height.toPx()),
                    cornerRadius = CornerRadius(28.dp.toPx()),
                    style = Stroke(stroke, pathEffect = PathEffect.dashPathEffect(floatArrayOf(3.dp.toPx(), 3.dp.toPx())), cap = StrokeCap.Round),
                )
            },
        ) {
            surface()
            val outside = handle == WidgetHandlePlacement.Outside
            Box(
                modifier = Modifier
                    .offset { IntOffset((width - 48.dp).roundToPx(), (height - 48.dp).roundToPx()) }
                    .size(48.dp)
                    .drawBehind {
                        val corner = 28.dp.toPx()
                        val radius = (if (outside) 33.dp else 22.dp).toPx()
                        val center = Offset(this.size.width - corner, this.size.height - corner)
                        drawArc(
                            color = if (dragging) accent else idle,
                            startAngle = 24.9f,
                            sweepAngle = 40.2f,
                            useCenter = false,
                            topLeft = center - Offset(radius, radius),
                            size = Size(radius * 2, radius * 2),
                            style = Stroke(4.dp.toPx(), cap = StrokeCap.Round),
                        )
                    }
                    .semantics {
                        contentDescription = "Resize widget"
                        stateDescription = current.label
                        customActions = reachable.filter { it != current }.map { option ->
                            CustomAccessibilityAction("Resize to ${option.label}") {
                                select(option)
                                true
                            }
                        }
                    }
                    .pointerInput(initial) {
                        detectTapGestures(onDoubleTap = { select(initial) })
                    }
                    .pointerInput(reachable, current, targetWidth) {
                        var last: WidgetSize? = null
                        detectDragGestures(
                            onDragStart = {
                                last = null
                                drag = Offset.Zero
                            },
                            onDrag = { change, amount ->
                                change.consume()
                                val next = (drag ?: Offset.Zero) + Offset(amount.x / density, amount.y / density)
                                drag = next
                                val nearest = nearestSize(targetWidth.value + next.x, targetHeight.value + next.y, reachable)
                                if (nearest != last) {
                                    if (last != null || nearest != current) haptics.selection()
                                    last = nearest
                                    preview = nearest
                                }
                            },
                            onDragEnd = {
                                drag = null
                                preview = null
                                val chosen = last
                                if (chosen != null && chosen != current) select(chosen)
                            },
                            onDragCancel = {
                                drag = null
                                preview = null
                            },
                        )
                    },
            )
        }
    }
}

@Composable
private fun WidgetSurface(
    modifier: Modifier,
    size: WidgetSize,
    align: WidgetAlign,
    content: @Composable WidgetScope.() -> Unit,
) {
    val colors = EsuissTheme.colors
    val shape = RoundedCornerShape(Radius.xl3)
    val scope = remember(size) { WidgetScopeImpl(size) }
    val center = align == WidgetAlign.Center
    CompositionLocalProvider(
        LocalWidgetAlign provides align,
        LocalContentStyle provides Typography.base.copy(color = colors.label, textAlign = if (center) TextAlign.Center else TextAlign.Unspecified),
        LocalContentColor provides colors.label,
    ) {
        Layout(
            content = { scope.content() },
            modifier = modifier
                .clip(shape)
                .background(colors.surfaceSecondary, shape)
                .semantics(mergeDescendants = false) { stateDescription = size.label },
        ) { measurables, constraints ->
            val padding = 16.dp.roundToPx()
            val gap = 12.dp.roundToPx()
            val innerWidth = (constraints.maxWidth - padding * 2).coerceAtLeast(0)
            val bounded = constraints.hasBoundedHeight
            val innerHeight = if (bounded) (constraints.maxHeight - padding * 2).coerceAtLeast(0) else Int.MAX_VALUE
            val child = constraints.copy(minWidth = 0, maxWidth = innerWidth, minHeight = 0)
            val flexible = measurables.indexOfFirst { it.layoutId == WidgetContentSlot }
            val placeables = arrayOfNulls<Placeable>(measurables.size)
            var used = 0
            measurables.forEachIndexed { i, measurable ->
                if (i == flexible) return@forEachIndexed
                val placeable = measurable.measure(child.copy(maxHeight = if (bounded) innerHeight else Int.MAX_VALUE))
                placeables[i] = placeable
                used += placeable.height
            }
            val gaps = gap * (measurables.size - 1).coerceAtLeast(0)
            if (flexible >= 0) {
                val remaining = if (bounded) (innerHeight - used - gaps).coerceAtLeast(0) else Int.MAX_VALUE
                placeables[flexible] = measurables[flexible].measure(child.copy(maxHeight = remaining))
            }
            val items = placeables.map { it!! }
            val stacked = items.sumOf { it.height } + gaps
            val width = constraints.maxWidth.takeIf { constraints.hasBoundedWidth } ?: (items.maxOfOrNull { it.width } ?: 0) + padding * 2
            val height = if (bounded && constraints.minHeight == constraints.maxHeight) constraints.maxHeight else constraints.constrainHeight(stacked + padding * 2)
            val footerIndex = measurables.indexOfFirst { it.layoutId == WidgetFooterSlot }
            layout(width, height) {
                val contentHeight = height - padding * 2
                var y = padding + if (center) ((contentHeight - stacked) / 2).coerceAtLeast(0) else 0
                items.forEachIndexed { i, placeable ->
                    val x = padding + if (center) (innerWidth - placeable.width) / 2 else 0
                    val top = if (!center && i == footerIndex && i == items.lastIndex) {
                        maxOf(y, height - padding - placeable.height)
                    } else {
                        y
                    }
                    placeable.place(x, top)
                    y = top + placeable.height + gap
                }
            }
        }
    }
}

@Composable
fun WidgetHeader(modifier: Modifier = Modifier, content: @Composable () -> Unit) {
    val center = LocalWidgetAlign.current == WidgetAlign.Center
    Layout(content = content, modifier = modifier) { measurables, constraints ->
        val loose = constraints.copy(minWidth = 0, minHeight = 0)
        if (center) {
            val gap = 12.dp.roundToPx()
            val placeables = measurables.filter { it.layoutId != WidgetActionSlot }.map { it.measure(loose) }
            val width = placeables.maxOfOrNull { it.width } ?: 0
            val height = placeables.sumOf { it.height } + gap * (placeables.size - 1).coerceAtLeast(0)
            layout(width, height) {
                var y = 0
                placeables.forEach {
                    it.place((width - it.width) / 2, y)
                    y += it.height + gap
                }
            }
        } else {
            val gap = 8.dp.roundToPx()
            val actionIndex = measurables.indexOfFirst { it.layoutId == WidgetActionSlot }
            val action = actionIndex.takeIf { it >= 0 }?.let { measurables[it].measure(loose) }
            var remaining = constraints.maxWidth - (action?.let { it.width + gap } ?: 0)
            val placeables = measurables.mapIndexedNotNull { i, measurable ->
                if (i == actionIndex) return@mapIndexedNotNull null
                val placeable = measurable.measure(loose.copy(maxWidth = remaining.coerceAtLeast(0)))
                remaining -= placeable.width + gap
                placeable
            }
            val height = maxOf(placeables.maxOfOrNull { it.height } ?: 0, action?.height ?: 0)
            val width = constraints.maxWidth
            layout(width, height) {
                var x = 0
                placeables.forEach {
                    it.place(x, (height - it.height) / 2)
                    x += it.width + gap
                }
                action?.place(width - action.width, (height - action.height) / 2)
            }
        }
    }
}

@Composable
fun WidgetIcon(
    modifier: Modifier = Modifier,
    size: WidgetIconSize = WidgetIconSize.Default,
    content: @Composable () -> Unit,
) {
    val colors = EsuissTheme.colors
    val (box, icon, radius) = when (size) {
        WidgetIconSize.Default -> Triple(32.dp, 18.dp, Radius.lg)
        WidgetIconSize.Lg -> Triple(52.dp, 24.dp, Radius.xl2)
        WidgetIconSize.Sm -> Triple(14.dp, 14.dp, 0.dp)
    }
    val shape = RoundedCornerShape(radius)
    Box(
        modifier = modifier
            .size(box)
            .then(if (size == WidgetIconSize.Sm) Modifier else Modifier.background(colors.control, shape)),
        contentAlignment = Alignment.Center,
    ) {
        CompositionLocalProvider(LocalIconSize provides icon) {
            content()
        }
    }
}

@Composable
fun WidgetTitle(text: String, modifier: Modifier = Modifier) {
    BasicText(
        text,
        modifier = modifier,
        style = LocalContentStyle.current.merge(Typography.sm).copy(fontWeight = FontWeight.SemiBold),
        maxLines = 1,
        overflow = TextOverflow.Ellipsis,
    )
}

@Composable
fun WidgetAction(modifier: Modifier = Modifier, content: @Composable () -> Unit) {
    Row(modifier = modifier.layoutId(WidgetActionSlot), verticalAlignment = Alignment.CenterVertically) {
        content()
    }
}

@Composable
fun WidgetDescription(text: String, modifier: Modifier = Modifier) {
    BasicText(
        text,
        modifier = modifier,
        style = LocalContentStyle.current.merge(Typography.sm).copy(color = EsuissTheme.colors.labelSecondary),
    )
}

@Composable
fun WidgetValue(text: String, modifier: Modifier = Modifier) {
    BasicText(
        text,
        modifier = modifier,
        style = LocalContentStyle.current.merge(Typography.xl3).copy(
            fontWeight = FontWeight.SemiBold,
            letterSpacing = (-0.025).em,
            fontFeatureSettings = "tnum",
        ),
        maxLines = 1,
    )
}

@Composable
fun WidgetContent(modifier: Modifier = Modifier, content: @Composable () -> Unit) {
    val center = LocalWidgetAlign.current == WidgetAlign.Center
    Column(
        modifier = modifier.layoutId(WidgetContentSlot),
        verticalArrangement = Arrangement.spacedBy(4.dp),
        horizontalAlignment = if (center) Alignment.CenterHorizontally else Alignment.Start,
    ) {
        content()
    }
}

@Composable
fun WidgetFooter(modifier: Modifier = Modifier, content: @Composable () -> Unit) {
    val colors = EsuissTheme.colors
    CompositionLocalProvider(
        LocalContentStyle provides LocalContentStyle.current.merge(Typography.xs).copy(color = colors.labelSecondary),
        LocalContentColor provides colors.labelSecondary,
        LocalIconSize provides 14.dp,
    ) {
        Row(
            modifier = modifier.layoutId(WidgetFooterSlot),
            horizontalArrangement = Arrangement.spacedBy(6.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            content()
        }
    }
}
