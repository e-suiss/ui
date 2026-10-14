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

private class BarDefaultRow(val month: String, val desktop: Double, val mobile: Double)

private val chartData = listOf(
    BarDefaultRow("January", 186.0, 80.0),
    BarDefaultRow("February", 305.0, 200.0),
    BarDefaultRow("March", 237.0, 120.0),
    BarDefaultRow("April", 173.0, 190.0),
    BarDefaultRow("May", 209.0, 130.0),
    BarDefaultRow("June", 264.0, 140.0),
)

private val chartConfig = ChartConfig(
    "desktop" to ChartConfigItem("Desktop") { blue },
)

@Composable
fun BarChartDefault(modifier: Modifier = Modifier) {
    Card(modifier, variant = CardVariant.Filled, size = CardSize.Sm) {
        CardHeader("Bar chart", description = "Desktop visitors · January to June")
        CardContent {
            ChartContainer(
                chartConfig,
                Modifier
                    .fillMaxWidth()
                    .height(192.dp),
            ) {
                BarChart(
                    chartData,
                    margin = ChartMargin(top = 10.dp, right = 4.dp, bottom = 0.dp, left = 4.dp),
                    accessibilityLabel = "Bar chart",
                ) {
                    CartesianGrid(strokeDasharray = listOf(2f, 4f))
                    XAxis(label = { it.month }, tickMargin = 8.dp, interval = 0, tickFormatter = { it.take(3) })
                    ChartTooltip(cursor = null) { ChartTooltipContent(hideLabel = true) }
                    Bar("desktop", value = { it.desktop }, radius = ChartRadius(6.dp), maxBarSize = 36.dp)
                }
            }
        }
    }
}
