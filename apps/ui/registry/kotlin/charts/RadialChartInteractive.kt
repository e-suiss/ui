package com.esuiss.ui.charts

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.selection.selectableGroup
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.lerp
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.esuiss.ui.components.Card
import com.esuiss.ui.components.CardContent
import com.esuiss.ui.components.CardSize
import com.esuiss.ui.components.CardVariant
import com.esuiss.ui.components.formReducedMotion
import com.esuiss.ui.components.rememberHaptics
import com.esuiss.ui.theme.Colors
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography
import kotlin.math.roundToInt
import kotlinx.coroutines.launch

private class RadialInteractiveActivityRing(val label: String, val unit: String, val goal: Double, val color: Colors.() -> Color)

private val activityRings = listOf(
    RadialInteractiveActivityRing("Move", "kcal", 600.0) { red },
    RadialInteractiveActivityRing("Exercise", "min", 30.0) { green },
    RadialInteractiveActivityRing("Stand", "hr", 12.0) { cyan },
)

private class RadialInteractiveActivityDay(val day: String, val values: List<Double>)

private val week = listOf(
    RadialInteractiveActivityDay("Monday", listOf(520.0, 34.0, 11.0)),
    RadialInteractiveActivityDay("Tuesday", listOf(610.0, 42.0, 12.0)),
    RadialInteractiveActivityDay("Wednesday", listOf(380.0, 18.0, 9.0)),
    RadialInteractiveActivityDay("Thursday", listOf(640.0, 45.0, 12.0)),
    RadialInteractiveActivityDay("Friday", listOf(470.0, 28.0, 10.0)),
    RadialInteractiveActivityDay("Saturday", listOf(720.0, 62.0, 12.0)),
    RadialInteractiveActivityDay("Sunday", listOf(486.0, 24.0, 10.0)),
)

private val FillEasing = CubicBezierEasing(0.65f, 0f, 0.35f, 1f)

@Composable
private fun Rings(values: List<Double>, size: Int, bar: Int, modifier: Modifier = Modifier) {
    val colors = EsuissTheme.colors
    RingsCanvas(
        values = activityRings.mapIndexed { index, ring -> (values[index] / ring.goal).toFloat() },
        colors = activityRings.map { it.color(colors) },
        size = size.dp,
        bar = bar.dp,
        gap = maxOf(1f, bar * 0.12f).dp,
        modifier = modifier.clearAndSetSemantics {},
    )
}

@Composable
fun RadialChartInteractive(modifier: Modifier = Modifier) {
    val colors = EsuissTheme.colors
    val reduced = formReducedMotion()
    val haptics = rememberHaptics()
    var selected by remember { mutableIntStateOf(6) }
    val target = week[selected].values
    val animated = remember { activityRings.map { Animatable(0f) } }
    LaunchedEffect(selected) {
        animated.forEachIndexed { index, value ->
            launch {
                if (reduced) value.snapTo(target[index].toFloat()) else value.animateTo(target[index].toFloat(), tween(750, easing = FillEasing))
            }
        }
    }
    val values = animated.map { it.value.toDouble() }
    Card(modifier, variant = CardVariant.Filled, size = CardSize.Sm) {
        CardContent {
            Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                BasicText("Activity", style = Typography.lg.copy(color = colors.label, fontWeight = FontWeight.SemiBold))
                BasicText("This week · pick a day", style = Typography.sm.copy(color = colors.labelSecondary))
            }
        }
        CardContent(Modifier.padding(top = 20.dp)) {
            Column(verticalArrangement = Arrangement.spacedBy(24.dp)) {
                Row(
                    Modifier
                        .fillMaxWidth()
                        .selectableGroup()
                        .semantics { contentDescription = "Day" },
                    horizontalArrangement = Arrangement.spacedBy(4.dp),
                ) {
                    week.forEachIndexed { index, day ->
                        val active = index == selected
                        val shape = RoundedCornerShape(Radius.xl)
                        Column(
                            Modifier
                                .weight(1f)
                                .clip(shape)
                                .background(if (active) colors.surface else Color.Transparent, shape)
                                .selectable(
                                    selected = active,
                                    interactionSource = remember { MutableInteractionSource() },
                                    indication = null,
                                    role = Role.Tab,
                                ) {
                                    if (!active) haptics.selection()
                                    selected = index
                                }
                                .semantics { contentDescription = day.day }
                                .padding(vertical = 8.dp),
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.spacedBy(6.dp),
                        ) {
                            BasicText(
                                day.day.take(3),
                                Modifier.clearAndSetSemantics {},
                                style = Typography.xs.copy(
                                    color = if (active) colors.label else colors.labelSecondary,
                                    fontWeight = FontWeight.SemiBold,
                                ),
                            )
                            Rings(day.values, size = 40, bar = 4)
                        }
                    }
                }
                BoxWithConstraints(Modifier.fillMaxWidth()) {
                    if (maxWidth >= 468.dp) {
                        Row(
                            Modifier.align(Alignment.Center),
                            horizontalArrangement = Arrangement.spacedBy(32.dp),
                            verticalAlignment = Alignment.CenterVertically,
                        ) {
                            Rings(values, size = 260, bar = 24)
                            RingStats(values, target)
                        }
                    } else {
                        Column(
                            Modifier.fillMaxWidth(),
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.spacedBy(24.dp),
                        ) {
                            Rings(values, size = 260, bar = 24)
                            RingStats(values, target)
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun RingStats(values: List<Double>, target: List<Double>) {
    val colors = EsuissTheme.colors
    Column(
        Modifier
            .widthIn(min = 176.dp)
            .semantics { liveRegion = LiveRegionMode.Polite },
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        activityRings.forEachIndexed { index, ring ->
            val percent = (target[index] / ring.goal * 100).roundToInt()
            val color = ring.color(colors)
            val tint = if (colors.isDark) color else lerp(color, colors.label, 0.45f)
            Column(Modifier.semantics(mergeDescendants = true) {}, verticalArrangement = Arrangement.spacedBy(2.dp)) {
                BasicText(ring.label, style = Typography.base.copy(color = colors.label, fontWeight = FontWeight.SemiBold))
                Row(horizontalArrangement = Arrangement.spacedBy(2.dp)) {
                    BasicText(
                        "${values[index].roundToInt()}/${ring.goal.roundToInt()}",
                        Modifier.alignByBaseline(),
                        style = Typography.xl3.copy(color = tint, fontWeight = FontWeight.SemiBold, fontFeatureSettings = "tnum"),
                    )
                    BasicText(
                        ring.unit.uppercase(),
                        Modifier.alignByBaseline(),
                        style = Typography.base.copy(color = tint, fontWeight = FontWeight.SemiBold),
                    )
                }
                BasicText(
                    "$percent%${if (percent >= 100) " · goal met" else ""}",
                    style = Typography.xs.copy(color = colors.labelSecondary),
                )
            }
        }
    }
}
