package com.esuiss.ui.patterns

import androidx.compose.runtime.Composable
import androidx.compose.runtime.Immutable
import androidx.compose.ui.Modifier
import com.esuiss.ui.components.AlertSheet
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
