package com.esuiss.ui.interactions

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.MutableTransitionState
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.scaleIn
import androidx.compose.animation.scaleOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawing
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalWindowInfo
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.IntRect
import androidx.compose.ui.unit.IntSize
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Popup
import androidx.compose.ui.window.PopupPositionProvider
import androidx.compose.ui.window.PopupProperties
import com.esuiss.ui.components.FormEasing
import com.esuiss.ui.components.LocalContentColor
import com.esuiss.ui.components.LocalContentStyle
import com.esuiss.ui.components.formReducedMotion
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Shadows
import com.esuiss.ui.theme.Typography
import com.esuiss.ui.theme.shadow

private val FloatingBarPadding = 16.dp

private class FloatingBarPosition(
    private val bottomLimit: Int,
    private val padding: Int,
) : PopupPositionProvider {
    override fun calculatePosition(
        anchorBounds: IntRect,
        windowSize: IntSize,
        layoutDirection: LayoutDirection,
        popupContentSize: IntSize,
    ): IntOffset {
        val bottom = minOf(windowSize.height, bottomLimit)
        return IntOffset(
            (windowSize.width - popupContentSize.width) / 2,
            bottom - popupContentSize.height + padding,
        )
    }
}

@Composable
internal fun FloatingBar(
    visible: Boolean,
    maxWidth: Dp,
    contentPadding: PaddingValues,
    horizontalArrangement: Arrangement.Horizontal,
    modifier: Modifier = Modifier,
    content: @Composable RowScope.() -> Unit,
) {
    val transition = remember { MutableTransitionState(false) }
    transition.targetState = visible
    if (!transition.currentState && !transition.targetState) return
    val density = LocalDensity.current
    val colors = EsuissTheme.colors
    val reduced = formReducedMotion()
    val container = LocalWindowInfo.current.containerSize
    val safeBottom = WindowInsets.safeDrawing.getBottom(density)
    val margin = with(density) { FloatingBarPadding.roundToPx() }
    val bottomLimit = if (container.height > 0) container.height - maxOf(margin, safeBottom) else Int.MAX_VALUE
    val available = with(density) { container.width.toDp() } - FloatingBarPadding * 2
    val width = if (container.width > 0 && available < maxWidth) available else maxWidth
    val provider = remember(bottomLimit, margin) { FloatingBarPosition(bottomLimit, margin) }
    val slide = with(density) { FloatingBarPadding.roundToPx() }
    Popup(
        popupPositionProvider = provider,
        properties = PopupProperties(focusable = false, dismissOnBackPress = false, dismissOnClickOutside = false),
    ) {
        Box(modifier = Modifier.padding(FloatingBarPadding)) {
            AnimatedVisibility(
                visibleState = transition,
                enter = if (reduced) {
                    fadeIn(tween(400))
                } else {
                    fadeIn(tween(400, easing = FormEasing)) +
                        scaleIn(tween(400, easing = FormEasing), initialScale = 0.95f) +
                        slideInVertically(tween(400, easing = FormEasing)) { it + slide }
                },
                exit = if (reduced) {
                    fadeOut(tween(300))
                } else {
                    fadeOut(tween(300, easing = FormEasing)) +
                        scaleOut(tween(300, easing = FormEasing), targetScale = 0.95f) +
                        slideOutVertically(tween(300, easing = FormEasing)) { it + slide }
                },
            ) {
                val background = if (colors.isDark) colors.surfaceSecondary.copy(alpha = 0.75f) else colors.surfaceRaised.copy(alpha = 0.8f)
                Row(
                    modifier = modifier
                        .width(width)
                        .height(52.dp)
                        .shadow(Shadows.lg, CircleShape)
                        .clip(CircleShape)
                        .background(background, CircleShape)
                        .border(1.dp, colors.separator, CircleShape)
                        .padding(contentPadding),
                    horizontalArrangement = horizontalArrangement,
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    CompositionLocalProvider(
                        LocalContentStyle provides Typography.sm.copy(color = colors.label),
                        LocalContentColor provides colors.label,
                    ) {
                        content()
                    }
                }
            }
        }
    }
}
