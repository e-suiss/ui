package com.esuiss.ui.components

import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.semantics.clearAndSetSemantics
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius

@Composable
fun Skeleton(
    modifier: Modifier = Modifier,
    shape: Shape = RoundedCornerShape(Radius.md),
) {
    val reduced = formReducedMotion()
    val transition = rememberInfiniteTransition(label = "skeleton")
    val pulse by transition.animateFloat(
        initialValue = 1f,
        targetValue = 0.5f,
        animationSpec = infiniteRepeatable(tween(1000, easing = LinearEasing), RepeatMode.Reverse),
        label = "skeleton",
    )
    Box(
        modifier
            .clearAndSetSemantics {}
            .graphicsLayer { alpha = if (reduced) 1f else pulse }
            .background(EsuissTheme.colors.muted, shape),
    )
}
