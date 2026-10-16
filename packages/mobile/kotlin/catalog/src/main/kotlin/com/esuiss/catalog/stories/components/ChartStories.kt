package com.esuiss.catalog.stories.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.Desktop
import com.adamglin.phosphoricons.regular.DeviceMobile
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.AreaChart
import com.esuiss.ui.components.BarChart
import com.esuiss.ui.components.Card
import com.esuiss.ui.components.CardContent
import com.esuiss.ui.components.CardHeader
import com.esuiss.ui.components.CardSize
import com.esuiss.ui.components.CardVariant
import com.esuiss.ui.components.ChartAxisOrientation
import com.esuiss.ui.components.ChartConfig
import com.esuiss.ui.components.ChartConfigItem
import com.esuiss.ui.components.ChartContainer
import com.esuiss.ui.components.ChartCurve
import com.esuiss.ui.components.ChartFill
import com.esuiss.ui.components.ChartMargin
import com.esuiss.ui.components.ChartRadius
import com.esuiss.ui.components.ChartTooltipContent
import com.esuiss.ui.components.ChartTooltipIndicator
import com.esuiss.ui.components.ChartTooltipScope
import com.esuiss.ui.components.Label
import com.esuiss.ui.components.Switch
import com.esuiss.ui.components.SwitchSize
import com.esuiss.ui.components.Text
import com.esuiss.ui.components.ToggleGroup
import com.esuiss.ui.components.ToggleGroupItem
import com.esuiss.ui.components.ToggleSize
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Palette
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Shadows
import com.esuiss.ui.theme.Typography
import com.esuiss.ui.theme.shadow
import java.text.NumberFormat
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Locale

val chartStories = StoryGroup(
    section = Section.Components,
    title = "Chart",
    stories = listOf(
        Story("TooltipDot") {
            ChartStackedTooltip("Dot indicator", "indicator=\"dot\"", 2) { ChartTooltipContent(indicator = ChartTooltipIndicator.Dot) }
        },
        Story("TooltipLine") {
            ChartStackedTooltip("Line indicator", "indicator=\"line\"", 2) { ChartTooltipContent(indicator = ChartTooltipIndicator.Line) }
        },
        Story("TooltipDashed") {
            ChartStackedTooltip("Dashed indicator", "indicator=\"dashed\"", 2) { ChartTooltipContent(indicator = ChartTooltipIndicator.Dashed) }
        },
        Story("TooltipNoIndicator") {
            ChartStackedTooltip("No indicator", "Just the name and value", 2) { ChartTooltipContent(hideIndicator = true) }
        },
        Story("TooltipNoLabel") {
            ChartStackedTooltip("No label", "The month is hidden", 2) { ChartTooltipContent(hideLabel = true) }
        },
        Story("TooltipLabelFormatter") { ChartLabelFormatter() },
        Story("TooltipFormatter") { ChartFormatter() },
        Story("TooltipIcons") {
            ChartStackedTooltip("With icons", "An icon instead of a color", 3, chartIconConfig) { ChartTooltipContent() }
        },
        Story("TooltipCustom") { ChartCustom() },
        Story("TooltipInteractive") { ChartInteractive() },
    ),
)

private class ChartMonth(val month: String, val desktop: Double, val mobile: Double)

private val chartMonthData = listOf(
    ChartMonth("January", 186.0, 80.0),
    ChartMonth("February", 305.0, 200.0),
    ChartMonth("March", 237.0, 120.0),
    ChartMonth("April", 173.0, 190.0),
    ChartMonth("May", 209.0, 130.0),
    ChartMonth("June", 264.0, 140.0),
)

private val chartDeviceConfig = ChartConfig(
    "desktop" to ChartConfigItem("Desktop") { chart1 },
    "mobile" to ChartConfigItem("Mobile") { chart2 },
)

private val chartIconConfig = ChartConfig(
    "desktop" to ChartConfigItem("Desktop", PhosphorIcons.Regular.Desktop) { chart1 },
    "mobile" to ChartConfigItem("Mobile", PhosphorIcons.Regular.DeviceMobile) { chart2 },
)

private val chartEnergyConfig = ChartConfig("energy" to ChartConfigItem("Active energy") { Palette.red500 })

private val chartEnergyValues = listOf(512, 604, 455, 389, 662, 598, 431, 520, 690, 447, 575, 402, 633, 558)

private class ChartEnergy(val date: Calendar, val energy: Double)

private fun chartEnergy(values: List<Int>, year: Int, month: Int, day: Int) = values.mapIndexed { index, value ->
    ChartEnergy(Calendar.getInstance().apply { clear(); set(year, month, day + index, 12, 0) }, value.toDouble())
}

private fun chartNumber(value: Double): String = NumberFormat.getNumberInstance(Locale.US).apply {
    minimumFractionDigits = 0
    maximumFractionDigits = 0
}.format(value)

@Composable
private fun ChartTooltipCard(title: String, description: String, content: @Composable () -> Unit) {
    Card(variant = CardVariant.Filled, size = CardSize.Sm) {
        CardHeader(title, description = description)
        CardContent { content() }
    }
}

@Composable
private fun ChartStackedTooltip(
    title: String,
    description: String,
    defaultIndex: Int,
    config: ChartConfig = chartDeviceConfig,
    tooltip: @Composable ChartTooltipScope.() -> Unit,
) {
    ChartTooltipCard(title, description) {
        ChartContainer(config, Modifier.fillMaxWidth().height(208.dp)) {
            BarChart(
                chartMonthData,
                margin = ChartMargin(top = 70.dp, right = 4.dp, bottom = 0.dp, left = 4.dp),
                accessibilityLabel = title,
            ) {
                XAxis(label = { it.month }, tickMargin = 8.dp, interval = 0, tickFormatter = { it.take(3) })
                ChartTooltip(defaultIndex = defaultIndex, cursor = null, content = tooltip)
                Bar("desktop", value = { it.desktop }, stackId = "a", radius = ChartRadius(0.dp, 0.dp, 4.dp, 4.dp), maxBarSize = 30.dp)
                Bar("mobile", value = { it.mobile }, stackId = "a", radius = ChartRadius(4.dp, 4.dp, 0.dp, 0.dp), maxBarSize = 30.dp)
            }
        }
    }
}

@Composable
private fun ChartLabelFormatter() {
    val colors = EsuissTheme.colors
    val data = remember { chartEnergy(chartEnergyValues, 2026, Calendar.SEPTEMBER, 23) }
    val longDate = remember { SimpleDateFormat("EEEE, MMMM d", Locale.US) }
    ChartTooltipCard("Custom label", "The date written out in full") {
        ChartContainer(chartEnergyConfig, Modifier.fillMaxWidth().height(208.dp)) {
            AreaChart(
                data,
                margin = ChartMargin(top = 70.dp, right = 12.dp, bottom = 0.dp, left = 12.dp),
                accessibilityLabel = "Custom label",
            ) {
                XAxis(label = { it.date.get(Calendar.DAY_OF_MONTH).toString() }, tickMargin = 8.dp, interval = 2)
                ChartTooltip(defaultIndex = 8) {
                    ChartTooltipContent(
                        indicator = ChartTooltipIndicator.Line,
                        labelFormatter = { _, items ->
                            Text(
                                longDate.format(data[items.first().index].date.time),
                                style = Typography.xs.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold),
                            )
                        },
                    )
                }
                Area(
                    "energy",
                    value = { it.energy },
                    curve = ChartCurve.Monotone,
                    strokeWidth = 2.dp,
                    fill = ChartFill.VerticalGradient(topAlpha = 0.38f, bottomAlpha = 0.02f),
                )
            }
        }
    }
}

@Composable
private fun ChartFormatter() {
    val colors = EsuissTheme.colors
    val data = remember { chartEnergy(chartEnergyValues.takeLast(7), 2026, Calendar.OCTOBER, 0) }
    val weekday = remember { SimpleDateFormat("EEE", Locale.US) }
    ChartTooltipCard("With units", "A unit next to the value") {
        ChartContainer(chartEnergyConfig, Modifier.fillMaxWidth().height(208.dp)) {
            BarChart(
                data,
                margin = ChartMargin(top = 70.dp, right = 4.dp, bottom = 0.dp, left = 4.dp),
                accessibilityLabel = "With units",
            ) {
                XAxis(label = { weekday.format(it.date.time) }, tickMargin = 8.dp, interval = 0)
                ChartTooltip(defaultIndex = 3, cursor = null) {
                    ChartTooltipContent(
                        hideLabel = true,
                        formatter = { item ->
                            Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                Text(
                                    "Active energy",
                                    Modifier.alignByBaseline(),
                                    style = Typography.xs.copy(color = colors.mutedForeground),
                                )
                                Text(
                                    chartNumber(item.value),
                                    Modifier.alignByBaseline(),
                                    style = Typography.xs.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold, fontFeatureSettings = "tnum"),
                                )
                                Text("kcal", Modifier.alignByBaseline(), style = Typography.xs.copy(color = colors.mutedForeground))
                            }
                        },
                    )
                }
                Bar("energy", value = { it.energy }, radius = ChartRadius(4.dp), maxBarSize = 26.dp)
            }
        }
    }
}

private class ChartSteps(val day: String, val steps: Double)

private val chartStepsData = listOf(
    ChartSteps("Monday", 8412.0),
    ChartSteps("Tuesday", 10230.0),
    ChartSteps("Wednesday", 6120.0),
    ChartSteps("Thursday", 12480.0),
    ChartSteps("Friday", 9050.0),
    ChartSteps("Saturday", 14320.0),
    ChartSteps("Sunday", 4870.0),
)

private val chartStepsConfig = ChartConfig("steps" to ChartConfigItem("Steps") { chart4 })

@Composable
private fun ChartCustom() {
    val colors = EsuissTheme.colors
    ChartTooltipCard("Custom content", "A tooltip built from scratch") {
        ChartContainer(chartStepsConfig, Modifier.fillMaxWidth().height(208.dp)) {
            BarChart(
                chartStepsData,
                margin = ChartMargin(top = 70.dp, right = 4.dp, bottom = 0.dp, left = 4.dp),
                accessibilityLabel = "Custom content",
            ) {
                XAxis(label = { it.day }, tickMargin = 8.dp, interval = 0, tickFormatter = { it.take(3) })
                ChartTooltip(defaultIndex = 5, cursor = null) {
                    val entry = items.firstOrNull() ?: return@ChartTooltip
                    val shape = RoundedCornerShape(Radius.xl)
                    Column(
                        Modifier
                            .widthIn(min = 112.dp)
                            .shadow(Shadows.lg, shape)
                            .background(colors.popover, shape)
                            .border(1.dp, colors.foreground.copy(alpha = if (colors.isDark) 0.1f else 0.05f), shape)
                            .padding(horizontal = 12.dp, vertical = 8.dp),
                    ) {
                        Text(
                            "TOTAL",
                            style = Typography.xs.copy(color = colors.mutedForeground, fontWeight = FontWeight.SemiBold),
                        )
                        Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                            Text(
                                chartNumber(entry.value),
                                Modifier.alignByBaseline(),
                                style = Typography.xl2.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold, fontFeatureSettings = "tnum"),
                            )
                            Text(
                                "steps",
                                Modifier.alignByBaseline(),
                                style = Typography.xs.copy(color = colors.mutedForeground, fontWeight = FontWeight.SemiBold),
                            )
                        }
                        Text(label, style = Typography.xs.copy(color = colors.mutedForeground))
                    }
                }
                Bar("steps", value = { it.steps }, radius = ChartRadius(4.dp), maxBarSize = 26.dp)
            }
        }
    }
}

private class ChartRevenue(val quarter: String, val phones: Double, val laptops: Double, val services: Double)

private val chartRevenueData = listOf(
    ChartRevenue("Q1 25", 69.1, 9.0, 26.3),
    ChartRevenue("Q2 25", 46.8, 8.0, 26.6),
    ChartRevenue("Q3 25", 44.6, 8.0, 27.4),
    ChartRevenue("Q4 25", 46.2, 8.7, 28.8),
    ChartRevenue("Q1 26", 71.0, 9.5, 29.1),
    ChartRevenue("Q2 26", 49.4, 8.6, 29.4),
    ChartRevenue("Q3 26", 47.3, 8.9, 30.1),
    ChartRevenue("Q4 26", 49.0, 9.3, 31.2),
)

private val chartRevenueConfig = ChartConfig(
    "phones" to ChartConfigItem("Phones") { chart1 },
    "laptops" to ChartConfigItem("Laptops") { chart2 },
    "services" to ChartConfigItem("Services") { Palette.purple500 },
)

private fun chartTotal(value: Double): String = NumberFormat.getNumberInstance().apply {
    maximumFractionDigits = 1
}.format(value)

private fun chartTick(value: Double): String =
    if (value == Math.floor(value)) value.toLong().toString() else value.toString()

@Composable
private fun ChartSetting(label: String, checked: Boolean, onCheckedChange: (Boolean) -> Unit) {
    Row(horizontalArrangement = Arrangement.spacedBy(10.dp), verticalAlignment = Alignment.CenterVertically) {
        Switch(checked, onCheckedChange, Modifier.semantics { contentDescription = label }, size = SwitchSize.Sm)
        Label(Modifier.clickable(interactionSource = null, indication = null) { onCheckedChange(!checked) }) {
            Text(label, style = Typography.sm)
        }
    }
}

@Composable
private fun ChartInteractive() {
    val colors = EsuissTheme.colors
    var indicator by rememberSaveable { mutableStateOf("dot") }
    var showTotal by rememberSaveable { mutableStateOf(true) }
    var hideLabel by rememberSaveable { mutableStateOf(false) }
    var hideIndicator by rememberSaveable { mutableStateOf(false) }
    Card(variant = CardVariant.Filled, size = CardSize.Sm) {
        CardContent {
            Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                Text("Tooltip settings", style = Typography.lg.copy(fontWeight = FontWeight.SemiBold))
                Text(
                    "Quarterly revenue · billions · sample data. Change the settings and touch the bars.",
                    style = Typography.sm.copy(color = colors.mutedForeground),
                )
            }
        }
        CardContent {
            Column(verticalArrangement = Arrangement.spacedBy(20.dp)) {
                FlowRow(
                    horizontalArrangement = Arrangement.spacedBy(24.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                    itemVerticalAlignment = Alignment.Bottom,
                ) {
                    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        Text(
                            "Indicator",
                            style = Typography.xs.copy(color = colors.mutedForeground, fontWeight = FontWeight.SemiBold),
                        )
                        ToggleGroup(
                            value = indicator,
                            onValueChange = { if (it != null) indicator = it },
                            modifier = Modifier.semantics { contentDescription = "Indicator" },
                            size = ToggleSize.Sm,
                            spacing = 0,
                        ) {
                            ToggleGroupItem("Dot", "dot")
                            ToggleGroupItem("Line", "line")
                            ToggleGroupItem("Dashed", "dashed")
                        }
                    }
                    FlowRow(
                        modifier = Modifier.padding(bottom = 4.dp),
                        horizontalArrangement = Arrangement.spacedBy(20.dp),
                        verticalArrangement = Arrangement.spacedBy(10.dp),
                    ) {
                        ChartSetting("Total in title", showTotal) { showTotal = it }
                        ChartSetting("Hide title", hideLabel) { hideLabel = it }
                        ChartSetting("Hide indicator", hideIndicator) { hideIndicator = it }
                    }
                }
                ChartContainer(chartRevenueConfig, Modifier.fillMaxWidth().height(288.dp)) {
                    BarChart(
                        chartRevenueData,
                        margin = ChartMargin(top = 10.dp, right = 4.dp, bottom = 0.dp, left = 12.dp),
                        accessibilityLabel = "Quarterly revenue",
                    ) {
                        CartesianGrid(strokeDasharray = listOf(2f, 4f))
                        XAxis(label = { it.quarter }, tickMargin = 8.dp, minTickGap = 8.dp)
                        YAxis(orientation = ChartAxisOrientation.Right, tickMargin = 6.dp, tickFormatter = { "${chartTick(it)}B" })
                        ChartTooltip(defaultIndex = 4, cursor = null) {
                            ChartTooltipContent(
                                indicator = when (indicator) {
                                    "line" -> ChartTooltipIndicator.Line
                                    "dashed" -> ChartTooltipIndicator.Dashed
                                    else -> ChartTooltipIndicator.Dot
                                },
                                hideLabel = hideLabel,
                                hideIndicator = hideIndicator,
                                labelFormatter = if (showTotal) {
                                    { label, items ->
                                        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                                            Text(
                                                label,
                                                Modifier.weight(1f),
                                                style = Typography.xs.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold),
                                            )
                                            Text(
                                                "${chartTotal(items.sumOf { it.value })}B",
                                                style = Typography.xs.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold, fontFeatureSettings = "tnum"),
                                            )
                                        }
                                    }
                                } else {
                                    null
                                },
                            )
                        }
                        ChartLegend()
                        Bar("services", value = { it.services }, stackId = "a", radius = ChartRadius(0.dp, 0.dp, 4.dp, 4.dp), maxBarSize = 44.dp)
                        Bar("laptops", value = { it.laptops }, stackId = "a", maxBarSize = 44.dp)
                        Bar("phones", value = { it.phones }, stackId = "a", radius = ChartRadius(4.dp, 4.dp, 0.dp, 0.dp), maxBarSize = 44.dp)
                    }
                }
            }
        }
    }
}
