package com.esuiss.ui.patterns

import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.runtime.Composable
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.ProvidableCompositionLocal
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Modifier
import com.esuiss.ui.components.Drawer

@Immutable
internal class DrawerPatternState(
    val open: Boolean,
    val onOpenChange: (Boolean) -> Unit,
    val floating: Boolean,
)

internal fun drawerPatternLocal(): ProvidableCompositionLocal<DrawerPatternState?> = staticCompositionLocalOf { null }

@Composable
internal fun DrawerPatternContent(
    state: DrawerPatternState?,
    modifier: Modifier,
    showCloseButton: Boolean,
    closeLabel: String?,
    content: @Composable ColumnScope.() -> Unit,
) {
    if (state == null) return
    Drawer(
        open = state.open,
        onOpenChange = state.onOpenChange,
        modifier = modifier,
        floating = state.floating,
        showSwipeHandle = true,
        showCloseButton = showCloseButton,
        closeLabel = closeLabel,
        content = content,
    )
}
