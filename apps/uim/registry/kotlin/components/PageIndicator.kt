package com.esuiss.ui.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.selected
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.esuiss.ui.theme.EsuissTheme

enum class PageIndicatorSize(val dot: Dp, val active: Dp, val gap: Dp) {
    Sm(6.dp, 14.dp, 6.dp),
    Default(8.dp, 20.dp, 8.dp),
}

enum class PageIndicatorVariant { Default, Accent }

@Composable
fun PageIndicator(
    count: Int,
    index: Int,
    modifier: Modifier = Modifier,
    onIndexChange: ((Int) -> Unit)? = null,
    size: PageIndicatorSize = PageIndicatorSize.Default,
    variant: PageIndicatorVariant = PageIndicatorVariant.Default,
    maxVisible: Int = 7,
    accessibilityLabel: String? = null,
) {
    if (count <= 0) return
    val colors = EsuissTheme.colors
    val haptics = rememberHaptics()
    val current = index.coerceIn(0, count - 1)
    val visible = maxVisible.coerceAtLeast(5)
    val start = if (count <= visible) 0 else (current - visible / 2).coerceIn(0, count - visible)
    val end = if (count <= visible) count else start + visible
    val activeColor = if (variant == PageIndicatorVariant.Accent) colors.accent else colors.label
    val summary = "Page ${current + 1} of $count"
    Row(
        modifier = modifier
            .height(24.dp)
            .then(
                if (onIndexChange == null) {
                    Modifier.clearAndSetSemantics {
                        contentDescription = accessibilityLabel ?: summary
                        if (accessibilityLabel != null) stateDescription = summary
                    }
                } else {
                    Modifier.semantics {
                        if (accessibilityLabel != null) contentDescription = accessibilityLabel
                        stateDescription = summary
                    }
                },
            ),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        for (page in start until end) {
            key(page) {
                val position = page - start
                val edge = when {
                    start > 0 && position == 0 -> 0.5f
                    start > 0 && position == 1 -> 0.75f
                    end < count && position == visible - 1 -> 0.5f
                    end < count && position == visible - 2 -> 0.75f
                    else -> 1f
                }
                val active = page == current
                val scale by animateFloatAsState(edge, tween(250), label = "scale")
                val width by animateDpAsState(if (active) size.active else size.dot, tween(300, easing = CarouselEasing), label = "width")
                val color by animateColorAsState(if (active) activeColor else colors.labelQuaternary, tween(300), label = "color")
                Box(
                    modifier = Modifier
                        .height(24.dp)
                        .then(
                            if (onIndexChange != null) {
                                Modifier
                                    .clickable(
                                        interactionSource = remember { MutableInteractionSource() },
                                        indication = null,
                                        role = Role.Button,
                                    ) {
                                        if (page != current) haptics.selection()
                                        onIndexChange(page)
                                    }
                                    .semantics {
                                        contentDescription = "Page ${page + 1}"
                                        selected = active
                                    }
                            } else {
                                Modifier
                            },
                        )
                        .padding(horizontal = size.gap / 2),
                    contentAlignment = Alignment.Center,
                ) {
                    Box(
                        modifier = Modifier
                            .graphicsLayer {
                                scaleX = scale
                                scaleY = scale
                            }
                            .width(width)
                            .height(size.dot)
                            .clip(CircleShape)
                            .background(color, CircleShape),
                    )
                }
            }
        }
    }
}
