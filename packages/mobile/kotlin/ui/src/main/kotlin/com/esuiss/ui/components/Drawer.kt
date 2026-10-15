package com.esuiss.ui.components

import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.AnchoredDraggableDefaults
import androidx.compose.foundation.gestures.AnchoredDraggableState
import androidx.compose.foundation.gestures.DraggableAnchors
import androidx.compose.foundation.gestures.Orientation
import androidx.compose.foundation.gestures.anchoredDraggable
import androidx.compose.foundation.gestures.animateTo
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.WindowInsetsSides
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.only
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawing
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.setValue
import androidx.compose.runtime.snapshotFlow
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.RectangleShape
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.onSizeChanged
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.paneTitle
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Palette
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Shadows
import com.esuiss.ui.theme.Typography
import com.esuiss.ui.theme.shadow
import kotlin.math.roundToInt
import kotlinx.coroutines.flow.drop

private const val Hidden = -1

private val DrawerEasing = CubicBezierEasing(0.32f, 0.72f, 0f, 1f)

@Immutable
private data class DrawerInfo(
    val hasCloseButton: Boolean,
    val hasCloseLabel: Boolean,
    val fillsHeight: Boolean,
)

private val LocalDrawerInfo = staticCompositionLocalOf { DrawerInfo(false, false, false) }

internal val LocalDrawerSquareTop = staticCompositionLocalOf { false }

@Composable
fun Drawer(
    open: Boolean,
    onOpenChange: (Boolean) -> Unit,
    modifier: Modifier = Modifier,
    snapPoints: List<Float> = emptyList(),
    onSnapPointChange: (Float) -> Unit = {},
    floating: Boolean = false,
    showSwipeHandle: Boolean = false,
    showCloseButton: Boolean = false,
    closeLabel: String? = null,
    content: @Composable ColumnScope.() -> Unit,
) {
    val squareTop = LocalDrawerSquareTop.current
    var visible by remember { mutableStateOf(false) }
    if (open && !visible) visible = true
    val state = remember { AnchoredDraggableState(initialValue = Hidden) }
    var sheetHeight by remember { mutableIntStateOf(0) }
    val paneTitle = remember { PaneTitleState() }
    val spec = tween<Float>(450, easing = DrawerEasing)
    val currentOpen by rememberUpdatedState(open)
    val currentOnOpenChange by rememberUpdatedState(onOpenChange)
    val currentOnSnapPointChange by rememberUpdatedState(onSnapPointChange)
    val currentSnapPoints by rememberUpdatedState(snapPoints)
    val close = { if (open) onOpenChange(false) }

    LaunchedEffect(open, sheetHeight) {
        if (sheetHeight == 0) {
            if (!open) visible = false
            return@LaunchedEffect
        }
        if (open) {
            if (state.targetValue == Hidden) state.animateTo(0, spec)
        } else {
            state.animateTo(Hidden, tween(300, easing = DrawerEasing))
            visible = false
            sheetHeight = 0
        }
    }

    LaunchedEffect(state) {
        snapshotFlow { state.settledValue }.drop(1).collect { value ->
            if (value == Hidden) {
                if (currentOpen) currentOnOpenChange(false)
            } else {
                currentSnapPoints.getOrNull(value)?.let { currentOnSnapPointChange(it) }
            }
        }
    }

    val colors = EsuissTheme.colors
    val density = LocalDensity.current
    ModalWindow(
        visible = visible,
        onDismissRequest = close,
        dismissOnBackPress = true,
        paneTitle = paneTitle.value,
    ) {
        BoxWithConstraints(modifier = Modifier.fillMaxSize()) {
            val windowHeight = constraints.maxHeight
            val topInset = WindowInsets.safeDrawing.getTop(density)
            val maxSheetHeight = windowHeight - maxOf(with(density) { 96.dp.roundToPx() }, topInset + with(density) { 24.dp.roundToPx() })
            val fixedHeight = if (snapPoints.isNotEmpty()) {
                minOf(maxSheetHeight, (snapPoints.max() * windowHeight).roundToInt())
            } else {
                null
            }
            val rawOffset = state.offset
            val offset = if (rawOffset.isNaN()) sheetHeight.toFloat() else rawOffset
            val lowestOpen = if (snapPoints.isEmpty()) {
                0f
            } else {
                sheetHeight - minOf(sheetHeight.toFloat(), snapPoints.min() * windowHeight)
            }
            val scrimAlpha = if (sheetHeight == 0) {
                0f
            } else {
                ((sheetHeight - offset) / (sheetHeight - lowestOpen).coerceAtLeast(1f)).coerceIn(0f, 1f)
            }

            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .graphicsLayer { alpha = scrimAlpha }
                    .background(Palette.black.copy(alpha = 0.5f))
                    .pointerInput(Unit) { detectTapGestures { close() } },
            )

            val shape = when {
                floating -> RoundedCornerShape(Radius.xl3)
                squareTop -> RectangleShape
                else -> RoundedCornerShape(topStart = Radius.xl3, topEnd = Radius.xl3)
            }
            Box(
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .fillMaxWidth()
                    .then(
                        if (floating) {
                            Modifier
                                .windowInsetsPadding(WindowInsets.safeDrawing.only(WindowInsetsSides.Bottom + WindowInsetsSides.Horizontal))
                                .padding(8.dp)
                        } else {
                            Modifier
                        },
                    )
                    .offset { IntOffset(0, offset.roundToInt()) }
                    .graphicsLayer { alpha = if (rawOffset.isNaN()) 0f else 1f }
                    .then(
                        if (fixedHeight != null) {
                            Modifier.height(with(density) { fixedHeight.toDp() })
                        } else {
                            Modifier.heightIn(max = with(density) { maxSheetHeight.toDp() })
                        },
                    )
                    .onSizeChanged { size ->
                        val height = size.height
                        val anchors = DraggableAnchors {
                            Hidden at height.toFloat()
                            if (snapPoints.isEmpty()) {
                                0 at 0f
                            } else {
                                snapPoints.forEachIndexed { index, point ->
                                    index at height - minOf(height.toFloat(), point * windowHeight)
                                }
                            }
                        }
                        state.updateAnchors(anchors, state.targetValue)
                        sheetHeight = height
                    }
                    .anchoredDraggable(
                        state = state,
                        orientation = Orientation.Vertical,
                        flingBehavior = AnchoredDraggableDefaults.flingBehavior(
                            state = state,
                            positionalThreshold = { it * 0.5f },
                            animationSpec = spec,
                        ),
                    )
                    .then(modifier)
                    .shadow(Shadows.lg, shape)
                    .clip(shape)
                    .background(colors.popover, shape)
                    .pointerInput(Unit) {}
                    .semantics { paneTitle.value?.let { this.paneTitle = it } },
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .then(if (floating) Modifier else Modifier.windowInsetsPadding(WindowInsets.safeDrawing.only(WindowInsetsSides.Bottom))),
                ) {
                    if (showSwipeHandle) DrawerHandle()
                    CompositionLocalProvider(
                        LocalDrawerSquareTop provides false,
                        LocalPaneTitle provides paneTitle,
                        LocalDrawerInfo provides DrawerInfo(showCloseButton, showCloseButton && closeLabel != null, fixedHeight != null),
                        LocalContentStyle provides Typography.base.copy(color = colors.foreground),
                        LocalContentColor provides colors.foreground,
                    ) {
                        Column(
                            modifier = Modifier.fillMaxWidth().then(if (fixedHeight != null) Modifier.weight(1f) else Modifier),
                            content = content,
                        )
                    }
                }
                if (showCloseButton) {
                    OverlayCloseButton(
                        onClick = close,
                        label = closeLabel,
                        modifier = Modifier
                            .align(Alignment.TopEnd)
                            .padding(
                                top = (if (showSwipeHandle) 23.dp else 11.dp) - (if (closeLabel != null) 0.dp else 6.dp),
                                end = if (closeLabel != null) 16.dp else 10.dp,
                            ),
                    )
                }
            }
        }
    }
}

@Composable
private fun DrawerHandle() {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(12.dp)
            .clearAndSetSemantics {},
        contentAlignment = Alignment.BottomCenter,
    ) {
        Box(
            modifier = Modifier
                .size(width = 36.dp, height = 5.dp)
                .background(EsuissTheme.colors.border, CircleShape),
        )
    }
}

@Composable
fun DrawerHeader(
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit,
) {
    val info = LocalDrawerInfo.current
    val horizontal = when {
        info.hasCloseLabel -> 96.dp
        info.hasCloseButton -> 56.dp
        else -> 16.dp
    }
    Column(
        modifier = modifier.fillMaxWidth().padding(start = horizontal, end = horizontal, top = 16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(2.dp),
        content = content,
    )
}

@Composable
fun ColumnScope.DrawerFooter(
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit,
) {
    if (LocalDrawerInfo.current.fillsHeight) {
        Spacer(Modifier.weight(1f))
    }
    Column(
        modifier = modifier.fillMaxWidth().padding(start = 16.dp, end = 16.dp, bottom = 16.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp),
        content = content,
    )
}

@Composable
fun DrawerTitle(text: String, modifier: Modifier = Modifier) {
    OverlayTitle(text, modifier, titleStyle(EsuissTheme.colors, centered = true))
}

@Composable
fun DrawerDescription(text: String, modifier: Modifier = Modifier) {
    BasicText(text, modifier = modifier, style = descriptionStyle(EsuissTheme.colors, centered = true))
}
