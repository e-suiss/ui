package com.esuiss.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.selection.triStateToggleable
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.error
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.state.ToggleableState
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.Check
import com.adamglin.phosphoricons.regular.Minus
import com.esuiss.ui.theme.Colors
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.shadow

@Composable
fun Checkbox(
    checked: Boolean,
    onCheckedChange: ((Boolean) -> Unit)?,
    modifier: Modifier = Modifier,
    enabled: Boolean = LocalFieldState.current.enabled,
    invalid: Boolean = LocalFieldState.current.invalid,
    interactionSource: MutableInteractionSource? = null,
) {
    TriStateCheckbox(
        state = ToggleableState(checked),
        onClick = onCheckedChange?.let { { it(!checked) } },
        modifier = modifier,
        enabled = enabled,
        invalid = invalid,
        interactionSource = interactionSource,
    )
}

@Composable
fun TriStateCheckbox(
    state: ToggleableState,
    onClick: (() -> Unit)?,
    modifier: Modifier = Modifier,
    enabled: Boolean = LocalFieldState.current.enabled,
    invalid: Boolean = LocalFieldState.current.invalid,
    interactionSource: MutableInteractionSource? = null,
) {
    val colors = EsuissTheme.colors
    val source = interactionSource ?: remember { MutableInteractionSource() }
    val pressed by source.collectIsPressedAsState()
    val on = state != ToggleableState.Off
    val shape = RoundedCornerShape(4.dp)
    val look = selectionControlLook(colors, on, enabled, invalid, pressed)
    val toggle = if (onClick != null) {
        Modifier
            .triStateToggleable(
                state = state,
                interactionSource = source,
                indication = null,
                enabled = enabled,
                role = Role.Checkbox,
                onClick = onClick,
            )
            .formTouchTarget()
    } else {
        Modifier
    }
    Box(
        modifier = modifier
            .then(toggle)
            .then(if (invalid) Modifier.semantics { error("Invalid") } else Modifier)
            .size(16.dp)
            .then(if (look.shadow) Modifier.shadow(FormShadowXs, shape) else Modifier)
            .background(look.background, shape)
            .border(1.dp, look.border, shape),
        contentAlignment = Alignment.Center,
    ) {
        if (on) {
            Icon(
                if (state == ToggleableState.Indeterminate) PhosphorIcons.Regular.Minus else PhosphorIcons.Regular.Check,
                contentDescription = null,
                size = 14.dp,
                tint = colors.onAccent,
            )
        }
    }
}

internal class SelectionControlLook(val background: Color, val border: Color, val shadow: Boolean)

internal fun selectionControlLook(
    colors: Colors,
    on: Boolean,
    enabled: Boolean,
    invalid: Boolean,
    pressed: Boolean,
): SelectionControlLook = when {
    on && !enabled -> SelectionControlLook(colors.accentDisabled, Color.Transparent, false)
    on -> {
        val color = if (pressed) colors.accentPressed else colors.accent
        SelectionControlLook(color, color, false)
    }
    !enabled -> SelectionControlLook(
        colors.controlDisabled,
        if (colors.isDark) Color.Transparent else colors.label.copy(alpha = 0.1f),
        false,
    )
    colors.isDark -> SelectionControlLook(
        colors.labelQuaternary,
        if (invalid) colors.danger else Color.Transparent,
        false,
    )
    else -> SelectionControlLook(
        if (pressed) colors.control else colors.surface,
        if (invalid) colors.danger else colors.label.copy(alpha = 0.25f),
        true,
    )
}
