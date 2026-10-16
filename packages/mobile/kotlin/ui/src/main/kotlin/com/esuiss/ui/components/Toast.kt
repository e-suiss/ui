package com.esuiss.ui.components

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.VectorConverter
import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.ime
import androidx.compose.foundation.layout.navigationBars
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.wrapContentHeight
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
import androidx.compose.runtime.mutableLongStateOf
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.TransformOrigin
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.onSizeChanged
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalWindowInfo
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.clearAndSetSemantics
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
import androidx.compose.ui.zIndex
import androidx.compose.ui.window.Popup
import androidx.compose.ui.window.PopupPositionProvider
import androidx.compose.ui.window.PopupProperties
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Bold
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.bold.Check
import com.adamglin.phosphoricons.bold.ExclamationMark
import com.adamglin.phosphoricons.bold.X
import com.adamglin.phosphoricons.regular.CircleNotch
import com.adamglin.phosphoricons.regular.X
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Palette
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Shadow
import com.esuiss.ui.theme.Shadows
import com.esuiss.ui.theme.Typography
import com.esuiss.ui.theme.shadow
import kotlin.math.abs
import kotlin.math.max
import kotlin.math.roundToInt
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

enum class ToastType { Default, Success, Info, Warning, Error, Loading }

@Immutable
class ToastAction(val label: String, val onClick: () -> Unit)

@Stable
class ToastData internal constructor(
    val id: Long,
    title: String,
    description: String?,
    type: ToastType,
    action: ToastAction?,
    durationMillis: Long,
) {
    var title by mutableStateOf(title)
        internal set
    var description by mutableStateOf(description)
        internal set
    var type by mutableStateOf(type)
        internal set
    var action by mutableStateOf(action)
        internal set
    var durationMillis by mutableLongStateOf(durationMillis)
        internal set
    internal var dismissed by mutableStateOf(false)
}

@Stable
class ToastState(
    val limit: Int = 3,
    val defaultDurationMillis: Long = 5000,
) {
    private val items = mutableStateListOf<ToastData>()
    private var nextId = 0L

    val toasts: List<ToastData>
        get() = items

    fun show(
        title: String,
        description: String? = null,
        type: ToastType = ToastType.Default,
        action: ToastAction? = null,
        durationMillis: Long = if (type == ToastType.Loading) 0 else defaultDurationMillis,
    ): Long {
        nextId += 1
        items.add(0, ToastData(nextId, title, description, type, action, durationMillis))
        return nextId
    }

    fun success(title: String, description: String? = null, action: ToastAction? = null): Long =
        show(title, description, ToastType.Success, action)

    fun info(title: String, description: String? = null, action: ToastAction? = null): Long =
        show(title, description, ToastType.Info, action)

    fun warning(title: String, description: String? = null, action: ToastAction? = null): Long =
        show(title, description, ToastType.Warning, action)

    fun error(title: String, description: String? = null, action: ToastAction? = null): Long =
        show(title, description, ToastType.Error, action)

    fun loading(title: String, description: String? = null): Long =
        show(title, description, ToastType.Loading)

    fun update(
        id: Long,
        title: String? = null,
        description: String? = null,
        type: ToastType? = null,
        action: ToastAction? = null,
        durationMillis: Long? = null,
    ) {
        val toast = items.firstOrNull { it.id == id } ?: return
        if (title != null) toast.title = title
        if (description != null) toast.description = description
        if (action != null) toast.action = action
        if (type != null) {
            toast.type = type
            if (durationMillis == null && type != ToastType.Loading && toast.durationMillis == 0L) {
                toast.durationMillis = defaultDurationMillis
            }
        }
        if (durationMillis != null) toast.durationMillis = durationMillis
    }

    fun dismiss(id: Long) {
        items.firstOrNull { it.id == id }?.dismissed = true
    }

    fun dismissAll() {
        items.forEach { it.dismissed = true }
    }

    internal fun remove(id: Long) {
        items.removeAll { it.id == id }
    }
}

@Composable
fun rememberToastState(limit: Int = 3, defaultDurationMillis: Long = 5000): ToastState =
    remember { ToastState(limit, defaultDurationMillis) }

private val ToastGap = 12.dp

private val ToastPeek = 12.dp

private val ToastMaxWidth = 384.dp

private val ToastShadow = Shadow(0.dp, 8.dp, 32.dp, Color.Black.copy(alpha = 0.14f))

private class ToasterPositionProvider(private val bottomLimit: Int) : PopupPositionProvider {
    override fun calculatePosition(
        anchorBounds: IntRect,
        windowSize: IntSize,
        layoutDirection: LayoutDirection,
        popupContentSize: IntSize,
    ): IntOffset {
        val bottom = minOf(anchorBounds.bottom, bottomLimit)
        val x = anchorBounds.left + (anchorBounds.width - popupContentSize.width) / 2
        return IntOffset(x, bottom - popupContentSize.height)
    }
}

@Composable
fun Toaster(
    state: ToastState,
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit = {},
) {
    val density = LocalDensity.current
    var anchorWidth by remember { mutableIntStateOf(0) }
    Box(modifier = modifier.onSizeChanged { anchorWidth = it.width }) {
        content()
        if (state.toasts.isNotEmpty() && anchorWidth > 0) {
            val containerHeight = LocalWindowInfo.current.containerSize.height
            val covered = max(WindowInsets.navigationBars.getBottom(density), WindowInsets.ime.getBottom(density))
            val bottomLimit = if (containerHeight > 0) containerHeight - covered else Int.MAX_VALUE
            val provider = remember(bottomLimit) { ToasterPositionProvider(bottomLimit) }
            val available = with(density) { anchorWidth.toDp() } - 32.dp
            val width = if (available < ToastMaxWidth) available else ToastMaxWidth
            Popup(
                popupPositionProvider = provider,
                properties = PopupProperties(
                    focusable = false,
                    dismissOnBackPress = false,
                    dismissOnClickOutside = false,
                ),
            ) {
                ToastStack(state, width)
            }
        }
    }
}

@Composable
private fun ToastStack(state: ToastState, width: Dp) {
    val density = LocalDensity.current
    val heights = remember { mutableStateMapOf<Long, Int>() }
    var expanded by remember { mutableStateOf(false) }
    val active = state.toasts.filter { !it.dismissed }
    if (active.size <= 1 && expanded) expanded = false
    val visible = active.take(state.limit)
    val gap = with(density) { ToastGap.roundToPx() }
    val peek = with(density) { ToastPeek.roundToPx() }
    val front = visible.firstOrNull()?.let { heights[it.id] } ?: 0
    val target = when {
        visible.isEmpty() -> 0
        expanded -> visible.sumOf { heights[it.id] ?: 0 } + gap * (visible.size - 1)
        else -> front + peek * (visible.size - 1)
    }
    val targetDp = with(density) { target.toDp() }
    val animated by animateDpAsState(targetDp, tween(450), label = "stack")
    val stackHeight = if (animated > targetDp) animated else targetDp

    Box(
        modifier = Modifier
            .width(width + 32.dp)
            .padding(start = 16.dp, end = 16.dp, top = 24.dp, bottom = 16.dp)
            .height(stackHeight),
        contentAlignment = Alignment.BottomCenter,
    ) {
        state.toasts.forEach { toast ->
            val index = active.indexOf(toast).let { if (it < 0) 0 else it }
            val offsetY = active.take(index).sumOf { heights[it.id] ?: 0 }
            key(toast.id) {
                ToastItem(
                    toast = toast,
                    index = index,
                    expanded = expanded,
                    frontHeight = front,
                    offsetY = offsetY,
                    hidden = index >= state.limit,
                    gap = gap,
                    peek = peek,
                    onHeight = { heights[toast.id] = it },
                    onDismiss = { state.dismiss(toast.id) },
                    onRemoved = {
                        heights.remove(toast.id)
                        state.remove(toast.id)
                    },
                    onToggle = { if (active.size > 1) expanded = !expanded },
                )
            }
        }
    }
}

@Composable
private fun ToastItem(
    toast: ToastData,
    index: Int,
    expanded: Boolean,
    frontHeight: Int,
    offsetY: Int,
    hidden: Boolean,
    gap: Int,
    peek: Int,
    onHeight: (Int) -> Unit,
    onDismiss: () -> Unit,
    onRemoved: () -> Unit,
    onToggle: () -> Unit,
) {
    val colors = EsuissTheme.colors
    val density = LocalDensity.current
    val scope = rememberCoroutineScope()
    var natural by remember { mutableIntStateOf(0) }
    val scale = if (expanded) 1f else max(0f, 1f - index * 0.1f)
    val translate = if (expanded) {
        -(offsetY + index * gap).toFloat()
    } else {
        -(index * peek).toFloat() - (1f - scale) * frontHeight
    }
    val spec = tween<Float>(450)
    val animatedTranslate by animateFloatAsState(translate, spec, label = "translate")
    val animatedScale by animateFloatAsState(scale, spec, label = "scale")
    val animatedAlpha by animateFloatAsState(if (hidden) 0f else 1f, spec, label = "alpha")
    val behind = !expanded && index > 0
    val contentAlpha by animateFloatAsState(if (behind) 0f else 1f, tween(250), label = "content")
    val enter = remember { Animatable(1f) }
    val exit = remember { Animatable(0f) }
    val drag = remember { Animatable(Offset.Zero, Offset.VectorConverter) }
    val currentOnDismiss by rememberUpdatedState(onDismiss)
    val currentOnToggle by rememberUpdatedState(onToggle)

    LaunchedEffect(Unit) {
        enter.animateTo(0f, tween(450))
    }
    LaunchedEffect(toast.dismissed) {
        if (toast.dismissed) {
            exit.animateTo(1f, tween(250))
            onRemoved()
        }
    }
    LaunchedEffect(toast.id, toast.type, toast.durationMillis, expanded, toast.dismissed) {
        if (!toast.dismissed && !expanded && toast.type != ToastType.Loading && toast.durationMillis > 0) {
            delay(toast.durationMillis)
            onDismiss()
        }
    }

    val forced = behind && frontHeight > 0
    val shape = RoundedCornerShape(Radius.xl)
    val liveMode = if (toast.type == ToastType.Error) LiveRegionMode.Assertive else LiveRegionMode.Polite
    val slideDistance = with(density) { 16.dp.toPx() }
    Box(
        modifier = Modifier
            .zIndex(1000f - index)
            .fillMaxWidth()
            .graphicsLayer {
                val height = if (natural > 0) natural.toFloat() else size.height
                translationY = animatedTranslate + enter.value * (height + slideDistance) +
                    exit.value * slideDistance + drag.value.y
                translationX = drag.value.x
                scaleX = animatedScale
                scaleY = animatedScale
                transformOrigin = TransformOrigin(0.5f, 1f)
                alpha = animatedAlpha * (1f - exit.value)
            }
            .then(if (forced) Modifier.height(with(density) { frontHeight.toDp() }) else Modifier)
            .then(if (colors.isDark) Modifier.shadow(Shadows.lg, shape) else Modifier.shadow(ToastShadow, shape))
            .clip(shape)
            .background(colors.popover, shape)
            .border(1.dp, if (colors.isDark) Color.Transparent else colors.foreground.copy(alpha = 0.05f), shape)
            .semantics {
                liveRegion = liveMode
                dismiss {
                    onDismiss()
                    true
                }
            }
            .pointerInput(toast.id) {
                detectTapGestures { currentOnToggle() }
            }
            .pointerInput(toast.id) {
                val threshold = 48.dp.toPx()
                detectDragGestures(
                    onDragEnd = {
                        val value = drag.value
                        if (abs(value.x) > threshold * 2 || value.y > threshold) {
                            currentOnDismiss()
                        } else {
                            scope.launch { drag.animateTo(Offset.Zero, tween(200)) }
                        }
                    },
                    onDragCancel = { scope.launch { drag.animateTo(Offset.Zero, tween(200)) } },
                ) { change, amount ->
                    change.consume()
                    val next = drag.value + amount
                    scope.launch { drag.snapTo(Offset(next.x, max(next.y, -8.dp.toPx()))) }
                }
            },
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .wrapContentHeight(Alignment.Top, unbounded = true)
                .onSizeChanged {
                    natural = it.height
                    onHeight(it.height)
                }
                .graphicsLayer { alpha = contentAlpha }
                .padding(16.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            ToastIcon(toast.type)
            Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                BasicText(toast.title, style = Typography.sm.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold))
                toast.description?.let {
                    BasicText(it, style = Typography.sm.copy(color = colors.mutedForeground))
                }
            }
            toast.action?.let { action ->
                Button(
                    text = action.label,
                    onClick = {
                        action.onClick()
                        onDismiss()
                    },
                    variant = ButtonVariant.Outline,
                    size = ButtonSize.Sm,
                )
            }
            Button(onClick = onDismiss, variant = ButtonVariant.Ghost, size = ButtonSize.IconSm) {
                Icon(PhosphorIcons.Regular.X, contentDescription = "Close toast", size = 16.dp, tint = colors.mutedForeground)
            }
        }
    }
}

@Composable
private fun ToastIcon(type: ToastType) {
    val colors = EsuissTheme.colors
    if (type == ToastType.Loading) {
        val transition = rememberInfiniteTransition(label = "spinner")
        val rotation by transition.animateFloat(
            initialValue = 0f,
            targetValue = 360f,
            animationSpec = infiniteRepeatable(tween(800, easing = LinearEasing), RepeatMode.Restart),
            label = "rotation",
        )
        Box(modifier = Modifier.size(32.dp).clearAndSetSemantics {}, contentAlignment = Alignment.Center) {
            Icon(PhosphorIcons.Regular.CircleNotch, contentDescription = null, modifier = Modifier.rotate(rotation), size = 20.dp, tint = colors.primary)
        }
        return
    }
    val tint = when (type) {
        ToastType.Success -> Palette.green500
        ToastType.Info -> colors.primary
        ToastType.Warning -> Palette.orange500
        ToastType.Error -> colors.destructive
        else -> return
    }
    val icon = when (type) {
        ToastType.Success -> PhosphorIcons.Bold.Check
        ToastType.Error -> PhosphorIcons.Bold.X
        else -> PhosphorIcons.Bold.ExclamationMark
    }
    Box(
        modifier = Modifier
            .size(32.dp)
            .background(tint, CircleShape)
            .clearAndSetSemantics {},
        contentAlignment = Alignment.Center,
    ) {
        Icon(
            icon,
            contentDescription = null,
            modifier = if (type == ToastType.Info) Modifier.rotate(180f) else Modifier,
            size = 16.dp,
            tint = colors.background,
        )
    }
}
