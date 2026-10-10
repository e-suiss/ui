package com.esuiss.ui.patterns

import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.Modifier
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.DrawerDescription
import com.esuiss.ui.components.DrawerFooter
import com.esuiss.ui.components.DrawerHeader
import com.esuiss.ui.components.DrawerTitle

private val LocalPanel = drawerPatternLocal()

@Composable
fun Panel(
    open: Boolean,
    onOpenChange: (Boolean) -> Unit,
    floating: Boolean = false,
    content: @Composable () -> Unit,
) {
    CompositionLocalProvider(
        LocalPanel provides DrawerPatternState(open, onOpenChange, floating),
        content = content,
    )
}

@Composable
fun PanelContent(
    modifier: Modifier = Modifier,
    showCloseButton: Boolean = true,
    closeLabel: String? = null,
    content: @Composable ColumnScope.() -> Unit,
) {
    DrawerPatternContent(LocalPanel.current, modifier, showCloseButton, closeLabel, content)
}

@Composable
fun PanelHeader(
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit,
) {
    DrawerHeader(modifier, content)
}

@Composable
fun PanelTitle(text: String, modifier: Modifier = Modifier) {
    DrawerTitle(text, modifier)
}

@Composable
fun PanelDescription(text: String, modifier: Modifier = Modifier) {
    DrawerDescription(text, modifier)
}

@Composable
fun PanelBody(
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit,
) {
    DrawerPatternBody(modifier, content)
}

@Composable
fun ColumnScope.PanelFooter(
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit,
) {
    DrawerFooter(modifier, content)
}

@Composable
fun PanelClose(
    text: String,
    modifier: Modifier = Modifier,
    variant: ButtonVariant = ButtonVariant.Secondary,
    size: ButtonSize = ButtonSize.Default,
    onClick: () -> Unit = {},
) {
    DrawerPatternClose(text, modifier, variant, size, onClick)
}
