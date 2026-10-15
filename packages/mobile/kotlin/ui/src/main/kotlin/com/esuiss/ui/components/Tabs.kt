package com.esuiss.ui.components

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.selection.selectableGroup
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.Stable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.layout.boundsInParent
import androidx.compose.ui.layout.onPlaced
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Shadows
import com.esuiss.ui.theme.Typography
import com.esuiss.ui.theme.shadow
import kotlin.math.roundToInt
import kotlinx.coroutines.launch

enum class TabsListVariant { Default, Line }

private val IndicatorEasing = CubicBezierEasing(0.32f, 0.72f, 0f, 1f)

@Stable
private class TabsState(selected: String, onSelectedChange: (String) -> Unit) {
    var selected by mutableStateOf(selected)
    var onSelectedChange by mutableStateOf(onSelectedChange)
    val bounds = mutableStateMapOf<String, Rect>()
}

private val LocalTabs = staticCompositionLocalOf<TabsState?> { null }

private val LocalTabsVariant = staticCompositionLocalOf { TabsListVariant.Default }

@Composable
fun Tabs(
    selected: String,
    onSelectedChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit,
) {
    val state = remember { TabsState(selected, onSelectedChange) }
    state.selected = selected
    state.onSelectedChange = onSelectedChange
    CompositionLocalProvider(LocalTabs provides state) {
        Column(modifier = modifier, verticalArrangement = Arrangement.spacedBy(8.dp), content = content)
    }
}

@Composable
fun TabsList(
    modifier: Modifier = Modifier,
    variant: TabsListVariant = TabsListVariant.Default,
    content: @Composable RowScope.() -> Unit,
) {
    val state = LocalTabs.current ?: error("TabsList must be used within Tabs.")
    val colors = EsuissTheme.colors
    val line = variant == TabsListVariant.Line
    val listShape = RoundedCornerShape(Radius.xl)
    Box(
        modifier = modifier
            .width(IntrinsicSize.Max)
            .height(if (line) 41.dp else 44.dp)
            .then(if (line) Modifier else Modifier.background(colors.secondary, listShape))
            .padding(if (line) 2.dp else 4.dp)
            .then(if (line) Modifier.padding(bottom = 5.dp) else Modifier),
    ) {
        TabsIndicator(state, variant)
        CompositionLocalProvider(LocalTabsVariant provides variant) {
            Row(
                modifier = Modifier.fillMaxWidth().fillMaxHeight().selectableGroup(),
                horizontalArrangement = Arrangement.spacedBy(4.dp),
                verticalAlignment = Alignment.CenterVertically,
                content = content,
            )
        }
    }
}

@Composable
private fun TabsIndicator(state: TabsState, variant: TabsListVariant) {
    val colors = EsuissTheme.colors
    val density = LocalDensity.current
    val target = state.bounds[state.selected] ?: return
    val left = remember { Animatable(target.left) }
    val width = remember { Animatable(target.width) }
    LaunchedEffect(target) {
        val spec = tween<Float>(300, easing = IndicatorEasing)
        launch { left.animateTo(target.left, spec) }
        launch { width.animateTo(target.width, spec) }
    }
    val shape = RoundedCornerShape(Radius.md)
    if (variant == TabsListVariant.Line) {
        Box(
            modifier = Modifier
                .offset { IntOffset(left.value.roundToInt(), (target.bottom + with(density) { 3.dp.toPx() }).roundToInt()) }
                .size(with(density) { width.value.toDp() }, 2.dp)
                .background(colors.foreground),
        )
    } else {
        Box(
            modifier = Modifier
                .offset { IntOffset(left.value.roundToInt(), target.top.roundToInt()) }
                .size(with(density) { width.value.toDp() }, with(density) { target.height.toDp() })
                .shadow(Shadows.md, shape)
                .background(if (colors.isDark) colors.border else colors.card, shape),
        )
    }
}

@Composable
fun RowScope.TabsTrigger(
    value: String,
    text: String,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
) {
    TabsTrigger(value, modifier, enabled) {
        BasicText(text, style = LocalContentStyle.current, maxLines = 1)
    }
}

@Composable
fun RowScope.TabsTrigger(
    value: String,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    content: @Composable RowScope.() -> Unit,
) {
    val state = LocalTabs.current ?: error("TabsTrigger must be used within Tabs.")
    val colors = EsuissTheme.colors
    val active = state.selected == value
    val foreground = if (active) colors.foreground else colors.mutedForeground
    Row(
        modifier = modifier
            .weight(1f)
            .fillMaxHeight()
            .alpha(if (enabled) 1f else 0.5f)
            .onPlaced { state.bounds[value] = it.boundsInParent() }
            .selectable(
                selected = active,
                enabled = enabled,
                role = Role.Tab,
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
                onClick = { state.onSelectedChange(value) },
            )
            .padding(horizontal = 12.dp, vertical = 4.dp),
        horizontalArrangement = Arrangement.spacedBy(8.dp, Alignment.CenterHorizontally),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        CompositionLocalProvider(
            LocalContentStyle provides Typography.sm.copy(color = foreground),
            LocalContentColor provides foreground,
            LocalIconSize provides 16.dp,
        ) {
            content()
        }
    }
}

@Composable
fun TabsContent(
    value: String,
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit,
) {
    val state = LocalTabs.current ?: error("TabsContent must be used within Tabs.")
    if (state.selected != value) return
    Column(modifier = modifier, content = content)
}
