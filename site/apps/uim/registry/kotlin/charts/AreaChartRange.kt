package com.esuiss.ui.charts

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
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
import com.esuiss.ui.components.ChartFill
import com.esuiss.ui.components.ChartMargin
import com.esuiss.ui.components.ChartTooltipContent
import com.esuiss.ui.components.ChartTooltipIndicator
import com.esuiss.ui.components.ComposedChart
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography

private class HeartRateRow(val hour: String, val low: Int, val high: Int, val average: Int)

private val readings = listOf(
    Triple(48, 62, 54), Triple(46, 60, 52), Triple(47, 64, 54), Triple(45, 61, 52),
    Triple(48, 63, 55), Triple(46, 66, 54), Triple(56, 78, 64), Triple(58, 82, 66),
    Triple(64, 88, 74), Triple(66, 90, 76), Triple(64, 92, 74), Triple(66, 89, 75),
    Triple(65, 94, 76), Triple(66, 90, 75), Triple(64, 88, 74), Triple(65, 91, 76),
    Triple(66, 92, 75), Triple(68, 96, 78), Triple(104, 158, 126), Triple(102, 150, 122),
    Triple(70, 94, 78), Triple(66, 90, 74), Triple(60, 82, 68), Triple(52, 70, 58),
)

private val chartData = readings.mapIndexed { hour, (low, high, average) -> HeartRateRow("$hour:00", low, high, average) }

private val chartConfig = ChartConfig(
    "range" to ChartConfigItem("Range") { red },
    "average" to ChartConfigItem("Average") { red },
)

private val low = chartData.minOf { it.low }

private val high = chartData.maxOf { it.high }

@Composable
fun AreaChartRange(modifier: Modifier = Modifier) {
    val colors = EsuissTheme.colors
    val value = Typography.xs.copy(color = colors.label, fontWeight = FontWeight.SemiBold, fontFeatureSettings = "tnum")
    Card(modifier, variant = CardVariant.Filled, size = CardSize.Sm) {
        CardContent {
            Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                BasicText("Heart rate", style = Typography.sm.copy(color = colors.danger, fontWeight = FontWeight.SemiBold))
                Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                    BasicText(
                        "$low–$high",
                        Modifier.alignByBaseline(),
                        style = Typography.xl3.copy(color = colors.label, fontWeight = FontWeight.SemiBold, fontFeatureSettings = "tnum"),
                    )
                    BasicText(
                        "BPM",
                        Modifier.alignByBaseline(),
                        style = Typography.base.copy(color = colors.labelSecondary, fontWeight = FontWeight.SemiBold),
                    )
                }
                BasicText("Today", style = Typography.sm.copy(color = colors.labelSecondary))
            }
        }
        CardContent {
            ChartContainer(
                chartConfig,
                Modifier
                    .fillMaxWidth()
                    .height(160.dp),
            ) {
                ComposedChart(
                    chartData,
                    margin = ChartMargin(top = 10.dp, right = 4.dp, bottom = 0.dp, left = 16.dp),
                    accessibilityLabel = "Heart rate",
                ) {
                    CartesianGrid(strokeDasharray = listOf(2f, 4f))
                    XAxis(label = { it.hour }, tickMargin = 8.dp, interval = 5)
                    YAxis(
                        orientation = ChartAxisOrientation.Right,
                        tickMargin = 6.dp,
                        domain = 40.0..170.0,
                        ticks = listOf(50.0, 100.0, 150.0),
                        tickFormatter = { it.toInt().toString() },
                    )
                    ChartTooltip {
                        ChartTooltipContent(
                            indicator = ChartTooltipIndicator.Line,
                            formatter = { item ->
                                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                    BasicText(
                                        chartConfig[item.key]?.label ?: item.key,
                                        style = Typography.xs.copy(color = colors.labelSecondary),
                                    )
                                    BasicText(
                                        if (item.base != null) "${item.base.toInt()}–${item.value.toInt()} BPM" else "${item.value.toInt()} BPM",
                                        style = value,
                                    )
                                }
                            },
                        )
                    }
                    Area(
                        "range",
                        value = { it.high.toDouble() },
                        base = { it.low.toDouble() },
                        curve = ChartCurve.Monotone,
                        strokeWidth = 0.dp,
                        fill = ChartFill.Solid(alpha = 0.22f),
                    )
                    Line("average", value = { it.average.toDouble() }, curve = ChartCurve.Monotone, strokeWidth = 2.dp)
                }
            }
        }
    }
}
