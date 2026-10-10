package com.esuiss.ui.patterns

import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.Modifier
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.DrawerDescription
import com.esuiss.ui.components.DrawerHeader
import com.esuiss.ui.components.DrawerTitle

private val LocalFlyout = drawerPatternLocal()

@Composable
fun Flyout(
    open: Boolean,
    onOpenChange: (Boolean) -> Unit,
    floating: Boolean = false,
    content: @Composable () -> Unit,
) {
    CompositionLocalProvider(
        LocalFlyout provides DrawerPatternState(open, onOpenChange, floating),
        content = content,
    )
}

@Composable
fun FlyoutContent(
    modifier: Modifier = Modifier,
    showCloseButton: Boolean = false,
    closeLabel: String? = null,
    content: @Composable ColumnScope.() -> Unit,
) {
    DrawerPatternContent(LocalFlyout.current, modifier, showCloseButton, closeLabel, content)
}

@Composable
fun FlyoutHeader(
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit,
) {
    DrawerHeader(modifier, content)
}

@Composable
fun FlyoutTitle(text: String, modifier: Modifier = Modifier) {
    DrawerTitle(text, modifier)
}

@Composable
fun FlyoutDescription(text: String, modifier: Modifier = Modifier) {
    DrawerDescription(text, modifier)
}

@Composable
fun FlyoutBody(
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit,
) {
    DrawerPatternBody(modifier, content)
}

@Composable
fun FlyoutClose(
    text: String,
    modifier: Modifier = Modifier,
    variant: ButtonVariant = ButtonVariant.Secondary,
    size: ButtonSize = ButtonSize.Default,
    onClick: () -> Unit = {},
) {
    DrawerPatternClose(text, modifier, variant, size, onClick)
}
