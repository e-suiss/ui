package com.esuiss.ui.components

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.selection.selectableGroup
import androidx.compose.foundation.selection.toggleable
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.layout
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.constrainWidth
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.CaretRight
import com.adamglin.phosphoricons.regular.Check
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography

enum class MenuItemVariant { Default, Destructive }

@Immutable
internal data class MenuContext(val dismiss: () -> Unit)

internal val LocalMenu = staticCompositionLocalOf { MenuContext {} }

@Immutable
private data class MenuRadioContext(val value: String?, val onValueChange: (String) -> Unit)

private val LocalMenuRadio = staticCompositionLocalOf { MenuRadioContext(null) {} }

@Composable
fun DropdownMenu(
    expanded: Boolean,
    onExpandedChange: (Boolean) -> Unit,
    trigger: @Composable () -> Unit,
    modifier: Modifier = Modifier,
    side: PopupSide = PopupSide.Bottom,
    align: PopupAlign = PopupAlign.Start,
    sideOffset: Dp = 4.dp,
    alignOffset: Dp = 0.dp,
    content: @Composable ColumnScope.() -> Unit,
) {
    Box {
        trigger()
        MenuPopup(
            expanded = expanded,
            onDismissRequest = { onExpandedChange(false) },
            modifier = modifier,
            side = side,
            align = align,
            sideOffset = sideOffset,
            alignOffset = alignOffset,
            minWidth = 192.dp,
            content = content,
        )
    }
}

@Composable
internal fun MenuPopup(
    expanded: Boolean,
    onDismissRequest: () -> Unit,
    modifier: Modifier,
    side: PopupSide,
    align: PopupAlign,
    sideOffset: Dp,
    alignOffset: Dp,
    minWidth: Dp,
    point: IntOffset? = null,
    content: @Composable ColumnScope.() -> Unit,
) {
    val colors = EsuissTheme.colors
    AnchoredPopup(
        expanded = expanded,
        onDismissRequest = onDismissRequest,
        side = side,
        align = align,
        sideOffset = sideOffset,
        alignOffset = alignOffset,
        point = point,
    ) {
        CompositionLocalProvider(
            LocalMenu provides MenuContext(onDismissRequest),
            LocalContentStyle provides Typography.base.copy(color = colors.label),
            LocalContentColor provides colors.label,
            LocalIconSize provides 16.dp,
        ) {
            Column(
                modifier = modifier
                    .widthIn(min = minWidth)
                    .width(IntrinsicSize.Max)
                    .raisedSurface(colors, RoundedCornerShape(Radius.xl))
                    .verticalScroll(rememberScrollState())
                    .padding(6.dp),
                content = content,
            )
        }
    }
}

@Composable
private fun MenuRow(
    modifier: Modifier,
    enabled: Boolean,
    foreground: Color,
    pressedBackground: Color,
    restingBackground: Color,
    interaction: MutableInteractionSource,
    startPadding: Dp,
    endPadding: Dp,
    indicator: (@Composable () -> Unit)?,
    content: @Composable RowScope.() -> Unit,
) {
    val pressed by interaction.collectIsPressedAsState()
    val shape = RoundedCornerShape(Radius.md)
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .heightIn(min = 44.dp)
            .clip(shape)
            .background(if (pressed && enabled) pressedBackground else restingBackground, shape)
            .then(modifier),
        contentAlignment = Alignment.CenterEnd,
    ) {
        CompositionLocalProvider(
            LocalContentStyle provides Typography.base.copy(color = foreground),
            LocalContentColor provides foreground,
            LocalIconSize provides 16.dp,
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .heightIn(min = 44.dp)
                    .padding(start = startPadding, end = endPadding, top = 8.dp, bottom = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(10.dp),
                verticalAlignment = Alignment.CenterVertically,
                content = content,
            )
            if (indicator != null) {
                Box(
                    modifier = Modifier.padding(start = 12.dp, end = 8.dp),
                    contentAlignment = Alignment.Center,
                ) {
                    indicator()
                }
            }
        }
    }
}

@Composable
private fun menuForeground(enabled: Boolean, destructive: Boolean = false): Color {
    val colors = EsuissTheme.colors
    return when {
        !enabled -> colors.labelQuaternary
        destructive -> colors.danger
        else -> colors.label
    }
}

@Composable
fun DropdownMenuItem(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: MenuItemVariant = MenuItemVariant.Default,
    enabled: Boolean = true,
    inset: Boolean = false,
    closeOnClick: Boolean = true,
    content: @Composable RowScope.() -> Unit,
) {
    val colors = EsuissTheme.colors
    val menu = LocalMenu.current
    val interaction = remember { MutableInteractionSource() }
    val destructive = variant == MenuItemVariant.Destructive
    MenuRow(
        modifier = modifier.clickable(
            interactionSource = interaction,
            indication = null,
            enabled = enabled,
            role = Role.Button,
            onClick = {
                onClick()
                if (closeOnClick) menu.dismiss()
            },
        ),
        enabled = enabled,
        foreground = menuForeground(enabled, destructive),
        pressedBackground = if (destructive) colors.dangerSurfacePressed else colors.itemPressed,
        restingBackground = Color.Transparent,
        interaction = interaction,
        startPadding = if (inset) 38.dp else 12.dp,
        endPadding = 12.dp,
        indicator = null,
        content = content,
    )
}

@Composable
fun DropdownMenuItem(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    icon: ImageVector? = null,
    shortcut: String? = null,
    variant: MenuItemVariant = MenuItemVariant.Default,
    enabled: Boolean = true,
    inset: Boolean = false,
    closeOnClick: Boolean = true,
) {
    DropdownMenuItem(onClick, modifier, variant, enabled, inset, closeOnClick) {
        if (icon != null) Icon(icon, contentDescription = null)
        BasicText(text, style = LocalContentStyle.current, maxLines = 1)
        if (shortcut != null) DropdownMenuShortcut(shortcut)
    }
}

@Composable
private fun CheckIndicator(visible: Boolean) {
    Box(modifier = Modifier.width(16.dp)) {
        if (visible) Icon(PhosphorIcons.Regular.Check, contentDescription = null, size = 16.dp)
    }
}

@Composable
fun DropdownMenuCheckboxItem(
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    inset: Boolean = false,
    closeOnClick: Boolean = false,
    content: @Composable RowScope.() -> Unit,
) {
    val colors = EsuissTheme.colors
    val menu = LocalMenu.current
    val interaction = remember { MutableInteractionSource() }
    MenuRow(
        modifier = modifier.toggleable(
            value = checked,
            interactionSource = interaction,
            indication = null,
            enabled = enabled,
            role = Role.Checkbox,
            onValueChange = {
                onCheckedChange(it)
                if (closeOnClick) menu.dismiss()
            },
        ),
        enabled = enabled,
        foreground = menuForeground(enabled),
        pressedBackground = colors.itemPressed,
        restingBackground = Color.Transparent,
        interaction = interaction,
        startPadding = if (inset) 38.dp else 12.dp,
        endPadding = 32.dp,
        indicator = { CheckIndicator(checked) },
        content = content,
    )
}

@Composable
fun DropdownMenuCheckboxItem(
    text: String,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    inset: Boolean = false,
) {
    DropdownMenuCheckboxItem(checked, onCheckedChange, modifier, enabled, inset) {
        BasicText(text, style = LocalContentStyle.current, maxLines = 1)
    }
}

@Composable
fun DropdownMenuRadioGroup(
    value: String?,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit,
) {
    CompositionLocalProvider(LocalMenuRadio provides MenuRadioContext(value, onValueChange)) {
        Column(modifier = modifier.fillMaxWidth().selectableGroup(), content = content)
    }
}

@Composable
fun DropdownMenuRadioItem(
    value: String,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    inset: Boolean = false,
    closeOnClick: Boolean = false,
    content: @Composable RowScope.() -> Unit,
) {
    val colors = EsuissTheme.colors
    val menu = LocalMenu.current
    val group = LocalMenuRadio.current
    val selected = group.value == value
    val interaction = remember { MutableInteractionSource() }
    MenuRow(
        modifier = modifier.selectable(
            selected = selected,
            interactionSource = interaction,
            indication = null,
            enabled = enabled,
            role = Role.RadioButton,
            onClick = {
                group.onValueChange(value)
                if (closeOnClick) menu.dismiss()
            },
        ),
        enabled = enabled,
        foreground = menuForeground(enabled),
        pressedBackground = colors.itemPressed,
        restingBackground = Color.Transparent,
        interaction = interaction,
        startPadding = if (inset) 38.dp else 12.dp,
        endPadding = 32.dp,
        indicator = { CheckIndicator(selected) },
        content = content,
    )
}

@Composable
fun DropdownMenuRadioItem(
    value: String,
    text: String,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    inset: Boolean = false,
) {
    DropdownMenuRadioItem(value, modifier, enabled, inset) {
        BasicText(text, style = LocalContentStyle.current, maxLines = 1)
    }
}

@Composable
fun DropdownMenuLabel(
    text: String,
    modifier: Modifier = Modifier,
    inset: Boolean = false,
) {
    BasicText(
        text,
        modifier = modifier
            .fillMaxWidth()
            .semantics { heading() }
            .padding(start = if (inset) 38.dp else 12.dp, end = 12.dp, top = 10.dp, bottom = 10.dp),
        style = Typography.xs.copy(color = EsuissTheme.colors.labelSecondary, fontWeight = FontWeight.SemiBold),
    )
}

@Composable
fun DropdownMenuSeparator(modifier: Modifier = Modifier) {
    MenuSeparatorLine(modifier, bleed = 6.dp, color = EsuissTheme.colors.separator.copy(alpha = 0.5f))
}

@Composable
internal fun MenuSeparatorLine(modifier: Modifier, bleed: Dp, color: Color) {
    Box(
        modifier = modifier
            .padding(vertical = bleed)
            .layout { measurable, constraints ->
                val extra = bleed.roundToPx()
                val width = if (constraints.hasBoundedWidth) constraints.maxWidth + extra * 2 else constraints.minWidth
                val placeable = measurable.measure(constraints.copy(minWidth = width, maxWidth = width))
                layout(constraints.constrainWidth(placeable.width - extra * 2), placeable.height) {
                    placeable.place(-extra, 0)
                }
            }
            .height(1.dp)
            .background(color),
    )
}

@Composable
fun RowScope.DropdownMenuShortcut(text: String, modifier: Modifier = Modifier) {
    Spacer(Modifier.weight(1f))
    BasicText(
        text,
        modifier = modifier,
        style = Typography.xs.copy(color = EsuissTheme.colors.labelSecondary),
        maxLines = 1,
    )
}

@Composable
fun DropdownMenuGroup(
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit,
) {
    Column(modifier = modifier.fillMaxWidth(), content = content)
}

@Composable
fun DropdownMenuSub(
    text: String,
    modifier: Modifier = Modifier,
    icon: ImageVector? = null,
    enabled: Boolean = true,
    inset: Boolean = false,
    content: @Composable ColumnScope.() -> Unit,
) {
    DropdownMenuSub(
        trigger = {
            if (icon != null) Icon(icon, contentDescription = null)
            BasicText(text, style = LocalContentStyle.current, maxLines = 1)
        },
        modifier = modifier,
        enabled = enabled,
        inset = inset,
        content = content,
    )
}

@Composable
fun DropdownMenuSub(
    trigger: @Composable RowScope.() -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    inset: Boolean = false,
    content: @Composable ColumnScope.() -> Unit,
) {
    val colors = EsuissTheme.colors
    val menu = LocalMenu.current
    var open by remember { mutableStateOf(false) }
    val interaction = remember { MutableInteractionSource() }
    val rotation by animateFloatAsState(if (open) 90f else 0f, label = "caret")
    Box {
        MenuRow(
            modifier = modifier
                .semantics { stateDescription = if (open) "Expanded" else "Collapsed" }
                .clickable(
                    interactionSource = interaction,
                    indication = null,
                    enabled = enabled,
                    role = Role.Button,
                    onClick = { open = !open },
                ),
            enabled = enabled,
            foreground = menuForeground(enabled),
            pressedBackground = colors.itemPressed,
            restingBackground = if (open) colors.itemSelected else Color.Transparent,
            interaction = interaction,
            startPadding = if (inset) 38.dp else 12.dp,
            endPadding = 12.dp,
            indicator = null,
        ) {
            Row(
                modifier = Modifier.weight(1f),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalAlignment = Alignment.CenterVertically,
                content = trigger,
            )
            Icon(PhosphorIcons.Regular.CaretRight, contentDescription = null, modifier = Modifier.rotate(rotation), size = 16.dp)
        }
        MenuPopup(
            expanded = open,
            onDismissRequest = { open = false },
            modifier = Modifier,
            side = PopupSide.Right,
            align = PopupAlign.Start,
            sideOffset = 0.dp,
            alignOffset = (-6).dp,
            minWidth = 144.dp,
        ) {
            CompositionLocalProvider(
                LocalMenu provides MenuContext(
                    dismiss = {
                        open = false
                        menu.dismiss()
                    },
                ),
            ) {
                content()
            }
        }
    }
}
