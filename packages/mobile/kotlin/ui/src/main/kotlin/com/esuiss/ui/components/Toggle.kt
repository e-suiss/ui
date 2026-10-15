package com.esuiss.ui.components

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.selection.toggleable
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.esuiss.ui.theme.Colors
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography

enum class ToggleVariant { Default, Outline }

enum class ToggleSize(internal val height: Dp, internal val horizontalPadding: Dp) {
    Default(36.dp, 12.dp),
    Sm(32.dp, 12.dp),
    Lg(40.dp, 16.dp),
}

@Composable
fun Toggle(
    pressed: Boolean,
    onPressedChange: (Boolean) -> Unit,
    modifier: Modifier = Modifier,
    variant: ToggleVariant = ToggleVariant.Default,
    size: ToggleSize = ToggleSize.Default,
    enabled: Boolean = true,
    interactionSource: MutableInteractionSource? = null,
    content: @Composable RowScope.() -> Unit,
) {
    val source = interactionSource ?: remember { MutableInteractionSource() }
    val touching by source.collectIsPressedAsState()
    val colors = EsuissTheme.colors
    val haptics = rememberHaptics()
    ToggleSurface(
        modifier = modifier.toggleSemantics(pressed, enabled, source, multiple = true) {
            haptics.toggle(!pressed)
            onPressedChange(!pressed)
        },
        size = size,
        shape = RoundedCornerShape(Radius.lg),
        outlined = variant == ToggleVariant.Outline,
        background = toggleBackground(colors, pressed),
        foreground = toggleForeground(colors, pressed),
        scaled = touching && enabled,
        alpha = toggleAlpha(enabled, touching),
        content = content,
    )
}

@Composable
fun Toggle(
    text: String,
    pressed: Boolean,
    onPressedChange: (Boolean) -> Unit,
    modifier: Modifier = Modifier,
    variant: ToggleVariant = ToggleVariant.Default,
    size: ToggleSize = ToggleSize.Default,
    enabled: Boolean = true,
) {
    Toggle(pressed, onPressedChange, modifier, variant, size, enabled) {
        BasicText(text, style = LocalContentStyle.current, maxLines = 1)
    }
}

internal fun toggleBackground(colors: Colors, on: Boolean): Color =
    if (on) colors.accent else Color.Transparent

internal fun toggleForeground(colors: Colors, on: Boolean): Color =
    if (on) colors.primary else colors.foreground

internal fun toggleAlpha(enabled: Boolean, touching: Boolean): Float = when {
    !enabled -> 0.5f
    touching -> 0.8f
    else -> 1f
}

@Composable
internal fun ToggleSurface(
    modifier: Modifier,
    size: ToggleSize,
    shape: Shape,
    outlined: Boolean,
    background: Color,
    foreground: Color,
    scaled: Boolean,
    alpha: Float = 1f,
    horizontalPadding: Dp = size.horizontalPadding,
    content: @Composable RowScope.() -> Unit,
) {
    val colors = EsuissTheme.colors
    val scale by animateFloatAsState(if (scaled) 0.96f else 1f, tween(150), label = "toggle")
    Row(
        modifier = modifier
            .graphicsLayer {
                scaleX = scale
                scaleY = scale
                this.alpha = alpha
            }
            .height(size.height)
            .defaultMinSize(minWidth = size.height)
            .clip(shape)
            .background(background, shape)
            .then(if (outlined) Modifier.border(1.dp, colors.border, shape) else Modifier)
            .padding(horizontal = horizontalPadding),
        horizontalArrangement = Arrangement.spacedBy(4.dp, Alignment.CenterHorizontally),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        CompositionLocalProvider(
            LocalContentStyle provides Typography.sm.copy(color = foreground),
            LocalContentColor provides foreground,
            LocalIconSize provides 16.dp,
        ) {
            content()
        }
    }
}

internal fun Modifier.toggleSemantics(
    on: Boolean,
    enabled: Boolean,
    source: MutableInteractionSource,
    multiple: Boolean,
    onClick: () -> Unit,
): Modifier = if (multiple) {
    toggleable(
        value = on,
        interactionSource = source,
        indication = null,
        enabled = enabled,
        role = Role.Checkbox,
        onValueChange = { onClick() },
    )
} else {
    selectable(
        selected = on,
        interactionSource = source,
        indication = null,
        enabled = enabled,
        role = Role.RadioButton,
        onClick = onClick,
    )
}
