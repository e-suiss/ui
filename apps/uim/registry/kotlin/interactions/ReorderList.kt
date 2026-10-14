package com.esuiss.ui.interactions

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.AnimationVector1D
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.snap
import androidx.compose.animation.core.spring
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.Orientation
import androidx.compose.foundation.gestures.draggable
import androidx.compose.foundation.gestures.rememberDraggableState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.Stable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.setValue
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.RectangleShape
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.layout.onPlaced
import androidx.compose.ui.layout.onSizeChanged
import androidx.compose.ui.semantics.CustomAccessibilityAction
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.customActions
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import androidx.compose.ui.zIndex
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.DotsSixVertical
import com.esuiss.ui.components.Haptics
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.ItemGroupVariant
import com.esuiss.ui.components.LocalItemGroupVariant
import com.esuiss.ui.components.LocalContentColor
import com.esuiss.ui.components.LocalContentStyle
import com.esuiss.ui.components.formReducedMotion
import com.esuiss.ui.components.rememberHaptics
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Shadows
import com.esuiss.ui.theme.Typography
import com.esuiss.ui.theme.shadow
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.launch

@Stable
interface ReorderListScope {
    val key: String
    val index: Int
    val dragging: Boolean
}

private val liftSpring = spring<Float>(dampingRatio = Spring.DampingRatioNoBouncy, stiffness = Spring.StiffnessMedium)

private val settleSpring = spring<Float>(dampingRatio = Spring.DampingRatioNoBouncy, stiffness = Spring.StiffnessMediumLow)

private class ReorderListItemScope(
    override val key: String,
    override val index: Int,
    override val dragging: Boolean,
) : ReorderListScope

@Stable
private class ReorderController {
    var order by mutableStateOf(emptyList<String>())
    var active by mutableStateOf<String?>(null)
    var settling by mutableStateOf<String?>(null)
    val raised: String? get() = active ?: settling
    var reduced = false
    var offset by mutableFloatStateOf(0f)
    val heights = mutableStateMapOf<String, Int>()
    var onChange: (List<String>) -> Unit = {}
    val placements = mutableMapOf<String, Animatable<Float, AnimationVector1D>>()
    var scope: CoroutineScope? = null
    var haptics: Haptics? = null

    fun start(key: String) {
        active = key
        offset = placements[key]?.value ?: 0f
        haptics?.perform(HapticFeedbackType.LongPress)
    }

    fun drag(delta: Float) {
        val key = active ?: return
        offset += delta
        var index = order.indexOf(key)
        if (index < 0) return
        while (true) {
            val next = order.getOrNull(index + 1)
            val previous = order.getOrNull(index - 1)
            val nextHeight = next?.let { heights[it] } ?: 0
            val previousHeight = previous?.let { heights[it] } ?: 0
            when {
                next != null && offset > nextHeight / 2f -> {
                    order = order.toMutableList().apply { add(index + 1, removeAt(index)) }
                    offset -= nextHeight
                    index += 1
                    haptics?.selection()
                }
                previous != null && offset < -previousHeight / 2f -> {
                    order = order.toMutableList().apply { add(index - 1, removeAt(index)) }
                    offset += previousHeight
                    index -= 1
                    haptics?.selection()
                }
                else -> break
            }
        }
        onChange(order)
    }

    fun end() {
        val key = active ?: return
        haptics?.perform(HapticFeedbackType.GestureEnd)
        val released = offset
        val placement = placements[key]
        val launcher = scope
        if (placement == null || launcher == null) {
            active = null
            offset = 0f
            return
        }
        launcher.launch {
            placement.snapTo(released)
            settling = key
            active = null
            offset = 0f
            try {
                if (reduced) placement.snapTo(0f) else placement.animateTo(0f, settleSpring)
            } finally {
                if (settling == key) settling = null
            }
        }
    }
}

private class ReorderHandleTarget(val controller: ReorderController, val key: String)

private val LocalReorderHandle = staticCompositionLocalOf<ReorderHandleTarget?> { null }

private val LocalReorderLift = staticCompositionLocalOf { 0f }

@Composable
fun ReorderList(
    value: List<String>,
    onValueChange: (List<String>) -> Unit,
    modifier: Modifier = Modifier,
    moveUpLabel: String = "Move up",
    moveDownLabel: String = "Move down",
    item: @Composable ReorderListScope.(String) -> Unit,
) {
    val colors = EsuissTheme.colors
    val scope = rememberCoroutineScope()
    val controller = remember { ReorderController() }
    val change by rememberUpdatedState(onValueChange)
    controller.onChange = { if (it != value) change(it) }
    controller.scope = scope
    controller.haptics = rememberHaptics()
    val reduced = formReducedMotion()
    controller.reduced = reduced
    val inset = LocalItemGroupVariant.current == ItemGroupVariant.Inset
    if (controller.active == null && controller.order != value) controller.order = value
    val order = controller.order
    Column(modifier = modifier) {
        order.forEachIndexed { index, itemKey ->
            key(itemKey) {
                val dragging = controller.active == itemKey
                val raised = controller.raised
                val previous = order.getOrNull(index - 1)
                val hideLine = index == 0 || itemKey == raised || previous == raised
                val placement = remember { Animatable(0f) }
                DisposableEffect(itemKey, placement) {
                    controller.placements[itemKey] = placement
                    onDispose { controller.placements.remove(itemKey) }
                }
                var placed by remember { mutableFloatStateOf(Float.NaN) }
                val lift by animateFloatAsState(
                    targetValue = if (dragging) 1f else 0f,
                    animationSpec = when {
                        reduced -> snap()
                        dragging -> liftSpring
                        else -> settleSpring
                    },
                    label = "lift",
                )
                val actions = buildList {
                    if (index > 0) {
                        add(
                            CustomAccessibilityAction(moveUpLabel) {
                                change(order.toMutableList().apply { add(index - 1, removeAt(index)) })
                                true
                            },
                        )
                    }
                    if (index < order.lastIndex) {
                        add(
                            CustomAccessibilityAction(moveDownLabel) {
                                change(order.toMutableList().apply { add(index + 1, removeAt(index)) })
                                true
                            },
                        )
                    }
                }
                Box(
                    modifier = Modifier
                        .zIndex(if (itemKey == raised || lift > 0f) 1f else 0f)
                        .onSizeChanged { controller.heights[itemKey] = it.height }
                        .onPlaced { coordinates ->
                            val y = coordinates.parentCoordinates?.let { parent ->
                                parent.localPositionOf(coordinates, Offset.Zero).y
                            } ?: 0f
                            val old = placed
                            placed = y
                            if (!old.isNaN() && old != y && controller.active != itemKey && !reduced) {
                                scope.launch {
                                    val velocity = placement.velocity
                                    placement.snapTo(placement.value + old - y)
                                    placement.animateTo(0f, settleSpring, velocity)
                                }
                            }
                        }
                        .graphicsLayer {
                            translationY = if (dragging) controller.offset else placement.value
                            val scale = if (reduced || inset) 1f else 1f + 0.02f * lift
                            scaleX = scale
                            scaleY = scale
                        }
                        .drawBehind {
                            if (!hideLine) {
                                val stroke = 1.dp.toPx()
                                val inset = 16.dp.toPx()
                                val start = if (layoutDirection == LayoutDirection.Rtl) 0f else inset
                                drawRect(colors.separator, Offset(start, 0f), Size(size.width - inset, stroke))
                            }
                        }
                        .semantics { customActions = actions },
                ) {
                    CompositionLocalProvider(
                        LocalReorderHandle provides ReorderHandleTarget(controller, itemKey),
                        LocalReorderLift provides lift,
                    ) {
                        ReorderListItemScope(itemKey, index, dragging).item(itemKey)
                    }
                }
            }
        }
    }
}

@Composable
fun ReorderListItem(
    modifier: Modifier = Modifier,
    content: @Composable RowScope.() -> Unit,
) {
    val colors = EsuissTheme.colors
    val lift = LocalReorderLift.current
    val shape = if (LocalItemGroupVariant.current == ItemGroupVariant.Inset) RoundedCornerShape(Radius.xl2) else RectangleShape
    val shadow = Shadows.lg
    Row(
        modifier = modifier
            .fillMaxWidth()
            .then(
                if (lift > 0f) {
                    Modifier
                        .shadow(shadow.copy(color = shadow.color.copy(alpha = shadow.color.alpha * lift)), shape)
                        .background(colors.surfaceRaised.copy(alpha = lift), shape)
                } else {
                    Modifier
                },
            )
            .heightIn(min = 52.dp)
            .padding(start = 16.dp, end = 4.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        CompositionLocalProvider(
            LocalContentStyle provides Typography.base.copy(color = colors.label),
            LocalContentColor provides colors.label,
        ) {
            content()
        }
    }
}

@Composable
fun ReorderListHandle(
    modifier: Modifier = Modifier,
    contentDescription: String = "Reorder",
) {
    val colors = EsuissTheme.colors
    val target = LocalReorderHandle.current ?: return
    val controller = target.controller
    val itemKey = target.key
    val state = rememberDraggableState { delta -> controller.drag(delta) }
    Box(
        modifier = modifier
            .size(44.dp)
            .draggable(
                state = state,
                orientation = Orientation.Vertical,
                startDragImmediately = true,
                onDragStarted = { controller.start(itemKey) },
                onDragStopped = { controller.end() },
            )
            .semantics { this.contentDescription = contentDescription },
        contentAlignment = Alignment.Center,
    ) {
        Icon(PhosphorIcons.Regular.DotsSixVertical, contentDescription = null, size = 20.dp, tint = colors.labelTertiary)
    }
}
