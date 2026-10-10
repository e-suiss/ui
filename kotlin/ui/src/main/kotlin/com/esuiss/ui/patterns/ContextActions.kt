package com.esuiss.ui.patterns

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.setValue
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.semantics.onLongClick
import androidx.compose.ui.semantics.semantics
import com.esuiss.ui.components.AlertSheetAction
import com.esuiss.ui.components.MenuItemVariant
import com.esuiss.ui.components.rememberLongPressModifier

private val LocalContextActions = staticCompositionLocalOf<SheetMenuState?> { null }

@Composable
fun ContextActions(
    onOpenChange: (Boolean) -> Unit = {},
    dismissible: Boolean = true,
    content: @Composable () -> Unit,
) {
    var open by remember { mutableStateOf(false) }
    val notify by rememberUpdatedState(onOpenChange)
    val setOpen: (Boolean) -> Unit = remember {
        { next ->
            open = next
            notify(next)
        }
    }
    CompositionLocalProvider(
        LocalContextActions provides SheetMenuState(open, setOpen, dismissible),
        content = content,
    )
}

@Composable
fun ContextActionsTrigger(
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    label: String = "Show actions",
    content: @Composable BoxScope.() -> Unit,
) {
    val state = LocalContextActions.current
    val haptics = LocalHapticFeedback.current
    val show = {
        if (state != null) {
            haptics.performHapticFeedback(HapticFeedbackType.LongPress)
            state.onOpenChange(true)
        }
    }
    Box(
        modifier = modifier
            .then(rememberLongPressModifier(enabled && state != null) { show() })
            .semantics {
                if (enabled && state != null) {
                    onLongClick(label = label) {
                        state.onOpenChange(true)
                        true
                    }
                }
            },
        content = content,
    )
}

@Composable
fun ContextActionsContent(
    modifier: Modifier = Modifier,
    cancelLabel: String = "Cancel",
    content: @Composable () -> Unit,
) {
    SheetMenuContent(LocalContextActions.current, cancelLabel, modifier, content)
}

@Composable
fun ContextActionsLabel(text: String, modifier: Modifier = Modifier) {
    SheetMenuLabel(text, modifier)
}

@Composable
fun ContextActionsItem(
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
fun ContextActionsSeparator() {
}
