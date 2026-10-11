package com.esuiss.ui.interactions

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.VectorConverter
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.awaitEachGesture
import androidx.compose.foundation.gestures.awaitFirstDown
import androidx.compose.foundation.gestures.calculateCentroid
import androidx.compose.foundation.gestures.calculatePan
import androidx.compose.foundation.gestures.calculateZoom
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawing
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.Stable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.setValue
import androidx.compose.runtime.snapshotFlow
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.painter.Painter
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.input.pointer.positionChanged
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.layout.onSizeChanged
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.IntSize
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.X
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.ModalWindow
import com.esuiss.ui.theme.DarkColors
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.LocalColors
import com.esuiss.ui.theme.Typography
import kotlin.math.abs
import kotlin.math.roundToInt
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.launch

@Immutable
class ImageViewerImage(val painter: Painter, val contentDescription: String? = null)

private const val MinScale = 1f
private const val MaxScale = 4f
private const val DoubleTapScale = 2.5f
private val Easing = CubicBezierEasing(0.32f, 0.72f, 0f, 1f)

@Stable
private class ZoomState {
    val scale = Animatable(1f)
    val offset = Animatable(Offset.Zero, Offset.VectorConverter)
    var size by mutableStateOf(IntSize.Zero)

    fun bounds(scale: Float): Offset = Offset(size.width * (scale - 1f) / 2f, size.height * (scale - 1f) / 2f)

    fun clamp(value: Offset, scale: Float): Offset {
        val limit = bounds(scale)
        return Offset(value.x.coerceIn(-limit.x, limit.x), value.y.coerceIn(-limit.y, limit.y))
    }

    suspend fun reset() = coroutineScope {
        launch { scale.animateTo(1f, tween(300, easing = Easing)) }
        launch { offset.animateTo(Offset.Zero, tween(300, easing = Easing)) }
    }

    suspend fun zoomTo(target: Float, focus: Offset) = coroutineScope {
        val center = Offset(size.width / 2f, size.height / 2f)
        val next = clamp((center - focus) * (target - 1f), target)
        launch { scale.animateTo(target, tween(300, easing = Easing)) }
        launch { offset.animateTo(next, tween(300, easing = Easing)) }
    }
}

@Composable
fun ImageViewer(
    open: Boolean,
    onOpenChange: (Boolean) -> Unit,
    images: List<ImageViewerImage>,
    index: Int,
    onIndexChange: (Int) -> Unit,
    modifier: Modifier = Modifier,
    closeLabel: String = "Close",
    indexLabel: (index: Int, count: Int) -> String = { current, count -> "${current + 1} of $count" },
) {
    var shown by remember { mutableStateOf(open) }
    val appear = remember { Animatable(if (open) 1f else 0f) }
    val dismiss = remember { Animatable(0f) }
    LaunchedEffect(open) {
        if (open) {
            shown = true
            dismiss.snapTo(0f)
            appear.animateTo(1f, tween(250, easing = Easing))
        } else if (shown) {
            appear.animateTo(0f, tween(200, easing = Easing))
            shown = false
        }
    }
    if (images.isEmpty()) return
    val change by rememberUpdatedState(onOpenChange)
    val indexChange by rememberUpdatedState(onIndexChange)
    ModalWindow(
        visible = shown,
        onDismissRequest = { change(false) },
        dismissOnBackPress = true,
        paneTitle = images.getOrNull(index)?.contentDescription,
    ) {
        CompositionLocalProvider(LocalColors provides DarkColors) {
            val colors = EsuissTheme.colors
            val pager = rememberPagerState(index.coerceIn(0, images.lastIndex)) { images.size }
            val zooms = remember(images.size) { List(images.size) { ZoomState() } }
            val scope = rememberCoroutineScope()
            LaunchedEffect(pager) {
                snapshotFlow { pager.settledPage }.distinctUntilChanged().collect { page ->
                    zooms.forEachIndexed { position, zoom ->
                        if (position != page && zoom.scale.value != 1f) {
                            zoom.scale.snapTo(1f)
                            zoom.offset.snapTo(Offset.Zero)
                        }
                    }
                    if (page != index) indexChange(page)
                }
            }
            LaunchedEffect(index) {
                val target = index.coerceIn(0, images.lastIndex)
                if (target != pager.settledPage) pager.scrollToPage(target)
            }
            val zoomed = zooms.getOrNull(pager.currentPage)?.let { it.scale.value > 1.01f } ?: false
            Box(
                modifier = modifier
                    .fillMaxSize()
                    .graphicsLayer { alpha = appear.value }
                    .background(colors.surface.copy(alpha = 1f - (abs(dismiss.value) / 600f).coerceIn(0f, 0.8f))),
            ) {
                HorizontalPager(
                    state = pager,
                    modifier = Modifier.fillMaxSize(),
                    userScrollEnabled = !zoomed,
                    pageSpacing = 16.dp,
                ) { page ->
                    val zoom = zooms[page]
                    val image = images[page]
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .onSizeChanged { zoom.size = it }
                            .pointerInput(zoom) {
                                val slop = viewConfiguration.touchSlop
                                var lastTap = 0L
                                var lastTapPosition = Offset.Zero
                                awaitEachGesture {
                                    val down = awaitFirstDown(requireUnconsumed = false)
                                    var mode = 0
                                    var travel = Offset.Zero
                                    var moved = false
                                    var multi = false
                                    do {
                                        val event = awaitPointerEvent()
                                        val pressed = event.changes.count { it.pressed }
                                        if (pressed >= 2) {
                                            multi = true
                                            mode = 3
                                            val factor = event.calculateZoom()
                                            val pan = event.calculatePan()
                                            val centroid = event.calculateCentroid()
                                            val center = Offset(size.width / 2f, size.height / 2f)
                                            val current = zoom.scale.value
                                            val next = (current * factor).coerceIn(MinScale * 0.8f, MaxScale)
                                            val applied = next / current
                                            val offset = (zoom.offset.value + pan) * applied + (centroid - center) * (1f - applied)
                                            scope.launch {
                                                zoom.scale.snapTo(next)
                                                zoom.offset.snapTo(zoom.clamp(offset, maxOf(next, 1f)))
                                            }
                                            event.changes.forEach { if (it.positionChanged()) it.consume() }
                                        } else if (pressed == 1) {
                                            val pan = event.calculatePan()
                                            travel += pan
                                            if (travel.getDistance() > slop) moved = true
                                            if (zoom.scale.value > 1.01f && mode != 3) {
                                                mode = 2
                                                val next = zoom.clamp(zoom.offset.value + pan, zoom.scale.value)
                                                scope.launch { zoom.offset.snapTo(next) }
                                                event.changes.forEach { it.consume() }
                                            } else if (mode == 0 && moved) {
                                                mode = if (abs(travel.y) > abs(travel.x)) 1 else 4
                                            }
                                            if (mode == 1) {
                                                scope.launch { dismiss.snapTo(dismiss.value + pan.y) }
                                                event.changes.forEach { it.consume() }
                                            }
                                        }
                                    } while (event.changes.any { it.pressed })
                                    when {
                                        mode == 1 -> {
                                            if (abs(dismiss.value) > 120.dp.toPx()) {
                                                change(false)
                                            } else {
                                                scope.launch { dismiss.animateTo(0f, spring()) }
                                            }
                                        }
                                        mode == 3 && zoom.scale.value < 1f -> scope.launch { zoom.reset() }
                                        !moved && !multi -> {
                                            val now = down.uptimeMillis
                                            if (now - lastTap < viewConfiguration.doubleTapTimeoutMillis &&
                                                (down.position - lastTapPosition).getDistance() < slop * 4
                                            ) {
                                                lastTap = 0L
                                                scope.launch {
                                                    if (zoom.scale.value > 1.01f) zoom.reset() else zoom.zoomTo(DoubleTapScale, down.position)
                                                }
                                            } else {
                                                lastTap = now
                                                lastTapPosition = down.position
                                            }
                                        }
                                    }
                                }
                            }
                            .semantics {
                                image.contentDescription?.let { contentDescription = it }
                                stateDescription = "${(zoom.scale.value * 100).roundToInt()}%"
                            },
                        contentAlignment = Alignment.Center,
                    ) {
                        Image(
                            painter = image.painter,
                            contentDescription = null,
                            contentScale = ContentScale.Fit,
                            modifier = Modifier
                                .fillMaxSize()
                                .graphicsLayer {
                                    scaleX = zoom.scale.value
                                    scaleY = zoom.scale.value
                                    translationX = zoom.offset.value.x
                                    translationY = zoom.offset.value.y + if (page == pager.currentPage) dismiss.value else 0f
                                    val shrink = 1f - (abs(dismiss.value) / 3000f).coerceIn(0f, 0.2f)
                                    if (page == pager.currentPage) {
                                        scaleX *= shrink
                                        scaleY *= shrink
                                    }
                                },
                        )
                    }
                }
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .windowInsetsPadding(WindowInsets.safeDrawing)
                        .padding(horizontal = 12.dp)
                        .height(52.dp)
                        .graphicsLayer { alpha = 1f - (abs(dismiss.value) / 200f).coerceIn(0f, 1f) },
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Box(modifier = Modifier.weight(1f))
                    BasicText(
                        indexLabel(pager.currentPage, images.size),
                        style = Typography.base.copy(color = colors.label, fontWeight = FontWeight.SemiBold),
                    )
                    Box(modifier = Modifier.weight(1f), contentAlignment = Alignment.CenterEnd) {
                        Button(onClick = { change(false) }, variant = ButtonVariant.Secondary, size = ButtonSize.Icon) {
                            Icon(PhosphorIcons.Regular.X, contentDescription = closeLabel)
                        }
                    }
                }
            }
        }
    }
}
