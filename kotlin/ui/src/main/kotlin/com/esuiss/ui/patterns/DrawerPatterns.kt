package com.esuiss.ui.patterns

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.ProvidableCompositionLocal
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Drawer

@Immutable
internal class DrawerPatternState(
    val open: Boolean,
    val onOpenChange: (Boolean) -> Unit,
    val floating: Boolean,
)

internal fun drawerPatternLocal(): ProvidableCompositionLocal<DrawerPatternState?> = staticCompositionLocalOf { null }

private val LocalDrawerPatternClose = staticCompositionLocalOf<() -> Unit> { {} }

@Composable
internal fun DrawerPatternContent(
    state: DrawerPatternState?,
    modifier: Modifier,
    showCloseButton: Boolean,
    closeLabel: String?,
    content: @Composable ColumnScope.() -> Unit,
) {
    if (state == null) return
    val close = { state.onOpenChange(false) }
    Drawer(
        open = state.open,
        onOpenChange = state.onOpenChange,
        modifier = modifier,
        floating = state.floating,
        showSwipeHandle = true,
        showCloseButton = showCloseButton,
        closeLabel = closeLabel,
    ) {
        CompositionLocalProvider(LocalDrawerPatternClose provides close) {
            content()
        }
    }
}

@Composable
internal fun DrawerPatternBody(modifier: Modifier, content: @Composable ColumnScope.() -> Unit) {
    Column(
        modifier = modifier.fillMaxWidth().padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        content = content,
    )
}

@Composable
internal fun DrawerPatternClose(
    text: String,
    modifier: Modifier,
    variant: ButtonVariant,
    size: ButtonSize,
    onClick: () -> Unit,
) {
    val close = LocalDrawerPatternClose.current
    Button(
        text = text,
        onClick = {
            onClick()
            close()
        },
        modifier = modifier,
        variant = variant,
        size = size,
    )
}
