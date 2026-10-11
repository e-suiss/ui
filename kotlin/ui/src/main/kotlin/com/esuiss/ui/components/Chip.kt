package com.esuiss.ui.components

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.selection.selectableGroup
import androidx.compose.foundation.selection.toggleable
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Bold
import com.adamglin.phosphoricons.bold.X
import com.esuiss.ui.theme.Colors
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography

enum class ChipSize(
    internal val height: Dp,
    internal val horizontalPadding: Dp,
    internal val iconSize: Dp,
) {
    Default(32.dp, 14.dp, 16.dp),
    Sm(28.dp, 12.dp, 14.dp),
    ;

    internal val textStyle: TextStyle
        get() = if (this == Sm) Typography.xs else Typography.sm
}

private class ChipGroupState(
    val isSelected: (String) -> Boolean,
    val toggle: (String) -> Unit,
    val size: ChipSize,
    val enabled: Boolean,
    val multiple: Boolean,
)

private val LocalChipGroupState = staticCompositionLocalOf<ChipGroupState?> { null }

@Composable
fun ChipGroup(
    value: String?,
    onValueChange: (String?) -> Unit,
    modifier: Modifier = Modifier,
    size: ChipSize = ChipSize.Default,
    scrollable: Boolean = false,
    enabled: Boolean = true,
    contentPadding: PaddingValues = PaddingValues(0.dp),
    content: @Composable () -> Unit,
) {
    val state = ChipGroupState(
        isSelected = { it == value },
        toggle = { onValueChange(if (it == value) null else it) },
        size = size,
        enabled = enabled,
        multiple = false,
    )
    ChipGroupLayout(state, modifier.selectableGroup(), scrollable, contentPadding, content)
}

@Composable
fun ChipGroup(
    values: Set<String>,
    onValuesChange: (Set<String>) -> Unit,
    modifier: Modifier = Modifier,
    size: ChipSize = ChipSize.Default,
    scrollable: Boolean = false,
    enabled: Boolean = true,
    contentPadding: PaddingValues = PaddingValues(0.dp),
    content: @Composable () -> Unit,
) {
    val state = ChipGroupState(
        isSelected = { it in values },
        toggle = { onValuesChange(if (it in values) values - it else values + it) },
        size = size,
        enabled = enabled,
        multiple = true,
    )
    ChipGroupLayout(state, modifier, scrollable, contentPadding, content)
}

@Composable
private fun ChipGroupLayout(
    state: ChipGroupState,
    modifier: Modifier,
    scrollable: Boolean,
    contentPadding: PaddingValues,
    content: @Composable () -> Unit,
) {
    CompositionLocalProvider(LocalChipGroupState provides state) {
        if (scrollable) {
            Row(
                modifier = modifier
                    .horizontalScroll(rememberScrollState())
                    .padding(contentPadding),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                content()
            }
        } else {
            FlowRow(
                modifier = modifier.padding(contentPadding),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                content()
            }
        }
    }
}

@Composable
fun Chip(
    text: String,
    value: String,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    icon: ImageVector? = null,
    onRemove: (() -> Unit)? = null,
    removeLabel: String = "Remove $text",
) {
    val group = LocalChipGroupState.current
    val selected = group?.isSelected(value) ?: false
    ChipSurface(
        text = text,
        selected = selected,
        onClick = { group?.toggle(value) },
        multiple = group?.multiple ?: true,
        modifier = modifier,
        size = group?.size ?: ChipSize.Default,
        enabled = enabled && (group?.enabled ?: true),
        icon = icon,
        onRemove = onRemove,
        removeLabel = removeLabel,
    )
}

@Composable
fun Chip(
    text: String,
    selected: Boolean,
    onSelectedChange: (Boolean) -> Unit,
    modifier: Modifier = Modifier,
    size: ChipSize = LocalChipGroupState.current?.size ?: ChipSize.Default,
    enabled: Boolean = true,
    icon: ImageVector? = null,
    onRemove: (() -> Unit)? = null,
    removeLabel: String = "Remove $text",
) {
    ChipSurface(
        text = text,
        selected = selected,
        onClick = { onSelectedChange(!selected) },
        multiple = true,
        modifier = modifier,
        size = size,
        enabled = enabled,
        icon = icon,
        onRemove = onRemove,
        removeLabel = removeLabel,
    )
}

private fun chipBackground(colors: Colors, selected: Boolean, enabled: Boolean, pressed: Boolean): Color = when {
    !enabled -> if (selected) colors.controlSelected.copy(alpha = 0.4f) else colors.controlDisabled
    selected -> colors.controlSelected
    pressed -> colors.controlPressed
    else -> colors.control
}

private fun chipForeground(colors: Colors, selected: Boolean, enabled: Boolean): Color = when {
    selected && enabled -> colors.onControlSelected
    selected -> colors.onControlSelected.copy(alpha = 0.7f)
    !enabled -> colors.labelQuaternary
    else -> colors.label
}

@Composable
private fun ChipSurface(
    text: String,
    selected: Boolean,
    onClick: () -> Unit,
    multiple: Boolean,
    modifier: Modifier,
    size: ChipSize,
    enabled: Boolean,
    icon: ImageVector?,
    onRemove: (() -> Unit)?,
    removeLabel: String,
) {
    val colors = EsuissTheme.colors
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    val haptics = rememberHaptics()
    val select = {
        if (multiple) haptics.toggle(!selected) else haptics.selection()
        onClick()
    }
    val scale by animateFloatAsState(if (pressed && enabled) 0.96f else 1f, tween(150), label = "chip")
    val foreground = chipForeground(colors, selected, enabled)
    val semantics = if (multiple) {
        Modifier.toggleable(
            value = selected,
            interactionSource = interaction,
            indication = null,
            enabled = enabled,
            role = Role.Checkbox,
            onValueChange = { select() },
        )
    } else {
        Modifier.selectable(
            selected = selected,
            interactionSource = interaction,
            indication = null,
            enabled = enabled,
            role = Role.RadioButton,
            onClick = select,
        )
    }
    Row(
        modifier = modifier
            .graphicsLayer {
                scaleX = scale
                scaleY = scale
            }
            .height(size.height)
            .clip(CircleShape)
            .background(chipBackground(colors, selected, enabled, pressed), CircleShape)
            .then(semantics)
            .padding(start = if (icon != null) size.horizontalPadding - 4.dp else size.horizontalPadding)
            .padding(end = if (onRemove != null) 4.dp else size.horizontalPadding),
        horizontalArrangement = Arrangement.spacedBy(6.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        CompositionLocalProvider(
            LocalContentColor provides foreground,
            LocalIconSize provides size.iconSize,
        ) {
            if (icon != null) Icon(icon, contentDescription = null, size = size.iconSize, tint = foreground)
            BasicText(
                text,
                style = size.textStyle.copy(color = foreground, fontWeight = FontWeight.Medium),
                maxLines = 1,
            )
            if (onRemove != null) {
                Box(
                    modifier = Modifier
                        .size(size.height - 8.dp)
                        .clip(CircleShape)
                        .clickable(
                            interactionSource = remember { MutableInteractionSource() },
                            indication = null,
                            enabled = enabled,
                            role = Role.Button,
                            onClick = onRemove,
                        )
                        .semantics { contentDescription = removeLabel },
                    contentAlignment = Alignment.Center,
                ) {
                    Icon(
                        PhosphorIcons.Bold.X,
                        contentDescription = null,
                        size = size.iconSize - 4.dp,
                        tint = foreground.copy(alpha = foreground.alpha * 0.7f),
                    )
                }
            }
        }
    }
}
