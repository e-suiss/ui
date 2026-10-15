package com.esuiss.ui.charts

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.esuiss.ui.components.BarChart
import com.esuiss.ui.components.Card
import com.esuiss.ui.components.CardContent
import com.esuiss.ui.components.CardHeader
import com.esuiss.ui.components.CardSize
import com.esuiss.ui.components.CardVariant
import com.esuiss.ui.components.ChartConfig
import com.esuiss.ui.components.ChartConfigItem
import com.esuiss.ui.components.ChartContainer
import com.esuiss.ui.components.ChartMargin
import com.esuiss.ui.components.ChartRadius
import com.esuiss.ui.components.ChartTooltipContent

private class BarStackedRow(val month: String, val desktop: Double, val mobile: Double)

private val chartData = listOf(
    BarStackedRow("January", 186.0, 80.0),
    BarStackedRow("February", 305.0, 200.0),
    BarStackedRow("March", 237.0, 120.0),
    BarStackedRow("April", 173.0, 190.0),
    BarStackedRow("May", 209.0, 130.0),
    BarStackedRow("June", 264.0, 140.0),
)

private val chartConfig = ChartConfig(
    "desktop" to ChartConfigItem("Desktop") { chart1 },
    "mobile" to ChartConfigItem("Mobile") { chart2 },
)

@Composable
fun BarChartStacked(modifier: Modifier = Modifier) {
    Card(modifier, variant = CardVariant.Filled, size = CardSize.Sm) {
        CardHeader("Stacked", description = "With a legend")
        CardContent {
            ChartContainer(
                chartConfig,
                Modifier
                    .fillMaxWidth()
                    .height(224.dp),
            ) {
                BarChart(
                    chartData,
                    margin = ChartMargin(top = 10.dp, right = 4.dp, bottom = 0.dp, left = 4.dp),
                    accessibilityLabel = "Stacked",
                ) {
                    CartesianGrid(strokeDasharray = listOf(2f, 4f))
                    XAxis(label = { it.month }, tickMargin = 8.dp, interval = 0, tickFormatter = { it.take(3) })
                    ChartTooltip(cursor = null) { ChartTooltipContent(hideLabel = true) }
                    ChartLegend()
                    Bar(
                        "desktop",
                        value = { it.desktop },
                        radius = ChartRadius(0.dp, 0.dp, 4.dp, 4.dp),
                        maxBarSize = 36.dp,
                        stackId = "a",
                    )
                    Bar(
                        "mobile",
                        value = { it.mobile },
                        radius = ChartRadius(4.dp, 4.dp, 0.dp, 0.dp),
                        maxBarSize = 36.dp,
                        stackId = "a",
                    )
                }
            }
        }
    }
}
