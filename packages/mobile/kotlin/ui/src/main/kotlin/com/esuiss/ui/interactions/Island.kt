package com.esuiss.ui.interactions

import android.graphics.RectF
import android.os.Build
import android.view.View
import android.view.Window
import android.view.WindowInsets as PlatformWindowInsets
import android.view.WindowInsetsController
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.EnterTransition
import androidx.compose.animation.ExitTransition
import androidx.compose.animation.animateContentSize
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.snap
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.scaleIn
import androidx.compose.animation.scaleOut
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.Orientation
import androidx.compose.foundation.gestures.draggable
import androidx.compose.foundation.gestures.rememberDraggableState
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsIgnoringVisibility
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
import androidx.compose.ui.layout.Layout
import androidx.compose.ui.layout.layoutId
import androidx.compose.ui.layout.positionOnScreen
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalView
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
import androidx.compose.ui.unit.Constraints
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
import com.esuiss.ui.components.findActivity
import com.esuiss.ui.components.formReducedMotion
import com.esuiss.ui.theme.DarkColors
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.LocalColors
import com.esuiss.ui.theme.Palette
import com.esuiss.ui.theme.Shadow
import com.esuiss.ui.theme.Typography
import com.esuiss.ui.theme.shadow
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

enum class IslandView { Hidden, Compact, Minimal, Expanded, Notice }

enum class IslandRegion { Leading, Trailing, Center, Bottom }

@Immutable
class IslandNotice(
    val title: String,
    val description: String? = null,
    val duration: Long = IslandNoticeDuration,
    val icon: (@Composable () -> Unit)? = null,
)

const val IslandNoticeDuration = 4000L

private enum class IslandMode { Compact, Minimal, Expanded }

@Stable
class IslandState internal constructor() {
    private var mode by mutableStateOf(IslandMode.Compact)

    val expanded: Boolean
        get() = view == IslandView.Expanded
    var notice by mutableStateOf<IslandNotice?>(null)
        private set
    internal var activeCount by mutableIntStateOf(0)
    internal var hasMinimal by mutableStateOf(false)
    internal var noticeId by mutableIntStateOf(0)

    val view: IslandView
        get() = when {
            notice != null -> IslandView.Notice
            activeCount <= 0 -> IslandView.Hidden
            mode == IslandMode.Expanded -> IslandView.Expanded
            mode == IslandMode.Minimal && hasMinimal -> IslandView.Minimal
            else -> IslandView.Compact
        }

    fun expand() {
        mode = IslandMode.Expanded
    }

    fun collapse() {
        mode = IslandMode.Compact
    }

    fun minimize() {
        mode = IslandMode.Minimal
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

    internal fun register(): () -> Unit {
        activeCount += 1
        return {
            activeCount -= 1
            if (activeCount <= 0) mode = IslandMode.Compact
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

private class IslandPosition(private val center: Float?) : PopupPositionProvider {
    override fun calculatePosition(
        anchorBounds: IntRect,
        windowSize: IntSize,
        layoutDirection: LayoutDirection,
        popupContentSize: IntSize,
    ): IntOffset {
        val x = center?.let { (it - popupContentSize.width / 2f).toInt() } ?: ((windowSize.width - popupContentSize.width) / 2)
        return IntOffset(x.coerceIn(0, (windowSize.width - popupContentSize.width).coerceAtLeast(0)), 0)
    }
}

private class IslandCamera(val centerX: Float, val centerY: Float, val width: Float, val bottom: Float)

@Composable
private fun rememberIslandCamera(): IslandCamera? {
    val view = LocalView.current
    val configuration = LocalConfiguration.current
    var camera by remember { mutableStateOf<IslandCamera?>(null) }
    DisposableEffect(view, configuration) {
        fun read() {
            camera = islandCamera(view)
        }
        read()
        val listener = View.OnLayoutChangeListener { _, _, _, _, _, _, _, _, _ -> read() }
        view.addOnLayoutChangeListener(listener)
        onDispose { view.removeOnLayoutChangeListener(listener) }
    }
    return camera
}

private fun islandCamera(view: View): IslandCamera? {
    if (Build.VERSION.SDK_INT < 28) return null
    val cutout = view.rootWindowInsets?.displayCutout ?: return null
    val width = view.rootView.width.takeIf { it > 0 } ?: return null
    if (view.rootView.height <= width) return null
    if (Build.VERSION.SDK_INT >= 31) {
        val path = cutout.cutoutPath
        if (path != null) {
            val bounds = RectF()
            @Suppress("DEPRECATION")
            path.computeBounds(bounds, true)
            if (bounds.width() > 0f && bounds.top < width * 0.2f && bounds.width() < width * 0.3f) {
                return IslandCamera(bounds.centerX(), bounds.centerY(), bounds.width(), bounds.bottom)
            }
        }
    }
    val rect = cutout.boundingRects.firstOrNull { it.top <= 0 && it.width() > 0 && it.width() < width * 0.3f } ?: return null
    return IslandCamera(rect.exactCenterX(), rect.exactCenterY(), rect.width().toFloat(), rect.bottom.toFloat())
}

@Suppress("DEPRECATION")
private fun Window.showStatusBar(visible: Boolean) {
    if (Build.VERSION.SDK_INT >= 30) {
        val controller = insetsController ?: return
        if (visible) {
            controller.show(PlatformWindowInsets.Type.statusBars())
        } else {
            controller.systemBarsBehavior = WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
            controller.hide(PlatformWindowInsets.Type.statusBars())
        }
        return
    }
    val flags = decorView.systemUiVisibility
    val next = if (visible) flags and View.SYSTEM_UI_FLAG_FULLSCREEN.inv() else flags or View.SYSTEM_UI_FLAG_FULLSCREEN
    if (next != flags) decorView.systemUiVisibility = next
}

@Composable
private fun IslandStatusBar(hide: Boolean) {
    val view = LocalView.current
    DisposableEffect(view, hide) {
        val window = if (hide && !view.isInEditMode) view.context.findActivity()?.window else null
        window?.showStatusBar(false)
        onDispose { window?.showStatusBar(true) }
    }
}

private val IslandSpring = spring<IntSize>(dampingRatio = 0.72f, stiffness = Spring.StiffnessMediumLow)

@Composable
internal fun islandWideWidth(): Dp {
    val density = LocalDensity.current
    val container = LocalWindowInfo.current.containerSize
    val available = with(density) { container.width.toDp() } - 24.dp
    return if (container.width > 0 && available < 384.dp) available else 384.dp
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun Island(
    compactLeading: (@Composable RowScope.() -> Unit)? = null,
    compactTrailing: (@Composable RowScope.() -> Unit)? = null,
    minimal: (@Composable () -> Unit)? = null,
    modifier: Modifier = Modifier,
    expanded: @Composable IslandExpandedScope.() -> Unit = {},
) {
    val state = useIsland()
    val active = compactLeading != null || compactTrailing != null
    DisposableEffect(state, active) {
        val release = if (active) state.register() else null
        onDispose { release?.invoke() }
    }
    val withMinimal = minimal != null
    DisposableEffect(state, withMinimal) {
        state.hasMinimal = withMinimal
        onDispose { state.hasMinimal = false }
    }
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
    val small = view == IslandView.Compact || view == IslandView.Minimal || hidden
    val radius by animateDpAsState(
        if (small) 18.dp else 28.dp,
        if (reduced) tween(0) else tween(450, easing = FormEasing),
        label = "radius",
    )
    val camera = rememberIslandCamera()
    val belowBar = maxOf(with(density) { WindowInsets.statusBarsIgnoringVisibility.getTop(density).toDp() }, 12.dp)
    val atCamera = camera?.let { with(density) { (it.centerY.toDp() - 18.dp).coerceAtLeast(4.dp) } }
    val top by animateDpAsState(
        atCamera ?: belowBar,
        if (reduced) tween(0) else tween(450, easing = FormEasing),
        label = "top",
    )
    var origin by remember { mutableStateOf<Float?>(null) }
    val offset = origin?.let { with(density) { (top.toPx() - it).coerceAtLeast(0f).toDp() } } ?: top
    val target = camera?.let {
        if (view == IslandView.Minimal) it.centerX + it.width / 2f + with(density) { 26.dp.toPx() } else it.centerX
    }
    val anchor = remember { Animatable(0f) }
    var anchored by remember { mutableStateOf(false) }
    LaunchedEffect(target) {
        if (target == null) {
            anchored = false
            return@LaunchedEffect
        }
        if (!anchored || reduced) {
            anchor.snapTo(target)
            anchored = true
        } else {
            anchor.animateTo(target, tween(450, easing = FormEasing))
        }
    }
    val center = if (anchored) anchor.value else null
    val provider = remember(center) { IslandPosition(center) }
    val drag = remember { Animatable(0f) }
    val dragState = rememberDraggableState { delta ->
        scope.launch { drag.snapTo((drag.value + delta).coerceAtMost(with(density) { 8.dp.toPx() })) }
    }
    val shape = RoundedCornerShape(radius)
    val background = Palette.black
    val foreground = Palette.white
    val hole = camera?.let { with(density) { it.width.toDp() } }
    val clearance = if (camera != null && atCamera != null) {
        with(density) { (camera.bottom.toDp() - atCamera - 8.dp).coerceAtLeast(0.dp) }
    } else {
        0.dp
    }
    val reach = camera != null && (view == IslandView.Compact || view == IslandView.Minimal)
    IslandStatusBar(camera != null && (view == IslandView.Expanded || view == IslandView.Notice))
    Popup(
        popupPositionProvider = provider,
        onDismissRequest = { if (state.view == IslandView.Expanded) state.collapse() },
        properties = PopupProperties(
            clippingEnabled = false,
            focusable = view == IslandView.Expanded,
            dismissOnBackPress = true,
            dismissOnClickOutside = view == IslandView.Expanded,
        ),
    ) {
        IslandReach(
            modifier = Modifier
                .onGloballyPositioned { origin = it.positionOnScreen().y }
                .then(if (present) Modifier.padding(top = offset, start = 12.dp, end = 12.dp, bottom = if (reach) 0.dp else 24.dp) else Modifier),
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
                        .animateContentSize(if (reduced) snap() else IslandSpring)
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
                                        IslandView.Expanded -> state.collapse()
                                        else -> Unit
                                    }
                                }
                                drag.animateTo(0f, tween(200))
                            },
                        )
                        .padding(top = if (view == IslandView.Notice) clearance else 0.dp)
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
                    IslandCompactView(state, compactLeading, compactTrailing, hole, reduced)
                    if (minimal != null) IslandMinimalView(state, minimal, reduced)
                    IslandExpandedView(state, clearance, expanded, reduced)
                    IslandNoticeView(state, reduced)
                }
            }
            if (present && reach) {
                Box(
                    modifier = Modifier.clickable(
                        interactionSource = remember { MutableInteractionSource() },
                        indication = null,
                        onClick = state::expand,
                    ),
                )
            }
        }
    }
}

@Composable
private fun IslandReach(modifier: Modifier, content: @Composable () -> Unit) {
    Layout(content = content, modifier = modifier) { measurables, constraints ->
        val pill = measurables[0].measure(constraints.copy(minWidth = 0, minHeight = 0))
        val reach = measurables.getOrNull(1)?.measure(Constraints.fixed(pill.width, 28.dp.roundToPx()))
        layout(pill.width, pill.height + (reach?.height ?: 0)) {
            pill.place(0, 0)
            reach?.place(0, pill.height)
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
                            foreground.copy(alpha = 0.15f),
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
                            color = foreground.copy(alpha = 0.7f),
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
private fun IslandCompactView(
    state: IslandState,
    leading: (@Composable RowScope.() -> Unit)?,
    trailing: (@Composable RowScope.() -> Unit)?,
    hole: Dp?,
    reduced: Boolean,
) {
    AnimatedVisibility(
        visible = state.view == IslandView.Compact,
        enter = islandPartEnter(reduced),
        exit = islandPartExit(reduced),
    ) {
        Layout(
            content = {
                Row(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalAlignment = Alignment.CenterVertically) {
                    leading?.invoke(this)
                }
                Row(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalAlignment = Alignment.CenterVertically) {
                    trailing?.invoke(this)
                }
            },
            modifier = Modifier
                .height(36.dp)
                .clickable(
                    interactionSource = remember { MutableInteractionSource() },
                    indication = null,
                    role = Role.Button,
                    onClick = state::expand,
                )
                .semantics(mergeDescendants = true) {
                    stateDescription = "Collapsed"
                    expand {
                        state.expand()
                        true
                    }
                }
                .padding(horizontal = 10.dp),
        ) { measurables, constraints ->
            val loose = constraints.copy(minWidth = 0, minHeight = 0)
            val start = measurables[0].measure(loose)
            val end = measurables[1].measure(loose)
            val split = hole != null || (leading != null && trailing != null)
            val gap = (if (hole != null) hole + 16.dp else 24.dp).roundToPx()
            val minimum = (if (hole != null) maxOf(144.dp, hole + 112.dp) else 144.dp).roundToPx() - 20.dp.roundToPx()
            val side = maxOf(start.width, end.width)
            val width = (if (split) maxOf(minimum, side * 2 + gap) else maxOf(minimum, side))
                .coerceIn(constraints.minWidth, constraints.maxWidth)
            val height = maxOf(constraints.minHeight, start.height, end.height)
            layout(width, height) {
                if (split) {
                    start.placeRelative(0, (height - start.height) / 2)
                    end.placeRelative(width - end.width, (height - end.height) / 2)
                } else {
                    val only = if (leading != null) start else end
                    only.placeRelative((width - only.width) / 2, (height - only.height) / 2)
                }
            }
        }
    }
}

@Composable
private fun IslandMinimalView(state: IslandState, content: @Composable () -> Unit, reduced: Boolean) {
    AnimatedVisibility(
        visible = state.view == IslandView.Minimal,
        enter = islandPartEnter(reduced),
        exit = islandPartExit(reduced),
    ) {
        Box(
            modifier = Modifier
                .size(36.dp)
                .clickable(
                    interactionSource = remember { MutableInteractionSource() },
                    indication = null,
                    role = Role.Button,
                    onClick = state::expand,
                )
                .semantics(mergeDescendants = true) {
                    stateDescription = "Minimized"
                    expand {
                        state.expand()
                        true
                    }
                },
            contentAlignment = Alignment.Center,
        ) {
            content()
        }
    }
}

@Stable
class IslandExpandedScope internal constructor() {
    @Composable
    fun IslandExpandedRegion(
        region: IslandRegion,
        modifier: Modifier = Modifier,
        content: @Composable ColumnScope.() -> Unit,
    ) {
        Column(modifier = Modifier.layoutId(region).then(modifier), content = content)
    }
}

private val IslandExpandedScopeInstance = IslandExpandedScope()

@Composable
private fun IslandExpandedView(
    state: IslandState,
    clearance: Dp,
    content: @Composable IslandExpandedScope.() -> Unit,
    reduced: Boolean,
) {
    AnimatedVisibility(
        visible = state.view == IslandView.Expanded,
        enter = islandPartEnter(reduced),
        exit = islandPartExit(reduced),
    ) {
        Layout(
            content = { IslandExpandedScopeInstance.content() },
            modifier = Modifier
                .width(islandWideWidth())
                .semantics {
                    stateDescription = "Expanded"
                    collapse {
                        state.collapse()
                        true
                    }
                    customActions = listOfNotNull(
                        CustomAccessibilityAction("Collapse") {
                            state.collapse()
                            true
                        },
                        if (state.hasMinimal) {
                            CustomAccessibilityAction("Minimize") {
                                state.minimize()
                                true
                            }
                        } else {
                            null
                        },
                    )
                }
                .padding(16.dp),
        ) { measurables, constraints ->
            val width = constraints.maxWidth
            val gap = 12.dp.roundToPx()
            fun region(region: IslandRegion) = measurables.firstOrNull { it.layoutId == region }
            val leading = region(IslandRegion.Leading)?.measure(Constraints(maxWidth = width))
            val trailing = region(IslandRegion.Trailing)?.measure(
                Constraints(maxWidth = (width - (leading?.let { it.width + gap } ?: 0)).coerceAtLeast(0)),
            )
            val startX = leading?.let { it.width + gap } ?: 0
            val endX = width - (trailing?.let { it.width + gap } ?: 0)
            val center = region(IslandRegion.Center)?.measure(Constraints.fixedWidth((endX - startX).coerceAtLeast(0)))
            val bottom = region(IslandRegion.Bottom)?.measure(Constraints.fixedWidth(width))
            val drop = clearance.roundToPx()
            val band = maxOf(leading?.height ?: 0, trailing?.height ?: 0)
            val centerHeight = center?.height ?: 0
            val row = if (drop > 0 && center != null) maxOf(band, drop + centerHeight) else maxOf(band, centerHeight)
            val bottomY = if (row > 0 && bottom != null) row + gap else row
            val height = (bottomY + (bottom?.height ?: 0)).coerceAtLeast(constraints.minHeight)
            layout(width, height) {
                leading?.placeRelative(0, if (drop > 0) 0 else (row - leading.height) / 2)
                trailing?.placeRelative(width - trailing.width, if (drop > 0) 0 else (row - trailing.height) / 2)
                center?.placeRelative(startX, if (drop > 0) drop else (row - centerHeight) / 2)
                bottom?.placeRelative(0, bottomY)
            }
        }
    }
}

@Composable
fun IslandRing(
    value: Float,
    modifier: Modifier = Modifier,
    color: Color = EsuissTheme.colors.primary,
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
