package com.esuiss.ui.patterns

import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import com.esuiss.ui.components.AlertSheet
import com.esuiss.ui.components.AlertSheetAction
import com.esuiss.ui.components.AlertSheetActionVariant
import com.esuiss.ui.components.AlertSheetCancel
import com.esuiss.ui.components.AlertSheetGroup
import com.esuiss.ui.components.AlertSheetHeader
import com.esuiss.ui.components.AlertSheetTitle
import com.esuiss.ui.components.MenuItemVariant

@Immutable
internal class SheetMenuState(
    val open: Boolean,
    val onOpenChange: (Boolean) -> Unit,
    val dismissible: Boolean,
)

private val LocalActionMenu = staticCompositionLocalOf<SheetMenuState?> { null }

internal fun MenuItemVariant.toSheetVariant(): AlertSheetActionVariant =
    if (this == MenuItemVariant.Destructive) AlertSheetActionVariant.Destructive else AlertSheetActionVariant.Default

@Composable
internal fun SheetMenuContent(
    state: SheetMenuState?,
    cancelLabel: String,
    modifier: Modifier,
    content: @Composable () -> Unit,
) {
    if (state == null) return
    AlertSheet(
        open = state.open,
        onOpenChange = state.onOpenChange,
        modifier = modifier,
        dismissible = state.dismissible,
    ) {
        AlertSheetGroup(content = content)
        AlertSheetCancel(cancelLabel)
    }
}

@Composable
internal fun SheetMenuLabel(text: String, modifier: Modifier) {
    AlertSheetHeader {
        AlertSheetTitle(text, modifier)
    }
}

@Composable
fun ActionMenu(
    open: Boolean,
    onOpenChange: (Boolean) -> Unit,
    dismissible: Boolean = true,
    content: @Composable () -> Unit,
) {
    CompositionLocalProvider(
        LocalActionMenu provides SheetMenuState(open, onOpenChange, dismissible),
        content = content,
    )
}

@Composable
fun ActionMenuContent(
    modifier: Modifier = Modifier,
    cancelLabel: String = "Cancel",
    content: @Composable () -> Unit,
) {
    SheetMenuContent(LocalActionMenu.current, cancelLabel, modifier, content)
}

@Composable
fun ActionMenuLabel(text: String, modifier: Modifier = Modifier) {
    SheetMenuLabel(text, modifier)
}

@Composable
fun ActionMenuItem(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: MenuItemVariant = MenuItemVariant.Default,
    enabled: Boolean = true,
    icon: ImageVector? = null,
) {
    AlertSheetAction(text, onClick, modifier, variant.toSheetVariant(), enabled, icon)
}

@Composable
fun ActionMenuSeparator() {
}
