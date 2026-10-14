package com.esuiss.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.combinedClickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.Stable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.RectangleShape
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.layout.Layout
import androidx.compose.ui.layout.Measurable
import androidx.compose.ui.layout.Placeable
import androidx.compose.ui.layout.layoutId
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.isTraversalGroup
import androidx.compose.ui.semantics.selected
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Constraints
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography

enum class ItemVariant { Default, Outline, Muted }

enum class ItemSize(
    internal val horizontalPadding: Dp,
    internal val verticalPadding: Dp,
    internal val gap: Dp,
    internal val contentGap: Dp,
    internal val imageSize: Dp,
) {
    Default(16.dp, 14.dp, 14.dp, 4.dp, 40.dp),
    Sm(14.dp, 12.dp, 14.dp, 4.dp, 32.dp),
    Xs(12.dp, 10.dp, 10.dp, 2.dp, 24.dp),
}

enum class ItemGroupVariant { Default, Inset }

enum class ItemMediaVariant { Default, Icon, Image }

private enum class ItemSlot { Media, Content, Actions, Header, Footer }

@Stable
private class ItemState(val size: ItemSize) {
    var descriptions by mutableIntStateOf(0)
}

private val LocalItemState = staticCompositionLocalOf<ItemState?> { null }

internal val LocalItemGroupVariant = staticCompositionLocalOf<ItemGroupVariant?> { null }

@Composable
fun ItemGroup(
    modifier: Modifier = Modifier,
    variant: ItemGroupVariant = ItemGroupVariant.Default,
    content: @Composable ColumnScope.() -> Unit,
) {
    val colors = EsuissTheme.colors
    val inset = variant == ItemGroupVariant.Inset
    val shape = RoundedCornerShape(Radius.xl2)
    Column(
        modifier = modifier
            .fillMaxWidth()
            .then(if (inset) Modifier.clip(shape).background(colors.surfaceSecondary, shape) else Modifier)
            .semantics { isTraversalGroup = true },
        verticalArrangement = if (inset) Arrangement.Top else Arrangement.spacedBy(16.dp),
    ) {
        CompositionLocalProvider(LocalItemGroupVariant provides variant) {
            content()
        }
    }
}

@Composable
fun ItemSeparator(modifier: Modifier = Modifier) {
    val inset = LocalItemGroupVariant.current == ItemGroupVariant.Inset
    Box(
        modifier = modifier
            .fillMaxWidth()
            .padding(start = if (inset) 16.dp else 0.dp)
            .padding(vertical = if (inset) 0.dp else 8.dp)
            .height(1.dp)
            .background(EsuissTheme.colors.separator),
    )
}

@Composable
fun Item(
    modifier: Modifier = Modifier,
    variant: ItemVariant = ItemVariant.Default,
    size: ItemSize = ItemSize.Default,
    onClick: (() -> Unit)? = null,
    onLongClick: (() -> Unit)? = null,
    enabled: Boolean = true,
    selected: Boolean? = null,
    role: Role? = Role.Button,
    onClickLabel: String? = null,
    content: @Composable () -> Unit,
) {
    val inset = LocalItemGroupVariant.current == ItemGroupVariant.Inset
    val shape = if (inset) RectangleShape else RoundedCornerShape(Radius.xl)
    ItemFrame(
        modifier = modifier,
        variant = variant,
        size = size,
        shape = shape,
        padding = PaddingValues(horizontal = size.horizontalPadding, vertical = size.verticalPadding),
        onClick = onClick,
        onLongClick = onLongClick,
        enabled = enabled,
        selected = selected,
        role = role,
        onClickLabel = onClickLabel,
        content = content,
    )
}

@Composable
internal fun ItemFrame(
    modifier: Modifier,
    variant: ItemVariant,
    size: ItemSize,
    shape: Shape,
    padding: PaddingValues,
    onClick: (() -> Unit)?,
    onLongClick: (() -> Unit)?,
    enabled: Boolean,
    selected: Boolean?,
    role: Role?,
    onClickLabel: String?,
    minHeight: Dp = 0.dp,
    gap: Dp = size.gap,
    content: @Composable () -> Unit,
) {
    val colors = EsuissTheme.colors
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    val state = remember(size) { ItemState(size) }
    val interactive = onClick != null || onLongClick != null
    val background = when {
        pressed && enabled && interactive -> colors.itemPressed
        selected == true -> colors.itemSelected
        variant == ItemVariant.Muted -> colors.surfaceSecondary.copy(alpha = colors.surfaceSecondary.alpha * 0.5f)
        else -> Color.Transparent
    }
    val foreground = if (enabled) colors.label else colors.labelQuaternary
    val behaviour = if (interactive) {
        Modifier
            .heightIn(min = maxOf(minHeight, 48.dp))
            .combinedClickable(
                interactionSource = interaction,
                indication = null,
                enabled = enabled,
                onClickLabel = onClickLabel,
                role = role,
                onLongClick = onLongClick,
                onClick = onClick ?: {},
            )
    } else {
        Modifier
            .heightIn(min = minHeight)
            .semantics(mergeDescendants = true) {}
    }
    Box(
        modifier = modifier
            .fillMaxWidth()
            .clip(shape)
            .background(background, shape)
            .then(if (variant == ItemVariant.Outline) Modifier.border(1.dp, colors.separator, shape) else Modifier)
            .then(if (selected != null) Modifier.semantics { this.selected = selected } else Modifier)
            .then(behaviour)
            .padding(padding),
        contentAlignment = Alignment.CenterStart,
    ) {
        CompositionLocalProvider(
            LocalItemState provides state,
            LocalContentStyle provides Typography.base.copy(color = foreground),
            LocalContentColor provides foreground,
            LocalIconSize provides 16.dp,
        ) {
            ItemLayout(gap, state.descriptions > 0, content)
        }
    }
}

@Composable
private fun ItemLayout(gap: Dp, mediaAtTop: Boolean, content: @Composable () -> Unit) {
    Layout(content = content, modifier = Modifier.fillMaxWidth()) { measurables, constraints ->
        val gapPx = gap.roundToPx()
        val nudge = if (mediaAtTop) 2.dp.roundToPx() else 0
        val lines = mutableListOf<List<Measurable>>()
        var current = mutableListOf<Measurable>()
        measurables.forEach { measurable ->
            val slot = measurable.layoutId
            if (slot == ItemSlot.Header || slot == ItemSlot.Footer) {
                if (current.isNotEmpty()) lines += current
                lines += listOf(measurable)
                current = mutableListOf()
            } else {
                current += measurable
            }
        }
        if (current.isNotEmpty()) lines += current
        val bounded = constraints.hasBoundedWidth
        val available = if (bounded) constraints.maxWidth else Constraints.Infinity
        val measured = lines.map { line ->
            val placeables = arrayOfNulls<Placeable>(line.size)
            val flexIndex = line.indexOfFirst { it.layoutId == ItemSlot.Content }
            var used = gapPx * (line.size - 1).coerceAtLeast(0)
            line.forEachIndexed { index, measurable ->
                if (index == flexIndex) return@forEachIndexed
                val full = measurable.layoutId == ItemSlot.Header || measurable.layoutId == ItemSlot.Footer
                val childConstraints = when {
                    full && bounded -> Constraints(minWidth = available, maxWidth = available)
                    bounded -> Constraints(maxWidth = (available - used).coerceAtLeast(0))
                    else -> Constraints()
                }
                val placeable = measurable.measure(childConstraints)
                placeables[index] = placeable
                used += placeable.width
            }
            if (flexIndex >= 0) {
                val remaining = (available - used).coerceAtLeast(0)
                placeables[flexIndex] = line[flexIndex].measure(
                    if (bounded) Constraints(minWidth = remaining, maxWidth = remaining) else Constraints(),
                )
            }
            placeables.requireNoNulls().toList()
        }
        val width = if (bounded) {
            constraints.maxWidth
        } else {
            measured.maxOfOrNull { line -> line.sumOf { it.width } + gapPx * (line.size - 1).coerceAtLeast(0) } ?: 0
        }
        val lineHeights = measured.mapIndexed { lineIndex, line ->
            line.mapIndexed { index, placeable ->
                val isMedia = lines[lineIndex][index].layoutId == ItemSlot.Media
                placeable.height + if (isMedia) nudge else 0
            }.maxOrNull() ?: 0
        }
        val height = (lineHeights.sum() + gapPx * (measured.size - 1).coerceAtLeast(0))
            .coerceIn(constraints.minHeight, constraints.maxHeight)
        layout(width, height) {
            var y = 0
            measured.forEachIndexed { lineIndex, line ->
                val lineHeight = lineHeights[lineIndex]
                var x = 0
                line.forEachIndexed { index, placeable ->
                    val isMedia = lines[lineIndex][index].layoutId == ItemSlot.Media
                    val top = if (isMedia && mediaAtTop) nudge else (lineHeight - placeable.height) / 2
                    placeable.placeRelative(x, y + top)
                    x += placeable.width + gapPx
                }
                y += lineHeight + gapPx
            }
        }
    }
}

@Composable
fun ItemMedia(
    modifier: Modifier = Modifier,
    variant: ItemMediaVariant = ItemMediaVariant.Default,
    content: @Composable BoxScope.() -> Unit,
) {
    val size = LocalItemState.current?.size ?: ItemSize.Default
    val sizing = when (variant) {
        ItemMediaVariant.Image -> {
            val shape = RoundedCornerShape(if (size == ItemSize.Xs) Radius.sm else Radius.md)
            Modifier.size(size.imageSize).clip(shape)
        }
        else -> Modifier
    }
    Box(
        modifier = modifier.layoutId(ItemSlot.Media).then(sizing),
        contentAlignment = Alignment.Center,
    ) {
        CompositionLocalProvider(LocalIconSize provides if (variant == ItemMediaVariant.Icon) 16.dp else LocalIconSize.current) {
            content()
        }
    }
}

@Composable
fun ItemContent(
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit,
) {
    val size = LocalItemState.current?.size ?: ItemSize.Default
    Column(
        modifier = modifier.layoutId(ItemSlot.Content),
        verticalArrangement = Arrangement.spacedBy(size.contentGap),
        content = content,
    )
}

@Composable
fun ItemTitle(
    modifier: Modifier = Modifier,
    content: @Composable RowScope.() -> Unit,
) {
    val color = LocalContentColor.current
    Row(
        modifier = modifier,
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        CompositionLocalProvider(
            LocalContentStyle provides Typography.base.copy(color = color, fontWeight = FontWeight.SemiBold),
        ) {
            content()
        }
    }
}

@Composable
fun ItemTitle(text: String, modifier: Modifier = Modifier) {
    val color = LocalContentColor.current
    BasicText(
        text,
        modifier = modifier,
        style = Typography.base.copy(color = color, fontWeight = FontWeight.SemiBold),
        maxLines = 1,
        overflow = TextOverflow.Ellipsis,
    )
}

@Composable
fun ItemDescription(text: String, modifier: Modifier = Modifier) {
    val state = LocalItemState.current
    if (state != null) {
        DisposableEffect(state) {
            state.descriptions += 1
            onDispose { state.descriptions -= 1 }
        }
    }
    BasicText(
        text,
        modifier = modifier,
        style = Typography.sm.copy(color = EsuissTheme.colors.labelSecondary),
        maxLines = 2,
        overflow = TextOverflow.Ellipsis,
    )
}

@Composable
fun ItemActions(
    modifier: Modifier = Modifier,
    content: @Composable RowScope.() -> Unit,
) {
    Row(
        modifier = modifier.layoutId(ItemSlot.Actions),
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalAlignment = Alignment.CenterVertically,
        content = content,
    )
}

@Composable
fun ItemHeader(
    modifier: Modifier = Modifier,
    content: @Composable RowScope.() -> Unit,
) {
    Row(
        modifier = modifier.layoutId(ItemSlot.Header),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically,
        content = content,
    )
}

@Composable
fun ItemFooter(
    modifier: Modifier = Modifier,
    content: @Composable RowScope.() -> Unit,
) {
    Row(
        modifier = modifier.layoutId(ItemSlot.Footer),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically,
        content = content,
    )
}
