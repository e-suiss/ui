package com.esuiss.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.Stable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.unit.dp
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography

@Stable
private class MenubarState {
    var open by mutableStateOf<Any?>(null)
}

private val LocalMenubar = staticCompositionLocalOf<MenubarState?> { null }

@Composable
fun Menubar(
    modifier: Modifier = Modifier,
    content: @Composable RowScope.() -> Unit,
) {
    val colors = EsuissTheme.colors
    val state = remember { MenubarState() }
    val shape = RoundedCornerShape(Radius.md)
    CompositionLocalProvider(LocalMenubar provides state) {
        Row(
            modifier = modifier
                .height(36.dp)
                .border(1.dp, colors.separator, shape)
                .padding(4.dp),
            verticalAlignment = Alignment.CenterVertically,
            content = content,
        )
    }
}

@Composable
fun MenubarMenu(
    text: String,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    content: @Composable ColumnScope.() -> Unit,
) {
    val state = LocalMenubar.current ?: error("MenubarMenu must be used within a Menubar.")
    val colors = EsuissTheme.colors
    val key = remember { Any() }
    val expanded = state.open === key
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    val shape = RoundedCornerShape(Radius.sm)
    val foreground = if (enabled) colors.label else colors.labelQuaternary
    Box {
        Box(
            modifier = Modifier
                .clip(shape)
                .background(
                    when {
                        pressed && enabled -> colors.itemPressed
                        expanded -> colors.itemSelected
                        else -> Color.Transparent
                    },
                    shape,
                )
                .semantics { stateDescription = if (expanded) "Expanded" else "Collapsed" }
                .clickable(
                    interactionSource = interaction,
                    indication = null,
                    enabled = enabled,
                    role = Role.DropdownList,
                    onClick = { state.open = if (expanded) null else key },
                )
                .padding(horizontal = 8.dp, vertical = 3.dp),
        ) {
            BasicText(text, style = Typography.sm.copy(color = foreground), maxLines = 1)
        }
        CompositionLocalProvider(LocalMenu provides MenuContext({}, true)) {
            MenuPopup(
                expanded = expanded,
                onDismissRequest = { if (state.open === key) state.open = null },
                modifier = modifier,
                side = PopupSide.Bottom,
                align = PopupAlign.Start,
                sideOffset = 8.dp,
                alignOffset = (-4).dp,
                minWidth = 192.dp,
                menubar = true,
                content = content,
            )
        }
    }
}
