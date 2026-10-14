package com.esuiss.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.MutableTransitionState
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.Orientation
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.WindowInsetsSides
import androidx.compose.foundation.layout.asPaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.only
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawing
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.paneTitle
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography

enum class AlertSheetActionVariant { Default, Destructive }

private const val AlertSheetDuration = 300

private val LocalAlertSheetClose = staticCompositionLocalOf<() -> Unit> { {} }

@Composable
fun AlertSheet(
    open: Boolean,
    onOpenChange: (Boolean) -> Unit,
    modifier: Modifier = Modifier,
    dismissible: Boolean = true,
    content: @Composable ColumnScope.() -> Unit,
) {
    val transition = remember { MutableTransitionState(false) }
    transition.targetState = open
    val paneTitle = remember { PaneTitleState() }
    val reduced = formReducedMotion()
    val colors = EsuissTheme.colors
    val close = { if (open) onOpenChange(false) }
    ModalWindow(
        visible = transition.currentState || transition.targetState,
        onDismissRequest = close,
        dismissOnBackPress = true,
        paneTitle = paneTitle.value,
    ) {
        val bottom = maxOf(8.dp, WindowInsets.safeDrawing.asPaddingValues().calculateBottomPadding())
        val bottomPx = with(LocalDensity.current) { bottom.roundToPx() }
        Box(modifier = Modifier.fillMaxSize()) {
            Scrim(transition, AlertSheetDuration, AlertSheetDuration, onClick = if (dismissible) close else null)
            AnimatedVisibility(
                visibleState = transition,
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .windowInsetsPadding(WindowInsets.safeDrawing.only(WindowInsetsSides.Horizontal))
                    .padding(start = 8.dp, end = 8.dp, top = 8.dp, bottom = bottom),
                enter = if (reduced) {
                    fadeIn(tween(AlertSheetDuration))
                } else {
                    slideInVertically(tween(AlertSheetDuration, easing = FormEasing)) { it + bottomPx }
                },
                exit = if (reduced) {
                    fadeOut(tween(AlertSheetDuration))
                } else {
                    slideOutVertically(tween(AlertSheetDuration, easing = FormEasing)) { it + bottomPx }
                },
            ) {
                Column(
                    modifier = modifier
                        .widthIn(max = 448.dp)
                        .fillMaxWidth()
                        .pointerInput(Unit) {}
                        .semantics { paneTitle.value?.let { this.paneTitle = it } },
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    CompositionLocalProvider(
                        LocalPaneTitle provides paneTitle,
                        LocalAlertSheetClose provides close,
                        LocalContentStyle provides Typography.base.copy(color = colors.label),
                        LocalContentColor provides colors.label,
                    ) {
                        content()
                    }
                }
            }
        }
    }
}

@Composable
fun AlertSheetGroup(
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit,
) {
    val colors = EsuissTheme.colors
    val shape = RoundedCornerShape(Radius.xl2)
    FormDividedStack(
        orientation = Orientation.Vertical,
        dividerColor = colors.separator,
        modifier = modifier
            .fillMaxWidth()
            .clip(shape)
            .background(colors.surfaceRaised, shape),
        content = content,
    )
}

@Composable
fun AlertSheetHeader(
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit,
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(4.dp),
        content = content,
    )
}

@Composable
fun AlertSheetTitle(text: String, modifier: Modifier = Modifier) {
    OverlayTitle(
        text,
        modifier,
        Typography.sm.copy(
            color = EsuissTheme.colors.labelSecondary,
            fontWeight = FontWeight.SemiBold,
            textAlign = TextAlign.Center,
        ),
    )
}

@Composable
fun AlertSheetDescription(text: String, modifier: Modifier = Modifier) {
    BasicText(
        text,
        modifier = modifier,
        style = Typography.sm.copy(color = EsuissTheme.colors.labelSecondary, textAlign = TextAlign.Center),
    )
}

@Composable
private fun AlertSheetButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier,
    variant: AlertSheetActionVariant,
    enabled: Boolean,
    icon: ImageVector?,
    emphasized: Boolean,
) {
    val colors = EsuissTheme.colors
    val close = LocalAlertSheetClose.current
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    val foreground = when {
        !enabled -> colors.labelQuaternary
        variant == AlertSheetActionVariant.Destructive -> colors.danger
        else -> colors.link
    }
    Row(
        modifier = modifier
            .fillMaxWidth()
            .heightIn(min = 56.dp)
            .background(if (pressed && enabled) colors.label.copy(alpha = 0.1f) else Color.Transparent)
            .clickable(
                interactionSource = interaction,
                indication = null,
                enabled = enabled,
                role = Role.Button,
                onClick = {
                    onClick()
                    close()
                },
            )
            .padding(horizontal = 16.dp, vertical = 8.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp, Alignment.CenterHorizontally),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        if (icon != null) Icon(icon, contentDescription = null, size = 20.dp, tint = foreground)
        BasicText(
            text,
            style = Typography.lg.copy(
                color = foreground,
                fontWeight = if (emphasized) FontWeight.SemiBold else FontWeight.Normal,
                textAlign = TextAlign.Center,
            ),
        )
    }
}

@Composable
fun AlertSheetAction(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: AlertSheetActionVariant = AlertSheetActionVariant.Default,
    enabled: Boolean = true,
    icon: ImageVector? = null,
) {
    AlertSheetButton(text, onClick, modifier, variant, enabled, icon, emphasized = false)
}

@Composable
fun AlertSheetCancel(
    text: String = "Cancel",
    modifier: Modifier = Modifier,
    onClick: () -> Unit = {},
) {
    val colors = EsuissTheme.colors
    val shape = RoundedCornerShape(Radius.xl2)
    Box(modifier = modifier.fillMaxWidth().clip(shape).background(colors.surfaceRaised, shape)) {
        AlertSheetButton(text, onClick, Modifier, AlertSheetActionVariant.Default, true, null, emphasized = true)
    }
}
