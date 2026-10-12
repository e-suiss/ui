package com.esuiss.ui.charts

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.EnterTransition
import androidx.compose.animation.ExitTransition
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.tween
import androidx.compose.animation.expandVertically
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.scaleIn
import androidx.compose.animation.scaleOut
import androidx.compose.animation.shrinkVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.selection.toggleable
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.esuiss.ui.components.Card
import com.esuiss.ui.components.CardContent
import com.esuiss.ui.components.CardSize
import com.esuiss.ui.components.CardVariant
import com.esuiss.ui.components.ChartConfig
import com.esuiss.ui.components.ChartConfigItem
import com.esuiss.ui.components.ChartContainer
import com.esuiss.ui.components.ChartDot
import com.esuiss.ui.components.ChartMargin
import com.esuiss.ui.components.ChartTooltipContent
import com.esuiss.ui.components.ChartTooltipIndicator
import com.esuiss.ui.components.RadarChart
import com.esuiss.ui.components.chartColor
import com.esuiss.ui.components.formReducedMotion
import com.esuiss.ui.components.rememberHaptics
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography
import kotlinx.coroutines.launch
import kotlin.math.min
import kotlin.math.roundToInt

private val axes = listOf("Camera", "Battery", "Performance", "Display", "Weight", "Price")

private val scores = linkedMapOf(
    "pro" to listOf(98, 90, 98, 95, 58, 52),
    "standard" to listOf(85, 82, 88, 90, 74, 80),
    "air" to listOf(78, 68, 92, 90, 98, 64),
    "lite" to listOf(70, 80, 76, 72, 80, 95),
)

private val models = scores.keys.toList()

private const val MAX_SELECTED = 3

private val chartConfig = ChartConfig(
    "pro" to ChartConfigItem("Phone Pro") { orange },
    "standard" to ChartConfigItem("Phone") { blue },
    "air" to ChartConfigItem("Phone Air") { cyan },
    "lite" to ChartConfigItem("Phone Lite") { purple },
)

private val MorphEasing = CubicBezierEasing(0.65f, 0f, 0.35f, 1f)

private val RevealEasing = CubicBezierEasing(0.45f, 0f, 0.2f, 1f)

private class RadarInteractiveRow(val axis: String, val values: Map<String, Double>, val scores: Map<String, Int>)

private fun average(model: String): Int = (scores.getValue(model).sum().toDouble() / axes.size).roundToInt()

@Composable
private fun ModelToggle(label: String, color: Color, pressed: Boolean, onPressedChange: (Boolean) -> Unit) {
    val colors = EsuissTheme.colors
    val haptics = rememberHaptics()
    val background by animateColorAsState(if (pressed) color.copy(alpha = 0.16f) else colors.control, label = "background")
    val dot by animateColorAsState(if (pressed) color else colors.labelQuaternary, label = "dot")
    Row(
        modifier = Modifier
            .height(32.dp)
            .background(background, RoundedCornerShape(Radius.lg))
            .toggleable(pressed, role = Role.Checkbox) {
                haptics.toggle(it)
                onPressedChange(it)
            }
            .padding(horizontal = 12.dp),
        horizontalArrangement = Arrangement.spacedBy(6.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Box(
            Modifier
                .size(8.dp)
                .background(dot, CircleShape),
        )
        BasicText(label, style = Typography.sm.copy(color = colors.label, fontWeight = FontWeight.SemiBold))
    }
}

@Composable
fun RadarChartInteractive(modifier: Modifier = Modifier) {
    val colors = EsuissTheme.colors
    val reduced = formReducedMotion()
    var selected by remember { mutableStateOf(listOf("pro", "air")) }
    var axis by remember { mutableStateOf<Int?>(null) }
    val scale = remember { models.map { Animatable(0f) } }
    LaunchedEffect(selected) {
        models.forEachIndexed { index, model ->
            val target = if (model in selected) 1f else 0f
            launch {
                if (reduced) scale[index].snapTo(target) else scale[index].animateTo(target, tween(600, easing = MorphEasing))
            }
        }
    }
    val visibility = scale.map { it.value }
    val data = axes.mapIndexed { index, name ->
        RadarInteractiveRow(
            name,
            models.withIndex().associate { (position, model) -> model to scores.getValue(model)[index] * visibility[position].toDouble() },
            models.associateWith { scores.getValue(it)[index] },
        )
    }
    fun toggle(model: String, pressed: Boolean) {
        selected = when {
            !pressed -> if (selected.size > 1) selected - model else selected
            selected.size >= MAX_SELECTED -> selected.drop(1) + model
            else -> selected + model
        }
    }
    Card(modifier, variant = CardVariant.Filled, size = CardSize.Sm) {
        CardContent {
            Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                BasicText("Compare phone models", style = Typography.lg.copy(color = colors.label, fontWeight = FontWeight.SemiBold))
                BasicText(
                    "Up to three models · scores out of 100, sample data",
                    style = Typography.sm.copy(color = colors.labelSecondary),
                )
            }
        }
        CardContent(Modifier.padding(top = 20.dp)) {
            Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                ChartContainer(chartConfig) {
                    FlowRow(
                        Modifier.semantics { contentDescription = "Models" },
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp),
                    ) {
                        for (model in models) {
                            ModelToggle(chartConfig[model]?.label ?: model, chartColor(model), model in selected) { toggle(model, it) }
                        }
                    }
                }
                BoxWithConstraints(Modifier.fillMaxWidth()) {
                    val wide = maxWidth >= 568.dp
                    val chart = @Composable { chartModifier: Modifier ->
                        ChartContainer(chartConfig, chartModifier.height(344.dp)) {
                            RadarChart(
                                data,
                                margin = ChartMargin(top = 8.dp, right = 56.dp, bottom = 8.dp, left = 56.dp),
                                outerRadius = 0.74f,
                                accessibilityLabel = "Compare phone models",
                                selectedIndex = axis,
                                onSelectedIndexChange = { axis = it },
                            ) {
                                PolarGrid(stroke = colors.separator)
                                PolarAngleAxis(
                                    label = { it.axis },
                                    tickStyle = Typography.sm.copy(color = colors.labelSecondary),
                                    activeTickStyle = Typography.sm.copy(color = colors.label, fontWeight = FontWeight.SemiBold),
                                )
                                PolarRadiusAxis(domain = 0.0..100.0, tick = false)
                                ChartTooltip {
                                    ChartTooltipContent(
                                        indicator = ChartTooltipIndicator.Line,
                                        payload = items.filter { it.dataKey in selected },
                                        formatter = { item ->
                                            val row = item.payload as RadarInteractiveRow
                                            Row(
                                                Modifier.fillMaxWidth(),
                                                horizontalArrangement = Arrangement.spacedBy(8.dp),
                                                verticalAlignment = Alignment.CenterVertically,
                                            ) {
                                                Box(
                                                    Modifier
                                                        .width(3.dp)
                                                        .height(12.dp)
                                                        .background(item.color, CircleShape),
                                                )
                                                BasicText(
                                                    chartConfig[item.key]?.label ?: item.key,
                                                    Modifier.weight(1f),
                                                    style = Typography.xs.copy(color = colors.labelSecondary),
                                                )
                                                BasicText(
                                                    row.scores.getValue(item.key).toString(),
                                                    style = Typography.xs.copy(color = colors.label, fontWeight = FontWeight.SemiBold, fontFeatureSettings = "tnum"),
                                                )
                                            }
                                        },
                                    )
                                }
                                models.forEachIndexed { position, model ->
                                    val shown = visibility[position]
                                    if (shown >= 0.005f) {
                                        Radar(
                                            model,
                                            value = { it.values.getValue(model) },
                                            strokeWidth = 2.dp,
                                            strokeOpacity = min(1f, shown * 1.5f),
                                            fillOpacity = 0.14f * shown,
                                            dot = ChartDot((3f * min(1f, shown * 1.3f)).dp, strokeWidth = 2.dp),
                                        )
                                    }
                                }
                            }
                        }
                    }
                    if (wide) {
                        Row(horizontalArrangement = Arrangement.spacedBy(24.dp), verticalAlignment = Alignment.CenterVertically) {
                            chart(Modifier.weight(1f))
                            ScoreList(selected, axis, reduced, Modifier.width(256.dp))
                        }
                    } else {
                        Column(verticalArrangement = Arrangement.spacedBy(24.dp)) {
                            chart(Modifier.fillMaxWidth())
                            ScoreList(selected, axis, reduced, Modifier.fillMaxWidth())
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun ScoreList(selected: List<String>, axis: Int?, reduced: Boolean, modifier: Modifier) {
    val colors = EsuissTheme.colors
    Column(modifier.semantics { liveRegion = LiveRegionMode.Polite }) {
        for (model in models) {
            AnimatedVisibility(
                visible = model in selected,
                enter = if (reduced) EnterTransition.None else expandVertically(tween(500, easing = RevealEasing)) + fadeIn(tween(500, easing = RevealEasing)) + scaleIn(tween(500, easing = RevealEasing), initialScale = 0.96f),
                exit = if (reduced) ExitTransition.None else shrinkVertically(tween(500, easing = RevealEasing)) + fadeOut(tween(500, easing = RevealEasing)) + scaleOut(tween(500, easing = RevealEasing), targetScale = 0.96f),
            ) {
                ChartContainer(chartConfig) {
                    Row(
                        Modifier
                            .padding(bottom = 10.dp)
                            .fillMaxWidth()
                            .background(colors.surface, RoundedCornerShape(Radius.xl))
                            .semantics(mergeDescendants = true) {}
                            .padding(horizontal = 14.dp, vertical = 12.dp),
                        horizontalArrangement = Arrangement.spacedBy(12.dp),
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Box(
                            Modifier
                                .size(10.dp)
                                .background(chartColor(model), CircleShape),
                        )
                        Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(2.dp)) {
                            BasicText(
                                chartConfig[model]?.label ?: model,
                                style = Typography.base.copy(color = colors.label, fontWeight = FontWeight.SemiBold),
                            )
                            BasicText(
                                if (axis != null) axes[axis] else "Overall score",
                                style = Typography.xs.copy(color = colors.labelSecondary),
                            )
                        }
                        BasicText(
                            (if (axis != null) scores.getValue(model)[axis] else average(model)).toString(),
                            style = Typography.xl2.copy(color = colors.label, fontWeight = FontWeight.SemiBold, fontFeatureSettings = "tnum"),
                        )
                    }
                }
            }
        }
    }
}
