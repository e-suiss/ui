package com.esuiss.ui.charts

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.esuiss.ui.components.Card
import com.esuiss.ui.components.CardContent
import com.esuiss.ui.components.CardHeader
import com.esuiss.ui.components.CardSize
import com.esuiss.ui.components.CardVariant
import com.esuiss.ui.components.ChartConfig
import com.esuiss.ui.components.ChartConfigItem
import com.esuiss.ui.components.ChartContainer
import com.esuiss.ui.components.ChartCurve
import com.esuiss.ui.components.ChartMargin
import com.esuiss.ui.components.ChartTooltipContent
import com.esuiss.ui.components.LineChart

private class LineDefaultRow(val month: String, val desktop: Double, val mobile: Double)

private val chartData = listOf(
    LineDefaultRow("January", 186.0, 80.0),
    LineDefaultRow("February", 305.0, 200.0),
    LineDefaultRow("March", 237.0, 120.0),
    LineDefaultRow("April", 173.0, 190.0),
    LineDefaultRow("May", 209.0, 130.0),
    LineDefaultRow("June", 264.0, 140.0),
)

private val chartConfig = ChartConfig(
    "desktop" to ChartConfigItem("Desktop") { chart1 },
)

@Composable
fun LineChartDefault(modifier: Modifier = Modifier) {
    Card(modifier, variant = CardVariant.Filled, size = CardSize.Sm) {
        CardHeader("Line chart", description = "A smooth curve through each month")
        CardContent {
            ChartContainer(
                chartConfig,
                Modifier
                    .fillMaxWidth()
                    .height(192.dp),
            ) {
                LineChart(
                    chartData,
                    margin = ChartMargin(top = 10.dp, right = 12.dp, bottom = 0.dp, left = 12.dp),
                    accessibilityLabel = "Line chart",
                ) {
                    CartesianGrid(strokeDasharray = listOf(2f, 4f))
                    XAxis(label = { it.month }, tickMargin = 8.dp, interval = 0, tickFormatter = { it.take(3) })
                    ChartTooltip { ChartTooltipContent(hideLabel = true) }
                    Line("desktop", value = { it.desktop }, curve = ChartCurve.Natural, strokeWidth = 2.5.dp)
                }
            }
        }
    }
}
