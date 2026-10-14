package com.esuiss.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.MutableTransitionState
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideIn
import androidx.compose.animation.slideOut
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.Orientation
import androidx.compose.foundation.gestures.draggable
import androidx.compose.foundation.gestures.rememberDraggableState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.WindowInsetsSides
import androidx.compose.foundation.layout.absoluteOffset
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.only
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawing
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.AbsoluteAlignment
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.onSizeChanged
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.semantics.paneTitle
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Shadows
import com.esuiss.ui.theme.Typography
import com.esuiss.ui.theme.shadow
import kotlin.math.roundToInt
import kotlinx.coroutines.launch

enum class SheetSide { Top, Right, Bottom, Left }

@Immutable
private data class SheetInfo(
    val hasCloseButton: Boolean,
    val hasCloseLabel: Boolean,
    val fillsHeight: Boolean,
)

private val LocalSheetInfo = staticCompositionLocalOf { SheetInfo(false, false, false) }

private const val SheetDuration = 400

@Composable
fun Sheet(
    open: Boolean,
    onOpenChange: (Boolean) -> Unit,
    modifier: Modifier = Modifier,
    side: SheetSide = SheetSide.Right,
    showCloseButton: Boolean = true,
    closeLabel: String? = null,
    content: @Composable ColumnScope.() -> Unit,
) {
    val transition = remember { MutableTransitionState(false) }
    transition.targetState = open
    val paneTitle = remember { PaneTitleState() }
    val drag = remember { Animatable(0f) }
    val scope = rememberCoroutineScope()
    val close = { if (open) onOpenChange(false) }
    LaunchedEffect(open) { if (open) drag.snapTo(0f) }

    val horizontal = side == SheetSide.Left || side == SheetSide.Right
    val sign = if (side == SheetSide.Right || side == SheetSide.Bottom) 1f else -1f
    val alignment = when (side) {
        SheetSide.Top -> AbsoluteAlignment.TopLeft
        SheetSide.Right -> AbsoluteAlignment.CenterRight
        SheetSide.Bottom -> AbsoluteAlignment.BottomLeft
        SheetSide.Left -> AbsoluteAlignment.CenterLeft
    }
    val insetSides = when (side) {
        SheetSide.Top -> WindowInsetsSides.Top + WindowInsetsSides.Horizontal
        SheetSide.Bottom -> WindowInsetsSides.Bottom + WindowInsetsSides.Horizontal
        SheetSide.Left -> WindowInsetsSides.Vertical + WindowInsetsSides.Left
        SheetSide.Right -> WindowInsetsSides.Vertical + WindowInsetsSides.Right
    }
    val colors = EsuissTheme.colors
    val density = LocalDensity.current
    val slide = with(density) { 25.dp.roundToPx() }
    fun edgeOffset(): IntOffset = when (side) {
        SheetSide.Top -> IntOffset(0, -slide)
        SheetSide.Bottom -> IntOffset(0, slide)
        SheetSide.Left -> IntOffset(-slide, 0)
        SheetSide.Right -> IntOffset(slide, 0)
    }

    ModalWindow(
        visible = transition.currentState || transition.targetState,
        onDismissRequest = close,
        dismissOnBackPress = true,
        paneTitle = paneTitle.value,
    ) {
        BoxWithConstraints(modifier = Modifier.fillMaxSize()) {
            val wide = maxWidth >= 640.dp
            Scrim(transition, SheetDuration, SheetDuration, onClick = close)
            AnimatedVisibility(
                visibleState = transition,
                modifier = Modifier
                    .align(alignment)
                    .windowInsetsPadding(WindowInsets.safeDrawing.only(insetSides))
                    .padding(8.dp),
                enter = fadeIn(tween(SheetDuration)) + slideIn(tween(SheetDuration)) { edgeOffset() },
                exit = fadeOut(tween(SheetDuration)) + slideOut(tween(SheetDuration)) { edgeOffset() },
            ) {
                val extent = remember { mutableFloatStateOf(1f) }
                val shape = RoundedCornerShape(Radius.xl3)
                val sizing = if (horizontal) {
                    val width = if (wide) minOf(this@BoxWithConstraints.maxWidth * 0.75f, 384.dp) else this@BoxWithConstraints.maxWidth * 0.75f
                    Modifier.width(width).fillMaxHeight()
                } else {
                    Modifier.fillMaxWidth()
                }
                Box(
                    modifier = modifier
                        .then(sizing)
                        .onSizeChanged { extent.floatValue = (if (horizontal) it.width else it.height).toFloat() }
                        .absoluteOffset {
                            val value = (drag.value * sign).roundToInt()
                            if (horizontal) IntOffset(value, 0) else IntOffset(0, value)
                        }
                        .draggable(
                            orientation = if (horizontal) Orientation.Horizontal else Orientation.Vertical,
                            state = rememberDraggableState { delta ->
                                scope.launch { drag.snapTo((drag.value + delta * sign).coerceAtLeast(0f)) }
                            },
                            onDragStopped = { velocity ->
                                if (drag.value > extent.floatValue * 0.3f || velocity * sign > 1000f) {
                                    close()
                                } else {
                                    drag.animateTo(0f, tween(200))
                                }
                            },
                        )
                        .shadow(Shadows.lg, shape)
                        .clip(shape)
                        .background(colors.surfaceRaised, shape)
                        .pointerInput(Unit) {}
                        .semantics { paneTitle.value?.let { this.paneTitle = it } },
                ) {
                    CompositionLocalProvider(
                        LocalPaneTitle provides paneTitle,
                        LocalSheetInfo provides SheetInfo(showCloseButton, showCloseButton && closeLabel != null, horizontal),
                        LocalContentStyle provides Typography.base.copy(color = colors.label),
                        LocalContentColor provides colors.label,
                    ) {
                        Column(
                            modifier = if (horizontal) Modifier.fillMaxSize() else Modifier.fillMaxWidth(),
                            content = content,
                        )
                    }
                    if (showCloseButton) {
                        OverlayCloseButton(
                            onClick = close,
                            label = closeLabel,
                            modifier = Modifier
                                .align(Alignment.TopEnd)
                                .padding(
                                    top = if (closeLabel != null) 19.dp else 13.dp,
                                    end = if (closeLabel != null) 16.dp else 10.dp,
                                ),
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun SheetHeader(
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit,
) {
    val info = LocalSheetInfo.current
    val end = when {
        info.hasCloseLabel -> 96.dp
        info.hasCloseButton -> 56.dp
        else -> 24.dp
    }
    Column(
        modifier = modifier.fillMaxWidth().padding(start = 24.dp, top = 24.dp, bottom = 24.dp, end = end),
        verticalArrangement = Arrangement.spacedBy(6.dp),
        content = content,
    )
}

@Composable
fun ColumnScope.SheetFooter(
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit,
) {
    if (LocalSheetInfo.current.fillsHeight) {
        Spacer(Modifier.weight(1f))
    }
    Column(
        modifier = modifier.fillMaxWidth().padding(24.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp),
        content = content,
    )
}

@Composable
fun SheetTitle(text: String, modifier: Modifier = Modifier) {
    OverlayTitle(text, modifier, titleStyle(EsuissTheme.colors))
}

@Composable
fun SheetDescription(text: String, modifier: Modifier = Modifier) {
    BasicText(text, modifier = modifier, style = descriptionStyle(EsuissTheme.colors))
}
