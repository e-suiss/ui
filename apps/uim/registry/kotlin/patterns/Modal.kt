package com.esuiss.ui.patterns

import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.Layout
import androidx.compose.ui.unit.Constraints
import androidx.compose.ui.unit.dp
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.DrawerDescription
import com.esuiss.ui.components.DrawerFooter
import com.esuiss.ui.components.DrawerHeader
import com.esuiss.ui.components.DrawerTitle

private val LocalModal = drawerPatternLocal()

@Composable
fun Modal(
    open: Boolean,
    onOpenChange: (Boolean) -> Unit,
    floating: Boolean = false,
    content: @Composable () -> Unit,
) {
    CompositionLocalProvider(
        LocalModal provides DrawerPatternState(open, onOpenChange, floating),
        content = content,
    )
}

@Composable
fun ModalContent(
    modifier: Modifier = Modifier,
    showCloseButton: Boolean = true,
    closeLabel: String? = null,
    content: @Composable ColumnScope.() -> Unit,
) {
    DrawerPatternContent(LocalModal.current, modifier, showCloseButton, closeLabel, content)
}

@Composable
fun ModalHeader(
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit,
) {
    DrawerHeader(modifier, content)
}

@Composable
fun ModalTitle(text: String, modifier: Modifier = Modifier) {
    DrawerTitle(text, modifier)
}

@Composable
fun ModalDescription(text: String, modifier: Modifier = Modifier) {
    DrawerDescription(text, modifier)
}

@Composable
fun ModalBody(
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit,
) {
    DrawerPatternBody(modifier, content)
}

@Composable
fun ColumnScope.ModalFooter(
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit,
) {
    DrawerFooter(modifier) {
        Layout(content = content, modifier = Modifier.fillMaxWidth()) { measurables, constraints ->
            val gap = 8.dp.roundToPx()
            val placeables = measurables.map { it.measure(constraints.copy(minHeight = 0, maxHeight = Constraints.Infinity)) }
            val height = placeables.sumOf { it.height } + gap * (placeables.size - 1).coerceAtLeast(0)
            layout(constraints.maxWidth, height) {
                var y = 0
                placeables.asReversed().forEach {
                    it.placeRelative(0, y)
                    y += it.height + gap
                }
            }
        }
    }
}

@Composable
fun ModalClose(
    text: String,
    modifier: Modifier = Modifier,
    variant: ButtonVariant = ButtonVariant.Secondary,
    size: ButtonSize = ButtonSize.Default,
    onClick: () -> Unit = {},
) {
    DrawerPatternClose(text, modifier, variant, size, onClick)
}
