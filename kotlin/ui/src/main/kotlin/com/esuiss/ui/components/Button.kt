package com.esuiss.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.esuiss.ui.theme.EsuissColors
import com.esuiss.ui.theme.EsuissTheme

enum class ButtonVariant { Primary, Secondary, Outline, Ghost, Destructive, Link }

enum class ButtonSize(
    val height: Dp,
    val horizontalPadding: Dp,
    val fontSize: Int,
    val isIcon: Boolean,
) {
    Xs(24.dp, 10.dp, 12, false),
    Sm(32.dp, 12.dp, 14, false),
    Regular(36.dp, 12.dp, 14, false),
    Lg(40.dp, 16.dp, 14, false),
    Icon(36.dp, 0.dp, 14, true),
    IconXs(24.dp, 0.dp, 12, true),
    IconSm(32.dp, 0.dp, 14, true),
    IconLg(40.dp, 0.dp, 14, true),
}

@Composable
fun Button(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: ButtonVariant = ButtonVariant.Primary,
    size: ButtonSize = ButtonSize.Regular,
    enabled: Boolean = true,
    content: @Composable RowScope.() -> Unit,
) {
    val colors = EsuissTheme.colors
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    val foreground = buttonForeground(variant, colors)
    val sizing = if (size.isIcon) Modifier.size(size.height) else Modifier.height(size.height)

    Row(
        modifier = modifier
            .then(sizing)
            .alpha(if (!enabled) 0.5f else if (pressed && variant == ButtonVariant.Secondary) 0.8f else 1f)
            .clip(CircleShape)
            .background(buttonBackground(variant, colors, pressed), CircleShape)
            .then(
                if (variant == ButtonVariant.Outline) Modifier.border(1.dp, colors.border, CircleShape) else Modifier,
            )
            .clickable(
                interactionSource = interaction,
                indication = null,
                enabled = enabled,
                role = Role.Button,
                onClick = onClick,
            )
            .padding(horizontal = size.horizontalPadding),
        horizontalArrangement = Arrangement.spacedBy(6.dp, Alignment.CenterHorizontally),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        CompositionLocalProvider(
            LocalContentStyle provides TextStyle(
                color = foreground,
                fontSize = size.fontSize.sp,
                fontWeight = FontWeight.Medium,
            ),
            LocalContentColor provides foreground,
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
    variant: ButtonVariant = ButtonVariant.Primary,
    size: ButtonSize = ButtonSize.Regular,
    enabled: Boolean = true,
) {
    Button(onClick, modifier, variant, size, enabled) {
        BasicText(text, style = LocalContentStyle.current, maxLines = 1)
    }
}

private fun buttonForeground(variant: ButtonVariant, colors: EsuissColors): Color = when (variant) {
    ButtonVariant.Primary -> colors.primaryForeground
    ButtonVariant.Destructive -> colors.destructive
    ButtonVariant.Link -> colors.primary
    ButtonVariant.Secondary, ButtonVariant.Outline, ButtonVariant.Ghost -> colors.foreground
}

private fun buttonBackground(variant: ButtonVariant, colors: EsuissColors, pressed: Boolean): Color =
    when (variant) {
        ButtonVariant.Primary -> colors.primary.copy(alpha = if (pressed) 0.8f else 1f)
        ButtonVariant.Secondary -> colors.secondary
        ButtonVariant.Outline -> when {
            pressed && colors.isDark -> colors.input.copy(alpha = 0.3f)
            pressed -> colors.muted
            colors.isDark -> Color.Transparent
            else -> colors.background
        }
        ButtonVariant.Ghost -> if (pressed) colors.muted.copy(alpha = if (colors.isDark) 0.5f else 1f) else Color.Transparent
        ButtonVariant.Destructive -> colors.destructive.copy(
            alpha = (if (colors.isDark) 0.2f else 0.1f) + (if (pressed) 0.1f else 0f),
        )
        ButtonVariant.Link -> Color.Transparent
    }
