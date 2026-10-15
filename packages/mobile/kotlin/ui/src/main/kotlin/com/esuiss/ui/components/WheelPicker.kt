package com.esuiss.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.snapping.SnapPosition
import androidx.compose.foundation.gestures.snapping.rememberSnapFlingBehavior
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.wrapContentWidth
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyListState
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.snapshotFlow
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.layout.Layout
import androidx.compose.ui.semantics.ProgressBarRangeInfo
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.progressBarRangeInfo
import androidx.compose.ui.semantics.setProgress
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography
import kotlin.math.PI
import kotlin.math.abs
import kotlin.math.cos
import kotlin.math.max
import kotlin.math.min
import kotlin.math.roundToInt
import kotlin.math.sin
import kotlinx.coroutines.flow.drop
import kotlinx.coroutines.flow.filter

private val WheelItemHeight = 32.dp

private const val RowAngle = (PI / 10.5).toFloat()

private const val MaxAngle = (PI / 2).toFloat()

private const val Perspective = 1200f

private const val FadeAngle = 0.35f

@Immutable
private class WheelEntry(
    val value: String,
    val text: String?,
    val enabled: Boolean,
    val content: @Composable () -> Unit,
)

interface WheelPickerColumnScope {
    fun WheelPickerItem(value: String, enabled: Boolean = true, content: @Composable () -> Unit)

    fun WheelPickerItem(value: String, text: String, enabled: Boolean = true)
}

private class WheelPickerColumnScopeImpl : WheelPickerColumnScope {
    val entries = mutableListOf<WheelEntry>()

    override fun WheelPickerItem(value: String, enabled: Boolean, content: @Composable () -> Unit) {
        entries += WheelEntry(value, null, enabled, content)
    }

    override fun WheelPickerItem(value: String, text: String, enabled: Boolean) {
        entries += WheelEntry(value, text, enabled) {
            BasicText(text, style = LocalContentStyle.current, maxLines = 1, softWrap = false)
        }
    }
}

@Composable
fun WheelPicker(
    modifier: Modifier = Modifier,
    horizontalArrangement: Arrangement.Horizontal = Arrangement.Center,
    content: @Composable RowScope.() -> Unit,
) {
    Box(modifier = modifier, contentAlignment = Alignment.Center) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(WheelItemHeight)
                .background(EsuissTheme.colors.secondary, RoundedCornerShape(Radius.lg)),
        )
        Row(
            horizontalArrangement = horizontalArrangement,
            verticalAlignment = Alignment.CenterVertically,
            content = content,
        )
    }
}

@Composable
fun WheelPickerColumn(
    value: String?,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    label: String? = null,
    horizontalAlignment: Alignment.Horizontal = Alignment.CenterHorizontally,
    itemPadding: Dp = 12.dp,
    content: WheelPickerColumnScope.() -> Unit,
) {
    val colors = EsuissTheme.colors
    val entries = WheelPickerColumnScopeImpl().apply(content).entries.toList()
    val selectedIndex = entries.indexOfFirst { it.value == value }
    val state = rememberLazyListState(initialFirstVisibleItemIndex = selectedIndex.coerceAtLeast(0))
    val fling = rememberSnapFlingBehavior(state, SnapPosition.Center)
    val reducedMotion = formReducedMotion()
    val currentValue by rememberUpdatedState(value)
    val currentEntries by rememberUpdatedState(entries)
    val haptics = rememberHaptics()
    val select: (String) -> Unit = {
        if (it != value) haptics.selection()
        onValueChange(it)
    }
    val currentOnValueChange by rememberUpdatedState(select)

    LaunchedEffect(state) {
        snapshotFlow { state.isScrollInProgress }
            .drop(1)
            .filter { !it }
            .collect {
                val list = currentEntries
                if (list.isEmpty()) return@collect
                val centered = state.wheelPosition().roundToInt().coerceIn(0, list.lastIndex)
                val index = nearestEnabledIndex(list, centered)
                if (index < 0) return@collect
                if (index != centered) {
                    if (reducedMotion) state.scrollToItem(index) else state.animateScrollToItem(index)
                }
                if (list[index].value != currentValue) currentOnValueChange(list[index].value)
            }
    }

    LaunchedEffect(value, entries.size) {
        if (selectedIndex < 0 || state.isScrollInProgress) return@LaunchedEffect
        if (state.layoutInfo.visibleItemsInfo.isEmpty()) {
            state.scrollToItem(selectedIndex)
            return@LaunchedEffect
        }
        if (selectedIndex == state.wheelPosition().roundToInt()) return@LaunchedEffect
        if (reducedMotion) state.scrollToItem(selectedIndex) else state.animateScrollToItem(selectedIndex)
    }

    val itemStyle = Typography.xl.copy(fontFeatureSettings = "tnum")
    Box(modifier = modifier.height(WheelItemHeight * 6.75f)) {
        Layout(
            content = {
                entries.forEach { entry ->
                    Box(Modifier.padding(horizontal = itemPadding)) {
                        CompositionLocalProvider(LocalContentStyle provides itemStyle) { entry.content() }
                    }
                }
            },
        ) { measurables, constraints ->
            val width = measurables.maxOfOrNull { it.maxIntrinsicWidth(WheelItemHeight.roundToPx()) } ?: 0
            layout(width.coerceIn(constraints.minWidth, constraints.maxWidth), 0) {}
        }
        LazyColumn(
            state = state,
            flingBehavior = fling,
            contentPadding = PaddingValues(vertical = WheelItemHeight * 2.875f),
            horizontalAlignment = horizontalAlignment,
            modifier = Modifier
                .matchParentSize()
                .clip(RoundedCornerShape(Radius.lg))
                .clearAndSetSemantics {
                    if (label != null) contentDescription = label
                    if (selectedIndex >= 0) {
                        stateDescription = entries[selectedIndex].text ?: entries[selectedIndex].value
                    }
                    if (entries.isNotEmpty()) {
                        val last = entries.lastIndex
                        progressBarRangeInfo = ProgressBarRangeInfo(
                            selectedIndex.coerceAtLeast(0).toFloat(),
                            0f..last.toFloat().coerceAtLeast(1f),
                            max(0, last - 1),
                        )
                        setProgress { target ->
                            val current = selectedIndex.coerceAtLeast(0)
                            val wanted = target.roundToInt().coerceIn(0, last)
                            val index = when {
                                wanted > current -> enabledIndex(entries, wanted, 1)
                                wanted < current -> enabledIndex(entries, wanted, -1)
                                else -> -1
                            }
                            if (index >= 0) select(entries[index].value)
                            index >= 0
                        }
                    }
                },
        ) {
            itemsIndexed(entries, key = { _, entry -> entry.value }) { index, entry ->
                Box(
                    modifier = Modifier
                        .height(WheelItemHeight)
                        .fillMaxWidth()
                        .clickable(interactionSource = null, indication = null, enabled = entry.enabled) {
                            select(entry.value)
                        }
                        .padding(horizontal = itemPadding),
                    contentAlignment = Alignment.CenterStart,
                ) {
                    Box(
                        modifier = Modifier
                            .align(Alignment.Center)
                            .fillMaxWidth()
                            .wrapContentWidth(horizontalAlignment, unbounded = true)
                            .graphicsLayer {
                                val distance = index - state.wheelPosition()
                                val height = WheelItemHeight.value
                                val radius = height / RowAngle
                                val angle = (distance * RowAngle).coerceIn(-MaxAngle, MaxAngle)
                                val offset = abs(distance)
                                val tone = if (offset < 1f) 1f - offset * 0.45f else 0.55f - (offset - 1f) * 0.06f
                                val fade = min(1f, (MaxAngle - abs(angle)) / FadeAngle)
                                val depth = Perspective / (Perspective + radius - radius * cos(angle))
                                translationY = (radius * sin(angle) - distance * height) * density
                                scaleX = depth
                                scaleY = depth * cos(angle)
                                alpha = max(0f, tone * fade)
                            },
                    ) {
                        CompositionLocalProvider(
                            LocalContentStyle provides itemStyle.copy(
                                color = if (entry.enabled) colors.foreground else colors.mutedForeground,
                            ),
                            LocalContentColor provides if (entry.enabled) colors.foreground else colors.mutedForeground,
                        ) {
                            entry.content()
                        }
                    }
                }
            }
        }
    }
}

private fun LazyListState.wheelPosition(): Float {
    val info = layoutInfo
    val first = info.visibleItemsInfo.firstOrNull() ?: return firstVisibleItemIndex.toFloat()
    if (first.size == 0) return first.index.toFloat()
    val center = (info.viewportStartOffset + info.viewportEndOffset) / 2f
    return first.index - (first.offset - center) / first.size - 0.5f
}

private fun enabledIndex(entries: List<WheelEntry>, from: Int, step: Int): Int {
    var index = from
    while (index >= 0 && index < entries.size) {
        if (entries[index].enabled) return index
        index += step
    }
    return -1
}

private fun nearestEnabledIndex(entries: List<WheelEntry>, from: Int): Int {
    for (distance in entries.indices) {
        if (entries.getOrNull(from - distance)?.enabled == true) return from - distance
        if (entries.getOrNull(from + distance)?.enabled == true) return from + distance
    }
    return -1
}
