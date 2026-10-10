package com.esuiss.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.esuiss.ui.theme.EsuissRadius
import com.esuiss.ui.theme.EsuissTheme

@Composable
fun Card(
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit,
) {
    val colors = EsuissTheme.colors
    val shape = RoundedCornerShape(EsuissRadius.xl4)
    Column(
        modifier = modifier
            .fillMaxWidth()
            .shadow(6.dp, shape, clip = false)
            .background(colors.card, shape)
            .border(1.dp, colors.foreground.copy(alpha = if (colors.isDark) 0.1f else 0.05f), shape)
            .padding(24.dp),
        verticalArrangement = Arrangement.spacedBy(24.dp),
        content = content,
    )
}

@Composable
fun CardHeader(
    title: String,
    modifier: Modifier = Modifier,
    description: String? = null,
) {
    val colors = EsuissTheme.colors
    Column(modifier = modifier, verticalArrangement = Arrangement.spacedBy(6.dp)) {
        BasicText(
            title,
            style = TextStyle(color = colors.foreground, fontSize = 16.sp, fontWeight = FontWeight.Medium),
        )
        if (description != null) {
            BasicText(description, style = TextStyle(color = colors.mutedForeground, fontSize = 14.sp))
        }
    }
}
