package com.esuiss.ui.interactions

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.gestures.Orientation
import androidx.compose.foundation.gestures.draggable
import androidx.compose.foundation.gestures.rememberDraggableState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBars
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.Stable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.onGloballyPositioned
import androidx.compose.ui.layout.onSizeChanged
import androidx.compose.ui.layout.positionOnScreen
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalWindowInfo
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.dismiss
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.IntRect
import androidx.compose.ui.unit.IntSize
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Popup
import androidx.compose.ui.window.PopupPositionProvider
import androidx.compose.ui.window.PopupProperties
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.FormEasing
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.formReducedMotion
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Shadows
import com.esuiss.ui.theme.Typography
import com.esuiss.ui.theme.shadow
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

private val TopBannerMaxWidth = 420.dp

class TopBannerAction(val label: String, val onClick: () -> Unit)

@Immutable
internal class TopBannerEntry(
    val id: Long,
    val title: String,
    val description: String?,
    val icon: ImageVector?,
    val action: TopBannerAction?,
    val timeoutMillis: Long,
)

@Stable
class TopBannerState internal constructor(private val defaultTimeoutMillis: Long) {
    private var nextId = 0L
    private val queue = mutableStateListOf<TopBannerEntry>()
    internal var leaving by mutableStateOf(false)

    internal val current: TopBannerEntry?
        get() = queue.firstOrNull()

    fun show(
        title: String,
        description: String? = null,
        icon: ImageVector? = null,
        action: TopBannerAction? = null,
        timeoutMillis: Long = defaultTimeoutMillis,
    ): Long {
        nextId += 1
        queue.add(TopBannerEntry(nextId, title, description, icon, action, timeoutMillis))
        return nextId
    }

    fun dismiss() {
        if (queue.isNotEmpty()) leaving = true
    }

    internal fun removeCurrent() {
        if (queue.isNotEmpty()) queue.removeAt(0)
        leaving = false
    }
}

@Composable
fun rememberTopBannerState(defaultTimeoutMillis: Long = 4000): TopBannerState =
    remember { TopBannerState(defaultTimeoutMillis) }

private class TopBannerPosition : PopupPositionProvider {
    override fun calculatePosition(
        anchorBounds: IntRect,
        windowSize: IntSize,
        layoutDirection: LayoutDirection,
        popupContentSize: IntSize,
    ): IntOffset = IntOffset((windowSize.width - popupContentSize.width) / 2, 0)
}

@Composable
fun TopBannerProvider(
    state: TopBannerState,
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit,
) {
    content()
    val entry = state.current ?: return
    val density = LocalDensity.current
    val top = WindowInsets.statusBars.getTop(density)
    val container = LocalWindowInfo.current.containerSize
    val available = with(density) { container.width.toDp() } - 32.dp
    val width = if (container.width > 0 && available < TopBannerMaxWidth) available else TopBannerMaxWidth
    val provider = remember { TopBannerPosition() }
    Popup(
        popupPositionProvider = provider,
        properties = PopupProperties(focusable = false, dismissOnBackPress = false, dismissOnClickOutside = false),
    ) {
        key(entry.id) {
            TopBannerCard(
                entry = entry,
                state = state,
                topInset = with(density) { top.toDp() },
                width = width,
                modifier = modifier,
            )
        }
    }
}

@Composable
private fun TopBannerCard(
    entry: TopBannerEntry,
    state: TopBannerState,
    topInset: Dp,
    width: Dp,
    modifier: Modifier,
) {
    val colors = EsuissTheme.colors
    val density = LocalDensity.current
    val scope = rememberCoroutineScope()
    val reduced = formReducedMotion()
    var height by remember { mutableIntStateOf(0) }
    val travel = remember { Animatable(1f) }
    val drag = remember { Animatable(0f) }
    val gap = with(density) { 8.dp.toPx() }
    LaunchedEffect(Unit) {
        travel.animateTo(0f, tween(if (reduced) 0 else 400, easing = FormEasing))
    }
    var holding by remember { mutableStateOf(false) }
    LaunchedEffect(entry.id, entry.timeoutMillis, holding) {
        if (entry.timeoutMillis <= 0 || holding) return@LaunchedEffect
        delay(entry.timeoutMillis)
        state.dismiss()
    }
    LaunchedEffect(state.leaving) {
        if (!state.leaving) return@LaunchedEffect
        travel.animateTo(1f, tween(if (reduced) 0 else 250, easing = FormEasing))
        state.removeCurrent()
    }
    val dragState = rememberDraggableState { delta ->
        scope.launch { drag.snapTo((drag.value + delta).coerceAtMost(with(density) { 12.dp.toPx() })) }
    }
    val shape = RoundedCornerShape(Radius.xl2)
    var origin by remember { mutableStateOf<Float?>(null) }
    val inset = origin?.let { with(density) { (topInset.toPx() - it).coerceAtLeast(0f).toDp() } } ?: topInset
    Box(
        modifier = Modifier
            .onGloballyPositioned { origin = it.positionOnScreen().y }
            .padding(top = inset + 8.dp, start = 16.dp, end = 16.dp, bottom = 24.dp),
    ) {
        Row(
            modifier = modifier
                .width(width)
                .onSizeChanged { height = it.height }
                .graphicsLayer {
                    translationY = -travel.value * (height + gap + inset.toPx()) + drag.value
                    alpha = if (reduced) 1f - travel.value else 1f
                }
                .shadow(Shadows.lg, shape)
                .background(colors.surfaceRaised, shape)
                .border(1.dp, colors.label.copy(alpha = if (colors.isDark) 0.1f else 0.05f), shape)
                .draggable(
                    state = dragState,
                    orientation = Orientation.Vertical,
                    onDragStarted = { holding = true },
                    onDragStopped = { velocity ->
                        holding = false
                        if (drag.value < -with(density) { 32.dp.toPx() } || velocity < -1000f) {
                            state.dismiss()
                        } else {
                            drag.animateTo(0f, tween(200))
                        }
                    },
                )
                .semantics {
                    liveRegion = LiveRegionMode.Polite
                    dismiss {
                        state.dismiss()
                        true
                    }
                }
                .padding(start = 14.dp, end = 14.dp, top = 12.dp, bottom = 12.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            if (entry.icon != null) {
                Box(
                    modifier = Modifier
                        .size(36.dp)
                        .background(colors.accentSurface, CircleShape),
                    contentAlignment = Alignment.Center,
                ) {
                    Icon(entry.icon, contentDescription = null, size = 20.dp, tint = colors.link)
                }
            }
            Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(2.dp)) {
                BasicText(entry.title, style = Typography.sm.copy(color = colors.label, fontWeight = FontWeight.SemiBold))
                if (entry.description != null) {
                    BasicText(entry.description, style = Typography.sm.copy(color = colors.labelSecondary))
                }
            }
            if (entry.action != null) {
                Button(
                    text = entry.action.label,
                    onClick = {
                        entry.action.onClick()
                        state.dismiss()
                    },
                    variant = ButtonVariant.Tinted,
                    size = ButtonSize.Sm,
                )
            }
        }
    }
}
