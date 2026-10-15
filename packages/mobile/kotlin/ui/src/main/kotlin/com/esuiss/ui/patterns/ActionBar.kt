package com.esuiss.ui.patterns

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Bold
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.bold.DotsThree
import com.adamglin.phosphoricons.regular.CaretRight
import com.esuiss.ui.components.AlertSheet
import com.esuiss.ui.components.AlertSheetAction
import com.esuiss.ui.components.AlertSheetCancel
import com.esuiss.ui.components.AlertSheetGroup
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Drawer
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.LocalDrawerSquareTop
import com.esuiss.ui.components.MenuItemVariant
import com.esuiss.ui.components.RegisterPaneTitle
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography

class ActionBarScope internal constructor() {
    internal val menus = mutableListOf<ActionBarMenuScope>()

    fun ActionBarMenu(
        open: Boolean? = null,
        onOpenChange: (Boolean) -> Unit = {},
        defaultOpen: Boolean = false,
        content: ActionBarMenuScope.() -> Unit,
    ) {
        menus += ActionBarMenuScope(open, onOpenChange, defaultOpen).apply(content)
    }
}

class ActionBarMenuScope internal constructor(
    internal val open: Boolean?,
    internal val onOpenChange: (Boolean) -> Unit,
    internal val defaultOpen: Boolean,
) {
    internal var trigger: String = ""
    internal var triggerEnabled: Boolean = true
    internal var contentModifier: Modifier = Modifier
    internal var content: (@Composable () -> Unit)? = null

    fun ActionBarTrigger(text: String, enabled: Boolean = true) {
        trigger = text
        triggerEnabled = enabled
    }

    fun ActionBarContent(modifier: Modifier = Modifier, content: @Composable () -> Unit) {
        contentModifier = modifier
        this.content = content
    }
}

@Composable
fun ActionBar(
    open: Boolean,
    onOpenChange: (Boolean) -> Unit,
    modifier: Modifier = Modifier,
    dismissible: Boolean = true,
    floating: Boolean = false,
    moreLabel: String = "More actions",
    cancelLabel: String = "Cancel",
    content: ActionBarScope.() -> Unit,
) {
    val menus = ActionBarScope().apply(content).menus
    var active by remember { mutableStateOf<Int?>(null) }
    val defaultIndex = menus.indexOfFirst { it.defaultOpen }
    LaunchedEffect(Unit) {
        if (defaultIndex >= 0) active = defaultIndex
    }
    val colors = EsuissTheme.colors
    Row(
        modifier = modifier,
        horizontalArrangement = Arrangement.End,
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Button(
            onClick = { onOpenChange(true) },
            modifier = Modifier.semantics { contentDescription = moreLabel },
            variant = ButtonVariant.Ghost,
            size = ButtonSize.Icon,
        ) {
            Icon(PhosphorIcons.Bold.DotsThree, contentDescription = null)
        }
    }
    CompositionLocalProvider(LocalDrawerSquareTop provides !floating) {
        Drawer(open = open, onOpenChange = onOpenChange, floating = floating) {
            RegisterPaneTitle(moreLabel)
            val shape = RoundedCornerShape(Radius.xl2)
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp)
                    .clip(shape)
                    .background(colors.muted, shape),
            ) {
                menus.forEachIndexed { index, menu ->
                    ActionBarRow(
                        text = menu.trigger,
                        enabled = menu.triggerEnabled,
                        divided = index > 0,
                        onClick = {
                            onOpenChange(false)
                            active = index
                            menu.onOpenChange(true)
                        },
                    )
                }
            }
        }
    }
    menus.forEachIndexed { index, menu ->
        AlertSheet(
            open = menu.open ?: (active == index),
            onOpenChange = { next ->
                if (!next) active = null
                menu.onOpenChange(next)
            },
            modifier = menu.contentModifier,
            dismissible = dismissible,
        ) {
            AlertSheetGroup { menu.content?.invoke() }
            AlertSheetCancel(cancelLabel)
        }
    }
}

@Composable
private fun ActionBarRow(
    text: String,
    enabled: Boolean,
    divided: Boolean,
    onClick: () -> Unit,
) {
    val colors = EsuissTheme.colors
    val rtl = LocalLayoutDirection.current == LayoutDirection.Rtl
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(start = 16.dp)
            .drawBehind {
                if (divided) drawRect(colors.border, Offset.Zero, Size(size.width, 1.dp.toPx()))
            }
            .heightIn(min = 44.dp)
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
                enabled = enabled,
                role = Role.Button,
                onClick = onClick,
            )
            .padding(top = 11.dp, bottom = 11.dp, end = 16.dp),
        horizontalArrangement = Arrangement.spacedBy(24.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        BasicText(
            text,
            modifier = Modifier.weight(1f),
            style = Typography.base.copy(color = colors.foreground),
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
        )
        Icon(
            PhosphorIcons.Regular.CaretRight,
            contentDescription = null,
            modifier = Modifier.graphicsLayer { scaleX = if (rtl) -1f else 1f },
            size = 16.dp,
            tint = colors.mutedForeground,
        )
    }
}

@Composable
fun ActionBarLabel(text: String, modifier: Modifier = Modifier) {
    SheetMenuLabel(text, modifier)
}

@Composable
fun ActionBarItem(
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
fun ActionBarSeparator() {
}
