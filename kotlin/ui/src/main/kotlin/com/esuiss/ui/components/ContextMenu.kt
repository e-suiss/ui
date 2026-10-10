package com.esuiss.ui.components

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.onLongClick
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.round

@Composable
fun ContextMenu(
    expanded: Boolean,
    onExpandedChange: (Boolean) -> Unit,
    trigger: @Composable () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    content: @Composable ColumnScope.() -> Unit,
) {
    var point by remember { mutableStateOf<IntOffset?>(null) }
    Box(
        modifier = rememberLongPressModifier(enabled) {
            point = it.round()
            onExpandedChange(true)
        }.semantics {
            if (enabled) {
                onLongClick(label = "Open menu") {
                    point = null
                    onExpandedChange(true)
                    true
                }
            }
        },
    ) {
        trigger()
        MenuPopup(
            expanded = expanded,
            onDismissRequest = { onExpandedChange(false) },
            modifier = modifier,
            side = PopupSide.Bottom,
            align = PopupAlign.Start,
            sideOffset = 0.dp,
            alignOffset = 0.dp,
            minWidth = 192.dp,
            point = point,
            content = content,
        )
    }
}
