package com.esuiss.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.WindowInsetsSides
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.only
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawing
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.unit.dp
import com.esuiss.ui.theme.EsuissTheme

@Composable
fun BottomBar(
    modifier: Modifier = Modifier,
    separator: Boolean = false,
    content: @Composable ColumnScope.() -> Unit,
) {
    val colors = EsuissTheme.colors
    Column(
        modifier = modifier
            .fillMaxWidth()
            .background(colors.background)
            .then(
                if (separator) {
                    Modifier.drawBehind { drawRect(colors.border, Offset.Zero, Size(size.width, 1.dp.toPx())) }
                } else {
                    Modifier
                },
            )
            .windowInsetsPadding(WindowInsets.safeDrawing.only(WindowInsetsSides.Bottom + WindowInsetsSides.Horizontal))
            .padding(bottom = with(LocalDensity.current) { (LocalKeyboardAccessory.current?.height ?: 0).toDp() }),
        content = content,
    )
}

@Composable
fun BottomBarContent(
    modifier: Modifier = Modifier,
    horizontalAlignment: Alignment.Horizontal = Alignment.CenterHorizontally,
    content: @Composable ColumnScope.() -> Unit,
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 12.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp),
        horizontalAlignment = horizontalAlignment,
        content = content,
    )
}
