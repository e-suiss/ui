package com.esuiss.ui

import android.graphics.Bitmap
import com.esuiss.ui.components.ChartLabelPosition
import com.esuiss.ui.components.ChartLabelList
import com.esuiss.ui.components.ChartRing
import com.esuiss.ui.components.ChartSector
import com.esuiss.ui.components.RadialBarChart
import com.esuiss.ui.components.PieChart
import androidx.compose.ui.unit.sp
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.asAndroidBitmap
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.test.assertCountEquals
import androidx.compose.ui.test.captureToImage
import androidx.compose.ui.test.click
import androidx.compose.ui.test.junit4.v2.createComposeRule
import androidx.compose.ui.test.onAllNodesWithText
import androidx.compose.ui.test.onNodeWithContentDescription
import androidx.compose.ui.test.onNodeWithTag
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import androidx.compose.ui.test.performTouchInput
import androidx.compose.ui.test.swipeRight
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.Desktop
import com.adamglin.phosphoricons.regular.DeviceMobile
import com.esuiss.ui.charts.AreaChartAxes
import com.esuiss.ui.charts.AreaChartDefault
import com.esuiss.ui.charts.AreaChartGradient
import com.esuiss.ui.charts.AreaChartInteractive
import com.esuiss.ui.charts.AreaChartLinear
import com.esuiss.ui.charts.AreaChartRange
import com.esuiss.ui.charts.AreaChartSparkline
import com.esuiss.ui.charts.AreaChartStacked
import com.esuiss.ui.charts.AreaChartStackedExpand
import com.esuiss.ui.charts.AreaChartStep
import com.esuiss.ui.charts.BarChartActive
import com.esuiss.ui.charts.BarChartDefault
import com.esuiss.ui.charts.BarChartHorizontal
import com.esuiss.ui.charts.BarChartHourly
import com.esuiss.ui.charts.BarChartInteractive
import com.esuiss.ui.charts.BarChartLabeled
import com.esuiss.ui.charts.BarChartMultiple
import com.esuiss.ui.charts.BarChartNegative
import com.esuiss.ui.charts.BarChartRange
import com.esuiss.ui.charts.BarChartStacked
import com.esuiss.ui.charts.LineChartDefault
import com.esuiss.ui.charts.LineChartDots
import com.esuiss.ui.charts.LineChartForecast
import com.esuiss.ui.charts.LineChartGoal
import com.esuiss.ui.charts.LineChartGoalDots
import com.esuiss.ui.charts.LineChartInteractive
import com.esuiss.ui.charts.LineChartLabeled
import com.esuiss.ui.charts.LineChartLinear
import com.esuiss.ui.charts.LineChartMultiple
import com.esuiss.ui.charts.LineChartStep
import com.esuiss.ui.charts.PieChartActive
import com.esuiss.ui.charts.PieChartDefault
import com.esuiss.ui.charts.PieChartDonut
import com.esuiss.ui.charts.PieChartDonutText
import com.esuiss.ui.charts.PieChartHalf
import com.esuiss.ui.charts.PieChartInteractive
import com.esuiss.ui.charts.PieChartLabel
import com.esuiss.ui.charts.PieChartLegend
import com.esuiss.ui.charts.PieChartNested
import com.esuiss.ui.charts.PieChartSeparated
import com.esuiss.ui.charts.RadarChartDefault
import com.esuiss.ui.charts.RadarChartDots
import com.esuiss.ui.charts.RadarChartGridCircle
import com.esuiss.ui.charts.RadarChartGridFilled
import com.esuiss.ui.charts.RadarChartGridNone
import com.esuiss.ui.charts.RadarChartInteractive
import com.esuiss.ui.charts.RadarChartLegend
import com.esuiss.ui.charts.RadarChartLinesOnly
import com.esuiss.ui.charts.RadarChartMultiple
import com.esuiss.ui.charts.RadarChartRadiusAxis
import com.esuiss.ui.charts.RadialChartBatteries
import com.esuiss.ui.charts.RadialChartDefault
import com.esuiss.ui.charts.RadialChartGauge
import com.esuiss.ui.charts.RadialChartInteractive
import com.esuiss.ui.charts.RadialChartLabel
import com.esuiss.ui.charts.RadialChartProgress
import com.esuiss.ui.charts.RadialChartRings
import com.esuiss.ui.charts.RadialChartStacked
import com.esuiss.ui.charts.RadialChartText
import com.esuiss.ui.charts.RadialChartTinted
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
import com.esuiss.ui.components.RadarChart
import com.esuiss.ui.components.Switch
import com.esuiss.ui.components.ToggleGroup
import com.esuiss.ui.components.ToggleGroupItem
import com.esuiss.ui.components.ToggleSize
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Palette
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Shadows
import com.esuiss.ui.theme.Typography
import com.esuiss.ui.theme.shadow
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import java.io.File
import java.text.NumberFormat
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Locale

private class Visitors(val month: String, val desktop: Double, val mobile: Double)

private val visitors = listOf(
    Visitors("January", 186.0, 80.0),
    Visitors("February", 305.0, 200.0),
    Visitors("March", 237.0, 120.0),
    Visitors("April", 173.0, 190.0),
    Visitors("May", 209.0, 130.0),
    Visitors("June", 264.0, 140.0),
)

private val visitorsConfig = ChartConfig(
    "desktop" to ChartConfigItem("Desktop") { chart1 },
    "mobile" to ChartConfigItem("Mobile") { chart2 },
)

private val iconConfig = ChartConfig(
    "desktop" to ChartConfigItem("Desktop", PhosphorIcons.Regular.Desktop) { chart1 },
    "mobile" to ChartConfigItem("Mobile", PhosphorIcons.Regular.DeviceMobile) { chart2 },
)

@Composable
private fun TooltipCard(title: String, description: String, content: @Composable () -> Unit) {
    Card(variant = CardVariant.Filled, size = CardSize.Sm) {
        CardHeader(title, description = description)
        CardContent { content() }
    }
}

@Composable
private fun StackedVisitors(
    title: String,
    description: String,
    config: ChartConfig = visitorsConfig,
    defaultIndex: Int = 2,
    tooltip: @Composable com.esuiss.ui.components.ChartTooltipScope.() -> Unit,
) {
    TooltipCard(title, description) {
        ChartContainer(config, Modifier.fillMaxWidth().height(208.dp)) {
            BarChart(visitors, margin = ChartMargin(top = 70.dp, right = 4.dp, bottom = 0.dp, left = 4.dp), accessibilityLabel = title) {
                XAxis(label = { it.month }, tickMargin = 8.dp, interval = 0, tickFormatter = { it.take(3) })
                ChartTooltip(defaultIndex = defaultIndex, cursor = null, content = tooltip)
                Bar("desktop", value = { it.desktop }, stackId = "a", radius = ChartRadius(0.dp, 0.dp, 4.dp, 4.dp), maxBarSize = 30.dp)
                Bar("mobile", value = { it.mobile }, stackId = "a", radius = ChartRadius(4.dp, 4.dp, 0.dp, 0.dp), maxBarSize = 30.dp)
            }
        }
    }
}

private class Energy(val date: Calendar, val energy: Double)

private fun energy(values: List<Int>, year: Int, month: Int, day: Int) = values.mapIndexed { index, value ->
    Energy(Calendar.getInstance().apply { clear(); set(year, month, day + index, 12, 0) }, value.toDouble())
}

private val energyValues = listOf(512, 604, 455, 389, 662, 598, 431, 520, 690, 447, 575, 402, 633, 558)

private val energyConfig = ChartConfig("energy" to ChartConfigItem("Active energy") { Palette.red500 })

@Composable
private fun TooltipFormatter() {
    val colors = EsuissTheme.colors
    val data = remember { energy(energyValues.takeLast(7), 2026, Calendar.OCTOBER, 0) }
    val weekday = remember { SimpleDateFormat("EEE", Locale.US) }
    val number = remember { NumberFormat.getNumberInstance(Locale.US) }
    TooltipCard("With units", "A unit next to the value") {
        ChartContainer(energyConfig, Modifier.fillMaxWidth().height(208.dp)) {
            BarChart(data, margin = ChartMargin(top = 70.dp, right = 4.dp, bottom = 0.dp, left = 4.dp), accessibilityLabel = "With units") {
                XAxis(label = { weekday.format(it.date.time) }, tickMargin = 8.dp, interval = 0)
                ChartTooltip(defaultIndex = 3, cursor = null) {
                    ChartTooltipContent(
                        hideLabel = true,
                        formatter = { item ->
                            Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                BasicText("Active energy", Modifier.alignByBaseline(), style = Typography.xs.copy(color = colors.mutedForeground))
                                BasicText(
                                    number.format(item.value),
                                    Modifier.alignByBaseline(),
                                    style = Typography.xs.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold, fontFeatureSettings = "tnum"),
                                )
                                BasicText("kcal", Modifier.alignByBaseline(), style = Typography.xs.copy(color = colors.mutedForeground))
                            }
                        },
                    )
                }
                Bar("energy", value = { it.energy }, radius = ChartRadius(4.dp), maxBarSize = 26.dp)
            }
        }
    }
}

@Composable
private fun TooltipLabelFormatter() {
    val colors = EsuissTheme.colors
    val data = remember { energy(energyValues, 2026, Calendar.SEPTEMBER, 23) }
    val longDate = remember { SimpleDateFormat("EEEE, MMMM d", Locale.US) }
    TooltipCard("Custom label", "The date written out in full") {
        ChartContainer(energyConfig, Modifier.fillMaxWidth().height(208.dp)) {
            AreaChart(data, margin = ChartMargin(top = 70.dp, right = 12.dp, bottom = 0.dp, left = 12.dp), accessibilityLabel = "Custom label") {
                XAxis(label = { it.date.get(Calendar.DAY_OF_MONTH).toString() }, tickMargin = 8.dp, interval = 2)
                ChartTooltip(defaultIndex = 8) {
                    ChartTooltipContent(
                        indicator = ChartTooltipIndicator.Line,
                        labelFormatter = { _, items ->
                            BasicText(
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

private class Steps(val day: String, val steps: Double)

@Composable
private fun TooltipCustom() {
    val colors = EsuissTheme.colors
    val data = listOf(
        Steps("Monday", 8412.0), Steps("Tuesday", 10230.0), Steps("Wednesday", 6120.0), Steps("Thursday", 12480.0),
        Steps("Friday", 9050.0), Steps("Saturday", 14320.0), Steps("Sunday", 4870.0),
    )
    val number = remember { NumberFormat.getNumberInstance(Locale.US) }
    TooltipCard("Custom content", "A tooltip built from scratch") {
        ChartContainer(ChartConfig("steps" to ChartConfigItem("Steps") { chart4 }), Modifier.fillMaxWidth().height(208.dp)) {
            BarChart(data, margin = ChartMargin(top = 70.dp, right = 4.dp, bottom = 0.dp, left = 4.dp), accessibilityLabel = "Custom content") {
                XAxis(label = { it.day }, tickMargin = 8.dp, interval = 0, tickFormatter = { it.take(3) })
                ChartTooltip(defaultIndex = 5, cursor = null) {
                    val entry = items.first()
                    val shape = RoundedCornerShape(Radius.xl)
                    Column(
                        Modifier
                            .widthIn(min = 112.dp)
                            .shadow(Shadows.lg, shape)
                            .background(colors.card, shape)
                            .padding(horizontal = 12.dp, vertical = 8.dp),
                    ) {
                        BasicText("TOTAL", style = Typography.xs.copy(color = colors.mutedForeground, fontWeight = FontWeight.SemiBold))
                        Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                            BasicText(
                                number.format(entry.value),
                                Modifier.alignByBaseline(),
                                style = Typography.xl2.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold, fontFeatureSettings = "tnum"),
                            )
                            BasicText("steps", Modifier.alignByBaseline(), style = Typography.xs.copy(color = colors.mutedForeground, fontWeight = FontWeight.SemiBold))
                        }
                        BasicText(label, style = Typography.xs.copy(color = colors.mutedForeground))
                    }
                }
                Bar("steps", value = { it.steps }, radius = ChartRadius(4.dp), maxBarSize = 26.dp)
            }
        }
    }
}

private class Revenue(val quarter: String, val phones: Double, val laptops: Double, val services: Double)

@Composable
private fun TooltipInteractive() {
    val colors = EsuissTheme.colors
    var indicator by remember { mutableStateOf("dot") }
    var showTotal by remember { mutableStateOf(true) }
    var hideLabel by remember { mutableStateOf(false) }
    var hideIndicator by remember { mutableStateOf(false) }
    val data = listOf(
        Revenue("Q1 25", 69.1, 9.0, 26.3), Revenue("Q2 25", 46.8, 8.0, 26.6), Revenue("Q3 25", 44.6, 8.0, 27.4),
        Revenue("Q4 25", 46.2, 8.7, 28.8), Revenue("Q1 26", 71.0, 9.5, 29.1), Revenue("Q2 26", 49.4, 8.6, 29.4),
        Revenue("Q3 26", 47.3, 8.9, 30.1), Revenue("Q4 26", 49.0, 9.3, 31.2),
    )
    val config = ChartConfig(
        "phones" to ChartConfigItem("Phones") { chart1 },
        "laptops" to ChartConfigItem("Laptops") { chart2 },
        "services" to ChartConfigItem("Services") { Palette.purple500 },
    )
    val billions = remember { NumberFormat.getNumberInstance(Locale.US).apply { minimumFractionDigits = 1; maximumFractionDigits = 1 } }
    Card(variant = CardVariant.Filled, size = CardSize.Sm) {
        CardContent {
            Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                BasicText("Tooltip settings", style = Typography.lg.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold))
                BasicText(
                    "Quarterly revenue · billions · sample data. Change the settings and touch the bars.",
                    style = Typography.sm.copy(color = colors.mutedForeground),
                )
            }
        }
        CardContent {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                BasicText("Indicator", style = Typography.xs.copy(color = colors.mutedForeground, fontWeight = FontWeight.SemiBold))
                ToggleGroup(value = indicator, onValueChange = { if (it != null) indicator = it }, size = ToggleSize.Sm, spacing = 0) {
                    ToggleGroupItem("Dot", "dot")
                    ToggleGroupItem("Line", "line")
                    ToggleGroupItem("Dashed", "dashed")
                }
                for ((label, value, change) in listOf(
                    Triple("Total in title", showTotal) { it: Boolean -> showTotal = it },
                    Triple("Hide title", hideLabel) { it: Boolean -> hideLabel = it },
                    Triple("Hide indicator", hideIndicator) { it: Boolean -> hideIndicator = it },
                )) {
                    Row(horizontalArrangement = Arrangement.spacedBy(10.dp), verticalAlignment = Alignment.CenterVertically) {
                        Switch(value, change)
                        BasicText(label, style = Typography.sm.copy(color = colors.foreground))
                    }
                }
            }
        }
        CardContent {
            ChartContainer(config, Modifier.fillMaxWidth().height(288.dp)) {
                BarChart(data, margin = ChartMargin(top = 10.dp, right = 4.dp, bottom = 0.dp, left = 12.dp), accessibilityLabel = "Tooltip settings") {
                    CartesianGrid(strokeDasharray = listOf(2f, 4f))
                    XAxis(label = { it.quarter }, tickMargin = 8.dp, minTickGap = 8.dp)
                    YAxis(orientation = ChartAxisOrientation.Right, tickMargin = 6.dp, tickFormatter = { "${it.toInt()}B" })
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
                                        BasicText(label, Modifier.weight(1f), style = Typography.xs.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold))
                                        BasicText(
                                            "${billions.format(items.sumOf { it.value })}B",
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


private class DeviceShare(val device: String, val users: Double)

private val devices = listOf(
    DeviceShare("phone", 275.0),
    DeviceShare("laptop", 200.0),
    DeviceShare("tablet", 187.0),
    DeviceShare("watch", 173.0),
    DeviceShare("other", 90.0),
)

private val deviceConfig = ChartConfig(
    "users" to ChartConfigItem("Users"),
    "phone" to ChartConfigItem("Phone") { chart1 },
    "laptop" to ChartConfigItem("Laptop") { chart2 },
    "tablet" to ChartConfigItem("Tablet") { chart3 },
    "watch" to ChartConfigItem("Watch") { chart4 },
    "other" to ChartConfigItem("Other") { chart5 },
    "desktop" to ChartConfigItem("Desktop") { chart1 },
    "mobile" to ChartConfigItem("Mobile") { chart2 },
    "value" to ChartConfigItem("Air quality") { Palette.green500 },
)

@Composable
private fun PolarRow(first: @Composable () -> Unit, second: @Composable () -> Unit) {
    Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
        Box(Modifier.weight(1f).height(184.dp)) { ChartContainer(deviceConfig, Modifier.fillMaxSize()) { first() } }
        Box(Modifier.weight(1f).height(184.dp)) { ChartContainer(deviceConfig, Modifier.fillMaxSize()) { second() } }
    }
}

@Composable
private fun PolarPies() {
    val colors = EsuissTheme.colors
    Card(variant = CardVariant.Filled, size = CardSize.Sm) {
        CardHeader("Pie base", description = "Default, active, separated, half, label, nested")
        CardContent {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                PolarRow(
                    {
                        PieChart(accessibilityLabel = "Pie default") {
                            ChartTooltip(defaultIndex = 0) { ChartTooltipContent(hideLabel = true) }
                            Pie(devices, value = { it.users }, nameKey = { it.device }, outerRadius = 0.85f, stroke = colors.muted, strokeWidth = 2.dp)
                        }
                    },
                    {
                        PieChart(accessibilityLabel = "Pie active") {
                            Pie(
                                devices,
                                value = { it.users },
                                nameKey = { it.device },
                                innerRadius = 0.5f,
                                outerRadius = 0.78f,
                                strokeWidth = 0.dp,
                                sectors = { index -> if (index == 0) ChartSector(10.dp, ChartRing(3.dp, 3.dp)) else ChartSector() },
                            )
                        }
                    },
                )
                PolarRow(
                    {
                        PieChart(accessibilityLabel = "Pie separated") {
                            ChartTooltip { ChartTooltipContent(hideLabel = true) }
                            Pie(devices, value = { it.users }, nameKey = { it.device }, innerRadius = 0.55f, outerRadius = 0.85f, paddingAngle = 5f, cornerRadius = 8.dp)
                        }
                    },
                    {
                        PieChart(accessibilityLabel = "Pie half") {
                            Pie(
                                devices,
                                value = { it.users },
                                nameKey = { it.device },
                                cy = 0.88f,
                                startAngle = 180f,
                                endAngle = 0f,
                                innerRadius = 1.05f,
                                outerRadius = 1.5f,
                                paddingAngle = 1.5f,
                                cornerRadius = 4.dp,
                            )
                        }
                    },
                )
                PolarRow(
                    {
                        PieChart(accessibilityLabel = "Pie label") {
                            Pie(
                                devices,
                                value = { it.users },
                                nameKey = { it.device },
                                outerRadius = 0.55f,
                                stroke = colors.muted,
                                strokeWidth = 2.dp,
                                label = { index -> deviceConfig[devices[index].device]?.label ?: "" },
                                labelLine = colors.input,
                            )
                        }
                    },
                    {
                        PieChart(accessibilityLabel = "Pie nested") {
                            ChartTooltip(defaultIndex = 3) { ChartTooltipContent(hideLabel = true) }
                            Pie(devices.take(2), value = { it.users }, nameKey = { it.device }, outerRadius = 0.52f, stroke = colors.muted, strokeWidth = 2.dp, fillOpacity = 0.55f)
                            Pie(devices, value = { it.users }, nameKey = { it.device }, innerRadius = 0.6f, outerRadius = 0.86f, stroke = colors.muted, strokeWidth = 2.dp)
                        }
                    },
                )
            }
        }
    }
}

private class Gauge(val value: Double)

@Composable
private fun PolarRadial() {
    val colors = EsuissTheme.colors
    Card(variant = CardVariant.Filled, size = CardSize.Sm) {
        CardHeader("Radial base", description = "Rings, gauge, stacked half, labels")
        CardContent {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                PolarRow(
                    {
                        RadialBarChart(devices.take(4), innerRadius = 0.25f, outerRadius = 1f, barSize = 12.dp, accessibilityLabel = "Radial default") {
                            ChartTooltip(defaultIndex = 1) { ChartTooltipContent(hideLabel = true) }
                            RadialBar("users", value = { it.users }, nameKey = { it.device }, background = colors.secondary, cornerRadius = 10.dp)
                        }
                    },
                    {
                        RadialBarChart(
                            listOf(Gauge(38.0)),
                            innerRadius = 0.72f,
                            outerRadius = 1f,
                            startAngle = 210f,
                            endAngle = -30f,
                            barSize = 14.dp,
                            accessibilityLabel = "Gauge",
                        ) {
                            PolarAngleAxis(0.0..100.0)
                            RadialBar("value", value = { it.value }, cornerRadius = 20.dp, background = Palette.green500.copy(alpha = 0.22f))
                        }
                    },
                )
                PolarRow(
                    {
                        RadialBarChart(
                            listOf(Visitors("January", 1260.0, 570.0)),
                            startAngle = 180f,
                            endAngle = 0f,
                            innerRadius = 1.2f,
                            outerRadius = 1.7f,
                            cy = 0.86f,
                            accessibilityLabel = "Stacked",
                        ) {
                            PolarAngleAxis(0.0..1830.0)
                            ChartTooltip(defaultIndex = 0) { ChartTooltipContent(hideLabel = true) }
                            RadialBar("desktop", value = { it.desktop }, stackId = "a", cornerRadius = 6.dp, stroke = colors.muted, strokeWidth = 3.dp)
                            RadialBar("mobile", value = { it.mobile }, stackId = "a", cornerRadius = 6.dp, stroke = colors.muted, strokeWidth = 3.dp)
                        }
                    },
                    {
                        RadialBarChart(
                            devices.take(4),
                            innerRadius = 0.28f,
                            outerRadius = 1f,
                            barSize = 16.dp,
                            startAngle = 90f,
                            endAngle = -200f,
                            accessibilityLabel = "Radial label",
                        ) {
                            RadialBar(
                                "users",
                                value = { it.users },
                                nameKey = { it.device },
                                cornerRadius = 10.dp,
                                background = colors.secondary,
                                labelList = ChartLabelList(
                                    ChartLabelPosition.InsideStart,
                                    fontSize = 11.sp,
                                    formatter = { index, _ -> deviceConfig[devices[index].device]?.label ?: "" },
                                ),
                            )
                        }
                    },
                )
            }
        }
    }
}

private class Skill(val skill: String, val thisMonth: Double, val lastMonth: Double)

private val skills = listOf(
    Skill("Cardio", 86.0, 72.0),
    Skill("Strength", 62.0, 58.0),
    Skill("Flexibility", 48.0, 55.0),
    Skill("Balance", 70.0, 60.0),
    Skill("Endurance", 80.0, 66.0),
    Skill("Speed", 74.0, 70.0),
)

private val skillsConfig = ChartConfig(
    "thisMonth" to ChartConfigItem("This month") { Palette.green500 },
    "lastMonth" to ChartConfigItem("Last month") { chart5 },
)

@Composable
private fun RadarSelected(indicator: ChartTooltipIndicator, defaultIndex: Int) {
    val colors = EsuissTheme.colors
    TooltipCard("Default selection", "Selected on first render") {
        ChartContainer(skillsConfig, Modifier.fillMaxWidth().height(224.dp)) {
            RadarChart(skills, outerRadius = 0.7f, accessibilityLabel = "Default selection") {
                ChartTooltip(defaultIndex = defaultIndex) { ChartTooltipContent(indicator = indicator) }
                PolarGrid(stroke = colors.border)
                PolarAngleAxis(label = { it.skill })
                Radar("lastMonth", value = { it.lastMonth }, fillOpacity = 0.18f, strokeWidth = 2.dp)
                Radar("thisMonth", value = { it.thisMonth }, fillOpacity = 0.18f, strokeWidth = 2.dp)
            }
        }
    }
}

private enum class RadarScene(val content: @Composable () -> Unit) {
    DefaultDots({
        RadarChartDefault()
        RadarChartDots()
    }),
    GridCircleFilled({
        RadarChartGridCircle()
        RadarChartGridFilled()
    }),
    GridNoneRadiusAxis({
        RadarChartGridNone()
        RadarChartRadiusAxis()
    }),
    LinesOnlyMultiple({
        RadarChartLinesOnly()
        RadarChartMultiple()
    }),
    Legend({ RadarChartLegend() }),
    Selected({
        RadarSelected(ChartTooltipIndicator.Line, 1)
        RadarSelected(ChartTooltipIndicator.Dot, 3)
    }),
    MultipleTouched({ RadarChartMultiple() }),
    Interactive({ RadarChartInteractive() }),
    InteractiveTouched({ RadarChartInteractive() }),
}

private enum class ChartScene(val content: @Composable () -> Unit) {
    TooltipDotLine({
        StackedVisitors("Dot indicator", "The default") { ChartTooltipContent(indicator = ChartTooltipIndicator.Dot) }
        StackedVisitors("Line indicator", "indicator=\"line\"") { ChartTooltipContent(indicator = ChartTooltipIndicator.Line) }
    }),
    TooltipDashedNoIndicator({
        StackedVisitors("Dashed indicator", "indicator=\"dashed\"") { ChartTooltipContent(indicator = ChartTooltipIndicator.Dashed) }
        StackedVisitors("No indicator", "Just the name and value") { ChartTooltipContent(hideIndicator = true) }
    }),
    TooltipNoLabelIcons({
        StackedVisitors("No label", "The month is hidden") { ChartTooltipContent(hideLabel = true) }
        StackedVisitors("With icons", "An icon instead of a color", iconConfig, 3) { ChartTooltipContent() }
    }),
    TooltipFormatters({
        TooltipFormatter()
        TooltipLabelFormatter()
    }),
    TooltipCustom({ TooltipCustom() }),
    TooltipInteractive({ TooltipInteractive() }),
    TooltipInteractiveLine({ TooltipInteractive() }),
    LineDefaultLinear({
        LineChartDefault()
        LineChartLinear()
    }),
    LineStepMultiple({
        LineChartStep()
        LineChartMultiple()
    }),
    LineLabeledDots({
        LineChartLabeled()
        LineChartDots()
    }),
    LineGoals({
        LineChartGoal()
        LineChartGoalDots()
    }),
    LineForecastTouched({
        LineChartForecast()
        LineChartDefault()
    }),
    LineInteractive({ LineChartInteractive() }),
    LineInteractiveSelected({ LineChartInteractive() }),
    AreaDefaultLinear({
        AreaChartDefault()
        AreaChartLinear()
    }),
    AreaStepStacked({
        AreaChartStep()
        AreaChartStacked()
    }),
    AreaExpandGradient({
        AreaChartStackedExpand()
        AreaChartGradient()
    }),
    AreaAxesRange({
        AreaChartAxes()
        AreaChartRange()
    }),
    AreaSparkline({ AreaChartSparkline() }),
    AreaInteractive({ AreaChartInteractive() }),
    AreaInteractiveSelected({ AreaChartInteractive() }),
    BarDefaultLabeled({
        BarChartDefault()
        BarChartLabeled()
    }),
    BarMultipleStacked({
        BarChartMultiple()
        BarChartStacked()
    }),
    BarHorizontalNegative({
        BarChartHorizontal()
        BarChartNegative()
    }),
    BarRangeHourly({
        BarChartRange()
        BarChartHourly()
    }),
    BarActive({ BarChartActive() }),
    BarInteractive({ BarChartInteractive() }),
    BarInteractiveSelected({ BarChartInteractive() }),
    BarInteractiveDay({ BarChartInteractive() }),
    PolarPies({ PolarPies() }),
    PolarRadial({ PolarRadial() }),
    PolarSelected({ PolarPies() }),
    PieDefaultDonut({
        PieChartDefault()
        PieChartDonut()
    }),
    PieDonutTextHalf({
        PieChartDonutText()
        PieChartHalf()
    }),
    PieLabelLegend({
        PieChartLabel()
        PieChartLegend()
    }),
    PieNestedSeparated({
        PieChartNested()
        PieChartSeparated()
    }),
    PieActive({ PieChartActive() }),
    PieActiveTouched({ PieChartActive() }),
    PieHalfTouched({ PieChartHalf() }),
    PieInteractive({ PieChartInteractive() }),
    PieInteractiveCloud({ PieChartInteractive() }),
    RadialDefaultLabel({
        RadialChartDefault()
        RadialChartLabel()
    }),
    RadialGaugeProgress({
        RadialChartGauge()
        RadialChartProgress()
    }),
    RadialTextStacked({
        RadialChartText()
        RadialChartStacked()
    }),
    RadialTintedBatteries({
        RadialChartTinted()
        RadialChartBatteries()
    }),
    RadialRings({ RadialChartRings() }),
    RadialTintedTouched({ RadialChartTinted() }),
    RadialInteractive({ RadialChartInteractive() }),
    RadialInteractiveMonday({ RadialChartInteractive() }),
}

@RunWith(AndroidJUnit4::class)
class ChartsGalleryTest {
    @get:Rule
    val compose = createComposeRule()

    @Test
    fun rendersChartsInBothSchemes() {
        var dark by mutableStateOf(false)
        var scene by mutableStateOf(ChartScene.TooltipDotLine)
        compose.setContent {
            EsuissTheme(darkTheme = dark) {
                Column(
                    modifier = Modifier
                        .testTag("charts")
                        .width(402.dp)
                        .background(EsuissTheme.colors.background)
                        .padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp),
                ) {
                    key(scene, dark) { scene.content() }
                }
            }
        }
        val context = InstrumentationRegistry.getInstrumentation().targetContext
        for (current in ChartScene.entries) {
            for (scheme in listOf(false, true)) {
                scene = current
                dark = scheme
                compose.waitForIdle()
                interact(current)
                compose.waitForIdle()
                val bitmap = compose.onNodeWithTag("charts").captureToImage().asAndroidBitmap()
                val name = "charts-${current.name.lowercase()}-${if (scheme) "dark" else "light"}.png"
                File(context.getExternalFilesDir(null), name).outputStream().use {
                    bitmap.compress(Bitmap.CompressFormat.PNG, 100, it)
                }
            }
        }
    }


    @Test
    fun rendersRadarChartsInBothSchemes() {
        var dark by mutableStateOf(false)
        var scene by mutableStateOf(RadarScene.DefaultDots)
        compose.setContent {
            EsuissTheme(darkTheme = dark) {
                Column(
                    modifier = Modifier
                        .testTag("charts")
                        .width(402.dp)
                        .background(EsuissTheme.colors.background)
                        .padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp),
                ) {
                    key(scene, dark) { scene.content() }
                }
            }
        }
        val context = InstrumentationRegistry.getInstrumentation().targetContext
        for (current in RadarScene.entries) {
            for (scheme in listOf(false, true)) {
                scene = current
                dark = scheme
                compose.waitForIdle()
                interactRadar(current)
                compose.waitForIdle()
                val bitmap = compose.onNodeWithTag("charts").captureToImage().asAndroidBitmap()
                val name = "radar-${current.name.lowercase()}-${if (scheme) "dark" else "light"}.png"
                File(context.getExternalFilesDir(null), name).outputStream().use {
                    bitmap.compress(Bitmap.CompressFormat.PNG, 100, it)
                }
            }
        }
    }

    private fun interactRadar(scene: RadarScene) {
        when (scene) {
            RadarScene.DefaultDots -> compose.onNodeWithContentDescription("Radar chart, Cardio, Strength", substring = true).assertExists()
            RadarScene.Selected -> {
                compose.onNodeWithText("Strength").assertExists()
                compose.onNodeWithText("Balance").assertExists()
                compose.onAllNodesWithText("62").assertCountEquals(1)
                compose.onAllNodesWithText("70").assertCountEquals(1)
            }
            RadarScene.MultipleTouched -> {
                val chart = compose.onNodeWithContentDescription("Comparison", substring = true)
                chart.performTouchInput { click(Offset(width * 0.5f, height * 0.95f)) }
                compose.waitForIdle()
                compose.onNodeWithText("Balance").assertExists()
                compose.onNodeWithText("This month").assertExists()
                chart.performTouchInput { click(Offset(width * 0.5f, height * 0.95f)) }
                compose.waitForIdle()
                compose.onNodeWithText("Balance").assertDoesNotExist()
                chart.performTouchInput { click(Offset(width * 0.8f, height * 0.3f)) }
                compose.waitForIdle()
                compose.onNodeWithText("Strength").assertExists()
                compose.onNodeWithText("62").assertExists()
            }
            RadarScene.Interactive -> {
                compose.onAllNodesWithText("Overall score").assertCountEquals(2)
                compose.onAllNodesWithText("82").assertCountEquals(2)
            }
            RadarScene.InteractiveTouched -> {
                compose.onNodeWithText("Phone").performClick()
                compose.waitForIdle()
                compose.onAllNodesWithText("Overall score").assertCountEquals(3)
                compose.onNodeWithContentDescription("Compare phone models", substring = true).performTouchInput {
                    click(Offset(width * 0.5f + width * 0.3f, height * 0.5f - width * 0.17f))
                }
                compose.waitForIdle()
                compose.onAllNodesWithText("Battery").assertCountEquals(4)
                compose.onNodeWithText("Performance").assertDoesNotExist()
            }
            else -> Unit
        }
    }

    private fun interact(scene: ChartScene) {
        when (scene) {
            ChartScene.TooltipDotLine -> compose.onAllNodesWithText("March").assertCountEquals(2)
            ChartScene.TooltipNoLabelIcons -> {
                compose.onAllNodesWithText("March").assertCountEquals(0)
                compose.onNodeWithText("April").assertExists()
            }
            ChartScene.TooltipFormatters -> {
                compose.onNodeWithText("kcal").assertExists()
                compose.onNodeWithText("Thursday, October 1").assertExists()
            }
            ChartScene.TooltipCustom -> compose.onNodeWithText("14,320").assertExists()
            ChartScene.TooltipInteractive -> compose.onNodeWithText("109.6B").assertExists()
            ChartScene.TooltipInteractiveLine -> {
                compose.onNodeWithText("Line").performClick()
                compose.onNodeWithText("Total in title").assertExists()
                compose.onNodeWithContentDescription("Tooltip settings", substring = true).performTouchInput {
                    click(Offset(width * 0.08f, height * 0.5f))
                }
                compose.waitForIdle()
                compose.onNodeWithText("Q1 25").assertExists()
            }
            ChartScene.LineForecastTouched -> {
                compose.onNodeWithContentDescription("Line chart", substring = true).performTouchInput {
                    swipeRight(startX = width * 0.2f, endX = width * 0.62f, durationMillis = 600)
                }
                compose.waitForIdle()
                compose.onNodeWithText("Desktop").assertExists()
            }
            ChartScene.LineInteractiveSelected -> {
                compose.onNodeWithText("High").performClick()
                compose.onNodeWithText("Izmir").performClick()
                compose.waitForIdle()
                compose.onNodeWithContentDescription("Monthly temperature", substring = true).performTouchInput {
                    click(Offset(width * 0.5f, height * 0.5f))
                }
                compose.waitForIdle()
                compose.onAllNodesWithText(" · ", substring = true).assertCountEquals(5)
            }
            ChartScene.AreaInteractiveSelected -> {
                compose.onNodeWithText("1Y").performClick()
                compose.waitForIdle()
                compose.onNodeWithContentDescription("ACME", substring = true).performTouchInput {
                    swipeRight(startX = width * 0.2f, endX = width * 0.5f, durationMillis = 600)
                }
                compose.waitForIdle()
                compose.onNodeWithText("Past year").assertDoesNotExist()
            }
            ChartScene.BarActive -> {
                compose.onNodeWithContentDescription("Steps", substring = true).performTouchInput {
                    click(Offset(width * 0.08f, height * 0.6f))
                }
                compose.waitForIdle()
                compose.onNodeWithText("8,412").assertExists()
                compose.onNodeWithText("Monday · select a bar").assertExists()
            }
            ChartScene.BarInteractiveSelected -> {
                compose.onNodeWithContentDescription("Screen time this week", substring = true).performTouchInput {
                    click(Offset(width * 0.75f, height * 0.6f))
                }
                compose.waitForIdle()
                compose.onAllNodesWithText("Saturday").assertCountEquals(2)
            }
            ChartScene.BarInteractiveDay -> {
                compose.onNodeWithText("Day").performClick()
                compose.waitForIdle()
                compose.onNodeWithText("Sunday").assertExists()
            }
            ChartScene.PolarPies -> compose.onNodeWithText("Phone").assertExists()
            ChartScene.PolarSelected -> {
                compose.onNodeWithContentDescription("Pie separated", substring = true).performTouchInput {
                    click(Offset(width * 0.5f, height * 0.2f))
                }
                compose.waitForIdle()
                compose.onAllNodesWithText("Phone").assertCountEquals(2)
            }
            ChartScene.PieActive -> {
                compose.onNodeWithText("Phone").assertExists()
                compose.onNodeWithText("275").assertExists()
            }
            ChartScene.PieActiveTouched -> {
                compose.onNodeWithContentDescription("Highlighted slice", substring = true).performTouchInput {
                    click(Offset(width * 0.5f - 48.dp.toPx(), height * 0.5f + 40.dp.toPx()))
                }
                compose.waitForIdle()
                compose.onNodeWithText("Tablet").assertExists()
                compose.onNodeWithText("187").assertExists()
            }
            ChartScene.PieHalfTouched -> {
                compose.onNodeWithContentDescription("Half circle", substring = true).performTouchInput {
                    click(Offset(width * 0.5f - 91.dp.toPx(), 151.dp.toPx() - 52.dp.toPx()))
                }
                compose.waitForIdle()
                compose.onNodeWithText("40%").assertExists()
            }
            ChartScene.PieInteractive -> compose.onNodeWithText("Used").assertExists()
            ChartScene.PieInteractiveCloud -> {
                compose.onNodeWithText("Cloud").performClick()
                compose.waitForIdle()
                compose.onNodeWithText("Backups").performClick()
                compose.waitForIdle()
                compose.onNodeWithText("Cloud storage").assertExists()
                compose.onNodeWithText("156.5 GB of 200 GB used").assertExists()
                compose.onAllNodesWithText("Backups").assertCountEquals(2)
                compose.onAllNodesWithText("31.4 GB").assertCountEquals(2)
            }
            ChartScene.RadialDefaultLabel -> compose.onNodeWithContentDescription("Radial chart", substring = true).assertExists()
            ChartScene.RadialTintedTouched -> {
                compose.onNodeWithContentDescription("Tinted track", substring = true).performTouchInput {
                    click(Offset(width * 0.5f, height * 0.5f - height * 0.45f))
                }
                compose.waitForIdle()
                compose.onNodeWithText("Watch").assertExists()
                compose.onNodeWithText("173").assertExists()
            }
            ChartScene.RadialInteractive -> compose.onNodeWithText("486/600").assertExists()
            ChartScene.RadialInteractiveMonday -> {
                compose.onNodeWithContentDescription("Monday").performClick()
                compose.waitForIdle()
                compose.onNodeWithText("520/600").assertExists()
                compose.onNodeWithText("113% · goal met").assertExists()
            }
            else -> Unit
        }
    }
}
