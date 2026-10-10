package com.esuiss.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
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
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.esuiss.ui.theme.Colors
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography

enum class ButtonVariant { Default, Outline, Secondary, Tinted, Ghost, Plain, Destructive, Link }

enum class ButtonSize(
    val height: Dp,
    val horizontalPadding: Dp,
    val spacing: Dp,
    val iconSize: Dp,
    val blockRadius: Dp,
    val isIcon: Boolean,
) {
    Default(36.dp, 16.dp, 6.dp, 16.dp, Radius.md, false),
    Xs(24.dp, 11.dp, 4.dp, 12.dp, Radius.sm, false),
    Sm(32.dp, 12.dp, 4.dp, 16.dp, Radius.md, false),
    Lg(44.dp, 22.dp, 6.dp, 16.dp, Radius.lg, false),
    Xl(56.dp, 31.dp, 8.dp, 16.dp, Radius.xl, false),
    Icon(36.dp, 0.dp, 6.dp, 16.dp, Radius.md, true),
    IconXs(24.dp, 0.dp, 4.dp, 12.dp, Radius.sm, true),
    IconSm(32.dp, 0.dp, 4.dp, 16.dp, Radius.md, true),
    IconLg(44.dp, 0.dp, 6.dp, 16.dp, Radius.lg, true),
    IconXl(56.dp, 0.dp, 8.dp, 16.dp, Radius.xl, true),
    ;

    val textStyle: TextStyle
        get() = when (this) {
            Xs, IconXs -> Typography.xs2
            Lg, Xl -> Typography.base
            else -> Typography.sm
        }
}

@Composable
fun Button(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: ButtonVariant = ButtonVariant.Default,
    size: ButtonSize = ButtonSize.Default,
    block: Boolean = false,
    enabled: Boolean = true,
    content: @Composable RowScope.() -> Unit,
) {
    val colors = EsuissTheme.colors
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    val foreground = buttonForeground(variant, colors, enabled)
    val shape = if (block) RoundedCornerShape(size.blockRadius) else CircleShape
    val sizing = when {
        block -> Modifier.fillMaxWidth().height(size.height)
        size.isIcon -> Modifier.size(size.height)
        else -> Modifier.height(size.height)
    }

    Row(
        modifier = modifier
            .then(sizing)
            .clip(shape)
            .background(buttonBackground(variant, colors, pressed && enabled, enabled), shape)
            .then(
                if (variant == ButtonVariant.Outline) Modifier.border(1.dp, colors.separator, shape) else Modifier,
            )
            .clickable(
                interactionSource = interaction,
                indication = null,
                enabled = enabled,
                role = Role.Button,
                onClick = onClick,
            )
            .padding(horizontal = size.horizontalPadding),
        horizontalArrangement = Arrangement.spacedBy(size.spacing, Alignment.CenterHorizontally),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        CompositionLocalProvider(
            LocalContentStyle provides size.textStyle.copy(
                color = foreground,
                textDecoration = if (variant == ButtonVariant.Link && pressed && enabled) {
                    TextDecoration.Underline
                } else {
                    null
                },
            ),
            LocalContentColor provides foreground,
            LocalIconSize provides size.iconSize,
        ) {
            content()
        }
    }
}

@Composable
fun Button(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: ButtonVariant = ButtonVariant.Default,
    size: ButtonSize = ButtonSize.Default,
    block: Boolean = false,
    enabled: Boolean = true,
) {
    Button(onClick, modifier, variant, size, block, enabled) {
        BasicText(text, style = LocalContentStyle.current, maxLines = 1)
    }
}

private fun buttonForeground(variant: ButtonVariant, colors: Colors, enabled: Boolean): Color =
    when (variant) {
        ButtonVariant.Default -> colors.onAccent
        ButtonVariant.Outline, ButtonVariant.Secondary, ButtonVariant.Ghost ->
            if (enabled) colors.label else colors.labelQuaternary
        ButtonVariant.Tinted, ButtonVariant.Plain ->
            if (enabled) colors.link else colors.link.copy(alpha = 0.4f)
        ButtonVariant.Destructive ->
            if (enabled) colors.danger else colors.danger.copy(alpha = 0.4f)
        ButtonVariant.Link -> if (enabled) colors.link else colors.labelQuaternary
    }

private fun buttonBackground(variant: ButtonVariant, colors: Colors, pressed: Boolean, enabled: Boolean): Color =
    when (variant) {
        ButtonVariant.Default -> when {
            !enabled -> colors.accentDisabled
            pressed -> colors.accentPressed
            else -> colors.accent
        }
        ButtonVariant.Outline -> when {
            pressed -> colors.itemPressed
            colors.isDark -> Color.Transparent
            else -> colors.surface
        }
        ButtonVariant.Secondary -> when {
            !enabled -> colors.controlDisabled
            pressed -> colors.controlPressed
            else -> colors.control
        }
        ButtonVariant.Tinted -> if (pressed) colors.accentSurfacePressed else colors.accentSurface
        ButtonVariant.Ghost -> if (pressed) colors.itemPressed else Color.Transparent
        ButtonVariant.Plain -> if (pressed) colors.itemPressed else Color.Transparent
        ButtonVariant.Destructive -> if (pressed) colors.dangerSurfacePressed else colors.dangerSurface
        ButtonVariant.Link -> Color.Transparent
    }
