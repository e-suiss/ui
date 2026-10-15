package com.esuiss.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.paneTitle
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography

@Composable
fun Popover(
    open: Boolean,
    onOpenChange: (Boolean) -> Unit,
    trigger: @Composable () -> Unit,
    modifier: Modifier = Modifier,
    side: PopupSide = PopupSide.Bottom,
    align: PopupAlign = PopupAlign.Center,
    sideOffset: Dp = 4.dp,
    alignOffset: Dp = 0.dp,
    content: @Composable ColumnScope.() -> Unit,
) {
    val colors = EsuissTheme.colors
    val paneTitle = remember { PaneTitleState() }
    Box {
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
                LocalPaneTitle provides paneTitle,
                LocalContentStyle provides Typography.base.copy(color = colors.foreground),
                LocalContentColor provides colors.foreground,
            ) {
                Column(
                    modifier = modifier
                        .width(288.dp)
                        .raisedSurface(colors, RoundedCornerShape(Radius.xl2))
                        .semantics { paneTitle.value?.let { this.paneTitle = it } }
                        .padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp),
                    content = content,
                )
            }
        }
    }
}

@Composable
fun PopoverHeader(
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit,
) {
    val colors = EsuissTheme.colors
    CompositionLocalProvider(LocalContentStyle provides Typography.sm.copy(color = colors.foreground)) {
        Column(
            modifier = modifier.fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(4.dp),
            content = content,
        )
    }
}

@Composable
fun PopoverTitle(text: String, modifier: Modifier = Modifier) {
    OverlayTitle(text, modifier, titleStyle(EsuissTheme.colors))
}

@Composable
fun PopoverDescription(text: String, modifier: Modifier = Modifier) {
    BasicText(text, modifier = modifier, style = descriptionStyle(EsuissTheme.colors))
}
