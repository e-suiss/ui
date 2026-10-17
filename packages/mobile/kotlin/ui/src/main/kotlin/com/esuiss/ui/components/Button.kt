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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.esuiss.ui.theme.Colors
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Metrics
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
    Default(Metrics.Height.button, Metrics.PaddingX.button, 6.dp, 16.dp, Radius.md, false),
    Xs(Metrics.Height.buttonXs, Metrics.PaddingX.buttonXs, 4.dp, 12.dp, Radius.sm, false),
    Sm(Metrics.Height.buttonSm, Metrics.PaddingX.buttonSm, 4.dp, 16.dp, Radius.md, false),
    Lg(Metrics.Height.buttonLg, Metrics.PaddingX.buttonLg, 6.dp, 16.dp, Radius.lg, false),
    Xl(56.dp, 31.dp, 8.dp, 16.dp, Radius.xl, false),
    Icon(Metrics.Height.button, 0.dp, 6.dp, 16.dp, Radius.md, true),
    IconXs(Metrics.Height.buttonXs, 0.dp, 4.dp, 12.dp, Radius.sm, true),
    IconSm(Metrics.Height.buttonSm, 0.dp, 4.dp, 16.dp, Radius.md, true),
    IconLg(Metrics.Height.buttonLg, 0.dp, 6.dp, 16.dp, Radius.lg, true),
    IconXl(56.dp, 0.dp, 8.dp, 16.dp, Radius.xl, true),
    ;

    val textStyle: TextStyle
        get() = when (this) {
            Xs, IconXs -> Typography.xs
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
    val foreground = buttonForeground(variant, colors)
    val group = LocalButtonGroup.current?.takeIf { variant != ButtonVariant.Ghost && variant != ButtonVariant.Plain }
    RegisterButtonGroupOutline(group, variant == ButtonVariant.Outline)
    val shape = group.itemShape(if (block) RoundedCornerShape(size.blockRadius) else RoundedCornerShape(Metrics.Radius.button))
    val sizing = when {
        block -> Modifier.fillMaxWidth().height(size.height)
        size.isIcon -> Modifier.size(size.height)
        else -> Modifier.height(size.height)
    }

    Row(
        modifier = modifier
            .then(sizing)
            .alpha(
                when {
                    !enabled -> 0.5f
                    pressed -> 0.8f
                    else -> 1f
                },
            )
            .clip(shape)
            .background(buttonBackground(variant, colors), shape)
            .then(
                when {
                    variant != ButtonVariant.Outline -> Modifier
                    group != null -> Modifier.buttonGroupEdge(group, colors.border)
                    else -> Modifier.border(1.dp, colors.border, shape)
                },
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
            LocalButtonGroup provides null,
            LocalContentStyle provides size.textStyle.copy(
                color = foreground,
                fontWeight = Metrics.Weight.button,
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

private fun buttonForeground(variant: ButtonVariant, colors: Colors): Color =
    when (variant) {
        ButtonVariant.Default -> colors.primaryForeground
        ButtonVariant.Outline, ButtonVariant.Secondary, ButtonVariant.Ghost ->
            colors.foreground
        ButtonVariant.Tinted, ButtonVariant.Plain ->
            colors.primary
        ButtonVariant.Destructive ->
            colors.destructive
        ButtonVariant.Link -> colors.primary
    }

private fun buttonBackground(variant: ButtonVariant, colors: Colors): Color =
    when (variant) {
        ButtonVariant.Default -> colors.primary
        ButtonVariant.Outline -> if (colors.isDark) Color.Transparent else colors.background
        ButtonVariant.Secondary -> colors.secondary
        ButtonVariant.Tinted -> colors.primary.copy(alpha = if (colors.isDark) 0.2f else 0.1f)
        ButtonVariant.Ghost, ButtonVariant.Plain, ButtonVariant.Link -> Color.Transparent
        ButtonVariant.Destructive -> colors.destructive.copy(alpha = if (colors.isDark) 0.2f else 0.1f)
    }
