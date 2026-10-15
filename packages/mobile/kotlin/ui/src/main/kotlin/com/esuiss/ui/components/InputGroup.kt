package com.esuiss.ui.components

import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.text.selection.LocalTextSelectionColors
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.Stable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.Layout
import androidx.compose.ui.layout.Placeable
import androidx.compose.ui.layout.layoutId
import androidx.compose.ui.semantics.error
import androidx.compose.ui.semantics.isTraversalGroup
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.Constraints
import androidx.compose.ui.unit.dp
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography

enum class InputGroupAddonAlign { InlineStart, InlineEnd, BlockStart, BlockEnd }

enum class InputGroupButtonSize(internal val buttonSize: ButtonSize) {
    Xs(ButtonSize.Xs),
    Sm(ButtonSize.Sm),
    IconXs(ButtonSize.IconXs),
    IconSm(ButtonSize.IconSm),
}

private object InputGroupControl

@Stable
private class InputGroupState {
    val focusRequester = FocusRequester()
    var focused by mutableStateOf(false)
    var enabled by mutableStateOf(true)
    var invalid by mutableStateOf(false)
    var inlineStart by mutableIntStateOf(0)
    var inlineEnd by mutableIntStateOf(0)
    var blockStart by mutableIntStateOf(0)
    var blockEnd by mutableIntStateOf(0)
    var multiline by mutableIntStateOf(0)
    var controls by mutableIntStateOf(0)
}

@Stable
private class InputGroupAddonState {
    var buttons by mutableIntStateOf(0)
}

private val LocalInputGroup = staticCompositionLocalOf<InputGroupState?> { null }

private val LocalInputGroupAddon = staticCompositionLocalOf<InputGroupAddonState?> { null }

@Composable
fun InputGroup(
    modifier: Modifier = Modifier,
    enabled: Boolean = LocalFieldState.current.enabled,
    invalid: Boolean = LocalFieldState.current.invalid,
    content: @Composable () -> Unit,
) {
    val colors = EsuissTheme.colors
    val state = remember { InputGroupState() }
    state.enabled = enabled
    state.invalid = invalid
    val tall = state.blockStart > 0 || state.blockEnd > 0 || state.multiline > 0
    val item = rememberButtonGroupItem(LocalButtonGroup.current, RoundedCornerShape(if (tall) Radius.xl else Radius.lg))
    CompositionLocalProvider(
        LocalInputGroup provides state,
        LocalTextSelectionColors provides formSelectionColors(colors),
    ) {
        Layout(
            content = content,
            modifier = modifier
                .then(item.modifier)
                .fillMaxWidth()
                .formInputSurface(colors, item.shape, state.focused, invalid, enabled)
                .semantics { isTraversalGroup = true },
        ) { measurables, constraints ->
            val width = if (constraints.hasBoundedWidth) constraints.maxWidth else 320.dp.roundToPx()
            val rowMin = 44.dp.roundToPx()
            val blockStart = measurables.filter { it.layoutId == InputGroupAddonAlign.BlockStart }
                .map { it.measure(Constraints(minWidth = width, maxWidth = width)) }
            val blockEnd = measurables.filter { it.layoutId == InputGroupAddonAlign.BlockEnd }
                .map { it.measure(Constraints(minWidth = width, maxWidth = width)) }
            var used = 0
            val start = measurables.filter { it.layoutId == InputGroupAddonAlign.InlineStart }
                .map { it.measure(Constraints(maxWidth = (width - used).coerceAtLeast(0))).also { p -> used += p.width } }
            val end = measurables.filter { it.layoutId == InputGroupAddonAlign.InlineEnd }
                .map { it.measure(Constraints(maxWidth = (width - used).coerceAtLeast(0))).also { p -> used += p.width } }
            val middleMeasurables = measurables.filter { it.layoutId !is InputGroupAddonAlign }
            val remaining = (width - used).coerceAtLeast(0)
            val share = if (middleMeasurables.isEmpty()) 0 else remaining / middleMeasurables.size
            val middle = middleMeasurables.map { it.measure(Constraints(minWidth = share, maxWidth = share)) }
            val inline: List<Placeable> = start + middle + end
            val rowHeight = maxOf(if (tall) 0 else rowMin, inline.maxOfOrNull { it.height } ?: 0)
            val height = blockStart.sumOf { it.height } + rowHeight + blockEnd.sumOf { it.height }
            layout(width, height.coerceIn(constraints.minHeight, constraints.maxHeight)) {
                var y = 0
                blockStart.forEach {
                    it.placeRelative(0, y)
                    y += it.height
                }
                var x = 0
                inline.forEach {
                    it.placeRelative(x, y + (rowHeight - it.height) / 2)
                    x += it.width
                }
                y += rowHeight
                blockEnd.forEach {
                    it.placeRelative(0, y)
                    y += it.height
                }
            }
        }
    }
}

@Composable
fun InputGroupAddon(
    modifier: Modifier = Modifier,
    align: InputGroupAddonAlign = InputGroupAddonAlign.InlineStart,
    content: @Composable RowScope.() -> Unit,
) {
    val colors = EsuissTheme.colors
    val group = LocalInputGroup.current
    val addon = remember { InputGroupAddonState() }
    if (group != null) {
        DisposableEffect(group, align) {
            when (align) {
                InputGroupAddonAlign.InlineStart -> group.inlineStart += 1
                InputGroupAddonAlign.InlineEnd -> group.inlineEnd += 1
                InputGroupAddonAlign.BlockStart -> group.blockStart += 1
                InputGroupAddonAlign.BlockEnd -> group.blockEnd += 1
            }
            onDispose {
                when (align) {
                    InputGroupAddonAlign.InlineStart -> group.inlineStart -= 1
                    InputGroupAddonAlign.InlineEnd -> group.inlineEnd -= 1
                    InputGroupAddonAlign.BlockStart -> group.blockStart -= 1
                    InputGroupAddonAlign.BlockEnd -> group.blockEnd -= 1
                }
            }
        }
    }
    val enabled = group?.enabled ?: true
    val hasButton = addon.buttons > 0
    val hasControl = (group?.controls ?: 0) > 0 && (group?.multiline ?: 0) == 0
    val edge = if (hasButton) 8.dp else 12.dp
    val padding = when (align) {
        InputGroupAddonAlign.InlineStart -> Modifier.padding(start = edge, top = 8.dp, bottom = 8.dp)
        InputGroupAddonAlign.InlineEnd -> Modifier.padding(end = edge, top = 8.dp, bottom = 8.dp)
        InputGroupAddonAlign.BlockStart -> Modifier.padding(start = 12.dp, end = 12.dp, top = if (hasControl) 14.dp else 12.dp)
        InputGroupAddonAlign.BlockEnd -> Modifier.padding(start = 12.dp, end = 12.dp, bottom = if (hasControl) 14.dp else 12.dp)
    }
    val foreground = colors.mutedForeground
    Row(
        modifier = modifier
            .layoutId(align)
            .pointerInput(group) {
                detectTapGestures {
                    if (group != null && group.enabled && group.controls > 0) group.focusRequester.requestFocus()
                }
            }
            .then(padding),
        horizontalArrangement = Arrangement.spacedBy(8.dp, if (align == InputGroupAddonAlign.BlockStart || align == InputGroupAddonAlign.BlockEnd) Alignment.Start else Alignment.CenterHorizontally),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        CompositionLocalProvider(
            LocalInputGroupAddon provides addon,
            LocalContentStyle provides Typography.base.copy(color = foreground),
            LocalContentColor provides foreground,
            LocalIconSize provides 16.dp,
        ) {
            content()
        }
    }
}

@Composable
fun InputGroupText(
    modifier: Modifier = Modifier,
    content: @Composable RowScope.() -> Unit,
) {
    Row(
        modifier = modifier,
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalAlignment = Alignment.CenterVertically,
        content = content,
    )
}

@Composable
fun InputGroupText(text: String, modifier: Modifier = Modifier) {
    BasicText(text, modifier = modifier, style = LocalContentStyle.current, maxLines = 1)
}

@Composable
fun InputGroupButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    size: InputGroupButtonSize = InputGroupButtonSize.Xs,
    variant: ButtonVariant = ButtonVariant.Ghost,
    enabled: Boolean = true,
    content: @Composable RowScope.() -> Unit,
) {
    val addon = LocalInputGroupAddon.current
    if (addon != null) {
        DisposableEffect(addon) {
            addon.buttons += 1
            onDispose { addon.buttons -= 1 }
        }
    }
    val groupEnabled = LocalInputGroup.current?.enabled ?: true
    Button(
        onClick = onClick,
        modifier = modifier,
        variant = variant,
        size = size.buttonSize,
        enabled = enabled && groupEnabled,
    ) {
        CompositionLocalProvider(LocalIconSize provides if (size == InputGroupButtonSize.Xs) 14.dp else LocalIconSize.current) {
            content()
        }
    }
}

@Composable
fun InputGroupButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    size: InputGroupButtonSize = InputGroupButtonSize.Xs,
    variant: ButtonVariant = ButtonVariant.Ghost,
    enabled: Boolean = true,
) {
    InputGroupButton(onClick, modifier, size, variant, enabled) {
        BasicText(text, style = LocalContentStyle.current, maxLines = 1)
    }
}

@Composable
private fun RegisterControl(group: InputGroupState?, multiline: Boolean) {
    if (group == null) return
    DisposableEffect(group, multiline) {
        group.controls += 1
        if (multiline) group.multiline += 1
        onDispose {
            group.controls -= 1
            if (multiline) group.multiline -= 1
        }
    }
}

@Composable
fun InputGroupInput(
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    placeholder: String? = null,
    readOnly: Boolean = false,
    keyboardOptions: KeyboardOptions = KeyboardOptions.Default,
    keyboardActions: KeyboardActions = KeyboardActions.Default,
    visualTransformation: VisualTransformation = VisualTransformation.None,
) {
    val group = LocalInputGroup.current
    RegisterControl(group, multiline = false)
    val colors = EsuissTheme.colors
    val enabled = group?.enabled ?: true
    val invalid = group?.invalid ?: false
    val textStyle = Typography.base.copy(color = colors.foreground)
    val start = if ((group?.inlineStart ?: 0) > 0) 6.dp else 12.dp
    val end = if ((group?.inlineEnd ?: 0) > 0) 6.dp else 12.dp
    val hasBlockStart = (group?.blockStart ?: 0) > 0
    val hasBlockEnd = (group?.blockEnd ?: 0) > 0
    val top = when {
        hasBlockEnd -> 12.dp
        hasBlockStart -> 8.dp
        else -> 11.dp
    }
    val bottom = when {
        hasBlockStart -> 12.dp
        hasBlockEnd -> 8.dp
        else -> 11.dp
    }
    BasicTextField(
        value = value,
        onValueChange = onValueChange,
        modifier = modifier
            .layoutId(InputGroupControl)
            .then(if (group != null) Modifier.focusRequester(group.focusRequester).onFocusChanged { group.focused = it.isFocused } else Modifier)
            .then(if (invalid) Modifier.semantics { error("Invalid") } else Modifier),
        enabled = enabled,
        readOnly = readOnly,
        textStyle = textStyle,
        keyboardOptions = keyboardOptions,
        keyboardActions = keyboardActions,
        singleLine = true,
        visualTransformation = visualTransformation,
        cursorBrush = SolidColor(colors.primary),
        decorationBox = { inner ->
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(start = start, end = end, top = top, bottom = bottom),
                contentAlignment = Alignment.CenterStart,
            ) {
                if (value.isEmpty() && placeholder != null) {
                    BasicText(
                        placeholder,
                        style = textStyle.copy(color = colors.mutedForeground),
                        maxLines = 1,
                    )
                }
                inner()
            }
        },
    )
}

@Composable
fun InputGroupTextarea(
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    placeholder: String? = null,
    readOnly: Boolean = false,
    minLines: Int = 3,
    maxLines: Int = Int.MAX_VALUE,
    keyboardOptions: KeyboardOptions = KeyboardOptions.Default,
    keyboardActions: KeyboardActions = KeyboardActions.Default,
) {
    val group = LocalInputGroup.current
    RegisterControl(group, multiline = true)
    val colors = EsuissTheme.colors
    val enabled = group?.enabled ?: true
    val invalid = group?.invalid ?: false
    val textStyle = Typography.base.copy(color = colors.foreground)
    BasicTextField(
        value = value,
        onValueChange = onValueChange,
        modifier = modifier
            .layoutId(InputGroupControl)
            .then(if (group != null) Modifier.focusRequester(group.focusRequester).onFocusChanged { group.focused = it.isFocused } else Modifier)
            .then(if (invalid) Modifier.semantics { error("Invalid") } else Modifier),
        enabled = enabled,
        readOnly = readOnly,
        textStyle = textStyle,
        keyboardOptions = keyboardOptions,
        keyboardActions = keyboardActions,
        minLines = minLines,
        maxLines = maxLines,
        cursorBrush = SolidColor(colors.primary),
        decorationBox = { inner ->
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 12.dp, vertical = 10.dp),
                contentAlignment = Alignment.TopStart,
            ) {
                if (value.isEmpty() && placeholder != null) {
                    BasicText(
                        placeholder,
                        style = textStyle.copy(color = colors.mutedForeground),
                    )
                }
                inner()
            }
        },
    )
}
