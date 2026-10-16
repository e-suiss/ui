package com.esuiss.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.combinedClickable
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.SideEffect
import androidx.compose.runtime.compositionLocalOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.RectangleShape
import androidx.compose.ui.graphics.compositeOver
import androidx.compose.ui.graphics.drawscope.withTransform
import androidx.compose.ui.graphics.vector.PathParser
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.Layout
import androidx.compose.ui.layout.layoutId
import androidx.compose.ui.semantics.onLongClick
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.Constraints
import androidx.compose.ui.unit.constrainHeight
import androidx.compose.ui.unit.constrainWidth
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import com.esuiss.ui.theme.Colors
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography
import kotlin.math.roundToInt

enum class BubbleVariant { Default, Secondary, Muted, Tinted, Outline, Ghost, Destructive }

enum class BubbleAlign { Start, End }

enum class BubbleReactionsSide { Top, Bottom }

internal class BubbleSlot {
    var align by mutableStateOf(BubbleAlign.Start)
    var tailed by mutableStateOf(true)
}

private class BubbleInfo(val variant: BubbleVariant, val align: BubbleAlign, val slot: BubbleSlot)

private class BubbleReactionsSlot(val side: BubbleReactionsSide, val align: BubbleAlign)

private val LocalBubble = compositionLocalOf<BubbleInfo?> { null }

internal val LocalBubbleAlign = compositionLocalOf { BubbleAlign.Start }

private val TailPath = PathParser().parsePathString("M7 0H20V4A16 16 0 0 1 4 20H0V19.54A10 10 0 0 0 7 10Z").toPath()

@Composable
internal fun BubbleStack(
    modifier: Modifier,
    spacing: Dp,
    alignEnd: Boolean,
    content: @Composable () -> Unit,
) {
    Layout(content = content, modifier = modifier) { measurables, constraints ->
        val loose = constraints.copy(minWidth = 0, minHeight = 0)
        val placeables = measurables.map { it.measure(loose) }
        val slots = measurables.map { it.layoutId as? BubbleSlot }
        slots.forEachIndexed { index, slot ->
            if (slot != null) {
                val next = slots.getOrNull(index + 1)
                slot.tailed = next == null || next.align != slot.align
            }
        }
        val gap = spacing.roundToPx()
        val width = if (constraints.hasBoundedWidth) constraints.maxWidth else placeables.maxOfOrNull { it.width } ?: 0
        val height = placeables.sumOf { it.height } + gap * (placeables.size - 1).coerceAtLeast(0)
        layout(width, constraints.constrainHeight(height)) {
            var y = 0
            placeables.forEachIndexed { index, placeable ->
                val end = alignEnd || slots[index]?.align == BubbleAlign.End
                placeable.placeRelative(if (end) width - placeable.width else 0, y)
                y += placeable.height + gap
            }
        }
    }
}

@Composable
fun BubbleGroup(
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit,
) {
    BubbleStack(modifier, 8.dp, alignEnd = false, content = content)
}

@Composable
fun Bubble(
    modifier: Modifier = Modifier,
    variant: BubbleVariant = BubbleVariant.Default,
    align: BubbleAlign = LocalBubbleAlign.current,
    content: @Composable () -> Unit,
) {
    val slot = remember { BubbleSlot() }
    SideEffect { slot.align = align }
    val message = LocalMessage.current
    if (variant == BubbleVariant.Ghost && message != null) {
        DisposableEffect(message) {
            message.ghosts += 1
            onDispose { message.ghosts -= 1 }
        }
    }
    val fraction = if (variant == BubbleVariant.Ghost) 1f else 0.8f
    val end = align == BubbleAlign.End
    CompositionLocalProvider(LocalBubble provides BubbleInfo(variant, align, slot)) {
        Layout(content = content, modifier = modifier.layoutId(slot)) { measurables, constraints ->
            val maxWidth = if (constraints.hasBoundedWidth) (constraints.maxWidth * fraction).roundToInt() else Constraints.Infinity
            val gap = 4.dp.roundToPx()
            val inset = 12.dp.roundToPx()
            val reserve = 20.dp.roundToPx()
            val childConstraints = Constraints(maxWidth = maxWidth, maxHeight = constraints.maxHeight)
            val items = measurables.filter { it.layoutId !is BubbleReactionsSlot }.map { it.measure(childConstraints) }
            val reactions = measurables.filter { it.layoutId is BubbleReactionsSlot }.map {
                it.layoutId as BubbleReactionsSlot to it.measure(Constraints(maxWidth = maxWidth))
            }
            val columnWidth = items.maxOfOrNull { it.width } ?: 0
            val columnHeight = items.sumOf { it.height } + gap * (items.size - 1).coerceAtLeast(0)
            val top = if (reactions.any { it.first.side == BubbleReactionsSide.Top }) reserve else 0
            val bottom = if (reactions.any { it.first.side == BubbleReactionsSide.Bottom }) reserve else 0
            val width = constraints.constrainWidth(columnWidth)
            layout(width, constraints.constrainHeight(top + columnHeight + bottom)) {
                var y = top
                items.forEach { placeable ->
                    placeable.placeRelative(if (end) width - placeable.width else 0, y)
                    y += placeable.height + gap
                }
                reactions.forEach { (data, placeable) ->
                    val x = if (data.align == BubbleAlign.End) width - inset - placeable.width else inset
                    val ry = if (data.side == BubbleReactionsSide.Bottom) {
                        top + columnHeight - placeable.height / 4
                    } else {
                        top - placeable.height * 3 / 4
                    }
                    placeable.placeRelative(x, ry, 1f)
                }
            }
        }
    }
}

@Composable
fun BubbleContent(
    modifier: Modifier = Modifier,
    onClick: (() -> Unit)? = null,
    onLongPress: (() -> Unit)? = null,
    content: @Composable () -> Unit,
) {
    val colors = EsuissTheme.colors
    val info = LocalBubble.current
    val variant = info?.variant ?: BubbleVariant.Default
    val align = info?.align ?: LocalBubbleAlign.current
    val slot = info?.slot
    val haptics = rememberHaptics()
    val interaction = remember { MutableInteractionSource() }
    val clicked by interaction.collectIsPressedAsState()
    var holding by remember { mutableStateOf(false) }
    val pressed = clicked || holding
    val background = bubbleBackground(variant, colors)
    val foreground = bubbleForeground(variant, colors)
    val ghost = variant == BubbleVariant.Ghost
    val shape = if (ghost) RectangleShape else RoundedCornerShape(Radius.xl2)
    val tailing = variant != BubbleVariant.Ghost && variant != BubbleVariant.Outline
    val longPress = onLongPress?.let { action ->
        {
            haptics.perform(HapticFeedbackType.LongPress)
            action()
        }
    }
    val currentLongPress by rememberUpdatedState(longPress)
    val gestures = when {
        onClick != null -> Modifier.combinedClickable(
            interactionSource = interaction,
            indication = null,
            onLongClick = longPress,
            onClick = onClick,
        )
        longPress != null -> Modifier
            .pointerInput(Unit) {
                detectTapGestures(
                    onPress = {
                        holding = true
                        tryAwaitRelease()
                        holding = false
                    },
                    onLongPress = { currentLongPress?.invoke() },
                )
            }
            .semantics {
                onLongClick {
                    longPress()
                    true
                }
            }
        else -> Modifier
    }
    Box(
        modifier = modifier
            .alpha(if (pressed) 0.8f else 1f)
            .drawBehind {
                if (tailing && (slot?.tailed ?: true)) {
                    val unit = 1.dp.toPx()
                    val end = (align == BubbleAlign.End) != (layoutDirection == LayoutDirection.Rtl)
                    val left = if (end) size.width + 6.9f * unit else -6.9f * unit
                    val top = size.height + unit - 20f * unit
                    withTransform({
                        translate(left, top)
                        scale(if (end) -unit else unit, unit, Offset.Zero)
                    }) {
                        drawPath(TailPath, background)
                    }
                }
            }
            .background(background, shape)
            .then(if (variant == BubbleVariant.Outline) Modifier.border(1.dp, colors.border, shape) else Modifier)
            .then(gestures)
            .then(if (ghost) Modifier else Modifier.padding(horizontal = 15.dp, vertical = 7.dp)),
    ) {
        CompositionLocalProvider(
            LocalContentStyle provides Typography.base.copy(color = foreground),
            LocalContentColor provides foreground,
        ) {
            content()
        }
    }
}

@Composable
fun BubbleContent(
    text: String,
    modifier: Modifier = Modifier,
    onClick: (() -> Unit)? = null,
    onLongPress: (() -> Unit)? = null,
) {
    BubbleContent(modifier, onClick, onLongPress) {
        BasicText(text, style = LocalContentStyle.current)
    }
}

@Composable
fun BubbleReactions(
    modifier: Modifier = Modifier,
    side: BubbleReactionsSide = BubbleReactionsSide.Bottom,
    align: BubbleAlign = BubbleAlign.End,
    content: @Composable RowScope.() -> Unit,
) {
    val colors = EsuissTheme.colors
    Row(
        modifier = modifier
            .layoutId(BubbleReactionsSlot(side, align))
            .drawBehind {
                val ring = 3.dp.toPx()
                drawRoundRect(
                    color = colors.background,
                    topLeft = Offset(-ring, -ring),
                    size = Size(size.width + ring * 2, size.height + ring * 2),
                    cornerRadius = CornerRadius(size.height / 2 + ring),
                )
            }
            .background(colors.muted, CircleShape)
            .padding(horizontal = 6.dp, vertical = 2.dp),
        horizontalArrangement = Arrangement.spacedBy(4.dp, Alignment.CenterHorizontally),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        CompositionLocalProvider(
            LocalContentStyle provides Typography.sm.copy(color = colors.foreground),
            LocalContentColor provides colors.foreground,
            LocalIconSize provides 16.dp,
        ) {
            content()
        }
    }
}

@Composable
fun BubbleReactions(
    text: String,
    modifier: Modifier = Modifier,
    side: BubbleReactionsSide = BubbleReactionsSide.Bottom,
    align: BubbleAlign = BubbleAlign.End,
) {
    BubbleReactions(modifier, side, align) {
        BasicText(text, style = LocalContentStyle.current, maxLines = 1)
    }
}

private fun bubbleBackground(variant: BubbleVariant, colors: Colors): Color =
    if (variant == BubbleVariant.Ghost) bubbleFill(variant, colors) else bubbleFill(variant, colors).compositeOver(colors.background)

private fun bubbleFill(variant: BubbleVariant, colors: Colors): Color = when (variant) {
    BubbleVariant.Default -> colors.primary
    BubbleVariant.Secondary -> colors.secondary
    BubbleVariant.Muted -> colors.muted
    BubbleVariant.Tinted -> colors.primary.copy(alpha = if (colors.isDark) 0.2f else 0.1f)
    BubbleVariant.Outline -> colors.background
    BubbleVariant.Ghost -> Color.Transparent
    BubbleVariant.Destructive -> colors.destructive.copy(alpha = if (colors.isDark) 0.2f else 0.1f)
}

private fun bubbleForeground(variant: BubbleVariant, colors: Colors): Color = when (variant) {
    BubbleVariant.Default -> colors.primaryForeground
    BubbleVariant.Destructive -> colors.destructive
    else -> colors.foreground
}
