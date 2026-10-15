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
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawing
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.SideEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.setValue
import androidx.compose.runtime.snapshotFlow
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.draw.drawWithContent
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.TransformOrigin
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.Layout
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
import androidx.compose.ui.unit.Constraints
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
import com.esuiss.ui.theme.Palette
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Shadows
import com.esuiss.ui.theme.Typography
import com.esuiss.ui.theme.shadow
import kotlin.math.max
import kotlin.math.min
import kotlin.math.roundToInt
import kotlinx.coroutines.flow.first

private val Edge = 16.dp
private val Gap = 12.dp
private val MenuSpace = 260.dp
private val MenuMinHeight = 88.dp
private val MaxWidth = 360.dp
private val Blur = 24.dp
private val Easing = CubicBezierEasing(0.32f, 0.72f, 0f, 1f)

private val LocalPreviewMenuClose = staticCompositionLocalOf<() -> Unit> { {} }

private class PreviewMenuGeometry {
    var tile = Size.Zero
    var frame = Rect.Zero
}

internal fun previewMenuSize(trigger: Size, aspectRatio: Float?, maxWidth: Float, maxHeight: Float): Size {
    val ratio = if (aspectRatio != null && aspectRatio > 0f) 1f / aspectRatio else trigger.height / max(trigger.width, 1f)
    var width = maxWidth
    var height = width * ratio
    if (height > maxHeight) {
        height = max(maxHeight, trigger.height)
        width = height / max(ratio, 0.01f)
    }
    return Size(width, height)
}

internal fun previewMenuGroupTop(top: Float, bottom: Float, preview: Float, gap: Float, menu: Float): Float =
    top + max(0f, (bottom - top - preview - gap - menu) / 2f)

private fun lerpRect(from: Rect, to: Rect, amount: Float) = Rect(
    lerp(from.left, to.left, amount),
    lerp(from.top, to.top, amount),
    lerp(from.right, to.right, amount),
    lerp(from.bottom, to.bottom, amount),
)

private fun Modifier.coverLayer(size: () -> Size, alpha: () -> Float) = layout { measurable, constraints ->
    val content = size()
    val width = content.width.roundToInt().coerceAtLeast(1)
    val height = content.height.roundToInt().coerceAtLeast(1)
    val placeable = measurable.measure(Constraints.fixed(width, height))
    layout(constraints.maxWidth, constraints.maxHeight) {
        placeable.placeWithLayer((constraints.maxWidth - width) / 2, (constraints.maxHeight - height) / 2) {
            val zoom = max(constraints.maxWidth / width.toFloat(), constraints.maxHeight / height.toFloat())
            scaleX = zoom
            scaleY = zoom
            this.alpha = alpha()
        }
    }
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
    val opening by rememberUpdatedState(open)
    val safeTop = WindowInsets.safeDrawing.getTop(density)
    val safeBottom = WindowInsets.safeDrawing.getBottom(density)
    var triggerBounds by remember { mutableStateOf(Rect.Zero) }
    var shown by remember { mutableStateOf(open) }
    var drawn by remember { mutableStateOf(false) }
    val progress = remember { Animatable(if (open) 1f else 0f) }
    LaunchedEffect(open) {
        if (open) {
            shown = true
            snapshotFlow { drawn }.first { it }
            progress.animateTo(1f, tween(400, easing = Easing))
        } else if (shown) {
            progress.animateTo(0f, tween(300, easing = Easing))
            shown = false
            drawn = false
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
            .alpha(if (drawn) 0f else 1f),
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
            window?.setWindowAnimations(0)
        }
        LaunchedEffect(window) {
            if (window != null && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                window.addFlags(WindowManager.LayoutParams.FLAG_BLUR_BEHIND)
                val blur = with(density) { Blur.toPx() }
                snapshotFlow { (blur * progress.value).roundToInt() }.collect { radius ->
                    val params = window.attributes
                    params.blurBehindRadius = radius
                    window.attributes = params
                }
            }
        }
        val colors = EsuissTheme.colors
        val geometry = remember { PreviewMenuGeometry() }
        val shape = RoundedCornerShape(Radius.xl2)
        Layout(
            contents = listOf(
                {
                    Box(
                        modifier = Modifier
                            .shadow(Shadows.lg, shape)
                            .clip(shape)
                            .pointerInput(Unit) { detectTapGestures { } }
                            .drawWithContent {
                                drawContent()
                                if (!drawn && opening) drawn = true
                            },
                    ) {
                        Box(
                            modifier = Modifier.coverLayer({ geometry.tile }) {
                                if (preview == null) 1f else (1f - progress.value * 2f).coerceIn(0f, 1f)
                            },
                        ) {
                            trigger()
                        }
                        if (preview != null) {
                            Box(modifier = Modifier.coverLayer({ geometry.frame.size }) { (progress.value * 2f).coerceIn(0f, 1f) }) {
                                preview()
                            }
                        }
                    }
                },
                {
                    CompositionLocalProvider(
                        LocalPreviewMenuClose provides { change(false) },
                        LocalContentStyle provides Typography.base.copy(color = colors.foreground),
                        LocalContentColor provides colors.foreground,
                        LocalIconSize provides 20.dp,
                    ) {
                        Column(
                            modifier = Modifier
                                .widthIn(min = 240.dp)
                                .width(IntrinsicSize.Max)
                                .shadow(Shadows.lg, shape)
                                .clip(shape)
                                .background(colors.popover)
                                .pointerInput(Unit) { detectTapGestures { } }
                                .verticalScroll(rememberScrollState()),
                            content = content,
                        )
                    }
                },
            ),
            modifier = Modifier
                .fillMaxSize()
                .pointerInput(Unit) { detectTapGestures { change(false) } }
                .drawBehind { drawRect(Palette.black.copy(alpha = 0.4f * progress.value)) },
        ) { (previewMeasurables, menuMeasurables), constraints ->
            val width = constraints.maxWidth.toFloat()
            val height = constraints.maxHeight.toFloat()
            val edge = Edge.toPx()
            val gap = Gap.toPx()
            val top = safeTop + edge
            val bottom = height - safeBottom - edge
            val tile = Size(max(triggerBounds.width, 1f), max(triggerBounds.height, 1f))
            val maxWidth = min(width - edge * 2, MaxWidth.toPx())
            val base = previewMenuSize(tile, aspectRatio, maxWidth, bottom - top - MenuSpace.toPx())
            val menu = menuMeasurables.first().measure(
                Constraints(
                    maxWidth = (width - edge * 2).roundToInt().coerceAtLeast(0),
                    maxHeight = max(bottom - top - base.height - gap, MenuMinHeight.toPx()).roundToInt(),
                ),
            )
            val size = previewMenuSize(tile, aspectRatio, maxWidth, bottom - top - menu.height - gap)
            val groupTop = previewMenuGroupTop(top, bottom, size.height, gap, menu.height.toFloat())
            val frame = Rect(Offset((width - size.width) / 2f, groupTop), size)
            geometry.tile = tile
            geometry.frame = frame
            val p = progress.value
            val previewWidth = lerp(tile.width, frame.width, p).roundToInt().coerceAtLeast(1)
            val previewHeight = lerp(tile.height, frame.height, p).roundToInt().coerceAtLeast(1)
            val previewPlaceable = previewMeasurables.first().measure(Constraints.fixed(previewWidth, previewHeight))
            val menuX = (frame.center.x - menu.width / 2f).coerceIn(edge, max(edge, width - edge - menu.width))
            val menuY = min(frame.bottom + gap, bottom - menu.height)
            layout(constraints.maxWidth, constraints.maxHeight) {
                val origin = coordinates?.positionOnScreen() ?: Offset.Zero
                val source = triggerBounds.translate(-origin)
                val current = lerpRect(source, frame, p)
                previewPlaceable.place(current.left.roundToInt(), current.top.roundToInt())
                val anchorX = frame.center.x
                val anchorY = frame.bottom + gap
                menu.placeWithLayer(menuX.roundToInt(), menuY.roundToInt()) {
                    val amount = progress.value
                    val moving = lerpRect(source, frame, amount)
                    translationX = moving.center.x - anchorX
                    translationY = moving.bottom + gap * amount - anchorY
                    val scale = lerp(0.4f, 1f, amount)
                    scaleX = scale
                    scaleY = scale
                    alpha = amount
                    transformOrigin = TransformOrigin(
                        ((anchorX - menuX) / max(menu.width, 1)).coerceIn(0f, 1f),
                        ((anchorY - menuY) / max(menu.height, 1)).coerceIn(0f, 1f),
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
    val foreground = if (variant == MenuItemVariant.Destructive) colors.destructive else colors.foreground
    val separator = colors.border
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
                .alpha(
                    when {
                        !enabled -> 0.5f
                        pressed -> 0.8f
                        else -> 1f
                    },
                )
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
            .background(EsuissTheme.colors.border.copy(alpha = EsuissTheme.colors.border.alpha * 0.4f)),
    )
}
