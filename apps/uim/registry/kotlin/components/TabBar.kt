package com.esuiss.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.WindowInsetsSides
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.only
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawing
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.selection.selectableGroup
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography

@Immutable
private class TabBarContext(val value: String, val onValueChange: (String) -> Unit)

private val LocalTabBar = staticCompositionLocalOf<TabBarContext?> { null }

@Composable
fun TabBar(
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    content: @Composable RowScope.() -> Unit,
) {
    val colors = EsuissTheme.colors
    CompositionLocalProvider(LocalTabBar provides TabBarContext(value, onValueChange)) {
        Column(
            modifier = modifier
                .fillMaxWidth()
                .background(colors.surface)
                .drawBehind { drawRect(colors.separator, Offset.Zero, Size(size.width, 1.dp.toPx())) }
                .windowInsetsPadding(WindowInsets.safeDrawing.only(WindowInsetsSides.Bottom + WindowInsetsSides.Horizontal)),
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp)
                    .padding(horizontal = 4.dp)
                    .selectableGroup(),
                verticalAlignment = Alignment.CenterVertically,
                content = content,
            )
        }
    }
}

@Composable
fun RowScope.TabBarItem(
    value: String,
    label: String,
    icon: ImageVector,
    modifier: Modifier = Modifier,
    selectedIcon: ImageVector? = null,
    badge: String? = null,
    enabled: Boolean = true,
) {
    val context = checkNotNull(LocalTabBar.current) { "TabBarItem must be used within a TabBar" }
    val colors = EsuissTheme.colors
    val haptics = rememberHaptics()
    val selected = context.value == value
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    val foreground = when {
        !enabled -> colors.labelQuaternary
        selected && pressed -> colors.accentPressed
        selected -> colors.accent
        pressed -> colors.label
        else -> colors.labelSecondary
    }
    Column(
        modifier = modifier
            .weight(1f)
            .fillMaxHeight()
            .selectable(
                selected = selected,
                interactionSource = interaction,
                indication = null,
                enabled = enabled,
                role = Role.Tab,
            ) {
                if (!selected) haptics.selection()
                context.onValueChange(value)
            },
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(2.dp, Alignment.CenterVertically),
    ) {
        Box {
            Icon(if (selected && selectedIcon != null) selectedIcon else icon, contentDescription = null, size = 24.dp, tint = foreground)
            if (badge != null) TabBarBadge(badge, Modifier.align(Alignment.TopStart).offset(x = if (badge.isEmpty()) 18.dp else 14.dp, y = (-4).dp))
        }
        BasicText(
            label,
            style = Typography.xs3.copy(color = foreground, fontWeight = FontWeight.Medium, textAlign = TextAlign.Center),
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
        )
    }
}

@Composable
private fun TabBarBadge(text: String, modifier: Modifier) {
    val colors = EsuissTheme.colors
    if (text.isEmpty()) {
        Box(modifier = modifier.size(10.dp).clip(CircleShape).background(colors.danger, CircleShape))
        return
    }
    Box(
        modifier = modifier
            .heightIn(min = 18.dp)
            .widthIn(min = 18.dp)
            .clip(CircleShape)
            .background(colors.danger, CircleShape)
            .padding(horizontal = 5.dp),
        contentAlignment = Alignment.Center,
    ) {
        BasicText(
            text,
            style = Typography.xs3.copy(color = colors.onAccent, fontWeight = FontWeight.SemiBold, textAlign = TextAlign.Center),
            maxLines = 1,
        )
    }
}
