package com.esuiss.ui.interactions

import androidx.compose.animation.core.animate
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clipToBounds
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.input.nestedscroll.NestedScrollConnection
import androidx.compose.ui.input.nestedscroll.NestedScrollSource
import androidx.compose.ui.input.nestedscroll.nestedScroll
import androidx.compose.ui.layout.layout
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.semantics.CustomAccessibilityAction
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.customActions
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.Constraints
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.Velocity
import androidx.compose.ui.unit.dp
import com.esuiss.ui.components.FormEasing
import com.esuiss.ui.components.Spinner
import com.esuiss.ui.components.SpinnerSpokes
import com.esuiss.ui.components.drawSpinnerSpokes
import com.esuiss.ui.components.formReducedMotion
import com.esuiss.ui.components.rememberHaptics
import com.esuiss.ui.theme.EsuissTheme
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlin.math.exp
import kotlin.math.roundToInt

enum class PullToRefreshPhase { Idle, Pulling, Refreshing, Settling }

private val PullThreshold = 64.dp
private val PullHold = 52.dp
private val PullMax = 128.dp
private const val MinRefreshMillis = 600L
private const val SettleMillis = 400

@Composable
fun PullToRefresh(
    onRefresh: suspend () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    refreshLabel: String = "Refresh",
    content: @Composable () -> Unit,
) {
    val scope = rememberCoroutineScope()
    val refresh by rememberUpdatedState(onRefresh)
    var refreshing by remember { mutableStateOf(false) }
    PullToRefresh(
        refreshing = refreshing,
        onRefresh = {
            if (!refreshing) {
                refreshing = true
                scope.launch {
                    try {
                        refresh()
                    } finally {
                        refreshing = false
                    }
                }
            }
        },
        modifier = modifier,
        enabled = enabled,
        refreshLabel = refreshLabel,
        content = content,
    )
}

@Composable
fun PullToRefresh(
    refreshing: Boolean,
    onRefresh: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    refreshLabel: String = "Refresh",
    content: @Composable () -> Unit,
) {
    val colors = EsuissTheme.colors
    val density = LocalDensity.current
    val haptics by rememberUpdatedState(rememberHaptics())
    val reduced = formReducedMotion()
    val scope = rememberCoroutineScope()
    val thresholdPx = with(density) { PullThreshold.toPx() }
    val holdPx = with(density) { PullHold.toPx() }
    val maxPx = with(density) { PullMax.toPx() }
    val trigger by rememberUpdatedState(onRefresh)
    var pull by remember { mutableFloatStateOf(0f) }
    var raw by remember { mutableFloatStateOf(0f) }
    var phase by remember { mutableStateOf(PullToRefreshPhase.Idle) }
    var requested by remember { mutableStateOf(false) }
    val active = refreshing || requested

    suspend fun animatePull(target: Float, millis: Int) {
        if (reduced) {
            pull = target
        } else {
            animate(pull, target, animationSpec = tween(millis, easing = FormEasing)) { value, _ -> pull = value }
        }
    }

    LaunchedEffect(active) {
        if (active) {
            phase = PullToRefreshPhase.Refreshing
            animatePull(holdPx, SettleMillis)
            if (requested) {
                delay(MinRefreshMillis)
                requested = false
            }
        } else if (phase == PullToRefreshPhase.Refreshing) {
            phase = PullToRefreshPhase.Settling
            animatePull(0f, SettleMillis)
            phase = PullToRefreshPhase.Idle
        }
    }

    fun resist(distance: Float): Float = maxPx * (1f - exp(-distance / (maxPx * 1.6f)))

    fun release() {
        raw = 0f
        if (pull >= thresholdPx) {
            haptics.perform(HapticFeedbackType.Confirm)
            requested = true
            trigger()
        } else {
            scope.launch {
                animatePull(0f, SettleMillis)
                if (phase == PullToRefreshPhase.Pulling) phase = PullToRefreshPhase.Idle
            }
        }
    }

    fun pullTo(distance: Float) {
        raw = distance.coerceAtLeast(0f)
        pull = resist(raw)
    }

    val connection = remember(enabled) {
        object : NestedScrollConnection {
            override fun onPreScroll(available: Offset, source: NestedScrollSource): Offset {
                if (source != NestedScrollSource.UserInput || phase != PullToRefreshPhase.Pulling || available.y >= 0f) return Offset.Zero
                val before = raw
                pullTo(raw + available.y)
                return Offset(0f, raw - before)
            }

            override fun onPostScroll(consumed: Offset, available: Offset, source: NestedScrollSource): Offset {
                if (!enabled || source != NestedScrollSource.UserInput || available.y <= 0f) return Offset.Zero
                if (phase != PullToRefreshPhase.Idle && phase != PullToRefreshPhase.Pulling) return Offset.Zero
                phase = PullToRefreshPhase.Pulling
                pullTo(raw + available.y)
                return Offset(0f, available.y)
            }

            override suspend fun onPreFling(available: Velocity): Velocity {
                if (phase != PullToRefreshPhase.Pulling) return Velocity.Zero
                release()
                return available
            }
        }
    }

    val spinning = phase == PullToRefreshPhase.Refreshing || phase == PullToRefreshPhase.Settling
    val settleScale by animateFloatAsState(
        targetValue = if (phase == PullToRefreshPhase.Settling) 0f else 1f,
        animationSpec = tween(if (reduced) 0 else 300),
        label = "settle",
    )
    val refreshAction = remember(refreshLabel) {
        listOf(
            CustomAccessibilityAction(refreshLabel) {
                if (!refreshing && !requested) {
                    requested = true
                    trigger()
                }
                true
            },
        )
    }
    Box(
        modifier = modifier
            .clipToBounds()
            .nestedScroll(connection)
            .semantics { if (enabled) customActions = refreshAction },
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clipToBounds()
                .layout { measurable, constraints ->
                    val height = pull.roundToInt().coerceAtLeast(0)
                    val placeable = measurable.measure(constraints.copy(minHeight = 0, maxHeight = Constraints.Infinity))
                    layout(placeable.width, height) {
                        placeable.place(0, (height - placeable.height) / 2)
                    }
                },
            contentAlignment = Alignment.Center,
        ) {
            if (spinning) {
                Spinner(
                    modifier = Modifier.graphicsLayer {
                        val scale = 0.5f + 0.5f * settleScale
                        scaleX = scale
                        scaleY = scale
                        alpha = settleScale
                    },
                    size = 24.dp,
                    color = colors.mutedForeground,
                    contentDescription = "Refreshing",
                )
            } else {
                val tint = colors.mutedForeground
                Canvas(modifier = Modifier.size(24.dp).clearAndSetSemantics {}) {
                    val progress = (pull / thresholdPx).coerceIn(0f, 1f)
                    drawSpinnerSpokes(tint) { index -> progress * SpinnerSpokes - index }
                }
            }
        }
        Box(modifier = Modifier.offset { IntOffset(0, pull.roundToInt()) }) {
            content()
        }
    }
}
