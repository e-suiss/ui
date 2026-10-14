package com.esuiss.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography

enum class AlertVariant { Default, Destructive }

@Composable
fun Alert(
    modifier: Modifier = Modifier,
    variant: AlertVariant = AlertVariant.Default,
    icon: ImageVector? = null,
    action: (@Composable () -> Unit)? = null,
    content: @Composable ColumnScope.() -> Unit,
) {
    val colors = EsuissTheme.colors
    val shape = RoundedCornerShape(Radius.xl2)
    Box(
        modifier = modifier
            .fillMaxWidth()
            .background(colors.surfaceSecondary, shape)
            .semantics { liveRegion = LiveRegionMode.Polite },
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(start = 20.dp, top = 20.dp, bottom = 20.dp, end = if (action != null) 96.dp else 20.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            CompositionLocalProvider(
                LocalContentStyle provides Typography.base.copy(color = colors.label),
                LocalContentColor provides colors.label,
            ) {
                if (icon != null) {
                    Icon(
                        icon,
                        contentDescription = null,
                        modifier = Modifier.padding(top = 1.dp),
                        size = 20.dp,
                        tint = if (variant == AlertVariant.Destructive) colors.danger else colors.accent,
                    )
                }
                Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(2.dp), content = content)
            }
        }
        if (action != null) {
            Box(Modifier.align(Alignment.TopEnd).padding(top = 16.dp, end = 16.dp)) {
                action()
            }
        }
    }
}

@Composable
fun AlertTitle(text: String, modifier: Modifier = Modifier) {
    Text(text, modifier, style = Typography.base.copy(color = EsuissTheme.colors.label, fontWeight = FontWeight.SemiBold))
}

@Composable
fun AlertDescription(text: String, modifier: Modifier = Modifier) {
    Text(text, modifier, style = Typography.base.copy(color = EsuissTheme.colors.labelSecondary))
}
