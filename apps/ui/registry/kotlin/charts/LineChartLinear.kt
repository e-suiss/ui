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

private class LineLinearRow(val month: String, val desktop: Double, val mobile: Double)

private val chartData = listOf(
    LineLinearRow("January", 186.0, 80.0),
    LineLinearRow("February", 305.0, 200.0),
    LineLinearRow("March", 237.0, 120.0),
    LineLinearRow("April", 173.0, 190.0),
    LineLinearRow("May", 209.0, 130.0),
    LineLinearRow("June", 264.0, 140.0),
)

private val chartConfig = ChartConfig(
    "desktop" to ChartConfigItem("Desktop") { blue },
)

@Composable
fun LineChartLinear(modifier: Modifier = Modifier) {
    Card(modifier, variant = CardVariant.Filled, size = CardSize.Sm) {
        CardHeader("Linear", description = "Straight lines between readings")
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
                    accessibilityLabel = "Linear",
                ) {
                    CartesianGrid(strokeDasharray = listOf(2f, 4f))
                    XAxis(label = { it.month }, tickMargin = 8.dp, interval = 0, tickFormatter = { it.take(3) })
                    ChartTooltip { ChartTooltipContent(hideLabel = true) }
                    Line("desktop", value = { it.desktop }, curve = ChartCurve.Linear, strokeWidth = 2.5.dp)
                }
            }
        }
    }
}
