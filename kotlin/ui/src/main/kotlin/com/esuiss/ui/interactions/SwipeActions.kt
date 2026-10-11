package com.esuiss.ui.interactions

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.AnchoredDraggableDefaults
import androidx.compose.foundation.gestures.AnchoredDraggableState
import androidx.compose.foundation.gestures.DraggableAnchors
import androidx.compose.foundation.gestures.Orientation
import androidx.compose.foundation.gestures.anchoredDraggable
import androidx.compose.foundation.gestures.animateTo
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.gestures.snapTo
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.SideEffect
import androidx.compose.runtime.Stable
import androidx.compose.runtime.State
import androidx.compose.runtime.derivedStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.setValue
import androidx.compose.runtime.snapshotFlow
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clipToBounds
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.compositeOver
import androidx.compose.ui.graphics.lerp
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.Layout
import androidx.compose.ui.layout.layout
import androidx.compose.ui.layout.onSizeChanged
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.semantics.CustomAccessibilityAction
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.customActions
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Constraints
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import com.esuiss.ui.components.FormEasing
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.formReducedMotion
import com.esuiss.ui.components.rememberHaptics
import com.esuiss.ui.theme.Colors
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import kotlin.math.abs
import kotlin.math.roundToInt
import kotlinx.coroutines.flow.drop
import kotlinx.coroutines.flow.filter

enum class SwipeActionsSide { Leading, Trailing }

enum class SwipeActionVariant { Default, Destructive, Archive, Neutral }

@Immutable
class SwipeAction(
    val label: String,
    val onClick: () -> Unit,
    val icon: ImageVector? = null,
    val variant: SwipeActionVariant = SwipeActionVariant.Default,
    val fullSwipe: Boolean = false,
)

internal enum class SwipeActionsValue { Closed, Leading, Trailing, LeadingFull, TrailingFull }

private val SwipeSpec = tween<Float>(300, easing = FormEasing)

@Stable
class SwipeActionsState internal constructor() {
    internal val anchored = AnchoredDraggableState(SwipeActionsValue.Closed)
    internal var scope: CoroutineScope? = null
    internal var reduced = false

    val openSide: SwipeActionsSide?
        get() = when (anchored.currentValue) {
            SwipeActionsValue.Leading, SwipeActionsValue.LeadingFull -> SwipeActionsSide.Leading
            SwipeActionsValue.Trailing, SwipeActionsValue.TrailingFull -> SwipeActionsSide.Trailing
            SwipeActionsValue.Closed -> null
        }

    suspend fun close() = moveTo(SwipeActionsValue.Closed)

    suspend fun open(side: SwipeActionsSide) =
        moveTo(if (side == SwipeActionsSide.Leading) SwipeActionsValue.Leading else SwipeActionsValue.Trailing)

    internal fun requestClose() {
        scope?.launch { close() }
    }

    private suspend fun moveTo(target: SwipeActionsValue) {
        if (anchored.anchors.size == 0) snapshotFlow { anchored.anchors.size }.first { it > 0 }
        if (!anchored.anchors.hasPositionFor(target)) return
        if (reduced) anchored.snapTo(target) else anchored.animateTo(target, SwipeSpec)
    }
}

@Composable
fun rememberSwipeActionsState(): SwipeActionsState = remember { SwipeActionsState() }

private object SwipeActionsRegistry {
    var open: SwipeActionsState? = null

    fun claim(state: SwipeActionsState) {
        val previous = open
        open = state
        if (previous != null && previous !== state) previous.requestClose()
    }

    fun release(state: SwipeActionsState) {
        if (open === state) open = null
    }
}

@Composable
fun SwipeActions(
    modifier: Modifier = Modifier,
    leading: List<SwipeAction> = emptyList(),
    trailing: List<SwipeAction> = emptyList(),
    state: SwipeActionsState = rememberSwipeActionsState(),
    enabled: Boolean = true,
    background: Color = EsuissTheme.colors.surface,
    content: @Composable () -> Unit,
) {
    val rtl = LocalLayoutDirection.current == LayoutDirection.Rtl
    val reduced = formReducedMotion()
    val scope = rememberCoroutineScope()
    SideEffect {
        state.scope = scope
        state.reduced = reduced
    }
    DisposableEffect(state) {
        onDispose { SwipeActionsRegistry.release(state) }
    }
    var rowWidth by remember { mutableIntStateOf(0) }
    var leadingWidth by remember { mutableIntStateOf(0) }
    var trailingWidth by remember { mutableIntStateOf(0) }
    var removing by remember { mutableStateOf(false) }
    val removal = remember { Animatable(1f) }
    val leadingFull = leading.any { it.fullSwipe }
    val trailingFull = trailing.any { it.fullSwipe }
    val currentLeading by rememberUpdatedState(leading)
    val currentTrailing by rememberUpdatedState(trailing)
    val hasLeading = leading.isNotEmpty()
    val hasTrailing = trailing.isNotEmpty()

    LaunchedEffect(rowWidth, leadingWidth, trailingWidth, hasLeading, hasTrailing, leadingFull, trailingFull) {
        if (rowWidth == 0) return@LaunchedEffect
        val anchors = DraggableAnchors {
            SwipeActionsValue.Closed at 0f
            if (hasLeading && leadingWidth > 0) {
                SwipeActionsValue.Leading at leadingWidth.toFloat()
                if (leadingFull && rowWidth > leadingWidth) SwipeActionsValue.LeadingFull at rowWidth.toFloat()
            }
            if (hasTrailing && trailingWidth > 0) {
                SwipeActionsValue.Trailing at -trailingWidth.toFloat()
                if (trailingFull && rowWidth > trailingWidth) SwipeActionsValue.TrailingFull at -rowWidth.toFloat()
            }
        }
        val target = state.anchored.targetValue
        state.anchored.updateAnchors(anchors, if (anchors.hasPositionFor(target)) target else SwipeActionsValue.Closed)
    }

    LaunchedEffect(state) {
        snapshotFlow { state.anchored.settledValue }.collect { value ->
            when (value) {
                SwipeActionsValue.Closed -> SwipeActionsRegistry.release(state)
                SwipeActionsValue.Leading, SwipeActionsValue.Trailing -> SwipeActionsRegistry.claim(state)
                SwipeActionsValue.LeadingFull, SwipeActionsValue.TrailingFull -> {
                    SwipeActionsRegistry.release(state)
                    val actions = if (value == SwipeActionsValue.LeadingFull) currentLeading else currentTrailing
                    val action = actions.firstOrNull { it.fullSwipe }
                    removing = true
                    if (!state.reduced) {
                        delay(180)
                        removal.animateTo(0f, tween(220, easing = FormEasing))
                    }
                    action?.onClick?.invoke()
                    delay(50)
                    state.anchored.snapTo(SwipeActionsValue.Closed)
                    removal.snapTo(1f)
                    removing = false
                }
            }
        }
    }

    val offsetState = remember(state) {
        derivedStateOf { state.anchored.offset.let { if (it.isNaN()) 0f else it } }
    }
    val fullSide by remember(state) {
        derivedStateOf {
            val anchors = state.anchored.anchors
            val offset = offsetState.value
            when {
                offset > 0f && anchors.hasPositionFor(SwipeActionsValue.LeadingFull) -> {
                    val open = anchors.positionOf(SwipeActionsValue.Leading)
                    val full = anchors.positionOf(SwipeActionsValue.LeadingFull)
                    if (offset > (open + full) / 2f) SwipeActionsSide.Leading else null
                }
                offset < 0f && anchors.hasPositionFor(SwipeActionsValue.TrailingFull) -> {
                    val open = anchors.positionOf(SwipeActionsValue.Trailing)
                    val full = anchors.positionOf(SwipeActionsValue.TrailingFull)
                    if (offset < (open + full) / 2f) SwipeActionsSide.Trailing else null
                }
                else -> null
            }
        }
    }
    val currentHaptics by rememberUpdatedState(rememberHaptics())
    LaunchedEffect(state) {
        snapshotFlow { fullSide }
            .drop(1)
            .filter { it != null }
            .collect { currentHaptics.perform(HapticFeedbackType.GestureThresholdActivate) }
    }
    val fullProgress = animateFloatAsState(
        targetValue = if (fullSide != null) 1f else 0f,
        animationSpec = if (reduced) tween(0) else tween(200, easing = FormEasing),
        label = "full",
    )
    val revealedSide by remember(state) {
        derivedStateOf {
            val offset = offsetState.value
            when {
                offset > 0.5f -> SwipeActionsSide.Leading
                offset < -0.5f -> SwipeActionsSide.Trailing
                else -> null
            }
        }
    }
    val isOpen = revealedSide != null
    val accessibilityActions = remember(leading, trailing) {
        (leading + trailing).map { action ->
            CustomAccessibilityAction(action.label) {
                action.onClick()
                true
            }
        }
    }

    Box(
        modifier = modifier
            .fillMaxWidth()
            .onSizeChanged { rowWidth = it.width }
            .layout { measurable, constraints ->
                val placeable = measurable.measure(constraints)
                val height = (placeable.height * removal.value).roundToInt()
                layout(placeable.width, height) { placeable.place(0, 0) }
            }
            .clipToBounds()
            .anchoredDraggable(
                state = state.anchored,
                orientation = Orientation.Horizontal,
                enabled = enabled && !removing,
                reverseDirection = rtl,
                flingBehavior = AnchoredDraggableDefaults.flingBehavior(
                    state = state.anchored,
                    positionalThreshold = { it * 0.5f },
                    animationSpec = SwipeSpec,
                ),
            ),
    ) {
        if (hasLeading) {
            SwipeActionsStrip(
                actions = leading,
                side = SwipeActionsSide.Leading,
                offset = offsetState,
                fullProgress = fullProgress,
                fullActive = fullSide == SwipeActionsSide.Leading,
                visible = revealedSide == SwipeActionsSide.Leading,
                onNaturalWidth = { leadingWidth = it },
                onAction = { state.requestClose() },
                modifier = Modifier.matchParentSize(),
            )
        }
        if (hasTrailing) {
            SwipeActionsStrip(
                actions = trailing,
                side = SwipeActionsSide.Trailing,
                offset = offsetState,
                fullProgress = fullProgress,
                fullActive = fullSide == SwipeActionsSide.Trailing,
                visible = revealedSide == SwipeActionsSide.Trailing,
                onNaturalWidth = { trailingWidth = it },
                onAction = { state.requestClose() },
                modifier = Modifier.matchParentSize(),
            )
        }
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .offset { IntOffset(offsetState.value.roundToInt(), 0) }
                .background(background)
                .pointerInput(Unit) {}
                .semantics(mergeDescendants = true) {
                    if (enabled) customActions = accessibilityActions
                },
        ) {
            content()
            if (isOpen) {
                Box(
                    modifier = Modifier
                        .matchParentSize()
                        .clearAndSetSemantics {}
                        .pointerInput(state) {
                            detectTapGestures { state.requestClose() }
                        },
                )
            }
        }
    }
}

internal fun swipeActionColor(variant: SwipeActionVariant, colors: Colors): Color = when (variant) {
    SwipeActionVariant.Default -> colors.accent
    SwipeActionVariant.Destructive -> if (colors.isDark) lerp(colors.danger, colors.surface, 0.3f) else colors.danger
    SwipeActionVariant.Archive -> if (colors.isDark) lerp(colors.purple, colors.surface, 0.3f) else lerp(colors.purple, colors.label, 0.15f)
    SwipeActionVariant.Neutral -> if (colors.isDark) lerp(colors.gray, colors.surface, 0.4f) else lerp(colors.gray, colors.label, 0.35f)
}

@Composable
private fun SwipeActionsStrip(
    actions: List<SwipeAction>,
    side: SwipeActionsSide,
    offset: State<Float>,
    fullProgress: State<Float>,
    fullActive: Boolean,
    visible: Boolean,
    onNaturalWidth: (Int) -> Unit,
    onAction: () -> Unit,
    modifier: Modifier,
) {
    val fullIndex = actions.indexOfFirst { it.fullSwipe }
    Layout(
        modifier = modifier.then(if (visible) Modifier else Modifier.clearAndSetSemantics {}),
        content = {
            actions.forEachIndexed { index, action ->
                SwipeActionButton(action, hidden = fullActive && index != fullIndex, onAction = onAction)
            }
        },
    ) { measurables, constraints ->
        val height = constraints.maxHeight
        val width = constraints.maxWidth
        val minimum = 72.dp.roundToPx()
        val natural = measurables.sumOf { maxOf(minimum, it.maxIntrinsicWidth(height)) }
        onNaturalWidth(natural)
        val raw = offset.value
        val revealed = (if (side == SwipeActionsSide.Leading) raw else -raw).coerceAtLeast(0f)
        val count = measurables.size
        val base = maxOf(minimum.toFloat(), revealed / count)
        val progress = if (fullIndex >= 0) fullProgress.value else 0f
        val widths = IntArray(count) { index ->
            val target = when {
                fullIndex < 0 -> base
                index == fullIndex -> base + (revealed - base) * progress
                else -> base * (1f - progress)
            }
            if (revealed <= 0f) 0 else target.roundToInt().coerceAtLeast(0)
        }
        val placeables = measurables.mapIndexed { index, measurable ->
            measurable.measure(Constraints.fixed(widths[index], height))
        }
        layout(width, height) {
            if (side == SwipeActionsSide.Trailing) {
                var x = width - revealed.roundToInt()
                placeables.forEachIndexed { index, placeable ->
                    val alpha = if (fullIndex >= 0 && index != fullIndex) 1f - progress else 1f
                    placeable.placeRelativeWithLayer(x, 0) { this.alpha = alpha }
                    x += placeable.width
                }
            } else {
                var x = revealed.roundToInt()
                placeables.forEachIndexed { index, placeable ->
                    x -= placeable.width
                    val alpha = if (fullIndex >= 0 && index != fullIndex) 1f - progress else 1f
                    placeable.placeRelativeWithLayer(x, 0) { this.alpha = alpha }
                }
            }
        }
    }
}

@Composable
private fun SwipeActionButton(action: SwipeAction, hidden: Boolean, onAction: () -> Unit) {
    val colors = EsuissTheme.colors
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    val base = swipeActionColor(action.variant, colors)
    val fill = if (pressed) Color.Black.copy(alpha = 0.12f).compositeOver(base) else base
    Column(
        modifier = Modifier
            .background(fill)
            .then(if (hidden) Modifier.clearAndSetSemantics {} else Modifier)
            .clickable(
                interactionSource = interaction,
                indication = null,
                role = Role.Button,
                onClick = {
                    action.onClick()
                    onAction()
                },
            )
            .padding(horizontal = 12.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(4.dp, Alignment.CenterVertically),
    ) {
        if (action.icon != null) Icon(action.icon, contentDescription = null, size = 20.dp, tint = colors.onAccent)
        BasicText(
            action.label,
            style = Typography.xs.copy(color = colors.onAccent, fontWeight = FontWeight.Medium, textAlign = TextAlign.Center),
            maxLines = 2,
        )
    }
}
