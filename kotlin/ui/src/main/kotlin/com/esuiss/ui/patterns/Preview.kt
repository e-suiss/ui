package com.esuiss.ui.patterns

import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import com.esuiss.ui.components.LocalContentColor
import com.esuiss.ui.components.LocalContentStyle
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography

private val LocalPreview = drawerPatternLocal()

@Composable
fun Preview(
    open: Boolean,
    onOpenChange: (Boolean) -> Unit,
    floating: Boolean = true,
    content: @Composable () -> Unit,
) {
    CompositionLocalProvider(
        LocalPreview provides DrawerPatternState(open, onOpenChange, floating),
        content = content,
    )
}

@Composable
fun PreviewTrigger(
    modifier: Modifier = Modifier,
    content: @Composable BoxScope.() -> Unit,
) {
    val state = LocalPreview.current
    val colors = EsuissTheme.colors
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    CompositionLocalProvider(
        LocalContentStyle provides LocalContentStyle.current.copy(
            color = colors.link,
            textDecoration = if (pressed) TextDecoration.Underline else null,
        ),
        LocalContentColor provides colors.link,
    ) {
        Box(
            modifier = modifier.clickable(
                interactionSource = interaction,
                indication = null,
                role = Role.Button,
            ) { state?.onOpenChange?.invoke(true) },
            content = content,
        )
    }
}

@Composable
fun PreviewTrigger(text: String, modifier: Modifier = Modifier) {
    PreviewTrigger(modifier) {
        BasicText(text, style = Typography.base.merge(LocalContentStyle.current))
    }
}

@Composable
fun PreviewContent(
    modifier: Modifier = Modifier,
    showCloseButton: Boolean = false,
    closeLabel: String? = null,
    content: @Composable ColumnScope.() -> Unit,
) {
    DrawerPatternContent(LocalPreview.current, modifier, showCloseButton, closeLabel) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(
                    start = 16.dp,
                    top = 16.dp,
                    bottom = 16.dp,
                    end = when {
                        showCloseButton && closeLabel != null -> 96.dp
                        showCloseButton -> 56.dp
                        else -> 16.dp
                    },
                ),
            content = content,
        )
    }
}
