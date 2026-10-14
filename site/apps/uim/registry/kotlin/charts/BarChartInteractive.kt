package com.esuiss.ui.charts

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
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
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.esuiss.ui.components.BarChart
import com.esuiss.ui.components.Card
import com.esuiss.ui.components.CardContent
import com.esuiss.ui.components.CardSize
import com.esuiss.ui.components.CardVariant
import com.esuiss.ui.components.ChartAxisOrientation
import com.esuiss.ui.components.ChartCell
import com.esuiss.ui.components.ChartConfig
import com.esuiss.ui.components.ChartConfigItem
import com.esuiss.ui.components.ChartContainer
import com.esuiss.ui.components.ChartMargin
import com.esuiss.ui.components.ChartRadius
import com.esuiss.ui.components.ChartTooltipContent
import com.esuiss.ui.components.Separator
import com.esuiss.ui.components.ToggleGroup
import com.esuiss.ui.components.ToggleGroupItem
import com.esuiss.ui.components.ToggleSize
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography
import kotlin.math.abs
import kotlin.math.roundToInt

private val categories = listOf("social", "productivity", "entertainment")

private val days = listOf("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday")

private val week: List<Map<String, Double>> = listOf(
    listOf(48, 95, 62),
    listOf(55, 120, 40),
    listOf(70, 88, 95),
    listOf(42, 130, 35),
    listOf(65, 100, 80),
    listOf(110, 30, 140),
    listOf(95, 25, 120),
).map { usage -> categories.zip(usage.map { it.toDouble() }).toMap() }

private val profile = listOf(1, 0, 0, 0, 0, 0, 1, 4, 6, 5, 4, 5, 7, 6, 5, 4, 5, 6, 7, 9, 10, 11, 8, 4)

private class AppUsage(val name: String, val category: String, val share: Double)

private val apps = listOf(
    AppUsage("Chat", "social", 0.55),
    AppUsage("Messages", "social", 0.45),
    AppUsage("Browser", "productivity", 0.45),
    AppUsage("Mail", "productivity", 0.3),
    AppUsage("Docs", "productivity", 0.25),
    AppUsage("Video", "entertainment", 0.6),
    AppUsage("Music", "entertainment", 0.4),
)

private val chartConfig = ChartConfig(
    "social" to ChartConfigItem("Social") { blue },
    "productivity" to ChartConfigItem("Productivity") { cyan },
    "entertainment" to ChartConfigItem("Entertainment") { orange },
)

private class UsageRow(val label: String, val values: Map<String, Double>)

private fun total(day: Map<String, Double>) = categories.sumOf { day.getValue(it) }

private val average = week.sumOf { total(it) } / week.size

private val dailyAverage = categories.associateWith { category -> week.sumOf { it.getValue(category) } / week.size }

private fun formatMinutes(minutes: Double): String {
    val rounded = minutes.roundToInt()
    val hours = rounded / 60
    return if (hours > 0) "${hours}h ${rounded % 60}m" else "${rounded}m"
}

private fun noise(seed: Int): Double {
    val state = seed.toLong() * 16807 % 2147483647
    return (state - 1) / 2147483646.0
}

private fun hourly(day: Int): List<UsageRow> {
    val profileTotal = profile.sum().toDouble()
    val values = week[day]
    return profile.mapIndexed { hour, weight ->
        val share = weight / profileTotal * (0.75 + noise(hour + 7 * (day + 1)) * 0.5)
        UsageRow(
            hour.toString(),
            mapOf(
                "social" to (values.getValue("social") * share).roundToInt().toDouble(),
                "productivity" to (values.getValue("productivity") * share * if (hour in 9..17) 1.6 else 0.4).roundToInt().toDouble(),
                "entertainment" to (values.getValue("entertainment") * share * if (hour > 18) 1.8 else 0.5).roundToInt().toDouble(),
            ),
        )
    }
}

@Composable
fun BarChartInteractive(modifier: Modifier = Modifier) {
    val colors = EsuissTheme.colors
    var view by remember { mutableStateOf("week") }
    var selected by remember { mutableStateOf<Int?>(null) }
    var hour by remember { mutableStateOf<Int?>(null) }
    val isWeek = view == "week"
    val selectedDay = selected?.let { week[it] }
    val values = selectedDay ?: dailyAverage
    val headline = selectedDay?.let(::total) ?: average
    val data = if (isWeek) {
        week.mapIndexed { index, day -> UsageRow(days[index].take(3), day) }
    } else {
        hourly(selected ?: 6)
    }
    val usage = apps.map { it to values.getValue(it.category) * it.share }.sortedByDescending { it.second }.take(5)
    val longest = usage.maxOf { it.second }
    val comparison = if (selected == null) {
        "8% less than last week"
    } else {
        "${(abs(headline / average - 1) * 100).roundToInt()}% ${if (headline > average) "above" else "below"} average"
    }
    val swatch = { key: String -> chartConfig[key]?.color?.invoke(colors) ?: colors.labelSecondary }
    val value = Typography.base.copy(color = colors.label, fontWeight = FontWeight.SemiBold, fontFeatureSettings = "tnum")
    Card(modifier, variant = CardVariant.Filled, size = CardSize.Sm) {
        CardContent {
            Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                Column(
                    Modifier.semantics { liveRegion = LiveRegionMode.Polite },
                    verticalArrangement = Arrangement.spacedBy(2.dp),
                ) {
                    BasicText(
                        selected?.let { days[it] } ?: "Daily average",
                        style = Typography.sm.copy(color = colors.labelSecondary, fontWeight = FontWeight.SemiBold),
                    )
                    BasicText(
                        formatMinutes(headline),
                        style = Typography.xl3.copy(color = colors.label, fontWeight = FontWeight.SemiBold, fontFeatureSettings = "tnum"),
                    )
                    BasicText(comparison, style = Typography.sm.copy(color = colors.labelSecondary))
                }
                ToggleGroup(
                    value = view,
                    onValueChange = { next ->
                        if (next != null) {
                            view = next
                            hour = null
                            if (next == "day" && selected == null) selected = 6
                        }
                    },
                    size = ToggleSize.Sm,
                    spacing = 0,
                ) {
                    ToggleGroupItem("Week", "week", Modifier.padding(horizontal = 8.dp))
                    ToggleGroupItem("Day", "day", Modifier.padding(horizontal = 8.dp))
                }
            }
        }
        CardContent {
            Column(verticalArrangement = Arrangement.spacedBy(20.dp)) {
                ChartContainer(
                    chartConfig,
                    Modifier
                        .fillMaxWidth()
                        .height(256.dp),
                ) {
                    BarChart(
                        data,
                        margin = ChartMargin(top = 10.dp, right = 4.dp, bottom = 0.dp, left = 12.dp),
                        accessibilityLabel = if (isWeek) "Screen time this week" else "Screen time by hour",
                        selectedIndex = if (isWeek) selected else hour,
                        onSelectedIndexChange = { index -> if (isWeek) selected = index else hour = index },
                    ) {
                        CartesianGrid(strokeDasharray = listOf(2f, 4f))
                        if (isWeek) {
                            XAxis(label = { it.label }, tickMargin = 8.dp, interval = 0)
                            YAxis(
                                orientation = ChartAxisOrientation.Right,
                                tickMargin = 6.dp,
                                ticks = listOf(0.0, 120.0, 240.0, 360.0),
                                tickFormatter = { "${(it / 60).toInt()}h" },
                            )
                            ReferenceLine(average, stroke = colors.green, strokeDasharray = listOf(3f, 3f))
                        } else {
                            XAxis(label = { it.label }, tickMargin = 8.dp, interval = 0, ticks = listOf(0, 6, 12, 18), tickFormatter = { "$it:00" })
                            YAxis(orientation = ChartAxisOrientation.Right, tickMargin = 6.dp, tickCount = 4, tickFormatter = { "${it.toInt()}m" })
                        }
                        ChartTooltip(cursor = null) {
                            ChartTooltipContent(
                                labelFormatter = { label, _ ->
                                    BasicText(
                                        if (isWeek) days.first { it.startsWith(label) } else "$label:00 – ${label.toInt() + 1}:00",
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
                                                .size(8.dp)
                                                .background(item.color, RoundedCornerShape(Radius.xs)),
                                        )
                                        BasicText(
                                            chartConfig[item.key]?.label ?: item.key,
                                            Modifier.weight(1f),
                                            style = Typography.xs.copy(color = colors.labelSecondary),
                                        )
                                        BasicText(
                                            formatMinutes(item.value),
                                            style = Typography.xs.copy(color = colors.label, fontWeight = FontWeight.SemiBold, fontFeatureSettings = "tnum"),
                                        )
                                    }
                                },
                            )
                        }
                        categories.forEachIndexed { position, category ->
                            Bar(
                                category,
                                value = { it.values.getValue(category) },
                                stackId = "a",
                                radius = if (position == categories.size - 1) ChartRadius(5.dp, 5.dp, 0.dp, 0.dp) else ChartRadius(0.dp),
                                maxBarSize = if (isWeek) 34.dp else 10.dp,
                                cells = if (isWeek) {
                                    { index -> ChartCell(alpha = if (selected == null || selected == index) 1f else 0.3f) }
                                } else {
                                    null
                                },
                                isAnimationActive = false,
                            )
                        }
                    }
                }
                Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    for (category in categories) {
                        Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(2.dp)) {
                            Row(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalAlignment = Alignment.CenterVertically) {
                                Box(
                                    Modifier
                                        .size(8.dp)
                                        .background(swatch(category), CircleShape),
                                )
                                BasicText(
                                    chartConfig[category]?.label ?: category,
                                    style = Typography.sm.copy(color = colors.labelSecondary),
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis,
                                )
                            }
                            BasicText(formatMinutes(values.getValue(category)), style = value)
                        }
                    }
                }
                Column {
                    BasicText(
                        "MOST USED",
                        Modifier.padding(bottom = 4.dp),
                        style = Typography.xs.copy(color = colors.labelSecondary, fontWeight = FontWeight.SemiBold),
                    )
                    for ((app, minutes) in usage) {
                        Separator()
                        val fraction by animateFloatAsState((minutes / longest).toFloat(), label = "fraction")
                        Row(
                            Modifier
                                .fillMaxWidth()
                                .padding(vertical = 8.dp),
                            horizontalArrangement = Arrangement.spacedBy(12.dp),
                            verticalAlignment = Alignment.CenterVertically,
                        ) {
                            BasicText(
                                app.name,
                                Modifier.width(96.dp),
                                style = Typography.base.copy(color = colors.label),
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis,
                            )
                            Box(
                                Modifier
                                    .weight(1f)
                                    .height(6.dp)
                                    .background(colors.control, CircleShape),
                            ) {
                                Box(
                                    Modifier
                                        .fillMaxWidth(fraction)
                                        .fillMaxHeight()
                                        .background(swatch(app.category), CircleShape),
                                )
                            }
                            BasicText(
                                formatMinutes(minutes),
                                Modifier.width(72.dp),
                                style = Typography.sm.copy(color = colors.labelSecondary, fontFeatureSettings = "tnum", textAlign = TextAlign.End),
                            )
                        }
                    }
                }
            }
        }
    }
}
