package com.esuiss.ui.interactions

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.VectorConverter
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.Stable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key as identity
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.TransformOrigin
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.input.pointer.util.VelocityTracker
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.semantics.CustomAccessibilityAction
import androidx.compose.ui.semantics.customActions
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import androidx.compose.ui.util.lerp
import com.esuiss.ui.components.formReducedMotion
import com.esuiss.ui.components.rememberHaptics
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.launch
import kotlin.math.abs

enum class CardStackDirection { Left, Right }

@Stable
class CardStackState internal constructor(initialIndex: Int, private val scope: CoroutineScope) {
    var index by mutableIntStateOf(initialIndex)
        private set
    internal val history = mutableStateListOf<CardStackDirection>()
    internal val offset = Animatable(Offset.Zero, Offset.VectorConverter)
    internal var width = 0f
    internal var count = 0
    internal var busy by mutableStateOf(false)
    internal var onSwiped: ((CardStackDirection, Int) -> Unit)? = null
    internal var onUndone: ((CardStackDirection, Int) -> Unit)? = null
    internal var reduced = false

    val canUndo: Boolean
        get() = history.isNotEmpty() && index > 0

    val isEmpty: Boolean
        get() = index >= count

    val progress: Float
        get() = if (width <= 0f) 0f else (offset.value.x / (width * 0.35f)).coerceIn(-1f, 1f)

    fun swipe(direction: CardStackDirection) {
        if (busy || isEmpty) return
        scope.launch { dismiss(direction) }
    }

    fun undo() {
        if (busy || !canUndo) return
        scope.launch {
            busy = true
            val direction = history.removeAt(history.lastIndex)
            index -= 1
            offset.snapTo(Offset(if (direction == CardStackDirection.Left) -width * 1.5f else width * 1.5f, 0f))
            onUndone?.invoke(direction, index)
            offset.animateTo(Offset.Zero, if (reduced) tween(0) else spring(0.8f, Spring.StiffnessMediumLow))
            busy = false
        }
    }

    internal suspend fun dismiss(direction: CardStackDirection) {
        busy = true
        val target = Offset(if (direction == CardStackDirection.Left) -width * 1.5f else width * 1.5f, offset.value.y)
        offset.animateTo(target, tween(if (reduced) 0 else 260))
        val swiped = index
        history.add(direction)
        index += 1
        offset.snapTo(Offset.Zero)
        busy = false
        onSwiped?.invoke(direction, swiped)
    }

    internal suspend fun settle() {
        offset.animateTo(Offset.Zero, if (reduced) tween(0) else spring(0.7f, Spring.StiffnessMedium))
    }
}

@Composable
fun rememberCardStackState(initialIndex: Int = 0): CardStackState {
    val scope = rememberCoroutineScope()
    return remember(scope) { CardStackState(initialIndex, scope) }
}

@Composable
fun <T> CardStack(
    items: List<T>,
    onSwipe: (CardStackDirection, T) -> Unit,
    modifier: Modifier = Modifier,
    state: CardStackState = rememberCardStackState(),
    key: ((T) -> Any)? = null,
    visibleCount: Int = 3,
    enabled: Boolean = true,
    onUndo: ((CardStackDirection, T) -> Unit)? = null,
    empty: @Composable () -> Unit = {},
    content: @Composable (T) -> Unit,
) {
    val haptics = rememberHaptics()
    val scope = rememberCoroutineScope()
    val density = LocalDensity.current
    val swipe by rememberUpdatedState(onSwipe)
    val undo by rememberUpdatedState(onUndo)
    val list by rememberUpdatedState(items)
    state.count = items.size
    state.reduced = formReducedMotion()
    LaunchedEffect(state) {
        state.onSwiped = { direction, index ->
            haptics.perform(HapticFeedbackType.GestureThresholdActivate)
            list.getOrNull(index)?.let { swipe(direction, it) }
        }
        state.onUndone = { direction, index ->
            list.getOrNull(index)?.let { undo?.invoke(direction, it) }
        }
    }
    BoxWithConstraints(
        modifier = modifier.fillMaxWidth().padding(bottom = 10.dp * (visibleCount - 1).coerceAtLeast(0)),
        contentAlignment = Alignment.TopCenter,
    ) {
        val width = with(density) { maxWidth.toPx() }
        state.width = width
        if (state.isEmpty) {
            empty()
            return@BoxWithConstraints
        }
        val threshold = width * 0.35f
        val step = with(density) { 10.dp.toPx() }
        val shown = items.drop(state.index).take(visibleCount.coerceAtLeast(1))
        val progress = abs(state.progress)
        shown.indices.reversed().forEach { depth ->
            val item = shown[depth]
            val position = state.index + depth
            identity(key?.invoke(item) ?: position) {
                val top = depth == 0
                val effective = if (top) 0f else depth - progress
                Box(
                    modifier = Modifier
                        .graphicsLayer {
                            if (top) {
                                val offset = state.offset.value
                                translationX = offset.x
                                translationY = offset.y
                                rotationZ = (offset.x / width) * 12f
                                transformOrigin = TransformOrigin(0.5f, 1f)
                            } else {
                                val scale = 1f - 0.05f * effective
                                scaleX = scale
                                scaleY = scale
                                translationY = step * effective
                                transformOrigin = TransformOrigin(0.5f, 1f)
                                alpha = if (depth >= visibleCount - 1) lerp(0f, 1f, (visibleCount - effective).coerceIn(0f, 1f)) else 1f
                            }
                        }
                        .then(
                            if (top && enabled) {
                                Modifier
                                    .semantics {
                                        customActions = listOf(
                                            CustomAccessibilityAction("Swipe left") {
                                                state.swipe(CardStackDirection.Left)
                                                true
                                            },
                                            CustomAccessibilityAction("Swipe right") {
                                                state.swipe(CardStackDirection.Right)
                                                true
                                            },
                                        )
                                    }
                                    .pointerInput(state, position) {
                                        val tracker = VelocityTracker()
                                        detectDragGestures(
                                            onDragStart = { tracker.resetTracking() },
                                            onDrag = { change, amount ->
                                                if (state.busy) return@detectDragGestures
                                                change.consume()
                                                tracker.addPosition(change.uptimeMillis, change.position)
                                                scope.launch { state.offset.snapTo(state.offset.value + amount) }
                                            },
                                            onDragEnd = {
                                                if (state.busy) return@detectDragGestures
                                                val x = state.offset.value.x
                                                val velocity = tracker.calculateVelocity().x
                                                val fling = with(density) { 1000.dp.toPx() }
                                                scope.launch {
                                                    when {
                                                        x > threshold || (velocity > fling && x > 0f) -> state.dismiss(CardStackDirection.Right)
                                                        x < -threshold || (velocity < -fling && x < 0f) -> state.dismiss(CardStackDirection.Left)
                                                        else -> state.settle()
                                                    }
                                                }
                                            },
                                            onDragCancel = { scope.launch { state.settle() } },
                                        )
                                    }
                            } else {
                                Modifier
                            },
                        ),
                ) {
                    content(item)
                }
            }
        }
    }
}
