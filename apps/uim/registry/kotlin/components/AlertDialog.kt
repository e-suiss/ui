package com.esuiss.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography

enum class AlertDialogSize(val maxWidth: Dp) {
    Default(340.dp),
    Sm(320.dp),
}

private val LocalAlertDialogClose = staticCompositionLocalOf<() -> Unit> { {} }

@Composable
fun AlertDialog(
    open: Boolean,
    onOpenChange: (Boolean) -> Unit,
    modifier: Modifier = Modifier,
    size: AlertDialogSize = AlertDialogSize.Default,
    content: @Composable ColumnScope.() -> Unit,
) {
    val close = { onOpenChange(false) }
    CompositionLocalProvider(LocalAlertDialogClose provides close) {
        CenteredModal(
            open = open,
            onDismissRequest = close,
            dismissOnScrimClick = false,
            maxWidth = size.maxWidth,
            modifier = modifier,
            content = content,
        )
    }
}

@Composable
fun AlertDialogHeader(
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit,
) {
    Column(
        modifier = modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(6.dp),
        content = content,
    )
}

@Composable
fun AlertDialogMedia(
    modifier: Modifier = Modifier,
    content: @Composable BoxScope.() -> Unit,
) {
    val colors = EsuissTheme.colors
    Box(
        modifier = modifier
            .padding(bottom = 8.dp)
            .size(64.dp)
            .background(colors.surfaceSecondary, CircleShape),
        contentAlignment = Alignment.Center,
    ) {
        CompositionLocalProvider(LocalIconSize provides 32.dp, LocalContentColor provides colors.label) {
            content()
        }
    }
}

@Composable
fun AlertDialogTitle(text: String, modifier: Modifier = Modifier) {
    OverlayTitle(text, modifier, titleStyle(EsuissTheme.colors, Typography.lg, centered = true))
}

@Composable
fun AlertDialogDescription(text: String, modifier: Modifier = Modifier) {
    BasicText(text, modifier = modifier, style = descriptionStyle(EsuissTheme.colors, centered = true))
}

@Composable
fun AlertDialogFooter(
    modifier: Modifier = Modifier,
    content: @Composable RowScope.() -> Unit,
) {
    Row(
        modifier = modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalAlignment = Alignment.CenterVertically,
        content = content,
    )
}

@Composable
fun RowScope.AlertDialogAction(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: ButtonVariant = ButtonVariant.Default,
    size: ButtonSize = ButtonSize.Default,
) {
    val close = LocalAlertDialogClose.current
    Button(
        text = text,
        onClick = {
            onClick()
            close()
        },
        modifier = modifier.weight(1f),
        variant = variant,
        size = size,
    )
}

@Composable
fun RowScope.AlertDialogCancel(
    text: String,
    modifier: Modifier = Modifier,
    onClick: () -> Unit = {},
    variant: ButtonVariant = ButtonVariant.Secondary,
    size: ButtonSize = ButtonSize.Default,
) {
    AlertDialogAction(text, onClick, modifier, variant, size)
}
