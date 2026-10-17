package com.esuiss.ui.components

import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsFocusedAsState
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
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
import androidx.compose.ui.semantics.error
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Metrics
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography

@Composable
fun Textarea(
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = LocalFieldState.current.enabled,
    readOnly: Boolean = false,
    invalid: Boolean = LocalFieldState.current.invalid,
    placeholder: String? = null,
    minLines: Int = 1,
    maxLines: Int = Int.MAX_VALUE,
    keyboardOptions: KeyboardOptions = KeyboardOptions.Default,
    keyboardActions: KeyboardActions = KeyboardActions.Default,
    interactionSource: MutableInteractionSource? = null,
) {
    val colors = EsuissTheme.colors
    val source = interactionSource ?: remember { MutableInteractionSource() }
    val focused by source.collectIsFocusedAsState()
    val shape = RoundedCornerShape(Metrics.Radius.textarea)
    val textStyle = Typography.base.copy(color = colors.foreground)
    CompositionLocalProvider(LocalTextSelectionColors provides formSelectionColors(colors)) {
        BasicTextField(
            value = value,
            onValueChange = onValueChange,
            modifier = modifier
                .fillMaxWidth()
                .heightIn(min = 64.dp)
                .formInputSurface(colors, shape, focused, invalid, enabled)
                .then(if (invalid) Modifier.semantics { error("Invalid") } else Modifier),
            enabled = enabled,
            readOnly = readOnly,
            textStyle = textStyle,
            keyboardOptions = keyboardOptions,
            keyboardActions = keyboardActions,
            singleLine = false,
            minLines = minLines,
            maxLines = maxLines,
            interactionSource = source,
            cursorBrush = SolidColor(colors.primary),
            decorationBox = { inner ->
                Box(
                    modifier = Modifier.padding(12.dp),
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
}
