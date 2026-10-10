package com.esuiss.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.esuiss.ui.theme.EsuissTheme

enum class BadgeVariant { Primary, Secondary, Destructive, Outline }

@Composable
fun Badge(
    text: String,
    modifier: Modifier = Modifier,
    variant: BadgeVariant = BadgeVariant.Primary,
) {
    val colors = EsuissTheme.colors
    val foreground = when (variant) {
        BadgeVariant.Primary -> colors.primaryForeground
        BadgeVariant.Secondary, BadgeVariant.Outline -> colors.foreground
        BadgeVariant.Destructive -> colors.destructive
    }
    val background = when (variant) {
        BadgeVariant.Primary -> colors.primary
        BadgeVariant.Secondary -> colors.secondary
        BadgeVariant.Destructive -> colors.destructive.copy(alpha = if (colors.isDark) 0.2f else 0.1f)
        BadgeVariant.Outline -> Color.Transparent
    }
    Box(
        modifier = modifier
            .height(20.dp)
            .background(background, CircleShape)
            .then(if (variant == BadgeVariant.Outline) Modifier.border(1.dp, colors.border, CircleShape) else Modifier)
            .padding(horizontal = 8.dp),
        contentAlignment = Alignment.Center,
    ) {
        BasicText(
            text,
            style = TextStyle(color = foreground, fontSize = 12.sp, fontWeight = FontWeight.Medium),
            maxLines = 1,
        )
    }
}
