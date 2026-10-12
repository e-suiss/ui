package com.esuiss.ui.components

import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyItemScope
import androidx.compose.foundation.lazy.LazyListState
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.SideEffect
import androidx.compose.runtime.Stable
import androidx.compose.runtime.derivedStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.setValue
import androidx.compose.runtime.snapshotFlow
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.lerp
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.onClick
import androidx.compose.ui.semantics.role
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.ArrowDown
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography
import kotlinx.coroutines.launch

enum class MessageScrollerScrollDirection { Start, End }

private const val MessageScrollerLoader = "com.esuiss.ui.MessageScroller.loader"

private const val LoadOlderThreshold = 3

@Stable
class MessageScrollerState internal constructor(
    internal val listState: LazyListState,
    private val edgeThreshold: Float,
) {
    internal var newestKey: Any? = null
    internal var keys: List<Any> = emptyList()

    var unreadCount by mutableIntStateOf(0)
        internal set

    val isAtEnd: Boolean
        get() = listState.firstVisibleItemIndex == 0 && listState.firstVisibleItemScrollOffset <= edgeThreshold

    val canScrollToEnd: Boolean
        get() = !isAtEnd

    val canScrollToStart: Boolean
        get() = listState.canScrollForward

    val visibleKeys: List<Any>
        get() = listState.layoutInfo.visibleItemsInfo.map { it.key }.filter { it != MessageScrollerLoader }.asReversed()

    suspend fun scrollToEnd(animated: Boolean = true) {
        if (animated) {
            if (listState.firstVisibleItemIndex > 12) listState.scrollToItem(12)
            listState.animateScrollToItem(0)
        } else {
            listState.scrollToItem(0)
        }
        unreadCount = 0
    }

    suspend fun scrollToStart(animated: Boolean = true) {
        val last = keys.size - 1
        if (last < 0) return
        if (animated) {
            if (last - listState.firstVisibleItemIndex > 12) listState.scrollToItem(last - 12)
            listState.animateScrollToItem(last)
        } else {
            listState.scrollToItem(last)
        }
    }

    suspend fun scrollToMessage(key: Any, animated: Boolean = true): Boolean {
        val index = keys.indexOf(key)
        if (index < 0) return false
        if (animated) listState.animateScrollToItem(index) else listState.scrollToItem(index)
        return true
    }
}

@Composable
fun rememberMessageScrollerState(): MessageScrollerState {
    val listState = rememberLazyListState()
    val threshold = with(LocalDensity.current) { 8.dp.toPx() }
    return remember(listState, threshold) { MessageScrollerState(listState, threshold) }
}

private val LocalMessageScroller = staticCompositionLocalOf<MessageScrollerState?> { null }

@Composable
fun <T> MessageScroller(
    items: List<T>,
    key: (T) -> Any,
    modifier: Modifier = Modifier,
    state: MessageScrollerState = rememberMessageScrollerState(),
    onLoadOlder: (() -> Unit)? = null,
    loadingOlder: Boolean = false,
    contentPadding: PaddingValues = PaddingValues(16.dp),
    verticalArrangement: Arrangement.Vertical = Arrangement.spacedBy(12.dp, Alignment.Bottom),
    overlay: @Composable BoxScope.() -> Unit = { MessageScrollerButton() },
    content: @Composable LazyItemScope.(T) -> Unit,
) {
    val newest = items.lastOrNull()?.let(key)
    SideEffect {
        state.keys = items.asReversed().map(key)
        val previous = state.newestKey
        if (previous != null && newest != null && previous != newest) {
            val at = items.indexOfLast { key(it) == previous }
            if (at >= 0) {
                if (state.isAtEnd) {
                    state.listState.requestScrollToItem(0)
                } else {
                    state.unreadCount += items.size - 1 - at
                }
            }
        }
        state.newestKey = newest
    }
    LaunchedEffect(state) {
        snapshotFlow { state.isAtEnd }.collect { if (it) state.unreadCount = 0 }
    }
    val load by rememberUpdatedState(onLoadOlder)
    val loading by rememberUpdatedState(loadingOlder)
    val count by rememberUpdatedState(items.size)
    LaunchedEffect(state) {
        snapshotFlow {
            val info = state.listState.layoutInfo
            val last = info.visibleItemsInfo.lastOrNull { it.key != MessageScrollerLoader }?.index ?: -1
            if (count > 0 && last >= count - 1 - LoadOlderThreshold) count else -1
        }.collect { size ->
            if (size >= 0 && !loading) load?.invoke()
        }
    }
    Box(modifier) {
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            state = state.listState,
            contentPadding = contentPadding,
            reverseLayout = true,
            verticalArrangement = verticalArrangement,
        ) {
            items(items.asReversed(), key = key) { item ->
                content(item)
            }
            if (loadingOlder) {
                item(key = MessageScrollerLoader) {
                    Box(Modifier.fillMaxWidth().padding(vertical = 8.dp), contentAlignment = Alignment.Center) {
                        Spinner(size = 20.dp)
                    }
                }
            }
        }
        CompositionLocalProvider(LocalMessageScroller provides state) {
            overlay()
        }
    }
}

private val EnterEasing = CubicBezierEasing(0.23f, 1f, 0.32f, 1f)

private val ExitEasing = CubicBezierEasing(0.7f, 0f, 0.84f, 0f)

@Composable
fun BoxScope.MessageScrollerButton(
    modifier: Modifier = Modifier,
    direction: MessageScrollerScrollDirection = MessageScrollerScrollDirection.End,
    animated: Boolean = true,
    contentDescription: String = if (direction == MessageScrollerScrollDirection.End) "Scroll to end" else "Scroll to start",
) {
    val state = LocalMessageScroller.current ?: return
    val colors = EsuissTheme.colors
    val scope = rememberCoroutineScope()
    val end = direction == MessageScrollerScrollDirection.End
    val active by remember(state, end) { derivedStateOf { if (end) state.canScrollToEnd else state.canScrollToStart } }
    val progress by animateFloatAsState(
        targetValue = if (active) 1f else 0f,
        animationSpec = if (active) tween(200, easing = EnterEasing) else tween(400, easing = ExitEasing),
        label = "message-scroller-button",
    )
    if (!active && progress == 0f) return
    val unread = if (end) state.unreadCount else 0
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    val scroll = {
        scope.launch {
            if (end) state.scrollToEnd(animated) else state.scrollToStart(animated)
        }
        Unit
    }
    val description = if (unread > 0) "$contentDescription, $unread new" else contentDescription
    Box(
        modifier = modifier
            .align(if (end) Alignment.BottomCenter else Alignment.TopCenter)
            .padding(vertical = 16.dp)
            .graphicsLayer {
                alpha = progress
                val scale = 0.95f + 0.05f * progress
                scaleX = scale
                scaleY = scale
                translationY = (1f - progress) * size.height * (if (end) 1f else -1f)
            }
            .clearAndSetSemantics {
                if (active) {
                    this.contentDescription = description
                    role = Role.Button
                    onClick {
                        scroll()
                        true
                    }
                }
            },
    ) {
        Box(
            modifier = Modifier
                .size(32.dp)
                .clip(CircleShape)
                .background(if (pressed) lerp(colors.surface, colors.label, 0.1f) else colors.surface, CircleShape)
                .border(1.dp, colors.separator, CircleShape)
                .clickable(
                    interactionSource = interaction,
                    indication = null,
                    enabled = active,
                    onClick = scroll,
                ),
            contentAlignment = Alignment.Center,
        ) {
            Icon(
                PhosphorIcons.Regular.ArrowDown,
                contentDescription = null,
                modifier = if (end) Modifier else Modifier.rotate(180f),
                size = 16.dp,
                tint = colors.label,
            )
        }
        if (unread > 0) {
            Box(
                modifier = Modifier
                    .align(Alignment.TopEnd)
                    .offset(x = 8.dp, y = (-6).dp)
                    .background(colors.surface, CircleShape)
                    .padding(2.dp)
                    .defaultMinSize(minWidth = 18.dp, minHeight = 18.dp)
                    .background(colors.accent, CircleShape)
                    .padding(horizontal = 5.dp),
                contentAlignment = Alignment.Center,
            ) {
                BasicText(
                    if (unread > 99) "99+" else unread.toString(),
                    style = Typography.xs2.copy(color = colors.onAccent, fontWeight = FontWeight.SemiBold),
                    maxLines = 1,
                )
            }
        }
    }
}
