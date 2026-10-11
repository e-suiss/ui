package com.esuiss.ui.components

import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.selection.toggleable
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.error
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.shadow

enum class SwitchSize(
    internal val width: Dp,
    internal val height: Dp,
    internal val thumbHeight: Dp,
    internal val thumbWidth: Dp,
    internal val pressedThumbWidth: Dp,
    internal val travel: Dp,
    internal val pressedTravel: Dp,
) {
    Default(52.dp, 24.dp, 20.dp, 32.dp, 36.dp, 16.dp, 12.dp),
    Sm(44.dp, 20.dp, 16.dp, 26.dp, 30.dp, 14.dp, 10.dp),
}

@Composable
fun Switch(
    checked: Boolean,
    onCheckedChange: ((Boolean) -> Unit)?,
    modifier: Modifier = Modifier,
    size: SwitchSize = SwitchSize.Default,
    enabled: Boolean = LocalFieldState.current.enabled,
    invalid: Boolean = LocalFieldState.current.invalid,
    interactionSource: MutableInteractionSource? = null,
) {
    val colors = EsuissTheme.colors
    val haptics = rememberHaptics()
    val source = interactionSource ?: remember { MutableInteractionSource() }
    val pressed by source.collectIsPressedAsState()
    val squeezed = pressed && enabled && onCheckedChange != null
    val spec = tween<Dp>(200, easing = FormEasing)
    val thumbWidth by animateDpAsState(if (squeezed) size.pressedThumbWidth else size.thumbWidth, spec, label = "thumb")
    val travel by animateDpAsState(
        when {
            !checked -> 0.dp
            squeezed -> size.pressedTravel
            else -> size.travel
        },
        spec,
        label = "travel",
    )
    val track = when {
        checked && !enabled -> colors.accentDisabled
        checked -> colors.accent
        !enabled -> colors.controlDisabled
        else -> colors.labelQuaternary
    }
    val border = when {
        invalid && enabled -> colors.danger
        checked && enabled -> colors.accent
        else -> Color.Transparent
    }
    val toggle = if (onCheckedChange != null) {
        Modifier
            .toggleable(
                value = checked,
                interactionSource = source,
                indication = null,
                enabled = enabled,
                role = Role.Switch,
                onValueChange = {
                    haptics.toggle(it)
                    onCheckedChange(it)
                },
            )
            .formTouchTarget()
    } else {
        Modifier
    }
    Box(
        modifier = modifier
            .then(toggle)
            .then(if (invalid) Modifier.semantics { error("Invalid") } else Modifier)
            .size(size.width, size.height)
            .background(track, CircleShape)
            .border(2.dp, border, CircleShape)
            .padding(2.dp),
        contentAlignment = Alignment.CenterStart,
    ) {
        Box(
            Modifier
                .offset(x = travel)
                .size(thumbWidth, size.thumbHeight)
                .shadow(FormShadowSm, CircleShape)
                .background(if (colors.isDark) colors.label else colors.surface, CircleShape),
        )
    }
}
