package com.esuiss.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.MutableTransitionState
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.scaleIn
import androidx.compose.animation.scaleOut
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawing
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.remember
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.Layout
import androidx.compose.ui.semantics.paneTitle
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography

@Immutable
private data class DialogCloseInfo(val hasCloseButton: Boolean, val hasCloseLabel: Boolean, val close: () -> Unit)

private val LocalDialogClose = staticCompositionLocalOf { DialogCloseInfo(false, false) {} }

@Composable
internal fun CenteredModal(
    open: Boolean,
    onDismissRequest: () -> Unit,
    dismissOnScrimClick: Boolean,
    maxWidth: Dp,
    modifier: Modifier,
    overlay: @Composable () -> Unit = {},
    content: @Composable ColumnScope.() -> Unit,
) {
    val transition = remember { MutableTransitionState(false) }
    transition.targetState = open
    val paneTitle = remember { PaneTitleState() }
    val colors = EsuissTheme.colors
    ModalWindow(
        visible = transition.currentState || transition.targetState,
        onDismissRequest = { if (open) onDismissRequest() },
        dismissOnBackPress = true,
        paneTitle = paneTitle.value,
    ) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Scrim(transition, 150, 100, onClick = if (dismissOnScrimClick) ({ if (open) onDismissRequest() }) else null)
            AnimatedVisibility(
                visibleState = transition,
                modifier = Modifier
                    .windowInsetsPadding(WindowInsets.safeDrawing)
                    .padding(16.dp),
                enter = fadeIn(tween(150)) + scaleIn(tween(150), initialScale = 0.95f),
                exit = fadeOut(tween(100)) + scaleOut(tween(100), targetScale = 0.95f),
            ) {
                val shape = RoundedCornerShape(Radius.xl2)
                Box(
                    modifier = modifier
                        .widthIn(max = maxWidth)
                        .fillMaxWidth()
                        .raisedSurface(colors, shape)
                        .pointerInput(Unit) {}
                        .semantics { paneTitle.value?.let { this.paneTitle = it } },
                ) {
                    CompositionLocalProvider(
                        LocalPaneTitle provides paneTitle,
                        LocalContentStyle provides Typography.base.copy(color = colors.label),
                        LocalContentColor provides colors.label,
                    ) {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .verticalScroll(rememberScrollState())
                                .padding(24.dp),
                            verticalArrangement = Arrangement.spacedBy(24.dp),
                            content = content,
                        )
                        overlay()
                    }
                }
            }
        }
    }
}

@Composable
fun Dialog(
    open: Boolean,
    onOpenChange: (Boolean) -> Unit,
    modifier: Modifier = Modifier,
    showCloseButton: Boolean = true,
    closeLabel: String? = null,
    dismissible: Boolean = true,
    content: @Composable ColumnScope.() -> Unit,
) {
    val close = { onOpenChange(false) }
    val info = DialogCloseInfo(showCloseButton, showCloseButton && closeLabel != null, close)
    CompositionLocalProvider(LocalDialogClose provides info) {
        CenteredModal(
            open = open,
            onDismissRequest = { if (dismissible) close() },
            dismissOnScrimClick = dismissible,
            maxWidth = 448.dp,
            modifier = modifier,
            overlay = {
                if (showCloseButton) {
                    Box(modifier = Modifier.fillMaxWidth(), contentAlignment = Alignment.TopEnd) {
                        OverlayCloseButton(
                            onClick = close,
                            label = closeLabel,
                            modifier = Modifier.padding(
                                top = if (closeLabel != null) 19.dp else 13.dp,
                                end = if (closeLabel != null) 16.dp else 10.dp,
                            ),
                        )
                    }
                }
            },
            content = content,
        )
    }
}

@Composable
fun DialogHeader(
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit,
) {
    val info = LocalDialogClose.current
    val end = when {
        info.hasCloseLabel -> 72.dp
        info.hasCloseButton -> 32.dp
        else -> 0.dp
    }
    Column(
        modifier = modifier.fillMaxWidth().padding(end = end),
        verticalArrangement = Arrangement.spacedBy(6.dp),
        content = content,
    )
}

@Composable
fun DialogFooter(
    modifier: Modifier = Modifier,
    showCloseButton: Boolean = false,
    content: @Composable () -> Unit,
) {
    val info = LocalDialogClose.current
    Layout(
        modifier = modifier.fillMaxWidth(),
        content = {
            content()
            if (showCloseButton) {
                Button("Close", onClick = info.close, modifier = Modifier.fillMaxWidth(), variant = ButtonVariant.Secondary)
            }
        },
    ) { measurables, constraints ->
        val gap = 8.dp.roundToPx()
        val placeables = measurables.map { it.measure(constraints.copy(minHeight = 0)) }
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

@Composable
fun DialogTitle(text: String, modifier: Modifier = Modifier) {
    OverlayTitle(text, modifier, titleStyle(EsuissTheme.colors))
}

@Composable
fun DialogDescription(text: String, modifier: Modifier = Modifier) {
    BasicText(text, modifier = modifier, style = descriptionStyle(EsuissTheme.colors))
}
