package com.esuiss.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography

@Composable
fun Label(
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    content: @Composable RowScope.() -> Unit,
) {
    val colors = EsuissTheme.colors
    val color = if (enabled) colors.label else colors.labelQuaternary
    Row(
        modifier = modifier,
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        CompositionLocalProvider(
            LocalContentStyle provides Typography.base.copy(color = color, fontWeight = FontWeight.SemiBold),
            LocalContentColor provides color,
        ) {
            content()
        }
    }
}

@Composable
fun Label(
    text: String,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
) {
    Label(modifier, enabled) {
        BasicText(text, style = LocalContentStyle.current)
    }
}
