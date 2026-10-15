package com.esuiss.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.runtime.snapshots.SnapshotStateMap
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.Layout
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.max
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.CaretUpDown
import com.adamglin.phosphoricons.regular.Check
import com.esuiss.ui.theme.Colors
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography

enum class SelectSize(val height: Dp, val radius: Dp) {
    Default(44.dp, Radius.lg),
    Sm(36.dp, Radius.md),
}

@Immutable
class SelectOption(val value: String, val label: String, val enabled: Boolean = true)

@Immutable
private data class SelectContext(val value: String?, val onSelect: (String) -> Unit)

private val LocalSelect = staticCompositionLocalOf { SelectContext(null) {} }

private val LocalSelectLabels = staticCompositionLocalOf<SnapshotStateMap<String, String>?> { null }

internal fun controlBackground(colors: Colors, invalid: Boolean): Color =
    if (invalid) colors.destructive.copy(alpha = if (colors.isDark) 0.1f else 0.05f) else colors.secondary

@Composable
fun Select(
    value: String?,
    onValueChange: (String) -> Unit,
    options: List<SelectOption>,
    modifier: Modifier = Modifier,
    placeholder: String = "",
    size: SelectSize = SelectSize.Default,
    invalid: Boolean? = null,
    enabled: Boolean = true,
    side: PopupSide = PopupSide.Bottom,
    align: PopupAlign = PopupAlign.Center,
    sideOffset: Dp = 4.dp,
) {
    Select(
        value = value,
        onValueChange = onValueChange,
        displayValue = options.firstOrNull { it.value == value }?.label,
        modifier = modifier,
        placeholder = placeholder,
        size = size,
        invalid = invalid,
        enabled = enabled,
        side = side,
        align = align,
        sideOffset = sideOffset,
    ) {
        SelectGroup {
            options.forEach { SelectItem(it.value, it.label, enabled = it.enabled) }
        }
    }
}

@Composable
fun Select(
    value: String?,
    onValueChange: (String) -> Unit,
    displayValue: String?,
    modifier: Modifier = Modifier,
    placeholder: String = "",
    size: SelectSize = SelectSize.Default,
    invalid: Boolean? = null,
    enabled: Boolean = true,
    side: PopupSide = PopupSide.Bottom,
    align: PopupAlign = PopupAlign.Center,
    sideOffset: Dp = 4.dp,
    content: @Composable ColumnScope.() -> Unit,
) {
    val colors = EsuissTheme.colors
    val field = LocalFieldState.current
    val isInvalid = invalid ?: field.invalid
    val isEnabled = enabled && field.enabled
    var expanded by remember { mutableStateOf(false) }
    val item = rememberButtonGroupItem(LocalButtonGroup.current, RoundedCornerShape(size.radius))
    val shape = item.shape
    val labels = remember { mutableStateMapOf<String, String>() }
    val text = displayValue ?: value?.let { labels[it] ?: it }
    val foreground = when {
        text == null -> colors.mutedForeground
        else -> colors.foreground
    }
    Box(modifier = modifier.then(item.modifier), propagateMinConstraints = true) {
        if (displayValue == null) {
            Layout(
                content = {
                    CompositionLocalProvider(LocalSelectLabels provides labels) { Column(content = content) }
                },
            ) { _, _ -> layout(0, 0) {} }
        }
        Row(
            modifier = Modifier
                .width(IntrinsicSize.Max)
                .height(size.height)
                .alpha(if (isEnabled) 1f else 0.5f)
                .clip(shape)
                .background(controlBackground(colors, isInvalid), shape)
                .border(1.dp, if (isInvalid) colors.destructive else Color.Transparent, shape)
                .semantics { stateDescription = if (expanded) "Expanded" else "Collapsed" }
                .clickable(
                    interactionSource = remember { MutableInteractionSource() },
                    indication = null,
                    enabled = isEnabled,
                    role = Role.DropdownList,
                    onClick = { expanded = !expanded },
                )
                .padding(horizontal = 12.dp),
            horizontalArrangement = Arrangement.spacedBy(6.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            BasicText(
                text ?: placeholder,
                modifier = Modifier.weight(1f),
                style = Typography.base.copy(color = foreground),
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
            Icon(PhosphorIcons.Regular.CaretUpDown, contentDescription = null, size = 16.dp, tint = colors.mutedForeground)
        }
        AnchoredPopup(
            expanded = expanded,
            onDismissRequest = { expanded = false },
            side = side,
            align = align,
            sideOffset = sideOffset,
        ) { placement ->
            val anchorWidth = with(LocalDensity.current) { placement.anchorWidth.toDp() }
            CompositionLocalProvider(
                LocalSelect provides SelectContext(value) {
                    onValueChange(it)
                    expanded = false
                },
                LocalContentStyle provides Typography.base.copy(color = colors.foreground),
                LocalContentColor provides colors.foreground,
            ) {
                Column(
                    modifier = Modifier
                        .width(max(anchorWidth, 144.dp))
                        .raisedSurface(colors, RoundedCornerShape(Radius.xl))
                        .verticalScroll(rememberScrollState()),
                    content = content,
                )
            }
        }
    }
}

@Composable
fun SelectGroup(
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit,
) {
    Column(modifier = modifier.fillMaxWidth().padding(6.dp), content = content)
}

@Composable
fun SelectLabel(text: String, modifier: Modifier = Modifier) {
    BasicText(
        text,
        modifier = modifier
            .fillMaxWidth()
            .semantics { heading() }
            .padding(horizontal = 12.dp, vertical = 10.dp),
        style = Typography.xs.copy(color = EsuissTheme.colors.mutedForeground, fontWeight = FontWeight.SemiBold),
    )
}

@Composable
fun SelectItem(
    value: String,
    text: String,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
) {
    val labels = LocalSelectLabels.current
    if (labels != null) {
        DisposableEffect(labels, value, text) {
            labels[value] = text
            onDispose { labels.remove(value) }
        }
        return
    }
    val colors = EsuissTheme.colors
    val select = LocalSelect.current
    val selected = select.value == value
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    val shape = RoundedCornerShape(Radius.md)
    Box(
        modifier = modifier
            .fillMaxWidth()
            .heightIn(min = 44.dp)
            .clip(shape)
            .alpha(
                when {
                    !enabled -> 0.5f
                    pressed -> 0.8f
                    else -> 1f
                },
            )
            .selectable(
                selected = selected,
                interactionSource = interaction,
                indication = null,
                enabled = enabled,
                role = Role.RadioButton,
                onClick = { select.onSelect(value) },
            )
            .padding(start = 12.dp, end = 8.dp),
        contentAlignment = Alignment.CenterStart,
    ) {
        BasicText(
            text,
            modifier = Modifier.padding(end = 24.dp, top = 8.dp, bottom = 8.dp),
            style = Typography.base.copy(color = colors.foreground),
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
        )
        if (selected) {
            Icon(
                PhosphorIcons.Regular.Check,
                contentDescription = null,
                modifier = Modifier.align(Alignment.CenterEnd),
                size = 16.dp,
                tint = colors.primary,
            )
        }
    }
}

@Composable
fun SelectSeparator(modifier: Modifier = Modifier) {
    Box(
        modifier = modifier
            .padding(vertical = 6.dp)
            .fillMaxWidth()
            .height(1.dp)
            .background(EsuissTheme.colors.border),
    )
}
