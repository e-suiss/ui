package com.esuiss.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.Orientation
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.esuiss.ui.theme.EsuissTheme

@Composable
fun Separator(
    modifier: Modifier = Modifier,
    orientation: Orientation = Orientation.Horizontal,
) {
    val sizing = if (orientation == Orientation.Horizontal) {
        Modifier.fillMaxWidth().height(1.dp)
    } else {
        Modifier.fillMaxHeight().width(1.dp)
    }
    Box(modifier.then(sizing).background(EsuissTheme.colors.border))
}
