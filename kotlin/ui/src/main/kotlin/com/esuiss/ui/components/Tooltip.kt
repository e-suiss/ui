package com.esuiss.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.drawscope.rotate
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.onLongClick
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography
import kotlinx.coroutines.delay

@Composable
fun Tooltip(
    text: String,
    modifier: Modifier = Modifier,
    side: PopupSide = PopupSide.Top,
    align: PopupAlign = PopupAlign.Center,
    sideOffset: Dp = 4.dp,
    alignOffset: Dp = 0.dp,
    hideDelayMillis: Long = 1500,
    enabled: Boolean = true,
    trigger: @Composable () -> Unit,
) {
    var open by remember { mutableStateOf(false) }
    Tooltip(
        open = open,
        onOpenChange = { open = it },
        modifier = modifier,
        side = side,
        align = align,
        sideOffset = sideOffset,
        alignOffset = alignOffset,
        hideDelayMillis = hideDelayMillis,
        enabled = enabled,
        trigger = trigger,
    ) {
        BasicText(text, style = LocalContentStyle.current)
    }
}

@Composable
fun Tooltip(
    open: Boolean,
    onOpenChange: (Boolean) -> Unit,
    trigger: @Composable () -> Unit,
    modifier: Modifier = Modifier,
    side: PopupSide = PopupSide.Top,
    align: PopupAlign = PopupAlign.Center,
    sideOffset: Dp = 4.dp,
    alignOffset: Dp = 0.dp,
    hideDelayMillis: Long = 1500,
    enabled: Boolean = true,
    content: @Composable RowScope.() -> Unit,
) {
    val colors = EsuissTheme.colors
    val currentOnOpenChange by rememberUpdatedState(onOpenChange)
    if (hideDelayMillis > 0) {
        LaunchedEffect(open) {
            if (open) {
                delay(hideDelayMillis)
                currentOnOpenChange(false)
            }
        }
    }
    Box(
        modifier = rememberLongPressModifier(enabled) { onOpenChange(true) }
            .semantics {
                if (enabled) {
                    onLongClick(label = "Show tooltip") {
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
            focusable = false,
            touchable = false,
            dismissOnClickOutside = false,
        ) { placement ->
            CompositionLocalProvider(
                LocalContentStyle provides Typography.xs.copy(color = colors.surface),
                LocalContentColor provides colors.surface,
                LocalIconSize provides 14.dp,
            ) {
                Row(
                    modifier = modifier
                        .widthIn(max = 320.dp)
                        .drawBehind {
                            val radius = Radius.xl.toPx()
                            val arrow = 10.dp.toPx()
                            val outset = 3.dp.toPx()
                            val bubble = Size(size.width, size.height)
                            drawRoundRect(colors.label, size = bubble, cornerRadius = CornerRadius(radius))
                            val vertical = placement.side == PopupSide.Top || placement.side == PopupSide.Bottom
                            val along = placement.anchorCenter.toFloat()
                            val center = if (vertical) {
                                val x = along.coerceIn(radius + arrow / 2, (size.width - radius - arrow / 2).coerceAtLeast(radius + arrow / 2))
                                val y = if (placement.side == PopupSide.Top) size.height + outset - arrow / 2 else -outset + arrow / 2
                                Offset(x, y)
                            } else {
                                val y = along.coerceIn(radius + arrow / 2, (size.height - radius - arrow / 2).coerceAtLeast(radius + arrow / 2))
                                val x = if (placement.side == PopupSide.Left) size.width + outset - arrow / 2 else -outset + arrow / 2
                                Offset(x, y)
                            }
                            rotate(45f, pivot = center) {
                                drawRoundRect(
                                    colors.label,
                                    topLeft = Offset(center.x - arrow / 2, center.y - arrow / 2),
                                    size = Size(arrow, arrow),
                                    cornerRadius = CornerRadius(Radius.xs.toPx()),
                                )
                            }
                        }
                        .semantics { liveRegion = LiveRegionMode.Polite }
                        .padding(horizontal = 12.dp, vertical = 6.dp),
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    content = content,
                )
            }
        }
    }
}
