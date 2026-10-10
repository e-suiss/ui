package com.esuiss.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.compositionLocalOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Shadows
import com.esuiss.ui.theme.Typography
import com.esuiss.ui.theme.shadow

enum class CardVariant { Default, Filled }

enum class CardSize(val spacing: Dp) {
    Default(24.dp),
    Sm(16.dp),
}

private val LocalCardSpacing = compositionLocalOf { 24.dp }

@Composable
fun Card(
    modifier: Modifier = Modifier,
    variant: CardVariant = CardVariant.Default,
    size: CardSize = CardSize.Default,
    content: @Composable ColumnScope.() -> Unit,
) {
    val colors = EsuissTheme.colors
    val shape = RoundedCornerShape(Radius.xl2)
    val filled = variant == CardVariant.Filled
    Column(
        modifier = modifier
            .fillMaxWidth()
            .then(if (filled) Modifier else Modifier.shadow(Shadows.md, shape))
            .clip(shape)
            .background(if (filled) colors.surfaceSecondary else colors.surfaceRaised, shape)
            .then(
                if (filled) {
                    Modifier
                } else {
                    Modifier.border(1.dp, colors.label.copy(alpha = if (colors.isDark) 0.1f else 0.05f), shape)
                },
            )
            .padding(vertical = size.spacing),
        verticalArrangement = Arrangement.spacedBy(size.spacing),
    ) {
        CompositionLocalProvider(
            LocalCardSpacing provides size.spacing,
            LocalContentStyle provides Typography.base.copy(color = colors.label),
            LocalContentColor provides colors.label,
        ) {
            content()
        }
    }
}

@Composable
fun CardHeader(
    title: String,
    modifier: Modifier = Modifier,
    description: String? = null,
    action: (@Composable () -> Unit)? = null,
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = LocalCardSpacing.current),
        horizontalArrangement = Arrangement.spacedBy(6.dp),
        verticalAlignment = Alignment.Top,
    ) {
        Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(6.dp)) {
            CardTitle(title)
            if (description != null) {
                CardDescription(description)
            }
        }
        action?.invoke()
    }
}

@Composable
fun CardTitle(text: String, modifier: Modifier = Modifier) {
    BasicText(
        text,
        modifier = modifier,
        style = Typography.base.copy(color = EsuissTheme.colors.label, fontWeight = FontWeight.SemiBold),
    )
}

@Composable
fun CardDescription(text: String, modifier: Modifier = Modifier) {
    BasicText(
        text,
        modifier = modifier,
        style = Typography.sm.copy(color = EsuissTheme.colors.labelSecondary),
    )
}

@Composable
fun CardContent(
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit,
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = LocalCardSpacing.current),
        content = content,
    )
}

@Composable
fun CardFooter(
    modifier: Modifier = Modifier,
    content: @Composable RowScope.() -> Unit,
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = LocalCardSpacing.current),
        verticalAlignment = Alignment.CenterVertically,
        content = content,
    )
}
