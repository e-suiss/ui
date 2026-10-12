package com.esuiss.ui.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsDraggedAsState
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.PagerState
import androidx.compose.foundation.pager.VerticalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.Stable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.setValue
import androidx.compose.runtime.snapshotFlow
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.selected
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Fill
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.fill.Pause
import com.adamglin.phosphoricons.fill.Play
import com.adamglin.phosphoricons.regular.CaretDown
import com.adamglin.phosphoricons.regular.CaretLeft
import com.adamglin.phosphoricons.regular.CaretRight
import com.adamglin.phosphoricons.regular.CaretUp
import com.esuiss.ui.theme.EsuissTheme
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.flow.drop
import kotlinx.coroutines.launch

enum class CarouselOrientation { Horizontal, Vertical }

enum class CarouselDotsVariant { Default, Plain }

internal val CarouselEasing = CubicBezierEasing(0.32f, 0.72f, 0f, 1f)

@Stable
class CarouselState internal constructor(
    internal val pager: PagerState,
    private val scope: CoroutineScope,
    val loop: Boolean,
) {
    val pageCount: Int get() = pager.pageCount

    val selectedIndex: Int get() = pager.currentPage

    val canScrollPrev: Boolean get() = pageCount > 1 && (loop || selectedIndex > 0)

    val canScrollNext: Boolean get() = pageCount > 1 && (loop || selectedIndex < pageCount - 1)

    internal var autoplayEnabled by mutableStateOf(false)

    internal var playing by mutableStateOf(false)

    internal val progress = Animatable(0f)

    fun scrollTo(index: Int, animate: Boolean = true) {
        if (pageCount == 0) return
        val target = index.coerceIn(0, pageCount - 1)
        scope.launch {
            if (animate) pager.animateScrollToPage(target, animationSpec = tween(500, easing = CarouselEasing))
            else pager.scrollToPage(target)
        }
    }

    fun scrollPrev() {
        if (!canScrollPrev) return
        scrollTo(if (selectedIndex == 0) pageCount - 1 else selectedIndex - 1)
    }

    fun scrollNext() {
        if (!canScrollNext) return
        scrollTo(if (selectedIndex == pageCount - 1) 0 else selectedIndex + 1)
    }

    fun setPlaying(playing: Boolean) {
        this.playing = playing
    }

    val isPlaying: Boolean get() = autoplayEnabled && playing
}

@Composable
fun rememberCarouselState(pageCount: Int, initialPage: Int = 0, loop: Boolean = false): CarouselState {
    val pager = rememberPagerState(initialPage) { pageCount }
    val scope = rememberCoroutineScope()
    return remember(pager, scope, loop) { CarouselState(pager, scope, loop) }
}

@Stable
private class CarouselContext(val state: CarouselState, val orientation: CarouselOrientation)

private val LocalCarousel = staticCompositionLocalOf<CarouselContext?> { null }

@Composable
private fun carousel(): CarouselContext =
    checkNotNull(LocalCarousel.current) { "Carousel parts must be used within a Carousel" }

@Composable
fun Carousel(
    state: CarouselState,
    modifier: Modifier = Modifier,
    orientation: CarouselOrientation = CarouselOrientation.Horizontal,
    autoplay: Boolean = false,
    autoplayDelayMillis: Long = 5000L,
    onSelect: ((Int) -> Unit)? = null,
    content: @Composable ColumnScope.() -> Unit,
) {
    val select by rememberUpdatedState(onSelect)
    LaunchedEffect(state) {
        snapshotFlow { state.selectedIndex }.distinctUntilChanged().drop(1).collect { select?.invoke(it) }
    }
    LaunchedEffect(state, autoplay) {
        state.autoplayEnabled = autoplay
        state.playing = autoplay
    }
    val dragged by state.pager.interactionSource.collectIsDraggedAsState()
    val running = state.autoplayEnabled && state.playing && !dragged
    val selected = state.selectedIndex
    LaunchedEffect(selected) { state.progress.snapTo(0f) }
    LaunchedEffect(state, running, selected, autoplayDelayMillis) {
        if (!running) return@LaunchedEffect
        val remaining = (autoplayDelayMillis * (1f - state.progress.value)).toInt().coerceAtLeast(0)
        state.progress.animateTo(1f, tween(remaining, easing = LinearEasing))
        if (state.selectedIndex != selected) return@LaunchedEffect
        if (state.selectedIndex < state.pageCount - 1) state.scrollTo(state.selectedIndex + 1) else state.scrollTo(0)
    }
    CompositionLocalProvider(LocalCarousel provides remember(state, orientation) { CarouselContext(state, orientation) }) {
        Column(modifier = modifier, content = content)
    }
}

@Composable
fun CarouselContent(
    modifier: Modifier = Modifier,
    contentPadding: PaddingValues = PaddingValues(0.dp),
    pageSpacing: Dp = 16.dp,
    key: ((Int) -> Any)? = null,
    content: @Composable (page: Int) -> Unit,
) {
    val context = carousel()
    if (context.orientation == CarouselOrientation.Horizontal) {
        HorizontalPager(
            state = context.state.pager,
            modifier = modifier.fillMaxWidth(),
            contentPadding = contentPadding,
            pageSpacing = pageSpacing,
            key = key,
            verticalAlignment = Alignment.Top,
        ) { page -> content(page) }
    } else {
        VerticalPager(
            state = context.state.pager,
            modifier = modifier,
            contentPadding = contentPadding,
            pageSpacing = pageSpacing,
            key = key,
            horizontalAlignment = Alignment.Start,
        ) { page -> content(page) }
    }
}

@Composable
fun CarouselItem(
    modifier: Modifier = Modifier,
    content: @Composable BoxScope.() -> Unit,
) {
    Box(modifier = modifier, content = content)
}

@Composable
fun CarouselPrevious(
    modifier: Modifier = Modifier,
    variant: ButtonVariant = ButtonVariant.Secondary,
    size: ButtonSize = ButtonSize.Icon,
    contentDescription: String = "Previous slide",
) {
    val context = carousel()
    Button(
        onClick = { context.state.scrollPrev() },
        modifier = modifier,
        variant = variant,
        size = size,
        enabled = context.state.canScrollPrev,
    ) {
        Icon(
            if (context.orientation == CarouselOrientation.Horizontal) PhosphorIcons.Regular.CaretLeft else PhosphorIcons.Regular.CaretUp,
            contentDescription = contentDescription,
        )
    }
}

@Composable
fun CarouselNext(
    modifier: Modifier = Modifier,
    variant: ButtonVariant = ButtonVariant.Secondary,
    size: ButtonSize = ButtonSize.Icon,
    contentDescription: String = "Next slide",
) {
    val context = carousel()
    Button(
        onClick = { context.state.scrollNext() },
        modifier = modifier,
        variant = variant,
        size = size,
        enabled = context.state.canScrollNext,
    ) {
        Icon(
            if (context.orientation == CarouselOrientation.Horizontal) PhosphorIcons.Regular.CaretRight else PhosphorIcons.Regular.CaretDown,
            contentDescription = contentDescription,
        )
    }
}

@Composable
fun CarouselControls(
    modifier: Modifier = Modifier,
    content: @Composable RowScope.() -> Unit,
) {
    Row(
        modifier = modifier.padding(top = 24.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp),
        verticalAlignment = Alignment.CenterVertically,
        content = content,
    )
}

@Composable
fun CarouselDots(
    modifier: Modifier = Modifier,
    variant: CarouselDotsVariant = CarouselDotsVariant.Default,
) {
    val context = carousel()
    val state = context.state
    val colors = EsuissTheme.colors
    val plain = variant == CarouselDotsVariant.Plain
    Row(
        modifier = modifier
            .height(36.dp)
            .clip(CircleShape)
            .background(if (plain) Color.Transparent else colors.control, CircleShape)
            .padding(horizontal = if (plain) 0.dp else 8.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        for (index in 0 until state.pageCount) {
            val active = index == state.selectedIndex
            val interaction = remember { MutableInteractionSource() }
            val pressed by interaction.collectIsPressedAsState()
            val width by animateDpAsState(if (active) 24.dp else 8.dp, tween(500, easing = CarouselEasing), label = "dot")
            val target = when {
                active && !state.autoplayEnabled -> colors.label
                pressed -> colors.labelSecondary
                else -> colors.labelTertiary
            }
            val color by animateColorAsState(target, tween(500, easing = CarouselEasing), label = "dotColor")
            val fill = colors.label
            Box(
                modifier = Modifier
                    .fillMaxHeight()
                    .clickable(interactionSource = interaction, indication = null, role = Role.Button) { state.scrollTo(index) }
                    .semantics {
                        contentDescription = "Go to slide ${index + 1}"
                        selected = active
                    }
                    .padding(horizontal = 8.dp),
                contentAlignment = Alignment.Center,
            ) {
                Box(
                    modifier = Modifier
                        .width(width)
                        .height(8.dp)
                        .clip(CircleShape)
                        .background(color, CircleShape)
                        .then(
                            if (active && state.autoplayEnabled) {
                                Modifier.drawBehind {
                                    val fraction = if (state.playing) state.progress.value else 1f
                                    drawRoundRect(
                                        color = fill,
                                        size = size.copy(width = size.width * fraction),
                                        cornerRadius = CornerRadius(size.height / 2f),
                                    )
                                }
                            } else {
                                Modifier
                            },
                        ),
                )
            }
        }
    }
}

@Composable
fun CarouselPlayButton(
    modifier: Modifier = Modifier,
    variant: ButtonVariant = ButtonVariant.Secondary,
    size: ButtonSize = ButtonSize.IconSm,
) {
    val state = carousel().state
    if (!state.autoplayEnabled) return
    Button(
        onClick = { state.setPlaying(!state.playing) },
        modifier = modifier,
        variant = variant,
        size = size,
    ) {
        Icon(
            if (state.playing) PhosphorIcons.Fill.Pause else PhosphorIcons.Fill.Play,
            contentDescription = if (state.playing) "Pause slideshow" else "Play slideshow",
        )
    }
}
