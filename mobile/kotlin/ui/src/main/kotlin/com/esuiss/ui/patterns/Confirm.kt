package com.esuiss.ui.patterns

import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.Stable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.setValue
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Modifier
import com.esuiss.ui.components.AlertSheet
import com.esuiss.ui.components.AlertSheetAction
import com.esuiss.ui.components.AlertSheetActionVariant
import com.esuiss.ui.components.AlertSheetCancel
import com.esuiss.ui.components.AlertSheetDescription
import com.esuiss.ui.components.AlertSheetGroup
import com.esuiss.ui.components.AlertSheetHeader
import com.esuiss.ui.components.AlertSheetTitle

internal class SheetCancel(val text: String, val onClick: () -> Unit)

@Stable
internal class SheetCancelSlot {
    var cancel by mutableStateOf<SheetCancel?>(null)
}

@Composable
internal fun RegisterSheetCancel(slot: SheetCancelSlot?, text: String, onClick: () -> Unit) {
    val click by rememberUpdatedState(onClick)
    if (slot == null) return
    DisposableEffect(slot, text) {
        val entry = SheetCancel(text) { click() }
        slot.cancel = entry
        onDispose { if (slot.cancel === entry) slot.cancel = null }
    }
}

private val LocalConfirm = staticCompositionLocalOf<SheetCancelSlot?> { null }

@Composable
fun Confirm(
    open: Boolean,
    onOpenChange: (Boolean) -> Unit,
    modifier: Modifier = Modifier,
    dismissible: Boolean = false,
    content: @Composable () -> Unit,
) {
    val slot = remember { SheetCancelSlot() }
    AlertSheet(open = open, onOpenChange = onOpenChange, modifier = modifier, dismissible = dismissible) {
        CompositionLocalProvider(LocalConfirm provides slot) {
            AlertSheetGroup(content = content)
            slot.cancel?.let { AlertSheetCancel(it.text, onClick = it.onClick) }
        }
    }
}

@Composable
fun ConfirmHeader(
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit,
) {
    AlertSheetHeader(modifier, content)
}

@Composable
fun ConfirmTitle(text: String, modifier: Modifier = Modifier) {
    AlertSheetTitle(text, modifier)
}

@Composable
fun ConfirmDescription(text: String, modifier: Modifier = Modifier) {
    AlertSheetDescription(text, modifier)
}

@Composable
fun ConfirmFooter(content: @Composable () -> Unit) {
    content()
}

@Composable
fun ConfirmAction(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: AlertSheetActionVariant = AlertSheetActionVariant.Default,
    enabled: Boolean = true,
) {
    AlertSheetAction(text, onClick, modifier, variant, enabled)
}

@Composable
fun ConfirmCancel(
    text: String = "Cancel",
    onClick: () -> Unit = {},
) {
    RegisterSheetCancel(LocalConfirm.current, text, onClick)
}
