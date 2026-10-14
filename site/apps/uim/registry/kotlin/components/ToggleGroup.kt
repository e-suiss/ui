package com.esuiss.ui.components

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.gestures.Orientation
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.selection.selectableGroup
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.SideEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.RectangleShape
import androidx.compose.ui.layout.boundsInParent
import androidx.compose.ui.layout.onPlaced
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.shadow
import kotlin.math.roundToInt
import kotlinx.coroutines.launch

private val IndicatorEasing = CubicBezierEasing(0.32f, 0.72f, 0f, 1f)

private class ToggleGroupIndicator {
    val bounds = mutableStateMapOf<String, Rect>()
    val active = mutableStateMapOf<String, Boolean>()
}

private class ToggleGroupState(
    val isSelected: (String) -> Boolean,
    val toggle: (String) -> Unit,
    val variant: ToggleVariant,
    val size: ToggleSize,
    val spacing: Int,
    val orientation: Orientation,
    val enabled: Boolean,
    val multiple: Boolean,
    val selected: String? = null,
    val indicator: ToggleGroupIndicator? = null,
) {
    val segmented: Boolean get() = spacing == 0 && variant == ToggleVariant.Default
    val attached: Boolean get() = spacing == 0 && variant == ToggleVariant.Outline
}

private val LocalToggleGroupState = staticCompositionLocalOf<ToggleGroupState?> { null }

@Composable
fun ToggleGroup(
    value: String?,
    onValueChange: (String?) -> Unit,
    modifier: Modifier = Modifier,
    variant: ToggleVariant = ToggleVariant.Default,
    size: ToggleSize = ToggleSize.Default,
    spacing: Int = 2,
    orientation: Orientation = Orientation.Horizontal,
    enabled: Boolean = true,
    content: @Composable () -> Unit,
) {
    val indicator = remember { ToggleGroupIndicator() }
    val state = ToggleGroupState(
        isSelected = { it == value },
        toggle = { onValueChange(if (it == value) null else it) },
        variant = variant,
        size = size,
        spacing = spacing,
        orientation = orientation,
        enabled = enabled,
        multiple = false,
        selected = value,
        indicator = if (spacing == 0 && variant == ToggleVariant.Default) indicator else null,
    )
    ToggleGroupLayout(state, modifier, content)
}

@Composable
fun ToggleGroup(
    values: Set<String>,
    onValuesChange: (Set<String>) -> Unit,
    modifier: Modifier = Modifier,
    variant: ToggleVariant = ToggleVariant.Default,
    size: ToggleSize = ToggleSize.Default,
    spacing: Int = 2,
    orientation: Orientation = Orientation.Horizontal,
    enabled: Boolean = true,
    content: @Composable () -> Unit,
) {
    val state = ToggleGroupState(
        isSelected = { it in values },
        toggle = { onValuesChange(if (it in values) values - it else values + it) },
        variant = variant,
        size = size,
        spacing = spacing,
        orientation = orientation,
        enabled = enabled,
        multiple = true,
    )
    ToggleGroupLayout(state, modifier, content)
}

@Composable
private fun ToggleGroupLayout(
    state: ToggleGroupState,
    modifier: Modifier,
    content: @Composable () -> Unit,
) {
    val colors = EsuissTheme.colors
    val vertical = state.orientation == Orientation.Vertical
    val base = modifier.then(if (state.multiple) Modifier else Modifier.selectableGroup())
    CompositionLocalProvider(LocalToggleGroupState provides state) {
        if (state.attached) {
            val shape = RoundedCornerShape(if (vertical) Radius.xl else Radius.lg)
            FormDividedStack(
                orientation = state.orientation,
                dividerColor = colors.separator,
                modifier = base.clip(shape).border(1.dp, colors.separator, shape),
                content = content,
            )
        } else {
            val gap = if (state.segmented) 4.dp else (state.spacing * 4).dp
            val container = if (state.segmented) {
                val shape = RoundedCornerShape(Radius.xl)
                base.clip(shape).background(colors.control, shape).padding(4.dp)
            } else {
                base
            }
            val indicator = state.indicator
            if (indicator != null) {
                Box(modifier = if (vertical) container.width(IntrinsicSize.Max) else container) {
                    if (state.enabled) ToggleGroupIndicatorLayer(indicator, state.selected)
                    ToggleGroupStack(vertical, gap, if (vertical) Modifier.fillMaxWidth() else Modifier, content)
                }
            } else {
                ToggleGroupStack(vertical, gap, if (vertical) container.width(IntrinsicSize.Max) else container, content)
            }
        }
    }
}

@Composable
private fun ToggleGroupStack(
    vertical: Boolean,
    gap: Dp,
    modifier: Modifier,
    content: @Composable () -> Unit,
) {
    if (vertical) {
        Column(
            modifier = modifier,
            verticalArrangement = Arrangement.spacedBy(gap),
        ) {
            content()
        }
    } else {
        Row(
            modifier = modifier,
            horizontalArrangement = Arrangement.spacedBy(gap),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            content()
        }
    }
}

@Composable
private fun ToggleGroupIndicatorLayer(indicator: ToggleGroupIndicator, selected: String?) {
    val colors = EsuissTheme.colors
    val density = LocalDensity.current
    val reduced = formReducedMotion()
    val target = selected?.takeIf { indicator.active[it] != false }?.let { indicator.bounds[it] } ?: return
    val left = remember { Animatable(target.left) }
    val top = remember { Animatable(target.top) }
    val width = remember { Animatable(target.width) }
    val height = remember { Animatable(target.height) }
    LaunchedEffect(target) {
        if (reduced) {
            left.snapTo(target.left)
            top.snapTo(target.top)
            width.snapTo(target.width)
            height.snapTo(target.height)
        } else {
            val spec = tween<Float>(300, easing = IndicatorEasing)
            launch { left.animateTo(target.left, spec) }
            launch { top.animateTo(target.top, spec) }
            launch { width.animateTo(target.width, spec) }
            launch { height.animateTo(target.height, spec) }
        }
    }
    val shape = RoundedCornerShape(Radius.md)
    Box(
        modifier = Modifier
            .offset { IntOffset(left.value.roundToInt(), top.value.roundToInt()) }
            .size(with(density) { width.value.toDp() }, with(density) { height.value.toDp() })
            .shadow(FormShadowSm, shape)
            .background(if (colors.isDark) colors.labelQuaternary else colors.surfaceRaised, shape),
    )
}

@Composable
fun ToggleGroupItem(
    value: String,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    interactionSource: MutableInteractionSource? = null,
    content: @Composable RowScope.() -> Unit,
) {
    val colors = EsuissTheme.colors
    val group = LocalToggleGroupState.current ?: return
    val source = interactionSource ?: remember { MutableInteractionSource() }
    val touching by source.collectIsPressedAsState()
    val haptics = rememberHaptics()
    val on = group.isSelected(value)
    val active = enabled && group.enabled
    val fill = if (group.orientation == Orientation.Vertical) Modifier.fillMaxWidth() else Modifier
    val semantics = modifier
        .then(fill)
        .toggleSemantics(on, active, source, group.multiple) {
            if (group.multiple) haptics.toggle(!on) else haptics.selection()
            group.toggle(value)
        }
    val indicator = group.indicator
    if (indicator != null) {
        SideEffect { indicator.active[value] = active }
        DisposableEffect(indicator, value) {
            onDispose {
                indicator.bounds.remove(value)
                indicator.active.remove(value)
            }
        }
    }
    val sliding = indicator != null && on && active
    when {
        group.segmented -> {
            val shape = RoundedCornerShape(Radius.md)
            val background = when {
                !on || sliding -> Color.Transparent
                !active -> colors.controlDisabled
                colors.isDark -> colors.labelQuaternary
                else -> colors.surfaceRaised
            }
            val foreground = when {
                !active -> colors.labelQuaternary
                on -> colors.label
                else -> colors.labelSecondary
            }
            val placed = if (indicator != null) {
                semantics.onPlaced { indicator.bounds[value] = it.boundsInParent() }
            } else {
                semantics
            }
            ToggleSurface(
                modifier = placed.then(if (on && active && !sliding) Modifier.shadow(FormShadowSm, shape) else Modifier),
                size = group.size,
                shape = shape,
                outlined = false,
                background = background,
                foreground = foreground,
                scaled = false,
                horizontalPadding = 12.dp,
                content = content,
            )
        }
        else -> ToggleSurface(
            modifier = semantics,
            size = group.size,
            shape = if (group.attached) RectangleShape else RoundedCornerShape(Radius.lg),
            outlined = !group.attached && group.variant == ToggleVariant.Outline,
            background = toggleBackground(colors, on, active, touching),
            foreground = toggleForeground(colors, on, active),
            scaled = touching && active,
            content = content,
        )
    }
}

@Composable
fun ToggleGroupItem(
    text: String,
    value: String,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
) {
    ToggleGroupItem(value, modifier, enabled) {
        BasicText(text, style = LocalContentStyle.current, maxLines = 1)
    }
}
