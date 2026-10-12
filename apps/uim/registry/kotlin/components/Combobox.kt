package com.esuiss.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.PressInteraction
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.selection.toggleable
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.selection.LocalTextSelectionColors
import androidx.compose.foundation.text.selection.TextSelectionColors
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.input.key.Key
import androidx.compose.ui.input.key.KeyEventType
import androidx.compose.ui.input.key.key
import androidx.compose.ui.input.key.onPreviewKeyEvent
import androidx.compose.ui.input.key.type
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.CaretDown
import com.adamglin.phosphoricons.regular.Check
import com.adamglin.phosphoricons.regular.X
import com.esuiss.ui.theme.Colors
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography

private fun comboboxSelectionColors(colors: Colors) = TextSelectionColors(
    handleColor = colors.accent,
    backgroundColor = colors.accent.copy(alpha = 0.3f),
)

@Composable
fun <T> Combobox(
    items: List<T>,
    value: T?,
    onValueChange: (T?) -> Unit,
    modifier: Modifier = Modifier,
    itemText: (T) -> String = { it.toString() },
    placeholder: String = "",
    emptyText: String = "No items found.",
    groupBy: ((T) -> String)? = null,
    showTrigger: Boolean = true,
    showClear: Boolean = false,
    invalid: Boolean? = null,
    enabled: Boolean = true,
    filter: (T, String) -> Boolean = { item, query -> itemText(item).contains(query, ignoreCase = true) },
) {
    val colors = EsuissTheme.colors
    val field = LocalFieldState.current
    val isInvalid = invalid ?: field.invalid
    val isEnabled = enabled && field.enabled
    val selectedText = value?.let(itemText).orEmpty()
    var query by remember { mutableStateOf(selectedText) }
    var filtering by remember { mutableStateOf(false) }
    var expanded by remember { mutableStateOf(false) }
    var focused by remember { mutableStateOf(false) }
    val currentSelectedText by rememberUpdatedState(selectedText)
    LaunchedEffect(selectedText) {
        if (!filtering) query = selectedText
    }
    val interaction = remember { MutableInteractionSource() }
    LaunchedEffect(interaction) {
        interaction.interactions.collect { if (it is PressInteraction.Release) expanded = true }
    }
    val visible = if (filtering && query.isNotEmpty()) items.filter { filter(it, query) } else items
    val clearVisible = showClear && (value != null || query.isNotEmpty())
    val shape = RoundedCornerShape(Radius.lg)
    val foreground = if (isEnabled) colors.label else colors.labelQuaternary

    Box(modifier = modifier) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .height(44.dp)
                .clip(shape)
                .background(controlBackground(colors, isInvalid, isEnabled), shape)
                .border(
                    1.dp,
                    when {
                        isInvalid -> colors.danger
                        focused -> colors.focus
                        else -> Color.Transparent
                    },
                    shape,
                )
                .padding(end = 8.dp),
            horizontalArrangement = Arrangement.spacedBy(4.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            CompositionLocalProvider(LocalTextSelectionColors provides comboboxSelectionColors(colors)) {
                BasicTextField(
                    value = query,
                    onValueChange = {
                        query = it
                        filtering = true
                        expanded = true
                    },
                    modifier = Modifier
                        .weight(1f)
                        .padding(start = 12.dp, end = 6.dp)
                        .onFocusChanged { state ->
                            focused = state.isFocused
                            if (!state.isFocused) {
                                expanded = false
                                filtering = false
                                query = currentSelectedText
                            }
                        },
                    enabled = isEnabled,
                    singleLine = true,
                    textStyle = Typography.base.copy(color = foreground),
                    cursorBrush = SolidColor(colors.accent),
                    interactionSource = interaction,
                    decorationBox = { inner ->
                        Box(contentAlignment = Alignment.CenterStart) {
                            if (query.isEmpty()) {
                                BasicText(
                                    placeholder,
                                    style = Typography.base.copy(
                                        color = if (isEnabled) colors.labelSecondary else colors.labelQuaternary,
                                    ),
                                    maxLines = 1,
                                )
                            }
                            inner()
                        }
                    },
                )
            }
            if (showTrigger && !clearVisible) {
                ComboboxIconButton(PhosphorIcons.Regular.CaretDown, "Show options", isEnabled, colors.labelSecondary) {
                    expanded = !expanded
                }
            }
            if (clearVisible) {
                ComboboxIconButton(PhosphorIcons.Regular.X, "Clear", isEnabled, colors.label) {
                    query = ""
                    filtering = false
                    onValueChange(null)
                }
            }
        }
        ComboboxPopup(
            expanded = expanded,
            onDismissRequest = { expanded = false },
            items = visible,
            isSelected = { it == value },
            itemText = itemText,
            groupBy = groupBy,
            emptyText = emptyText,
            onItemClick = { item ->
                onValueChange(item)
                query = itemText(item)
                filtering = false
                expanded = false
            },
        )
    }
}

@Composable
fun <T> MultiCombobox(
    items: List<T>,
    values: List<T>,
    onValuesChange: (List<T>) -> Unit,
    modifier: Modifier = Modifier,
    itemText: (T) -> String = { it.toString() },
    placeholder: String = "",
    emptyText: String = "No items found.",
    groupBy: ((T) -> String)? = null,
    invalid: Boolean? = null,
    enabled: Boolean = true,
    filter: (T, String) -> Boolean = { item, query -> itemText(item).contains(query, ignoreCase = true) },
) {
    val colors = EsuissTheme.colors
    val field = LocalFieldState.current
    val isInvalid = invalid ?: field.invalid
    val isEnabled = enabled && field.enabled
    var query by remember { mutableStateOf("") }
    var expanded by remember { mutableStateOf(false) }
    val interaction = remember { MutableInteractionSource() }
    LaunchedEffect(interaction) {
        interaction.interactions.collect { if (it is PressInteraction.Release) expanded = true }
    }
    val visible = if (query.isNotEmpty()) items.filter { filter(it, query) } else items
    val shape = RoundedCornerShape(Radius.lg)
    val hasValue = values.isNotEmpty()

    Box(modifier = modifier) {
        FlowRow(
            modifier = Modifier
                .fillMaxWidth()
                .heightIn(min = 44.dp)
                .clip(shape)
                .background(controlBackground(colors, isInvalid, isEnabled), shape)
                .border(1.dp, if (isInvalid) colors.danger else Color.Transparent, shape)
                .padding(horizontal = if (hasValue) 6.dp else 12.dp, vertical = 6.dp),
            horizontalArrangement = Arrangement.spacedBy(6.dp),
            verticalArrangement = Arrangement.spacedBy(6.dp, Alignment.CenterVertically),
            itemVerticalAlignment = Alignment.CenterVertically,
        ) {
            values.forEach { item ->
                ComboboxChip(itemText(item), isEnabled) { onValuesChange(values - item) }
            }
            CompositionLocalProvider(LocalTextSelectionColors provides comboboxSelectionColors(colors)) {
                BasicTextField(
                    value = query,
                    onValueChange = {
                        query = it
                        expanded = true
                    },
                    modifier = Modifier
                        .weight(1f)
                        .widthIn(min = 64.dp)
                        .height(30.dp)
                        .padding(horizontal = 4.dp)
                        .onFocusChanged { if (!it.isFocused) expanded = false }
                        .onPreviewKeyEvent { event ->
                            if (event.type == KeyEventType.KeyDown && event.key == Key.Backspace && query.isEmpty() && hasValue) {
                                onValuesChange(values.dropLast(1))
                                true
                            } else {
                                false
                            }
                        },
                    enabled = isEnabled,
                    singleLine = true,
                    textStyle = Typography.base.copy(color = if (isEnabled) colors.label else colors.labelQuaternary),
                    cursorBrush = SolidColor(colors.accent),
                    interactionSource = interaction,
                    decorationBox = { inner ->
                        Box(contentAlignment = Alignment.CenterStart) {
                            if (query.isEmpty() && !hasValue) {
                                BasicText(placeholder, style = Typography.base.copy(color = colors.labelSecondary), maxLines = 1)
                            }
                            inner()
                        }
                    },
                )
            }
        }
        ComboboxPopup(
            expanded = expanded,
            onDismissRequest = { expanded = false },
            items = visible,
            isSelected = { it in values },
            itemText = itemText,
            groupBy = groupBy,
            emptyText = emptyText,
            onItemClick = { item ->
                onValuesChange(if (item in values) values - item else values + item)
                query = ""
            },
        )
    }
}

@Composable
private fun ComboboxIconButton(
    icon: ImageVector,
    label: String,
    enabled: Boolean,
    tint: Color,
    onClick: () -> Unit,
) {
    val colors = EsuissTheme.colors
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    Box(
        modifier = Modifier
            .size(32.dp)
            .clickable(interactionSource = interaction, indication = null, enabled = enabled, role = Role.Button, onClick = onClick)
            .semantics { contentDescription = label },
        contentAlignment = Alignment.Center,
    ) {
        Box(
            modifier = Modifier
                .size(24.dp)
                .background(if (pressed) colors.itemPressed else Color.Transparent, CircleShape),
            contentAlignment = Alignment.Center,
        ) {
            Icon(icon, contentDescription = null, size = 16.dp, tint = if (enabled) tint else colors.labelQuaternary)
        }
    }
}

@Composable
private fun ComboboxChip(text: String, enabled: Boolean, onRemove: () -> Unit) {
    val colors = EsuissTheme.colors
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    val foreground = if (enabled) colors.link else colors.labelQuaternary
    Row(
        modifier = Modifier
            .height(22.dp)
            .background(if (enabled) colors.accentSurface else colors.controlDisabled, CircleShape)
            .padding(start = 10.dp, end = 2.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        BasicText(text, style = Typography.xs.copy(color = foreground), maxLines = 1)
        Box(
            modifier = Modifier
                .size(22.dp)
                .clip(CircleShape)
                .clickable(interactionSource = interaction, indication = null, enabled = enabled, role = Role.Button, onClick = onRemove)
                .semantics { contentDescription = "Remove $text" }
                .alpha(if (pressed) 1f else 0.5f),
            contentAlignment = Alignment.Center,
        ) {
            Icon(PhosphorIcons.Regular.X, contentDescription = null, size = 12.dp, tint = foreground)
        }
    }
}

@Composable
private fun <T> ComboboxPopup(
    expanded: Boolean,
    onDismissRequest: () -> Unit,
    items: List<T>,
    isSelected: (T) -> Boolean,
    itemText: (T) -> String,
    groupBy: ((T) -> String)?,
    emptyText: String,
    onItemClick: (T) -> Unit,
) {
    val colors = EsuissTheme.colors
    AnchoredPopup(
        expanded = expanded,
        onDismissRequest = onDismissRequest,
        side = PopupSide.Bottom,
        align = PopupAlign.Start,
        sideOffset = 6.dp,
        focusable = false,
    ) { placement ->
        val width = with(LocalDensity.current) { placement.anchorWidth.toDp() }
        Column(
            modifier = Modifier
                .width(width)
                .raisedSurface(colors, RoundedCornerShape(Radius.xl))
                .heightIn(max = 288.dp)
                .verticalScroll(rememberScrollState())
                .padding(6.dp),
        ) {
            if (items.isEmpty()) {
                BasicText(
                    emptyText,
                    modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp),
                    style = Typography.sm.copy(color = colors.labelSecondary, textAlign = TextAlign.Center),
                )
            } else if (groupBy == null) {
                items.forEach { ComboboxOption(itemText(it), isSelected(it)) { onItemClick(it) } }
            } else {
                items.groupBy(groupBy).entries.forEachIndexed { index, (label, group) ->
                    if (index > 0) {
                        MenuSeparatorLine(Modifier, bleed = 6.dp, color = colors.separator)
                    }
                    BasicText(
                        label,
                        modifier = Modifier
                            .fillMaxWidth()
                            .semantics { heading() }
                            .padding(horizontal = 12.dp, vertical = 10.dp),
                        style = Typography.xs.copy(color = colors.labelSecondary, fontWeight = FontWeight.SemiBold),
                    )
                    group.forEach { ComboboxOption(itemText(it), isSelected(it)) { onItemClick(it) } }
                }
            }
        }
    }
}

@Composable
private fun ComboboxOption(text: String, selected: Boolean, onClick: () -> Unit) {
    val colors = EsuissTheme.colors
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    val shape = RoundedCornerShape(Radius.md)
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .heightIn(min = 44.dp)
            .clip(shape)
            .background(if (pressed) colors.itemPressed else Color.Transparent, shape)
            .toggleable(
                value = selected,
                interactionSource = interaction,
                indication = null,
                role = Role.Checkbox,
                onValueChange = { onClick() },
            )
            .padding(start = 12.dp, end = 8.dp),
        contentAlignment = Alignment.CenterStart,
    ) {
        BasicText(
            text,
            modifier = Modifier.padding(end = 24.dp, top = 8.dp, bottom = 8.dp),
            style = Typography.base.copy(color = colors.label),
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
        )
        if (selected) {
            Icon(
                PhosphorIcons.Regular.Check,
                contentDescription = null,
                modifier = Modifier.align(Alignment.CenterEnd),
                size = 16.dp,
                tint = colors.link,
            )
        }
    }
}
