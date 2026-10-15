package com.esuiss.ui.charts

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.esuiss.ui.components.BarChart
import com.esuiss.ui.components.Card
import com.esuiss.ui.components.CardContent
import com.esuiss.ui.components.CardSize
import com.esuiss.ui.components.CardVariant
import com.esuiss.ui.components.ChartAxisOrientation
import com.esuiss.ui.components.ChartConfig
import com.esuiss.ui.components.ChartConfigItem
import com.esuiss.ui.components.ChartContainer
import com.esuiss.ui.components.ChartMargin
import com.esuiss.ui.components.ChartRadius
import com.esuiss.ui.components.ChartTooltipContent
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Palette
import com.esuiss.ui.theme.Typography

private class HourMinutes(val hour: Int, val minutes: Int)

private val chartData = listOf(
    4, 0, 0, 0, 0, 0, 6, 18, 27, 22, 19, 21, 30, 26, 23, 17, 22, 26, 31, 39, 42, 47, 35, 18,
).mapIndexed { hour, minutes -> HourMinutes(hour, minutes) }

private val chartConfig = ChartConfig(
    "minutes" to ChartConfigItem("Screen time") { chart1 },
)

private val total = chartData.sumOf { it.minutes }

private val average = total.toDouble() / chartData.size

@Composable
fun BarChartHourly(modifier: Modifier = Modifier) {
    val colors = EsuissTheme.colors
    Card(modifier, variant = CardVariant.Filled, size = CardSize.Sm) {
        CardContent {
            Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                BasicText("Screen time", style = Typography.sm.copy(color = colors.primary, fontWeight = FontWeight.SemiBold))
                BasicText(
                    "${total / 60}h ${total % 60}m",
                    style = Typography.xl3.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold, fontFeatureSettings = "tnum"),
                )
                BasicText("Today · hour by hour", style = Typography.sm.copy(color = colors.mutedForeground))
            }
        }
        CardContent {
            ChartContainer(
                chartConfig,
                Modifier
                    .fillMaxWidth()
                    .height(160.dp),
            ) {
                BarChart(
                    chartData,
                    margin = ChartMargin(top = 10.dp, right = 4.dp, bottom = 0.dp, left = 12.dp),
                    accessibilityLabel = "Screen time",
                ) {
                    CartesianGrid(strokeDasharray = listOf(2f, 4f))
                    XAxis(label = { "${it.hour}" }, tickMargin = 8.dp, interval = 0, ticks = listOf(0, 6, 12, 18), tickFormatter = { "$it:00" })
                    YAxis(
                        orientation = ChartAxisOrientation.Right,
                        tickMargin = 6.dp,
                        tickCount = 3,
                        tickFormatter = { "${it.toInt()} min" },
                    )
                    ReferenceLine(average, stroke = Palette.green500, strokeDasharray = listOf(3f, 3f))
                    ChartTooltip(cursor = null) {
                        ChartTooltipContent(
                            hideIndicator = true,
                            labelFormatter = { label, _ ->
                                BasicText("$label:00", style = Typography.xs.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold))
                            },
                            formatter = { item ->
                                BasicText(
                                    "${item.value.toInt()} min",
                                    style = Typography.xs.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold, fontFeatureSettings = "tnum"),
                                )
                            },
                        )
                    }
                    Bar(
                        "minutes",
                        value = { it.minutes.toDouble() },
                        radius = ChartRadius(3.dp, 3.dp, 0.dp, 0.dp),
                        maxBarSize = 8.dp,
                    )
                }
            }
        }
    }
}
