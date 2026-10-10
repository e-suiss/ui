package com.esuiss.ui.components

import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.semantics.ProgressBarRangeInfo
import androidx.compose.ui.semantics.progressBarRangeInfo
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography
import kotlin.math.roundToInt

@Composable
fun Progress(
    value: Float?,
    modifier: Modifier = Modifier,
    max: Float = 100f,
    label: String? = null,
    showValue: Boolean = false,
) {
    val colors = EsuissTheme.colors
    val fraction = if (value == null || max <= 0f) 0f else (value / max).coerceIn(0f, 1f)
    val animated by animateFloatAsState(
        targetValue = fraction,
        animationSpec = spring(dampingRatio = Spring.DampingRatioNoBouncy, stiffness = 100f),
        label = "progress",
    )
    Column(
        modifier = modifier
            .fillMaxWidth()
            .semantics(mergeDescendants = true) {
                progressBarRangeInfo = if (value == null) {
                    ProgressBarRangeInfo.Indeterminate
                } else {
                    ProgressBarRangeInfo(value.coerceIn(0f, max), 0f..max)
                }
            },
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        if (label != null || showValue) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                if (label != null) {
                    BasicText(label, style = Typography.sm.copy(color = colors.label))
                }
                Spacer(Modifier.weight(1f))
                if (showValue && value != null) {
                    BasicText(
                        "${(fraction * 100).roundToInt()}%",
                        style = Typography.sm.copy(color = colors.labelSecondary, fontFeatureSettings = "tnum"),
                    )
                }
            }
        }
        Box(
            Modifier
                .fillMaxWidth()
                .height(4.dp)
                .clip(CircleShape)
                .background(colors.surfaceSecondary),
        ) {
            Box(
                Modifier
                    .fillMaxHeight()
                    .fillMaxWidth(animated)
                    .background(colors.accent),
            )
        }
    }
}
