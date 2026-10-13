package com.esuiss.ui.charts

import androidx.compose.animation.animateColorAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
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
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.esuiss.ui.components.Card
import com.esuiss.ui.components.CardContent
import com.esuiss.ui.components.CardSize
import com.esuiss.ui.components.CardVariant
import com.esuiss.ui.components.ChartAxisOrientation
import com.esuiss.ui.components.ChartConfig
import com.esuiss.ui.components.ChartConfigItem
import com.esuiss.ui.components.ChartContainer
import com.esuiss.ui.components.ChartCurve
import com.esuiss.ui.components.ChartDot
import com.esuiss.ui.components.ChartEasing
import com.esuiss.ui.components.ChartMargin
import com.esuiss.ui.components.ChartTooltipContent
import com.esuiss.ui.components.ChartTooltipIndicator
import com.esuiss.ui.components.LineChart
import com.esuiss.ui.components.ToggleGroup
import com.esuiss.ui.components.ToggleGroupItem
import com.esuiss.ui.components.ToggleSize
import com.esuiss.ui.components.chartColor
import com.esuiss.ui.components.rememberHaptics
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography
import kotlin.math.PI
import kotlin.math.roundToInt
import kotlin.math.sin

private class CityClimate(val average: List<Double>, val spread: Pair<Double, Double>)

private val cities = linkedMapOf(
    "istanbul" to CityClimate(listOf(6.0, 6.0, 8.0, 12.0, 17.0, 22.0, 24.0, 24.0, 21.0, 16.0, 12.0, 8.0), 6.0 to 0.6),
    "ankara" to CityClimate(listOf(0.0, 2.0, 6.0, 11.0, 16.0, 20.0, 24.0, 24.0, 19.0, 13.0, 7.0, 2.0), 11.0 to 1.6),
    "izmir" to CityClimate(listOf(9.0, 10.0, 12.0, 16.0, 21.0, 26.0, 28.0, 28.0, 24.0, 19.0, 14.0, 10.0), 9.0 to 1.0),
    "antalya" to CityClimate(listOf(10.0, 11.0, 13.0, 16.0, 21.0, 26.0, 29.0, 29.0, 25.0, 20.0, 15.0, 11.0), 9.0 to 0.9),
    "erzurum" to CityClimate(listOf(-9.0, -8.0, -2.0, 6.0, 11.0, 15.0, 20.0, 20.0, 15.0, 8.0, 1.0, -6.0), 12.0 to 1.8),
)

private val modes = linkedMapOf("average" to "Average", "high" to "High", "low" to "Low")

private val shortMonths = listOf("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec")

private val longMonths = listOf(
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
)

private val chartConfig = ChartConfig(
    "istanbul" to ChartConfigItem("Istanbul") { blue },
    "ankara" to ChartConfigItem("Ankara") { purple },
    "izmir" to ChartConfigItem("Izmir") { teal },
    "antalya" to ChartConfigItem("Antalya") { orange },
    "erzurum" to ChartConfigItem("Erzurum") { indigo },
)

private class TemperatureRow(val index: Int, val month: String, val values: Map<String, Double>)

private fun temperature(city: String, month: Int, mode: String): Double {
    val climate = cities.getValue(city)
    val mean = climate.average[month]
    if (mode == "average") return mean
    val season = sin((month - 0.5) / 12 * PI)
    val range = climate.spread.first + climate.spread.second * 6 * season * season
    return mean + if (mode == "high") range / 2 else -range / 2
}

private fun degrees(value: Double): String = if (value % 1.0 == 0.0) value.toLong().toString() else value.toString()

@Composable
private fun CityToggle(label: String, color: Color, pressed: Boolean, onPressedChange: (Boolean) -> Unit) {
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
fun LineChartInteractive(modifier: Modifier = Modifier) {
    val colors = EsuissTheme.colors
    var visible by remember { mutableStateOf(listOf("istanbul", "ankara", "antalya")) }
    var mode by remember { mutableStateOf("average") }
    var month by remember { mutableStateOf<Int?>(null) }
    val data = remember(mode) {
        shortMonths.mapIndexed { index, name ->
            TemperatureRow(
                index,
                name,
                cities.keys.associateWith { city -> (temperature(city, index, mode) * 10).roundToInt() / 10.0 },
            )
        }
    }
    val shown = cities.keys.filter { it in visible }
    Card(modifier, variant = CardVariant.Filled, size = CardSize.Sm) {
        CardContent {
            Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                    BasicText("Monthly temperature", style = Typography.lg.copy(color = colors.label, fontWeight = FontWeight.SemiBold))
                    BasicText(
                        "${modes.getValue(mode)} · °C · long-term",
                        style = Typography.sm.copy(color = colors.labelSecondary),
                    )
                }
                ToggleGroup(value = mode, onValueChange = { value -> if (value != null) mode = value }, size = ToggleSize.Sm, spacing = 0) {
                    for ((key, label) in modes) ToggleGroupItem(label, key)
                }
            }
        }
        CardContent {
            Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                ChartContainer(chartConfig) {
                    FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        for (city in cities.keys) {
                            CityToggle(chartConfig[city]?.label ?: city, chartColor(city), city in visible) { pressed ->
                                visible = when {
                                    pressed -> visible + city
                                    visible.size > 1 -> visible - city
                                    else -> visible
                                }
                            }
                        }
                    }
                }
                ChartContainer(
                    chartConfig,
                    Modifier
                        .fillMaxWidth()
                        .height(288.dp),
                ) {
                    LineChart(
                        data,
                        margin = ChartMargin(top = 10.dp, right = 4.dp, bottom = 0.dp, left = 12.dp),
                        accessibilityLabel = "Monthly temperature",
                        selectedIndex = month,
                        onSelectedIndexChange = { month = it },
                    ) {
                        CartesianGrid(strokeDasharray = listOf(2f, 4f))
                        XAxis(label = { it.month }, tickMargin = 8.dp, minTickGap = 8.dp)
                        YAxis(
                            orientation = ChartAxisOrientation.Right,
                            tickMargin = 6.dp,
                            domain = -20.0..40.0,
                            ticks = listOf(-20.0, -10.0, 0.0, 10.0, 20.0, 30.0, 40.0),
                            tickFormatter = { "${it.toInt()}°" },
                        )
                        ReferenceLine(0.0, stroke = colors.separatorStrong)
                        ChartTooltip {
                            ChartTooltipContent(
                                indicator = ChartTooltipIndicator.Line,
                                labelFormatter = { _, items ->
                                    BasicText(
                                        longMonths[items.firstOrNull()?.index ?: 0],
                                        style = Typography.xs.copy(color = colors.label, fontWeight = FontWeight.SemiBold),
                                    )
                                },
                                formatter = { item ->
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
                                            "${degrees(item.value)}°",
                                            style = Typography.xs.copy(color = colors.label, fontWeight = FontWeight.SemiBold, fontFeatureSettings = "tnum"),
                                        )
                                    }
                                },
                            )
                        }
                        for (city in shown) {
                            Line(
                                city,
                                value = { it.values.getValue(city) },
                                curve = ChartCurve.Monotone,
                                strokeWidth = 2.5.dp,
                                activeDot = ChartDot(5.dp, strokeColor = colors.surfaceSecondary, strokeWidth = 2.dp),
                                animationDuration = 650,
                                animationEasing = ChartEasing.EaseInOut,
                            )
                        }
                    }
                }
                ChartContainer(chartConfig) {
                    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                        for (pair in shown.chunked(2)) {
                            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                                for (city in pair) {
                                    val temperatures = data.map { it.values.getValue(city) }
                                    val highlighted = month?.let { temperatures.getOrNull(it) }
                                    Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(2.dp)) {
                                        Row(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalAlignment = Alignment.CenterVertically) {
                                            Box(
                                                Modifier
                                                    .size(8.dp)
                                                    .background(chartColor(city), CircleShape),
                                            )
                                            BasicText(
                                                chartConfig[city]?.label ?: city,
                                                style = Typography.sm.copy(color = colors.labelSecondary),
                                            )
                                        }
                                        BasicText(
                                            if (month == null || highlighted == null) {
                                                "${temperatures.min().roundToInt()}° / ${temperatures.max().roundToInt()}°"
                                            } else {
                                                "${highlighted.roundToInt()}° · ${longMonths[month!!]}"
                                            },
                                            style = Typography.base.copy(color = colors.label, fontWeight = FontWeight.SemiBold, fontFeatureSettings = "tnum"),
                                        )
                                    }
                                }
                                if (pair.size == 1) Box(Modifier.weight(1f))
                            }
                        }
                    }
                }
            }
        }
    }
}
