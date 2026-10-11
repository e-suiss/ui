package com.esuiss.ui.interactions

import android.os.Build
import android.view.WindowManager
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.requiredSize
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.SideEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.setValue
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.TransformOrigin
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.layout
import androidx.compose.ui.layout.onGloballyPositioned
import androidx.compose.ui.layout.onPlaced
import androidx.compose.ui.layout.positionInParent
import androidx.compose.ui.layout.positionOnScreen
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.onLongClick
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.IntSize
import androidx.compose.ui.unit.dp
import androidx.compose.ui.util.lerp
import androidx.compose.ui.window.DialogWindowProvider
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.LocalContentColor
import com.esuiss.ui.components.LocalContentStyle
import com.esuiss.ui.components.LocalIconSize
import com.esuiss.ui.components.MenuItemVariant
import com.esuiss.ui.components.ModalWindow
import com.esuiss.ui.components.rememberHaptics
import com.esuiss.ui.components.rememberLongPressModifier
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Shadows
import com.esuiss.ui.theme.Typography
import com.esuiss.ui.theme.shadow
import kotlin.math.max
import kotlin.math.min
import kotlin.math.roundToInt

private val Edge = 16.dp
private val MenuSpace = 260.dp
private val MaxWidth = 360.dp
private val Easing = CubicBezierEasing(0.32f, 0.72f, 0f, 1f)

@Immutable
private class PreviewFrame(val bounds: Rect, val scale: Float, val dx: Float, val dy: Float)

private val LocalPreviewMenuClose = staticCompositionLocalOf<() -> Unit> { {} }

private fun measureFrame(trigger: Rect, window: IntSize, aspectRatio: Float?, edge: Float, menuSpace: Float, maxWidth: Float): PreviewFrame {
    val ratio = if (aspectRatio != null && aspectRatio > 0f) 1f / aspectRatio else trigger.height / max(trigger.width, 1f)
    var width = min(window.width - edge * 2, maxWidth)
    var height = width * ratio
    val maxHeight = window.height - menuSpace - edge * 2
    if (height > maxHeight) {
        height = max(maxHeight, trigger.height)
        width = height / max(ratio, 0.01f)
    }
    val left = (window.width - width) / 2f
    val centered = trigger.center.y - height / 2f
    val top = min(max(centered, edge), max(edge, window.height - menuSpace - height))
    val scale = max(trigger.width / width, trigger.height / height)
    val dx = trigger.center.x - (left + width * scale / 2f)
    val dy = trigger.center.y - (top + height * scale / 2f)
    return PreviewFrame(Rect(left, top, left + width, top + height), scale, dx, dy)
}

@Composable
fun PreviewMenu(
    open: Boolean,
    onOpenChange: (Boolean) -> Unit,
    trigger: @Composable () -> Unit,
    modifier: Modifier = Modifier,
    preview: (@Composable () -> Unit)? = null,
    aspectRatio: Float? = null,
    enabled: Boolean = true,
    content: @Composable ColumnScope.() -> Unit,
) {
    val haptics = rememberHaptics()
    val density = LocalDensity.current
    val change by rememberUpdatedState(onOpenChange)
    var triggerBounds by remember { mutableStateOf(Rect.Zero) }
    var shown by remember { mutableStateOf(open) }
    val progress = remember { Animatable(if (open) 1f else 0f) }
    LaunchedEffect(open) {
        if (open) {
            shown = true
            progress.animateTo(1f, tween(400, easing = Easing))
        } else if (shown) {
            progress.animateTo(0f, tween(300, easing = Easing))
            shown = false
        }
    }
    Box(
        modifier = modifier
            .onGloballyPositioned { coordinates ->
                triggerBounds = Rect(coordinates.positionOnScreen(), Size(coordinates.size.width.toFloat(), coordinates.size.height.toFloat()))
            }
            .then(
                rememberLongPressModifier(enabled && !open) {
                    haptics.perform(HapticFeedbackType.LongPress)
                    change(true)
                },
            )
            .semantics {
                if (enabled) {
                    onLongClick(label = "Open preview menu") {
                        change(true)
                        true
                    }
                }
            }
            .alpha(if (shown) 0f else 1f),
    ) {
        trigger()
    }
    ModalWindow(
        visible = shown,
        onDismissRequest = { change(false) },
        dismissOnBackPress = true,
        paneTitle = null,
    ) {
        val window = (LocalView.current.parent as? DialogWindowProvider)?.window
        SideEffect {
            if (window != null && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                window.addFlags(WindowManager.LayoutParams.FLAG_BLUR_BEHIND)
                val params = window.attributes
                params.blurBehindRadius = with(density) { 24.dp.roundToPx() }
                window.attributes = params
            }
        }
        val colors = EsuissTheme.colors
        var origin by remember { mutableStateOf<Offset?>(null) }
        var windowSize by remember { mutableStateOf(IntSize.Zero) }
        Box(
            modifier = Modifier
                .fillMaxSize()
                .onGloballyPositioned {
                    origin = it.positionOnScreen()
                    windowSize = it.size
                }
                .pointerInput(Unit) { detectTapGestures { change(false) } }
                .drawBehind { drawRect(colors.scrim.copy(alpha = 0.4f * progress.value)) },
        ) {
            val start = origin
            if (start != null && windowSize != IntSize.Zero) {
                val local = triggerBounds.translate(-start)
                val frame = remember(local, windowSize, aspectRatio) {
                    with(density) {
                        measureFrame(local, windowSize, aspectRatio, Edge.toPx(), MenuSpace.toPx(), MaxWidth.toPx())
                    }
                }
                val shape = RoundedCornerShape(Radius.xl2)
                Box(
                    modifier = Modifier
                        .layout { measurable, _ ->
                            val width = frame.bounds.width.roundToInt()
                            val height = frame.bounds.height.roundToInt()
                            val placeable = measurable.measure(androidx.compose.ui.unit.Constraints.fixed(width, height))
                            layout(width, height) { placeable.place(0, 0) }
                        }
                        .graphicsLayer {
                            val p = progress.value
                            val scale = lerp(frame.scale, 1f, p)
                            transformOrigin = TransformOrigin(0f, 0f)
                            scaleX = scale
                            scaleY = scale
                            translationX = frame.bounds.left + lerp(frame.dx, 0f, p)
                            translationY = frame.bounds.top + lerp(frame.dy, 0f, p)
                        }
                        .shadow(Shadows.lg, shape)
                        .clip(shape)
                        .pointerInput(Unit) { detectTapGestures { } },
                    contentAlignment = Alignment.Center,
                ) {
                    if (preview != null) {
                        Box(modifier = Modifier.fillMaxSize()) { preview() }
                    } else {
                        val zoom = max(frame.bounds.width / max(local.width, 1f), frame.bounds.height / max(local.height, 1f))
                        Box(
                            modifier = Modifier
                                .requiredSize(with(density) { local.width.toDp() }, with(density) { local.height.toDp() })
                                .graphicsLayer {
                                    scaleX = zoom
                                    scaleY = zoom
                                },
                        ) {
                            trigger()
                        }
                    }
                }
                val gap = with(density) { 12.dp.toPx() }
                val edge = with(density) { Edge.toPx() }
                CompositionLocalProvider(
                    LocalPreviewMenuClose provides { change(false) },
                    LocalContentStyle provides Typography.base.copy(color = colors.label),
                    LocalContentColor provides colors.label,
                    LocalIconSize provides 20.dp,
                ) {
                    Column(
                        modifier = Modifier
                            .layout { measurable, constraints ->
                                val maxHeight = (windowSize.height - frame.bounds.bottom - gap - edge).roundToInt()
                                val placeable = measurable.measure(
                                    constraints.copy(
                                        minWidth = 0,
                                        minHeight = 0,
                                        maxWidth = (windowSize.width - edge * 2).roundToInt(),
                                        maxHeight = maxHeight.coerceAtLeast(with(density) { 88.dp.roundToPx() }),
                                    ),
                                )
                                layout(constraints.maxWidth, constraints.maxHeight) {
                                    val x = (frame.bounds.center.x - placeable.width / 2f)
                                        .coerceIn(edge, max(edge, windowSize.width - edge - placeable.width))
                                    val y = min(frame.bounds.bottom + gap, windowSize.height - edge - placeable.height)
                                    placeable.place(x.roundToInt(), y.roundToInt())
                                }
                            }
                            .graphicsLayer {
                                val p = progress.value
                                alpha = p
                                val scale = lerp(0.9f, 1f, p)
                                scaleX = scale
                                scaleY = scale
                                transformOrigin = TransformOrigin(0.5f, 0f)
                            }
                            .widthIn(min = 240.dp)
                            .width(IntrinsicSize.Max)
                            .shadow(Shadows.lg, RoundedCornerShape(Radius.xl2))
                            .clip(RoundedCornerShape(Radius.xl2))
                            .background(colors.surfaceRaised)
                            .pointerInput(Unit) { detectTapGestures { } }
                            .verticalScroll(rememberScrollState()),
                        content = content,
                    )
                }
            }
        }
    }
}

@Composable
fun PreviewMenuItem(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: MenuItemVariant = MenuItemVariant.Default,
    enabled: Boolean = true,
    content: @Composable RowScope.() -> Unit,
) {
    val colors = EsuissTheme.colors
    val close = LocalPreviewMenuClose.current
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    var first by remember { mutableStateOf(false) }
    val foreground = when {
        !enabled -> colors.labelQuaternary
        variant == MenuItemVariant.Destructive -> colors.danger
        else -> colors.label
    }
    val separator = colors.separator
    CompositionLocalProvider(
        LocalContentStyle provides Typography.base.copy(color = foreground),
        LocalContentColor provides foreground,
        LocalIconSize provides 20.dp,
    ) {
        Row(
            modifier = modifier
                .fillMaxWidth()
                .heightIn(min = 44.dp)
                .onPlaced { first = it.positionInParent().y == 0f }
                .background(if (pressed && enabled) colors.itemPressed else Color.Transparent)
                .drawBehind {
                    if (!first) drawRect(separator, Offset.Zero, Size(size.width, 1.dp.toPx()))
                }
                .clickable(interactionSource = interaction, indication = null, enabled = enabled, role = Role.Button) {
                    onClick()
                    close()
                }
                .padding(horizontal = 16.dp, vertical = 11.dp),
            horizontalArrangement = Arrangement.spacedBy(24.dp),
            verticalAlignment = Alignment.CenterVertically,
            content = content,
        )
    }
}

@Composable
fun PreviewMenuItem(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    icon: ImageVector? = null,
    variant: MenuItemVariant = MenuItemVariant.Default,
    enabled: Boolean = true,
) {
    PreviewMenuItem(onClick, modifier, variant, enabled) {
        BasicText(text, modifier = Modifier.weight(1f), style = LocalContentStyle.current, maxLines = 1)
        if (icon != null) Icon(icon, contentDescription = null)
    }
}

@Composable
fun PreviewMenuSeparator(modifier: Modifier = Modifier) {
    Box(
        modifier = modifier
            .fillMaxWidth()
            .height(8.dp)
            .background(EsuissTheme.colors.separator.copy(alpha = EsuissTheme.colors.separator.alpha * 0.4f)),
    )
}
