package com.esuiss.ui.components

import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsFocusedAsState
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.text.selection.LocalTextSelectionColors
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.layout.layoutId
import androidx.compose.ui.semantics.error
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography

enum class InputSize(
    internal val height: Dp,
    internal val horizontalPadding: Dp,
    internal val radius: Dp,
) {
    Default(44.dp, 12.dp, Radius.lg),
    Md(36.dp, 12.dp, Radius.lg),
    Sm(32.dp, 10.dp, Radius.md),
}

@Composable
fun Input(
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    size: InputSize = InputSize.Default,
    enabled: Boolean = LocalFieldState.current.enabled,
    readOnly: Boolean = false,
    invalid: Boolean = LocalFieldState.current.invalid,
    placeholder: String? = null,
    keyboardOptions: KeyboardOptions = KeyboardOptions.Default,
    keyboardActions: KeyboardActions = KeyboardActions.Default,
    visualTransformation: VisualTransformation = VisualTransformation.None,
    interactionSource: MutableInteractionSource? = null,
) {
    val colors = EsuissTheme.colors
    val source = interactionSource ?: remember { MutableInteractionSource() }
    val focused by source.collectIsFocusedAsState()
    val group = LocalButtonGroup.current
    val item = rememberButtonGroupItem(group, RoundedCornerShape(size.radius))
    val textStyle = (if (size == InputSize.Default) Typography.base else Typography.sm)
        .copy(color = colors.foreground)
    CompositionLocalProvider(LocalTextSelectionColors provides formSelectionColors(colors)) {
        BasicTextField(
            value = value,
            onValueChange = onValueChange,
            modifier = modifier
                .then(if (group != null) Modifier.layoutId(ButtonGroupFill) else Modifier)
                .then(item.modifier)
                .fillMaxWidth()
                .height(size.height)
                .formInputSurface(colors, item.shape, focused, invalid, enabled)
                .then(if (invalid) Modifier.semantics { error("Invalid") } else Modifier),
            enabled = enabled,
            readOnly = readOnly,
            textStyle = textStyle,
            keyboardOptions = keyboardOptions,
            keyboardActions = keyboardActions,
            singleLine = true,
            visualTransformation = visualTransformation,
            interactionSource = source,
            cursorBrush = SolidColor(colors.primary),
            decorationBox = { inner ->
                Box(
                    modifier = Modifier.padding(horizontal = size.horizontalPadding),
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
}
