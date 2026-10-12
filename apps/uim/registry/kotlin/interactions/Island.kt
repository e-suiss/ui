package com.esuiss.ui.interactions

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.Canvas
import androidx.compose.animation.EnterTransition
import androidx.compose.animation.ExitTransition
import androidx.compose.animation.animateContentSize
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.scaleIn
import androidx.compose.animation.scaleOut
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.Orientation
import androidx.compose.foundation.gestures.draggable
import androidx.compose.foundation.gestures.rememberDraggableState
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBars
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.Stable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.layout.onGloballyPositioned
import androidx.compose.ui.layout.positionOnScreen
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalWindowInfo
import androidx.compose.ui.semantics.CustomAccessibilityAction
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.collapse
import androidx.compose.ui.semantics.customActions
import androidx.compose.ui.semantics.dismiss
import androidx.compose.ui.semantics.expand
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Density
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.IntRect
import androidx.compose.ui.unit.IntSize
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Popup
import androidx.compose.ui.window.PopupPositionProvider
import androidx.compose.ui.window.PopupProperties
import com.esuiss.ui.components.FormEasing
import com.esuiss.ui.components.LocalContentColor
import com.esuiss.ui.components.LocalContentStyle
import com.esuiss.ui.components.LocalIconSize
import com.esuiss.ui.components.formReducedMotion
import com.esuiss.ui.theme.DarkColors
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.LocalColors
import com.esuiss.ui.theme.Shadow
import com.esuiss.ui.theme.Typography
import com.esuiss.ui.theme.shadow
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

enum class IslandView { Hidden, Compact, Expanded, Notice }

@Immutable
class IslandNotice(
    val title: String,
    val description: String? = null,
    val duration: Long = IslandNoticeDuration,
    val icon: (@Composable () -> Unit)? = null,
)

const val IslandNoticeDuration = 4000L

@Stable
class IslandState internal constructor() {
    private var open by mutableStateOf(false)

    val expanded: Boolean
        get() = open
    var notice by mutableStateOf<IslandNotice?>(null)
        private set
    internal var compactCount by mutableIntStateOf(0)
    internal var noticeId by mutableIntStateOf(0)

    val view: IslandView
        get() = when {
            notice != null -> IslandView.Notice
            compactCount <= 0 -> IslandView.Hidden
            expanded -> IslandView.Expanded
            else -> IslandView.Compact
        }

    fun setExpanded(expanded: Boolean) {
        open = expanded
    }

    fun notify(notice: IslandNotice) {
        this.notice = notice
        noticeId += 1
    }

    fun notify(
        title: String,
        description: String? = null,
        duration: Long = IslandNoticeDuration,
        icon: (@Composable () -> Unit)? = null,
    ) = notify(IslandNotice(title, description, duration, icon))

    fun dismiss() {
        notice = null
    }

    internal fun registerCompact(): () -> Unit {
        compactCount += 1
        return {
            compactCount -= 1
            open = false
        }
    }
}

private val LocalIsland = staticCompositionLocalOf<IslandState?> { null }

@Composable
fun useIsland(): IslandState = checkNotNull(LocalIsland.current) { "useIsland must be used within an IslandProvider" }

@Composable
fun IslandProvider(content: @Composable () -> Unit) {
    val state = remember { IslandState() }
    val notice = state.notice
    LaunchedEffect(state.noticeId, notice) {
        if (notice == null) return@LaunchedEffect
        delay(notice.duration)
        state.dismiss()
    }
    CompositionLocalProvider(LocalIsland provides state, content = content)
}

private class IslandPosition : PopupPositionProvider {
    override fun calculatePosition(
        anchorBounds: IntRect,
        windowSize: IntSize,
        layoutDirection: LayoutDirection,
        popupContentSize: IntSize,
    ): IntOffset = IntOffset((windowSize.width - popupContentSize.width) / 2, 0)
}

private val IslandSpring = spring<IntSize>(dampingRatio = 0.72f, stiffness = Spring.StiffnessMediumLow)

@Composable
internal fun islandWideWidth(): Dp {
    val density = LocalDensity.current
    val container = LocalWindowInfo.current.containerSize
    val available = with(density) { container.width.toDp() } - 24.dp
    return if (container.width > 0 && available < 384.dp) available else 384.dp
}

@Composable
fun Island(modifier: Modifier = Modifier, content: @Composable () -> Unit) {
    val state = useIsland()
    val colors = EsuissTheme.colors
    val density = LocalDensity.current
    val reduced = formReducedMotion()
    val scope = rememberCoroutineScope()
    val view = state.view
    val hidden = view == IslandView.Hidden
    var present by remember { mutableStateOf(!hidden) }
    if (!hidden) present = true
    LaunchedEffect(hidden) {
        if (!hidden) return@LaunchedEffect
        delay(if (reduced) 0 else 400)
        present = false
    }
    val shown by animateFloatAsState(if (hidden) 0f else 1f, if (reduced) tween(0) else tween(400, easing = FormEasing), label = "shown")
    val radius by animateDpAsState(
        if (view == IslandView.Compact || hidden) 18.dp else 28.dp,
        if (reduced) tween(0) else tween(450, easing = FormEasing),
        label = "radius",
    )
    val top = maxOf(with(density) { WindowInsets.statusBars.getTop(density).toDp() }, 12.dp)
    var origin by remember { mutableStateOf<Float?>(null) }
    val offset = origin?.let { with(density) { (top.toPx() - it).coerceAtLeast(0f).toDp() } } ?: top
    val provider = remember { IslandPosition() }
    val drag = remember { Animatable(0f) }
    val dragState = rememberDraggableState { delta ->
        scope.launch { drag.snapTo((drag.value + delta).coerceAtMost(with(density) { 8.dp.toPx() })) }
    }
    val shape = RoundedCornerShape(radius)
    val background = if (colors.isDark) colors.surface else colors.label
    val foreground = if (colors.isDark) colors.label else colors.surface
    Popup(
        popupPositionProvider = provider,
        onDismissRequest = { state.setExpanded(false) },
        properties = PopupProperties(
            focusable = view == IslandView.Expanded,
            dismissOnBackPress = true,
            dismissOnClickOutside = view == IslandView.Expanded,
        ),
    ) {
        Box(
            modifier = Modifier
                .onGloballyPositioned { origin = it.positionOnScreen().y }
                .then(if (present) Modifier.padding(top = offset, start = 12.dp, end = 12.dp, bottom = 24.dp) else Modifier),
        ) {
            Box(
                modifier = if (!present) {
                    Modifier.size(0.dp)
                } else {
                    modifier
                        .graphicsLayer {
                            translationY = drag.value
                            alpha = shown
                            scaleX = 0.75f + 0.25f * shown
                            scaleY = scaleX
                        }
                        .shadow(Shadow(0.dp, 20.dp, 25.dp, Color.Black.copy(alpha = 0.1f)), shape)
                        .clip(shape)
                        .background(background, shape)
                        .then(if (colors.isDark) Modifier.border(1.dp, colors.separator, shape) else Modifier)
                        .animateContentSize(if (reduced) spring(stiffness = Spring.StiffnessHigh) else IslandSpring)
                        .then(if (hidden) Modifier.size(126.dp, 36.dp) else Modifier)
                        .draggable(
                            state = dragState,
                            orientation = Orientation.Vertical,
                            enabled = !hidden,
                            onDragStopped = { velocity ->
                                val threshold = with(density) { 24.dp.toPx() }
                                if (drag.value < -threshold || velocity < -800f) {
                                    when (state.view) {
                                        IslandView.Notice -> state.dismiss()
                                        IslandView.Expanded -> state.setExpanded(false)
                                        else -> Unit
                                    }
                                }
                                drag.animateTo(0f, tween(200))
                            },
                        )
                },
                contentAlignment = Alignment.TopCenter,
            ) {
                CompositionLocalProvider(
                    LocalColors provides DarkColors,
                    LocalContentColor provides foreground,
                    LocalContentStyle provides Typography.sm.copy(color = foreground),
                    LocalIconSize provides 20.dp,
                    LocalIslandForeground provides foreground,
                ) {
                    content()
                    IslandNoticeView(state, reduced)
                }
            }
        }
    }
}

private val LocalIslandForeground = staticCompositionLocalOf { Color.Unspecified }

@Composable
private fun islandPartEnter(reduced: Boolean): EnterTransition =
    if (reduced) EnterTransition.None else fadeIn(tween(450, 100, FormEasing)) + scaleIn(tween(450, 100, FormEasing), initialScale = 0.9f)

@Composable
private fun islandPartExit(reduced: Boolean): ExitTransition =
    if (reduced) ExitTransition.None else fadeOut(tween(150, easing = FormEasing)) + scaleOut(tween(150, easing = FormEasing), targetScale = 0.9f)

@Composable
private fun IslandNoticeView(state: IslandState, reduced: Boolean) {
    val colors = EsuissTheme.colors
    val foreground = LocalIslandForeground.current
    var shown by remember { mutableStateOf(state.notice) }
    if (state.notice != null) shown = state.notice
    AnimatedVisibility(
        visible = state.view == IslandView.Notice,
        enter = islandPartEnter(reduced),
        exit = islandPartExit(reduced),
    ) {
        val notice = shown ?: return@AnimatedVisibility
        Row(
            modifier = Modifier
                .width(islandWideWidth())
                .clickable(
                    interactionSource = remember { MutableInteractionSource() },
                    indication = null,
                    role = Role.Button,
                    onClick = state::dismiss,
                )
                .semantics(mergeDescendants = true) {
                    liveRegion = LiveRegionMode.Polite
                    dismiss {
                        state.dismiss()
                        true
                    }
                }
                .padding(14.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            if (notice.icon != null) {
                Box(
                    modifier = Modifier
                        .size(40.dp)
                        .background(
                            if (colors.isDark) colors.label.copy(alpha = 0.15f) else colors.surface.copy(alpha = 0.15f),
                            RoundedCornerShape(12.dp),
                        ),
                    contentAlignment = Alignment.Center,
                ) {
                    CompositionLocalProvider(LocalIconSize provides 24.dp) {
                        notice.icon.invoke()
                    }
                }
            }
            Column(modifier = Modifier.weight(1f)) {
                BasicText(
                    notice.title,
                    style = Typography.sm.copy(color = foreground, fontWeight = FontWeight.SemiBold),
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                )
                if (notice.description != null) {
                    BasicText(
                        notice.description,
                        style = Typography.sm.copy(
                            color = if (colors.isDark) colors.labelSecondary else colors.surface.copy(alpha = 0.7f),
                        ),
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                    )
                }
            }
        }
    }
}

@Composable
fun IslandCompact(modifier: Modifier = Modifier, content: @Composable RowScope.() -> Unit) {
    val state = useIsland()
    val reduced = formReducedMotion()
    DisposableEffect(state) { onDispose(state.registerCompact()) }
    AnimatedVisibility(
        visible = state.view == IslandView.Compact,
        enter = islandPartEnter(reduced),
        exit = islandPartExit(reduced),
    ) {
        Row(
            modifier = modifier
                .height(36.dp)
                .widthIn(min = 144.dp)
                .clickable(
                    interactionSource = remember { MutableInteractionSource() },
                    indication = null,
                    role = Role.Button,
                    onClick = { state.setExpanded(true) },
                )
                .semantics(mergeDescendants = true) {
                    stateDescription = "Collapsed"
                    expand {
                        state.setExpanded(true)
                        true
                    }
                }
                .padding(horizontal = 10.dp),
            horizontalArrangement = IslandCompactArrangement,
            verticalAlignment = Alignment.CenterVertically,
            content = content,
        )
    }
}

private object IslandCompactArrangement : Arrangement.Horizontal {
    override val spacing: Dp = 24.dp

    override fun Density.arrange(
        totalSize: Int,
        sizes: IntArray,
        layoutDirection: LayoutDirection,
        outPositions: IntArray,
    ) {
        val used = sizes.sum()
        val minimum = spacing.roundToPx()
        val gap = if (sizes.size > 1) maxOf(minimum, (totalSize - used) / (sizes.size - 1)) else 0
        var x = if (sizes.size == 1) (totalSize - used) / 2 else 0
        sizes.indices.forEach {
            outPositions[it] = if (layoutDirection == LayoutDirection.Ltr) x else totalSize - x - sizes[it]
            x += sizes[it] + gap
        }
    }
}

@Composable
fun IslandExpanded(modifier: Modifier = Modifier, content: @Composable ColumnScope.() -> Unit) {
    val state = useIsland()
    val reduced = formReducedMotion()
    AnimatedVisibility(
        visible = state.view == IslandView.Expanded,
        enter = islandPartEnter(reduced),
        exit = islandPartExit(reduced),
    ) {
        Column(
            modifier = modifier
                .width(islandWideWidth())
                .semantics {
                    stateDescription = "Expanded"
                    collapse {
                        state.setExpanded(false)
                        true
                    }
                    customActions = listOf(
                        CustomAccessibilityAction("Collapse") {
                            state.setExpanded(false)
                            true
                        },
                    )
                }
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
            content = content,
        )
    }
}

@Composable
fun IslandRing(
    value: Float,
    modifier: Modifier = Modifier,
    color: Color = EsuissTheme.colors.accent,
) {
    val progress = value.coerceIn(0f, 1f)
    Canvas(modifier = modifier.size(20.dp)) {
        val stroke = 2.5f * size.minDimension / 20f
        val radius = 8f * size.minDimension / 20f
        val topLeft = center - Offset(radius, radius)
        val arc = Size(radius * 2, radius * 2)
        drawCircle(color.copy(alpha = color.alpha * 0.25f), radius, style = Stroke(stroke))
        drawArc(color, -90f, 360f * progress, false, topLeft, arc, style = Stroke(stroke, cap = StrokeCap.Round))
    }
}
