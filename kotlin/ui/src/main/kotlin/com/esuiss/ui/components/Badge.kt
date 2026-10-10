package com.esuiss.ui.components

import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography

enum class BadgeVariant { Default, Secondary, Destructive, Outline, Ghost, Link }

@Composable
fun Badge(
    modifier: Modifier = Modifier,
    variant: BadgeVariant = BadgeVariant.Default,
    content: @Composable RowScope.() -> Unit,
) {
    val colors = EsuissTheme.colors
    val foreground = when (variant) {
        BadgeVariant.Default, BadgeVariant.Link -> colors.link
        BadgeVariant.Secondary -> colors.labelSecondary
        BadgeVariant.Destructive -> colors.danger
        BadgeVariant.Outline, BadgeVariant.Ghost -> colors.label
    }
    val padded = variant == BadgeVariant.Outline || variant == BadgeVariant.Ghost
    Row(
        modifier = modifier
            .height(20.dp)
            .clip(CircleShape)
            .then(if (variant == BadgeVariant.Outline) Modifier.border(1.dp, colors.separator, CircleShape) else Modifier)
            .padding(horizontal = if (padded) 8.dp else 0.dp),
        horizontalArrangement = Arrangement.spacedBy(4.dp, Alignment.CenterHorizontally),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        CompositionLocalProvider(
            LocalContentStyle provides Typography.xs.copy(color = foreground, fontWeight = FontWeight.SemiBold),
            LocalContentColor provides foreground,
            LocalIconSize provides 12.dp,
        ) {
            content()
        }
    }
}

@Composable
fun Badge(
    text: String,
    modifier: Modifier = Modifier,
    variant: BadgeVariant = BadgeVariant.Default,
) {
    Badge(modifier, variant) {
        BasicText(text, style = LocalContentStyle.current, maxLines = 1)
    }
}
