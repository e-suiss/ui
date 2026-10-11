package com.esuiss.ui.components

import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.gestures.awaitEachGesture
import androidx.compose.foundation.gestures.awaitFirstDown
import androidx.compose.foundation.gestures.awaitHorizontalTouchSlopOrCancellation
import androidx.compose.foundation.gestures.horizontalDrag
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.input.pointer.changedToUp
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.Layout
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.semantics.ProgressBarRangeInfo
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.disabled
import androidx.compose.ui.semantics.progressBarRangeInfo
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.setProgress
import androidx.compose.ui.unit.Constraints
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.constrainHeight
import androidx.compose.ui.unit.dp
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Shadows
import com.esuiss.ui.theme.shadow
import kotlin.math.abs
import kotlin.math.roundToInt

@Composable
fun Slider(
    value: Float,
    onValueChange: (Float) -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = LocalFieldState.current.enabled,
    valueRange: ClosedFloatingPointRange<Float> = 0f..100f,
    step: Float = 1f,
    onValueChangeFinished: (() -> Unit)? = null,
    contentDescription: String? = null,
) {
    SliderLayout(
        values = listOf(value),
        onValuesChange = { onValueChange(it[0]) },
        modifier = modifier,
        enabled = enabled,
        valueRange = valueRange,
        step = step,
        onValueChangeFinished = onValueChangeFinished,
        contentDescription = contentDescription,
    )
}

@Composable
fun RangeSlider(
    value: ClosedFloatingPointRange<Float>,
    onValueChange: (ClosedFloatingPointRange<Float>) -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = LocalFieldState.current.enabled,
    valueRange: ClosedFloatingPointRange<Float> = 0f..100f,
    step: Float = 1f,
    onValueChangeFinished: (() -> Unit)? = null,
    contentDescription: String? = null,
) {
    SliderLayout(
        values = listOf(value.start, value.endInclusive),
        onValuesChange = { onValueChange(it[0]..it[1]) },
        modifier = modifier,
        enabled = enabled,
        valueRange = valueRange,
        step = step,
        onValueChangeFinished = onValueChangeFinished,
        contentDescription = contentDescription,
    )
}

@Composable
private fun SliderLayout(
    values: List<Float>,
    onValuesChange: (List<Float>) -> Unit,
    modifier: Modifier,
    enabled: Boolean,
    valueRange: ClosedFloatingPointRange<Float>,
    step: Float,
    onValueChangeFinished: (() -> Unit)?,
    contentDescription: String?,
) {
    val colors = EsuissTheme.colors
    val rtl = LocalLayoutDirection.current == LayoutDirection.Rtl
    val start = valueRange.start
    val span = valueRange.endInclusive - valueRange.start
    val currentValues by rememberUpdatedState(values)
    val currentOnChange by rememberUpdatedState(onValuesChange)
    val currentOnFinished by rememberUpdatedState(onValueChangeFinished)
    val currentHaptics by rememberUpdatedState(rememberHaptics())
    var activeThumb by remember { mutableIntStateOf(-1) }

    fun snap(raw: Float): Float {
        val clamped = raw.coerceIn(valueRange)
        if (step <= 0f) return clamped
        return (start + ((clamped - start) / step).roundToInt() * step).coerceIn(valueRange)
    }

    fun fractionOf(value: Float): Float = if (span <= 0f) 0f else ((value - start) / span).coerceIn(0f, 1f)

    fun update(index: Int, raw: Float): Boolean {
        val next = currentValues.toMutableList()
        var value = snap(raw)
        if (next.size == 2) {
            value = if (index == 0) value.coerceAtMost(next[1]) else value.coerceAtLeast(next[0])
        }
        next[index] = value
        if (next != currentValues) {
            if (step > 0f) currentHaptics.perform(HapticFeedbackType.SegmentFrequentTick)
            currentOnChange(next)
        }
        return true
    }

    val thumbWidth = 32.dp
    val gesture = if (enabled) {
        Modifier.pointerInput(valueRange, step, rtl) {
            val thumb = thumbWidth.toPx()
            fun valueAt(x: Float): Float {
                val usable = (size.width - thumb).coerceAtLeast(1f)
                var fraction = ((x - thumb / 2f) / usable).coerceIn(0f, 1f)
                if (rtl) fraction = 1f - fraction
                return start + fraction * span
            }
            fun pick(target: Float): Int {
                val list = currentValues
                if (list.size == 1) return 0
                val first = abs(list[0] - target)
                val second = abs(list[1] - target)
                return when {
                    first < second -> 0
                    second < first -> 1
                    target > list[1] -> 1
                    else -> 0
                }
            }
            awaitEachGesture {
                val down = awaitFirstDown(requireUnconsumed = false)
                val index = pick(valueAt(down.position.x))
                activeThumb = index
                try {
                    val slop = awaitHorizontalTouchSlopOrCancellation(down.id) { change, _ -> change.consume() }
                    if (slop != null) {
                        update(index, valueAt(slop.position.x))
                        horizontalDrag(slop.id) { change ->
                            update(index, valueAt(change.position.x))
                            change.consume()
                        }
                        currentOnFinished?.invoke()
                    } else {
                        val up = currentEvent.changes.firstOrNull { it.id == down.id }
                        if (up != null && up.changedToUp() && !up.isConsumed) {
                            update(index, valueAt(up.position.x))
                            up.consume()
                            currentOnFinished?.invoke()
                        }
                    }
                } finally {
                    activeThumb = -1
                }
            }
        }
    } else {
        Modifier
    }

    val fractions = values.map { fractionOf(it) }
    val stepCount = if (step > 0f && span > 0f) ((span / step).roundToInt() - 1).coerceAtLeast(0) else 0

    Layout(
        content = {
            Box(
                Modifier
                    .fillMaxWidth()
                    .height(4.dp)
                    .clip(CircleShape)
                    .background(if (enabled) colors.labelQuaternary else colors.controlDisabled)
                    .drawBehind {
                        val thumb = thumbWidth.toPx()
                        val usable = size.width - thumb
                        val centers = fractions.map { thumb / 2f + it * usable }
                        val from = if (centers.size == 1) 0f else centers[0]
                        val to = centers.last()
                        val left = if (rtl) size.width - to else from
                        val right = if (rtl) size.width - from else to
                        drawRect(
                            if (enabled) colors.accent else colors.accentDisabled,
                            Offset(left, 0f),
                            Size((right - left).coerceAtLeast(0f), size.height),
                        )
                    },
            )
            values.forEachIndexed { index, value ->
                SliderThumb(
                    value = value,
                    valueRange = valueRange,
                    stepCount = stepCount,
                    enabled = enabled,
                    dragging = activeThumb == index,
                    contentDescription = contentDescription,
                    onSetProgress = {
                        update(index, it)
                        currentOnFinished?.invoke()
                    },
                )
            }
        },
        modifier = modifier
            .then(gesture)
            .formTouchTarget()
            .fillMaxWidth()
            .height(32.dp),
    ) { measurables, constraints ->
        val width = if (constraints.hasBoundedWidth) constraints.maxWidth else 200.dp.roundToPx()
        val height = constraints.constrainHeight(32.dp.roundToPx())
        val track = measurables[0].measure(Constraints.fixed(width, 4.dp.roundToPx()))
        val thumbs = measurables.drop(1).map { it.measure(Constraints()) }
        val thumb = thumbWidth.toPx()
        layout(width, height) {
            track.place(0, (height - track.height) / 2)
            thumbs.forEachIndexed { index, placeable ->
                val center = thumb / 2f + fractions[index] * (width - thumb)
                val x = if (rtl) width - center else center
                placeable.place((x - placeable.width / 2f).roundToInt(), (height - placeable.height) / 2)
            }
        }
    }
}

@Composable
private fun SliderThumb(
    value: Float,
    valueRange: ClosedFloatingPointRange<Float>,
    stepCount: Int,
    enabled: Boolean,
    dragging: Boolean,
    contentDescription: String?,
    onSetProgress: (Float) -> Unit,
) {
    val colors = EsuissTheme.colors
    val width by animateDpAsState(
        if (dragging && enabled) 36.dp else 32.dp,
        tween<Dp>(200, easing = FormEasing),
        label = "thumb",
    )
    Box(
        Modifier
            .semantics {
                if (contentDescription != null) this.contentDescription = contentDescription
                progressBarRangeInfo = ProgressBarRangeInfo(value, valueRange, stepCount)
                if (enabled) {
                    setProgress { target ->
                        onSetProgress(target)
                        true
                    }
                } else {
                    disabled()
                }
            }
            .size(width, 20.dp)
            .then(if (enabled) Modifier.shadow(Shadows.md, CircleShape) else Modifier)
            .background(if (colors.isDark) colors.label else colors.surface, CircleShape)
            .border(1.dp, colors.label.copy(alpha = 0.1f), CircleShape),
    )
}
