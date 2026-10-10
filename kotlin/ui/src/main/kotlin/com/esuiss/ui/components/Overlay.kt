package com.esuiss.ui.components

import android.os.Build
import android.view.Window
import android.view.WindowManager
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.MutableTransitionState
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.scaleIn
import androidx.compose.animation.scaleOut
import androidx.compose.animation.slideIn
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.awaitEachGesture
import androidx.compose.foundation.gestures.awaitFirstDown
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.ime
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.runtime.Stable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.setValue
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.graphics.TransformOrigin
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.input.pointer.PointerEventPass
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.platform.LocalWindowInfo
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.IntRect
import androidx.compose.ui.unit.IntSize
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog as WindowDialog
import androidx.compose.ui.window.DialogProperties
import androidx.compose.ui.window.DialogWindowProvider
import androidx.compose.ui.window.Popup
import androidx.compose.ui.window.PopupPositionProvider
import androidx.compose.ui.window.PopupProperties
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.X
import com.esuiss.ui.theme.Colors
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Shadow
import com.esuiss.ui.theme.Shadows
import com.esuiss.ui.theme.Typography
import com.esuiss.ui.theme.shadow
import kotlin.math.max
import kotlin.math.min

enum class PopupSide { Top, Bottom, Left, Right }

enum class PopupAlign { Start, Center, End }

internal val PopupInset = 16.dp

internal val PopupMargin = 8.dp

@Stable
internal class PopupPlacement(side: PopupSide) {
    var side by mutableStateOf(side)
    var anchorCenter by mutableIntStateOf(0)
    var anchorWidth by mutableIntStateOf(0)
}

internal class AnchoredPositionProvider(
    private val side: PopupSide,
    private val align: PopupAlign,
    private val sideOffset: Int,
    private val alignOffset: Int,
    private val inset: Int,
    private val margin: Int,
    private val bottomLimit: Int,
    private val point: IntOffset?,
    private val placement: PopupPlacement,
) : PopupPositionProvider {
    override fun calculatePosition(
        anchorBounds: IntRect,
        windowSize: IntSize,
        layoutDirection: LayoutDirection,
        popupContentSize: IntSize,
    ): IntOffset {
        val anchor = if (point != null) {
            val x = anchorBounds.left + point.x
            val y = anchorBounds.top + point.y
            IntRect(x, y, x, y)
        } else {
            anchorBounds
        }
        val width = (popupContentSize.width - inset * 2).coerceAtLeast(0)
        val height = (popupContentSize.height - inset * 2).coerceAtLeast(0)
        val left = margin
        val top = margin
        val right = windowSize.width - margin
        val bottom = min(windowSize.height, bottomLimit) - margin

        fun space(candidate: PopupSide): Int = when (candidate) {
            PopupSide.Bottom -> bottom - anchor.bottom - sideOffset
            PopupSide.Top -> anchor.top - sideOffset - top
            PopupSide.Right -> right - anchor.right - sideOffset
            PopupSide.Left -> anchor.left - sideOffset - left
        }

        val opposite = when (side) {
            PopupSide.Bottom -> PopupSide.Top
            PopupSide.Top -> PopupSide.Bottom
            PopupSide.Left -> PopupSide.Right
            PopupSide.Right -> PopupSide.Left
        }
        val vertical = side == PopupSide.Top || side == PopupSide.Bottom
        val needed = if (vertical) height else width
        val resolved = if (space(side) >= needed || space(side) >= space(opposite)) side else opposite
        val rtl = layoutDirection == LayoutDirection.Rtl

        var x: Int
        var y: Int
        if (vertical) {
            x = when (align) {
                PopupAlign.Start -> if (rtl) anchor.right - width else anchor.left
                PopupAlign.Center -> anchor.left + (anchor.width - width) / 2
                PopupAlign.End -> if (rtl) anchor.left else anchor.right - width
            } + if (rtl) -alignOffset else alignOffset
            y = if (resolved == PopupSide.Bottom) anchor.bottom + sideOffset else anchor.top - sideOffset - height
        } else {
            y = when (align) {
                PopupAlign.Start -> anchor.top
                PopupAlign.Center -> anchor.top + (anchor.height - height) / 2
                PopupAlign.End -> anchor.bottom - height
            } + alignOffset
            x = if (resolved == PopupSide.Right) anchor.right + sideOffset else anchor.left - sideOffset - width
        }
        x = x.coerceIn(left, max(left, right - width))
        y = y.coerceIn(top, max(top, bottom - height))
        placement.side = resolved
        placement.anchorCenter = if (vertical) anchor.center.x - x else anchor.center.y - y
        placement.anchorWidth = anchorBounds.width
        return IntOffset(x - inset, y - inset)
    }
}

private fun transformOrigin(side: PopupSide): TransformOrigin = when (side) {
    PopupSide.Bottom -> TransformOrigin(0.5f, 0f)
    PopupSide.Top -> TransformOrigin(0.5f, 1f)
    PopupSide.Left -> TransformOrigin(1f, 0.5f)
    PopupSide.Right -> TransformOrigin(0f, 0.5f)
}

@Composable
internal fun AnchoredPopup(
    expanded: Boolean,
    onDismissRequest: () -> Unit,
    side: PopupSide = PopupSide.Bottom,
    align: PopupAlign = PopupAlign.Center,
    sideOffset: Dp = 4.dp,
    alignOffset: Dp = 0.dp,
    focusable: Boolean = true,
    touchable: Boolean = true,
    dismissOnClickOutside: Boolean = true,
    point: IntOffset? = null,
    enterMillis: Int = 150,
    exitMillis: Int = 100,
    content: @Composable (PopupPlacement) -> Unit,
) {
    val transition = remember { MutableTransitionState(false) }
    transition.targetState = expanded
    if (!transition.currentState && !transition.targetState) return

    val density = LocalDensity.current
    val imeBottom = WindowInsets.ime.getBottom(density)
    val containerHeight = LocalWindowInfo.current.containerSize.height
    val bottomLimit = if (containerHeight > 0) containerHeight - imeBottom else Int.MAX_VALUE
    val placement = remember { PopupPlacement(side) }
    val provider = remember(side, align, sideOffset, alignOffset, point, bottomLimit, density) {
        with(density) {
            AnchoredPositionProvider(
                side = side,
                align = align,
                sideOffset = sideOffset.roundToPx(),
                alignOffset = alignOffset.roundToPx(),
                inset = PopupInset.roundToPx(),
                margin = PopupMargin.roundToPx(),
                bottomLimit = bottomLimit,
                point = point,
                placement = placement,
            )
        }
    }
    val currentExpanded by rememberUpdatedState(expanded)
    val dismiss by rememberUpdatedState(onDismissRequest)
    val properties = if (touchable) {
        PopupProperties(
            focusable = focusable,
            dismissOnBackPress = true,
            dismissOnClickOutside = dismissOnClickOutside,
        )
    } else {
        PopupProperties(
            flags = WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE,
            dismissOnBackPress = false,
            dismissOnClickOutside = false,
        )
    }
    val slide = with(density) { 8.dp.roundToPx() }
    val origin = transformOrigin(side)
    Popup(
        popupPositionProvider = provider,
        onDismissRequest = { if (currentExpanded) dismiss() },
        properties = properties,
    ) {
        Box(
            modifier = Modifier
                .pointerInput(Unit) {
                    val insetPx = PopupInset.toPx()
                    detectTapGestures { position ->
                        val inside = position.x >= insetPx && position.y >= insetPx &&
                            position.x <= size.width - insetPx && position.y <= size.height - insetPx
                        if (!inside && currentExpanded) dismiss()
                    }
                }
                .padding(PopupInset),
        ) {
            AnimatedVisibility(
                visibleState = transition,
                enter = fadeIn(tween(enterMillis)) +
                    scaleIn(tween(enterMillis), initialScale = 0.95f, transformOrigin = origin) +
                    slideIn(tween(enterMillis)) {
                        when (side) {
                            PopupSide.Bottom -> IntOffset(0, -slide)
                            PopupSide.Top -> IntOffset(0, slide)
                            PopupSide.Left -> IntOffset(slide, 0)
                            PopupSide.Right -> IntOffset(-slide, 0)
                        }
                    },
                exit = fadeOut(tween(exitMillis)) +
                    scaleOut(tween(exitMillis), targetScale = 0.95f, transformOrigin = origin),
            ) {
                content(placement)
            }
        }
    }
}

@Composable
internal fun ModalWindow(
    visible: Boolean,
    onDismissRequest: () -> Unit,
    dismissOnBackPress: Boolean,
    paneTitle: String?,
    content: @Composable () -> Unit,
) {
    if (!visible) return
    WindowDialog(
        onDismissRequest = onDismissRequest,
        properties = DialogProperties(
            dismissOnBackPress = dismissOnBackPress,
            dismissOnClickOutside = false,
            usePlatformDefaultWidth = false,
            decorFitsSystemWindows = false,
            windowTitle = paneTitle.orEmpty(),
        ),
    ) {
        val window = (LocalView.current.parent as? DialogWindowProvider)?.window
        SideEffect {
            window?.apply {
                setDimAmount(0f)
                clearFlags(WindowManager.LayoutParams.FLAG_DIM_BEHIND)
                setLayout(WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.MATCH_PARENT)
                val params = attributes
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                    params.fitInsetsTypes = 0
                    params.fitInsetsSides = 0
                    params.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_ALWAYS
                } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                    params.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES
                }
                attributes = params
                addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS)
                clearSystemBarColors()
            }
        }
        content()
    }
}

@Suppress("DEPRECATION")
private fun Window.clearSystemBarColors() {
    statusBarColor = android.graphics.Color.TRANSPARENT
    navigationBarColor = android.graphics.Color.TRANSPARENT
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
        isStatusBarContrastEnforced = false
        isNavigationBarContrastEnforced = false
    }
}

@Composable
internal fun Scrim(
    transition: MutableTransitionState<Boolean>,
    enterMillis: Int,
    exitMillis: Int,
    onClick: (() -> Unit)?,
) {
    val color = EsuissTheme.colors.scrim
    val click by rememberUpdatedState(onClick)
    AnimatedVisibility(
        visibleState = transition,
        enter = fadeIn(tween(enterMillis)),
        exit = fadeOut(tween(exitMillis)),
    ) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(color)
                .pointerInput(Unit) { detectTapGestures { click?.invoke() } },
        )
    }
}

@Stable
internal class PaneTitleState {
    var value by mutableStateOf<String?>(null)
}

internal val LocalPaneTitle = staticCompositionLocalOf<PaneTitleState?> { null }

@Composable
internal fun RegisterPaneTitle(text: String) {
    val state = LocalPaneTitle.current
    SideEffect { state?.value = text }
}

internal fun Modifier.raisedSurface(colors: Colors, shape: Shape, shadow: Shadow = Shadows.lg): Modifier =
    this
        .shadow(shadow, shape)
        .clip(shape)
        .background(colors.surfaceRaised, shape)
        .border(1.dp, colors.label.copy(alpha = if (colors.isDark) 0.1f else 0.05f), shape)

internal fun titleStyle(colors: Colors, style: TextStyle = Typography.base, centered: Boolean = false): TextStyle =
    style.copy(
        color = colors.label,
        fontWeight = FontWeight.SemiBold,
        textAlign = if (centered) TextAlign.Center else TextAlign.Unspecified,
    )

internal fun descriptionStyle(colors: Colors, centered: Boolean = false): TextStyle =
    Typography.sm.copy(
        color = colors.labelSecondary,
        textAlign = if (centered) TextAlign.Center else TextAlign.Unspecified,
    )

@Composable
internal fun OverlayTitle(text: String, modifier: Modifier, style: TextStyle) {
    RegisterPaneTitle(text)
    BasicText(text, modifier = modifier.semantics { heading() }, style = style)
}

@Composable
internal fun OverlayCloseButton(
    onClick: () -> Unit,
    label: String?,
    modifier: Modifier = Modifier,
) {
    val colors = EsuissTheme.colors
    if (label != null) {
        Button(onClick = onClick, modifier = modifier, variant = ButtonVariant.Plain, size = ButtonSize.Sm) {
            BasicText(label, style = Typography.base.copy(color = LocalContentColor.current), maxLines = 1)
        }
        return
    }
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    Box(
        modifier = modifier
            .size(44.dp)
            .clip(CircleShape)
            .clickable(interactionSource = interaction, indication = null, role = Role.Button, onClick = onClick)
            .semantics { contentDescription = "Close" },
        contentAlignment = Alignment.Center,
    ) {
        Box(
            modifier = Modifier
                .size(32.dp)
                .background(if (pressed) colors.separator else colors.surfaceTertiary, CircleShape),
            contentAlignment = Alignment.Center,
        ) {
            Icon(PhosphorIcons.Regular.X, contentDescription = null, size = 16.dp, tint = colors.label)
        }
    }
}

@Composable
internal fun rememberLongPressModifier(enabled: Boolean, onLongPress: (Offset) -> Unit): Modifier {
    val callback by rememberUpdatedState(onLongPress)
    if (!enabled) return Modifier
    return Modifier.pointerInput(Unit) {
        awaitEachGesture {
            val down = awaitFirstDown(requireUnconsumed = false, pass = PointerEventPass.Initial)
            val released = withTimeoutOrNull(viewConfiguration.longPressTimeoutMillis) {
                while (true) {
                    val event = awaitPointerEvent(PointerEventPass.Initial)
                    val change = event.changes.firstOrNull { it.id == down.id }
                    if (change == null || !change.pressed) break
                    if ((change.position - down.position).getDistance() > viewConfiguration.touchSlop) break
                }
                true
            }
            if (released == null) {
                callback(down.position)
                while (true) {
                    val event = awaitPointerEvent(PointerEventPass.Initial)
                    event.changes.forEach { it.consume() }
                    if (event.changes.none { it.pressed }) break
                }
            }
        }
    }
}
