package com.esuiss.ui.components

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.onLongClick
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography

@Composable
fun HoverCard(
    open: Boolean,
    onOpenChange: (Boolean) -> Unit,
    trigger: @Composable () -> Unit,
    modifier: Modifier = Modifier,
    side: PopupSide = PopupSide.Bottom,
    align: PopupAlign = PopupAlign.Center,
    sideOffset: Dp = 4.dp,
    alignOffset: Dp = 4.dp,
    enabled: Boolean = true,
    content: @Composable BoxScope.() -> Unit,
) {
    val colors = EsuissTheme.colors
    Box(
        modifier = rememberLongPressModifier(enabled) { onOpenChange(true) }
            .semantics {
                if (enabled) {
                    onLongClick(label = "Show preview") {
                        onOpenChange(true)
                        true
                    }
                }
            },
    ) {
        trigger()
        AnchoredPopup(
            expanded = open,
            onDismissRequest = { onOpenChange(false) },
            side = side,
            align = align,
            sideOffset = sideOffset,
            alignOffset = alignOffset,
        ) {
            CompositionLocalProvider(
                LocalContentStyle provides Typography.base.copy(color = colors.label),
                LocalContentColor provides colors.label,
            ) {
                Box(
                    modifier = modifier
                        .width(288.dp)
                        .raisedSurface(colors, RoundedCornerShape(Radius.xl2))
                        .padding(16.dp),
                    content = content,
                )
            }
        }
    }
}
