package com.esuiss.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.selection.selectableGroup
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.error
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography
import com.esuiss.ui.theme.shadow

private class RadioGroupState(
    val selected: Any?,
    val onSelect: (Any?) -> Unit,
    val enabled: Boolean,
    val invalid: Boolean,
)

private val LocalRadioGroupState = staticCompositionLocalOf<RadioGroupState?> { null }

@Suppress("UNCHECKED_CAST")
@Composable
fun <T> RadioGroup(
    value: T?,
    onValueChange: (T) -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = LocalFieldState.current.enabled,
    invalid: Boolean = LocalFieldState.current.invalid,
    content: @Composable ColumnScope.() -> Unit,
) {
    val state = RadioGroupState(value, { onValueChange(it as T) }, enabled, invalid)
    CompositionLocalProvider(LocalRadioGroupState provides state) {
        Column(
            modifier = modifier.fillMaxWidth().selectableGroup(),
            verticalArrangement = Arrangement.spacedBy(12.dp),
            content = content,
        )
    }
}

@Composable
fun <T> RadioGroupItem(
    value: T,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    invalid: Boolean = false,
    interactionSource: MutableInteractionSource? = null,
    label: (@Composable () -> Unit)? = null,
) {
    val colors = EsuissTheme.colors
    val group = LocalRadioGroupState.current
    val selected = group?.selected == value
    val active = enabled && (group?.enabled ?: true)
    val error = invalid || (group?.invalid ?: false)
    val source = interactionSource ?: remember { MutableInteractionSource() }
    val pressed by source.collectIsPressedAsState()
    val look = selectionControlLook(colors, selected, active, error, pressed)
    val select = Modifier
        .selectable(
            selected = selected,
            interactionSource = source,
            indication = null,
            enabled = active && group != null,
            role = Role.RadioButton,
            onClick = { group?.onSelect(value) },
        )
        .then(if (error) Modifier.semantics { error("Invalid") } else Modifier)
    val control = @Composable { controlModifier: Modifier ->
        Box(
            modifier = controlModifier
                .size(16.dp)
                .then(if (look.shadow) Modifier.shadow(FormShadowXs, CircleShape) else Modifier)
                .background(look.background, CircleShape)
                .border(1.dp, look.border, CircleShape),
            contentAlignment = Alignment.Center,
        ) {
            if (selected) {
                Box(Modifier.size(if (colors.isDark) 10.dp else 8.dp).background(colors.onAccent, CircleShape))
            }
        }
    }
    if (label == null) {
        control(modifier.then(select).formTouchTarget())
    } else {
        val color = if (active) colors.label else colors.labelQuaternary
        Row(
            modifier = modifier.then(select).heightIn(min = 24.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            control(Modifier)
            CompositionLocalProvider(
                LocalContentStyle provides Typography.base.copy(color = color),
                LocalContentColor provides color,
                content = label,
            )
        }
    }
}
