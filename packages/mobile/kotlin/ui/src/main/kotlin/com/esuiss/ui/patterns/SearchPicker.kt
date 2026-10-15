package com.esuiss.ui.patterns

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.selection.LocalTextSelectionColors
import androidx.compose.foundation.text.selection.TextSelectionColors
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalWindowInfo
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.selected
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.CaretUpDown
import com.adamglin.phosphoricons.regular.Check
import com.adamglin.phosphoricons.regular.MagnifyingGlass
import com.esuiss.ui.components.Drawer
import com.esuiss.ui.components.DrawerHeader
import com.esuiss.ui.components.DrawerTitle
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.RegisterPaneTitle
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography

@Immutable
data class SearchPickerItem(
    val value: String,
    val label: String,
    val group: String? = null,
    val enabled: Boolean = true,
)

@Composable
fun SearchPicker(
    items: List<SearchPickerItem>,
    value: String?,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    placeholder: String = "",
    searchPlaceholder: String = "Search...",
    emptyText: String = "No results found.",
    title: String? = null,
    enabled: Boolean = true,
    invalid: Boolean? = null,
    floating: Boolean = false,
    showCloseButton: Boolean = false,
    closeLabel: String? = null,
) {
    var open by remember { mutableStateOf(false) }
    val selected = items.firstOrNull { it.value == value }
    PickerTrigger(
        text = selected?.label,
        placeholder = placeholder,
        modifier = modifier,
        enabled = enabled,
        invalid = invalid,
        onClick = { open = true },
        trailing = { tint -> Icon(PhosphorIcons.Regular.CaretUpDown, contentDescription = null, size = 16.dp, tint = tint) },
    )
    Drawer(
        open = open,
        onOpenChange = { open = it },
        floating = floating,
        showSwipeHandle = true,
        showCloseButton = showCloseButton,
        closeLabel = closeLabel,
    ) {
        if (title != null) {
            DrawerHeader { DrawerTitle(title) }
        } else {
            RegisterPaneTitle(placeholder)
        }
        SearchPickerContent(
            items = items,
            value = value,
            searchPlaceholder = searchPlaceholder,
            emptyText = emptyText,
            endInset = when {
                showCloseButton && closeLabel != null -> 84.dp
                showCloseButton -> 44.dp
                else -> 0.dp
            },
            onSelect = {
                onValueChange(it)
                open = false
            },
        )
    }
}

@Composable
private fun SearchPickerContent(
    items: List<SearchPickerItem>,
    value: String?,
    searchPlaceholder: String,
    emptyText: String,
    endInset: Dp,
    onSelect: (String) -> Unit,
) {
    val colors = EsuissTheme.colors
    var query by remember { mutableStateOf("") }
    val focus = remember { FocusRequester() }
    LaunchedEffect(Unit) { focus.requestFocus() }
    val visible = if (query.isBlank()) items else items.filter { it.label.contains(query.trim(), ignoreCase = true) }
    val groups = visible.groupBy { it.group.orEmpty() }.entries.toList()
    val windowHeight = with(LocalDensity.current) { LocalWindowInfo.current.containerSize.height.toDp() }
    val inputStyle = Typography.xl.copy(color = colors.foreground)

    Column(modifier = Modifier.fillMaxWidth().padding(start = 12.dp, end = 12.dp, top = 5.dp, bottom = 12.dp)) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(end = endInset)
                .height(56.dp)
                .drawBehind {
                    val stroke = 1.dp.toPx()
                    drawRect(colors.border, Offset(0f, size.height - stroke), Size(size.width, stroke))
                }
                .padding(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Icon(PhosphorIcons.Regular.MagnifyingGlass, contentDescription = null, size = 22.dp, tint = colors.mutedForeground)
            CompositionLocalProvider(
                LocalTextSelectionColors provides TextSelectionColors(colors.primary, colors.primary.copy(alpha = 0.3f)),
            ) {
                BasicTextField(
                    value = query,
                    onValueChange = { query = it },
                    modifier = Modifier.weight(1f).focusRequester(focus),
                    singleLine = true,
                    textStyle = inputStyle,
                    cursorBrush = SolidColor(colors.primary),
                    decorationBox = { inner ->
                        Box(contentAlignment = Alignment.CenterStart) {
                            if (query.isEmpty()) {
                                BasicText(
                                    searchPlaceholder,
                                    style = inputStyle.copy(color = colors.mutedForeground),
                                    maxLines = 1,
                                )
                            }
                            inner()
                        }
                    },
                )
            }
        }
        LazyColumn(
            modifier = Modifier
                .fillMaxWidth()
                .heightIn(min = windowHeight * 0.4f, max = windowHeight * 0.6f),
            contentPadding = PaddingValues(6.dp),
        ) {
            if (visible.isEmpty()) {
                item(key = "empty") {
                    BasicText(
                        emptyText,
                        modifier = Modifier.fillMaxWidth().padding(vertical = 40.dp),
                        style = Typography.base.copy(color = colors.mutedForeground, textAlign = TextAlign.Center),
                    )
                }
            }
            groups.forEachIndexed { index, (group, groupItems) ->
                if (group.isNotEmpty()) {
                    item(key = "group:$group") {
                        BasicText(
                            group,
                            modifier = Modifier
                                .fillMaxWidth()
                                .semantics { heading() }
                                .padding(start = 12.dp, end = 12.dp, top = if (index > 0) 12.dp else 4.dp, bottom = 6.dp),
                            style = Typography.xs.copy(color = colors.mutedForeground, fontWeight = FontWeight.SemiBold),
                        )
                    }
                } else if (index > 0) {
                    item(key = "gap:$index") { Box(Modifier.height(8.dp)) }
                }
                items(groupItems, key = { "item:${it.value}" }) { item ->
                    SearchPickerOption(item, item.value == value) { onSelect(item.value) }
                }
            }
        }
    }
}

@Composable
private fun SearchPickerOption(item: SearchPickerItem, checked: Boolean, onClick: () -> Unit) {
    val colors = EsuissTheme.colors
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    val shape = RoundedCornerShape(Radius.lg)
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .height(40.dp)
            .clip(shape)
            .alpha(
                when {
                    !item.enabled -> 0.5f
                    pressed -> 0.8f
                    else -> 1f
                },
            )
            .clickable(
                interactionSource = interaction,
                indication = null,
                enabled = item.enabled,
                role = Role.RadioButton,
                onClick = onClick,
            )
            .semantics { selected = checked }
            .padding(horizontal = 12.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        BasicText(
            item.label,
            modifier = Modifier.weight(1f),
            style = Typography.base.copy(color = colors.foreground),
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
        )
        if (checked) {
            Icon(PhosphorIcons.Regular.Check, contentDescription = null, size = 20.dp, tint = colors.mutedForeground)
        }
    }
}
