package com.esuiss.ui.interactions

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.MutableTransitionState
import androidx.compose.animation.core.tween
import androidx.compose.animation.expandVertically
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.scaleIn
import androidx.compose.animation.scaleOut
import androidx.compose.animation.shrinkVertically
import androidx.compose.animation.slideInVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.awaitEachGesture
import androidx.compose.foundation.gestures.awaitFirstDown
import androidx.compose.foundation.gestures.waitForUpOrCancellation
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.Stable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.setValue
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.geometry.RoundRect
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Outline
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.PathOperation
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.graphics.TransformOrigin
import androidx.compose.ui.input.pointer.PointerEventPass
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.Layout
import androidx.compose.ui.layout.Placeable
import androidx.compose.ui.layout.boundsInWindow
import androidx.compose.ui.layout.layoutId
import androidx.compose.ui.layout.onGloballyPositioned
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalWindowInfo
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Constraints
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
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Bold
import com.adamglin.phosphoricons.bold.X
import com.esuiss.ui.components.AnchoredPositionProvider
import com.esuiss.ui.components.FormEasing
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.LocalContentColor
import com.esuiss.ui.components.LocalContentStyle
import com.esuiss.ui.components.LocalIconSize
import com.esuiss.ui.components.PopupAlign
import com.esuiss.ui.components.PopupInset
import com.esuiss.ui.components.PopupMargin
import com.esuiss.ui.components.PopupPlacement
import com.esuiss.ui.components.PopupSide
import com.esuiss.ui.components.formReducedMotion
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Shadow
import com.esuiss.ui.theme.Typography
import com.esuiss.ui.theme.shadow
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

interface TipStorage {
    suspend fun getItem(key: String): String?
    suspend fun setItem(key: String, value: String)
}

class MemoryTipStorage : TipStorage {
    private val items = mutableMapOf<String, String>()

    override suspend fun getItem(key: String): String? = synchronized(items) { items[key] }

    override suspend fun setItem(key: String, value: String) {
        synchronized(items) { items[key] = value }
    }
}

private const val StoragePrefix = "tip:"

private const val Dismissed = "dismissed"

private val DefaultTipStorage = MemoryTipStorage()

private val LocalTipStorage = staticCompositionLocalOf<TipStorage> { DefaultTipStorage }

suspend fun resetTips(ids: List<String>, storage: TipStorage = DefaultTipStorage) {
    ids.forEach { storage.setItem(StoragePrefix + it, "") }
}

@Stable
private class TipGroupContext {
    val order = mutableStateListOf<String>()
    val completed = mutableStateListOf<String>()

    val current: String?
        get() = order.firstOrNull { it !in completed }
}

private val LocalTipGroup = staticCompositionLocalOf<TipGroupContext?> { null }

@Stable
private class TipContext(val dismiss: () -> Unit) {
    var visible by mutableStateOf(false)
    var anchor by mutableStateOf<Rect?>(null)
}

private val LocalTip = staticCompositionLocalOf<TipContext?> { null }

@Composable
private fun tip(): TipContext = LocalTip.current ?: error("Tip parts must be used within a Tip")

private object TipCloseSlot

private object TipContentSlot

@Composable
fun TipGroup(
    storage: TipStorage = LocalTipStorage.current,
    content: @Composable () -> Unit,
) {
    val group = remember { TipGroupContext() }
    CompositionLocalProvider(
        LocalTipGroup provides group,
        LocalTipStorage provides storage,
        content = content,
    )
}

@Composable
fun Tip(
    id: String,
    delayMillis: Long = 0,
    onDismiss: () -> Unit = {},
    content: @Composable () -> Unit,
) {
    val group = LocalTipGroup.current
    val storage = LocalTipStorage.current
    val scope = rememberCoroutineScope()
    val currentOnDismiss by rememberUpdatedState(onDismiss)
    var stored by remember(id, storage) { mutableStateOf<Boolean?>(null) }
    var ready by remember(id) { mutableStateOf(false) }
    var dismissed by remember(id) { mutableStateOf(false) }
    val context = remember(id, storage) {
        TipContext(
            dismiss = {
                if (!dismissed) {
                    dismissed = true
                    scope.launch { storage.setItem(StoragePrefix + id, Dismissed) }
                    group?.completed?.add(id)
                    currentOnDismiss()
                }
            },
        )
    }
    DisposableEffect(group, id) {
        if (group != null && id !in group.order) group.order.add(id)
        onDispose { group?.order?.remove(id) }
    }
    LaunchedEffect(id, storage) {
        val value = storage.getItem(StoragePrefix + id) == Dismissed
        stored = value
        if (value && group != null && id !in group.completed) group.completed.add(id)
    }
    val turn = group == null || group.current == id
    LaunchedEffect(id, turn, stored, delayMillis) {
        if (stored != false || !turn) return@LaunchedEffect
        delay(delayMillis)
        ready = true
    }
    context.visible = ready && turn && !dismissed && stored == false
    CompositionLocalProvider(LocalTip provides context, content = content)
}

@Composable
private fun TipSurface(
    modifier: Modifier,
    content: @Composable () -> Unit,
) {
    Layout(content = content, modifier = modifier) { measurables, constraints ->
        val padding = 16.dp.roundToPx()
        val end = 48.dp.roundToPx()
        val gap = 12.dp.roundToPx()
        val closeOffset = 8.dp.roundToPx()
        val width = if (constraints.hasBoundedWidth) constraints.maxWidth else constraints.minWidth
        val inner = (width - padding - end).coerceAtLeast(0)
        val flow = measurables.filter { it.layoutId != TipCloseSlot }
        val fills = flow.count { it.layoutId == TipContentSlot }
        val placeables = arrayOfNulls<Placeable>(measurables.size)
        var used = gap * (flow.size - 1).coerceAtLeast(0)
        measurables.forEachIndexed { index, measurable ->
            if (measurable.layoutId == TipCloseSlot) {
                placeables[index] = measurable.measure(Constraints())
            } else if (measurable.layoutId != TipContentSlot) {
                val placeable = measurable.measure(Constraints(maxWidth = (inner - used).coerceAtLeast(0)))
                placeables[index] = placeable
                used += placeable.width
            }
        }
        val remaining = (inner - used).coerceAtLeast(0)
        measurables.forEachIndexed { index, measurable ->
            if (measurable.layoutId == TipContentSlot) {
                val share = if (fills == 0) 0 else remaining / fills
                placeables[index] = measurable.measure(Constraints(minWidth = share, maxWidth = share))
            }
        }
        val contentHeight = measurables.indices
            .filter { measurables[it].layoutId != TipCloseSlot }
            .maxOfOrNull { placeables[it]?.height ?: 0 } ?: 0
        val closeHeight = measurables.indices
            .filter { measurables[it].layoutId == TipCloseSlot }
            .maxOfOrNull { (placeables[it]?.height ?: 0) + closeOffset } ?: 0
        val height = constraints.constrainHeightSafe(maxOf(contentHeight + padding * 2, closeHeight))
        layout(width, height) {
            var x = padding
            measurables.forEachIndexed { index, measurable ->
                val placeable = placeables[index] ?: return@forEachIndexed
                if (measurable.layoutId == TipCloseSlot) {
                    placeable.placeRelative(width - closeOffset - placeable.width, closeOffset)
                } else {
                    placeable.placeRelative(x, padding)
                    x += placeable.width + gap
                }
            }
        }
    }
}

private fun Constraints.constrainHeightSafe(height: Int): Int = height.coerceIn(minHeight, maxHeight)

@Composable
fun TipCard(
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit,
) {
    val context = tip()
    val colors = EsuissTheme.colors
    val reduced = formReducedMotion()
    val slide = with(LocalDensity.current) { 8.dp.roundToPx() }
    AnimatedVisibility(
        visible = context.visible,
        enter = if (reduced) {
            fadeIn(tween(0))
        } else {
            expandVertically(tween(400, easing = FormEasing)) +
                fadeIn(tween(400, easing = FormEasing)) +
                slideInVertically(tween(400, easing = FormEasing)) { -slide }
        },
        exit = if (reduced) {
            fadeOut(tween(0))
        } else {
            shrinkVertically(tween(300, easing = FormEasing)) + fadeOut(tween(300, easing = FormEasing))
        },
    ) {
        val shape = RoundedCornerShape(Radius.xl2)
        TipProvider(context) {
            TipSurface(
                modifier = modifier
                    .fillMaxWidth()
                    .background(colors.surfaceSecondary, shape),
                content = content,
            )
        }
    }
}

@Composable
private fun TipProvider(context: TipContext, content: @Composable () -> Unit) {
    val colors = EsuissTheme.colors
    CompositionLocalProvider(
        LocalTip provides context,
        LocalContentStyle provides Typography.base.copy(color = colors.label),
        LocalContentColor provides colors.label,
        content = content,
    )
}

@Composable
fun TipAnchor(
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit,
) {
    val context = tip()
    Box(
        modifier = modifier
            .onGloballyPositioned { context.anchor = it.boundsInWindow() }
            .pointerInput(context) {
                awaitEachGesture {
                    awaitFirstDown(requireUnconsumed = false, pass = PointerEventPass.Initial)
                    val up = waitForUpOrCancellation(PointerEventPass.Initial)
                    if (up != null && context.visible) context.dismiss()
                }
            },
    ) {
        content()
    }
}

private val TipArrow = 8.dp

private val TipShadow = Shadow(0.dp, 12.dp, 24.dp, Color.Black.copy(alpha = 0.14f))

@Stable
private class TipPlacement {
    var side by mutableStateOf(PopupSide.Bottom)
    var arrow by mutableFloatStateOf(0f)
}

private class TipPositionProvider(
    private val anchor: Rect,
    private val delegate: AnchoredPositionProvider,
    private val inset: Int,
    private val arrow: Int,
    private val edge: Int,
    private val requested: PopupSide,
    private val placement: TipPlacement,
) : PopupPositionProvider {
    override fun calculatePosition(
        anchorBounds: IntRect,
        windowSize: IntSize,
        layoutDirection: LayoutDirection,
        popupContentSize: IntSize,
    ): IntOffset {
        val bounds = IntRect(anchor.left.toInt(), anchor.top.toInt(), anchor.right.toInt(), anchor.bottom.toInt())
        val position = delegate.calculatePosition(bounds, windowSize, layoutDirection, popupContentSize)
        val left = position.x + inset
        val top = position.y + inset
        val width = popupContentSize.width - inset * 2
        val height = popupContentSize.height - inset * 2
        val vertical = requested == PopupSide.Top || requested == PopupSide.Bottom
        placement.side = when {
            vertical && top >= bounds.bottom -> PopupSide.Bottom
            vertical -> PopupSide.Top
            left >= bounds.right -> PopupSide.Right
            else -> PopupSide.Left
        }
        placement.arrow = if (vertical) {
            (bounds.center.x - left).toFloat().coerceIn((edge + arrow).toFloat(), (width - edge - arrow).toFloat().coerceAtLeast((edge + arrow).toFloat()))
        } else {
            (bounds.center.y - top).toFloat().coerceIn((edge + arrow).toFloat(), (height - edge - arrow).toFloat().coerceAtLeast((edge + arrow).toFloat()))
        }
        return position
    }
}

private class TipBubbleShape(
    private val side: PopupSide,
    private val arrowCenter: Float,
    private val radius: Dp,
) : Shape {
    override fun createOutline(size: Size, layoutDirection: LayoutDirection, density: Density): Outline {
        val arrow = with(density) { TipArrow.toPx() }
        val corner = with(density) { radius.toPx() }
        val body = when (side) {
            PopupSide.Bottom -> Rect(0f, arrow, size.width, size.height)
            PopupSide.Top -> Rect(0f, 0f, size.width, size.height - arrow)
            PopupSide.Right -> Rect(arrow, 0f, size.width, size.height)
            PopupSide.Left -> Rect(0f, 0f, size.width - arrow, size.height)
        }
        val rect = Path().apply { addRoundRect(RoundRect(body, CornerRadius(corner))) }
        val center = arrowCenter
        val tip = Path().apply {
            when (side) {
                PopupSide.Bottom -> {
                    moveTo(center - arrow, arrow + 1f)
                    lineTo(center, 0f)
                    lineTo(center + arrow, arrow + 1f)
                }
                PopupSide.Top -> {
                    moveTo(center - arrow, size.height - arrow - 1f)
                    lineTo(center, size.height)
                    lineTo(center + arrow, size.height - arrow - 1f)
                }
                PopupSide.Right -> {
                    moveTo(arrow + 1f, center - arrow)
                    lineTo(0f, center)
                    lineTo(arrow + 1f, center + arrow)
                }
                PopupSide.Left -> {
                    moveTo(size.width - arrow - 1f, center - arrow)
                    lineTo(size.width, center)
                    lineTo(size.width - arrow - 1f, center + arrow)
                }
            }
            close()
        }
        return Outline.Generic(Path.combine(PathOperation.Union, rect, tip))
    }
}

@Composable
fun TipPopover(
    modifier: Modifier = Modifier,
    side: PopupSide = PopupSide.Bottom,
    align: PopupAlign = PopupAlign.Center,
    sideOffset: Dp = 10.dp,
    content: @Composable () -> Unit,
) {
    val context = tip()
    val transition = remember { MutableTransitionState(false) }
    transition.targetState = context.visible
    val anchor = context.anchor
    if (anchor == null || (!transition.currentState && !transition.targetState)) return
    val density = LocalDensity.current
    val colors = EsuissTheme.colors
    val reduced = formReducedMotion()
    val placement = remember { TipPlacement() }
    val container = LocalWindowInfo.current.containerSize
    val available = with(density) { container.width.toDp() } - 32.dp
    val width = if (container.width > 0 && available < 320.dp) available else 320.dp
    val provider = remember(anchor, side, align, sideOffset, density) {
        with(density) {
            TipPositionProvider(
                anchor = anchor,
                delegate = AnchoredPositionProvider(
                    side = side,
                    align = align,
                    sideOffset = (sideOffset - TipArrow).roundToPx(),
                    alignOffset = 0,
                    inset = PopupInset.roundToPx(),
                    margin = PopupMargin.roundToPx(),
                    bottomLimit = Int.MAX_VALUE,
                    point = null,
                    placement = PopupPlacement(),
                ),
                inset = PopupInset.roundToPx(),
                arrow = TipArrow.roundToPx(),
                edge = Radius.xl2.roundToPx(),
                requested = side,
                placement = placement,
            )
        }
    }
    val resolved = placement.side
    val vertical = resolved == PopupSide.Top || resolved == PopupSide.Bottom
    val shape = TipBubbleShape(resolved, placement.arrow, Radius.xl2)
    Popup(
        popupPositionProvider = provider,
        onDismissRequest = { if (context.visible) context.dismiss() },
        properties = PopupProperties(focusable = false, dismissOnBackPress = true, dismissOnClickOutside = true),
    ) {
        Box(modifier = Modifier.padding(PopupInset)) {
            Box(modifier = Modifier.width(width)) {
                val origin = with(density) {
                    val arrowFraction = placement.arrow / (if (vertical) width.toPx() else 1f).coerceAtLeast(1f)
                    when (resolved) {
                        PopupSide.Bottom -> TransformOrigin(arrowFraction, 0f)
                        PopupSide.Top -> TransformOrigin(arrowFraction, 1f)
                        PopupSide.Right -> TransformOrigin(0f, 0.5f)
                        PopupSide.Left -> TransformOrigin(1f, 0.5f)
                    }
                }
                AnimatedVisibility(
                    visibleState = transition,
                    enter = if (reduced) {
                        fadeIn(tween(0))
                    } else {
                        fadeIn(tween(300, easing = FormEasing)) +
                            scaleIn(tween(300, easing = FormEasing), initialScale = 0.9f, transformOrigin = origin)
                    },
                    exit = if (reduced) {
                        fadeOut(tween(0))
                    } else {
                        fadeOut(tween(300, easing = FormEasing)) +
                            scaleOut(tween(300, easing = FormEasing), targetScale = 0.9f, transformOrigin = origin)
                    },
                ) {
                    TipProvider(context) {
                        TipSurface(
                            modifier = modifier
                                .fillMaxWidth()
                                .shadow(TipShadow.copy(color = colors.label.copy(alpha = 0.14f)), shape)
                                .background(colors.surfaceRaised, shape)
                                .border(0.5.dp, colors.separatorStrong, shape)
                                .padding(
                                    top = if (resolved == PopupSide.Bottom) TipArrow else 0.dp,
                                    bottom = if (resolved == PopupSide.Top) TipArrow else 0.dp,
                                    start = if (resolved == PopupSide.Right) TipArrow else 0.dp,
                                    end = if (resolved == PopupSide.Left) TipArrow else 0.dp,
                                ),
                            content = content,
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun TipIcon(
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit,
) {
    Box(modifier = modifier) {
        CompositionLocalProvider(
            LocalContentColor provides EsuissTheme.colors.accent,
            LocalIconSize provides 32.dp,
            content = content,
        )
    }
}

@Composable
fun TipContent(
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit,
) {
    Column(
        modifier = modifier.layoutId(TipContentSlot),
        verticalArrangement = Arrangement.spacedBy(2.dp),
        content = content,
    )
}

@Composable
fun TipTitle(text: String, modifier: Modifier = Modifier) {
    BasicText(
        text,
        modifier = modifier,
        style = Typography.base.copy(color = EsuissTheme.colors.label, fontWeight = FontWeight.SemiBold),
    )
}

@Composable
fun TipDescription(text: String, modifier: Modifier = Modifier) {
    BasicText(
        text,
        modifier = modifier,
        style = Typography.sm.copy(color = EsuissTheme.colors.labelSecondary),
    )
}

@Composable
fun TipClose(
    modifier: Modifier = Modifier,
    contentDescription: String = "Dismiss tip",
) {
    val context = tip()
    val colors = EsuissTheme.colors
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    Box(
        modifier = modifier
            .layoutId(TipCloseSlot)
            .size(32.dp)
            .background(if (pressed) colors.itemPressed else Color.Transparent, CircleShape)
            .clickable(interactionSource = interaction, indication = null, role = Role.Button) { context.dismiss() }
            .semantics { this.contentDescription = contentDescription },
        contentAlignment = androidx.compose.ui.Alignment.Center,
    ) {
        Icon(
            PhosphorIcons.Bold.X,
            contentDescription = null,
            size = 16.dp,
            tint = if (pressed) colors.label else colors.labelSecondary,
        )
    }
}
