package com.esuiss.ui.components

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.spring
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.WindowInsetsSides
import androidx.compose.foundation.layout.exclude
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.onConsumedWindowInsetsChanged
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
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.runtime.Stable
import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.onPlaced
import androidx.compose.ui.layout.positionInParent
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.coerceAtLeast
import androidx.compose.ui.unit.dp
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography
import kotlinx.coroutines.launch

@Immutable
private class TabBarIndicator(val x: Float, val y: Float, val width: Float, val height: Float)

@Stable
private class TabBarLayout {
    val items = mutableStateMapOf<String, TabBarIndicator>()
}

@Immutable
private class TabBarContext(
    val value: String,
    val onValueChange: (String) -> Unit,
    val layout: TabBarLayout,
)

private val LocalTabBar = staticCompositionLocalOf<TabBarContext?> { null }

@Composable
fun TabBar(
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    content: @Composable RowScope.() -> Unit,
) {
    val colors = EsuissTheme.colors
    val density = LocalDensity.current
    var consumed by remember { mutableStateOf(WindowInsets(0, 0, 0, 0)) }
    val remaining = with(density) { WindowInsets.safeDrawing.exclude(consumed).getBottom(density).toDp() }
    val bottom = (remaining - 8.dp).coerceAtLeast(12.dp)
    val layout = remember { TabBarLayout() }
    val x = remember { Animatable(0f) }
    val width = remember { Animatable(0f) }
    var placed by remember { mutableStateOf(false) }
    val target = layout.items[value]
    LaunchedEffect(target?.x, target?.width) {
        if (target == null) return@LaunchedEffect
        if (!placed) {
            x.snapTo(target.x)
            width.snapTo(target.width)
            placed = true
            return@LaunchedEffect
        }
        val motion = spring<Float>(dampingRatio = 0.85f, stiffness = Spring.StiffnessMediumLow)
        launch { x.animateTo(target.x, motion) }
        launch { width.animateTo(target.width, motion) }
    }
    CompositionLocalProvider(LocalTabBar provides TabBarContext(value, onValueChange, layout)) {
        Column(
            modifier = modifier
                .fillMaxWidth()
                .onConsumedWindowInsetsChanged { consumed = it }
                .windowInsetsPadding(WindowInsets.safeDrawing.only(WindowInsetsSides.Horizontal))
                .padding(start = 16.dp, end = 16.dp, top = 8.dp, bottom = bottom),
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .raisedSurface(colors, CircleShape)
                    .padding(4.dp)
                    .drawBehind {
                        val current = layout.items[value]
                        if (placed && current != null) {
                            drawRoundRect(
                                color = colors.control,
                                topLeft = Offset(x.value, current.y),
                                size = Size(width.value, current.height),
                                cornerRadius = CornerRadius(current.height / 2f),
                            )
                        }
                    }
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
        selected -> colors.accent
        else -> colors.labelSecondary
    }
    DisposableEffect(context.layout, value) {
        onDispose { context.layout.items.remove(value) }
    }
    Column(
        modifier = modifier
            .weight(1f)
            .onPlaced { coordinates ->
                val position = coordinates.positionInParent()
                val next = TabBarIndicator(position.x, position.y, coordinates.size.width.toFloat(), coordinates.size.height.toFloat())
                val previous = context.layout.items[value]
                if (previous == null || previous.x != next.x || previous.y != next.y || previous.width != next.width || previous.height != next.height) {
                    context.layout.items[value] = next
                }
            }
            .clip(CircleShape)
            .then(if (pressed) Modifier.background(colors.itemPressed, CircleShape) else Modifier)
            .selectable(
                selected = selected,
                interactionSource = interaction,
                indication = null,
                enabled = enabled,
                role = Role.Tab,
            ) {
                if (!selected) haptics.selection()
                context.onValueChange(value)
            }
            .padding(vertical = 6.dp),
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
        Box(
            modifier = modifier
                .size(10.dp)
                .clip(CircleShape)
                .background(colors.danger, CircleShape)
                .border(2.dp, colors.surfaceRaised, CircleShape),
        )
        return
    }
    Box(
        modifier = modifier
            .heightIn(min = 18.dp)
            .widthIn(min = 18.dp)
            .clip(CircleShape)
            .background(colors.danger, CircleShape)
            .border(2.dp, colors.surfaceRaised, CircleShape)
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
