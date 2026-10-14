package com.esuiss.ui.charts

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.esuiss.ui.components.AreaChart
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
import com.esuiss.ui.components.ChartDot
import com.esuiss.ui.components.ChartFill
import com.esuiss.ui.components.ChartMargin
import com.esuiss.ui.components.ChartTooltipContent

private class AreaAxesRow(val month: String, val desktop: Double, val mobile: Double)

private val chartData = listOf(
    AreaAxesRow("January", 186.0, 80.0),
    AreaAxesRow("February", 305.0, 200.0),
    AreaAxesRow("March", 237.0, 120.0),
    AreaAxesRow("April", 173.0, 190.0),
    AreaAxesRow("May", 209.0, 130.0),
    AreaAxesRow("June", 264.0, 140.0),
)

private val chartConfig = ChartConfig(
    "desktop" to ChartConfigItem("Desktop") { blue },
)

@Composable
fun AreaChartAxes(modifier: Modifier = Modifier) {
    Card(modifier, variant = CardVariant.Filled, size = CardSize.Sm) {
        CardHeader("With axes", description = "A value axis on the right")
        CardContent {
            ChartContainer(
                chartConfig,
                Modifier
                    .fillMaxWidth()
                    .height(192.dp),
            ) {
                AreaChart(
                    chartData,
                    margin = ChartMargin(top = 10.dp, right = 4.dp, bottom = 0.dp, left = 12.dp),
                    accessibilityLabel = "With axes",
                ) {
                    CartesianGrid(strokeDasharray = listOf(2f, 4f))
                    XAxis(label = { it.month }, tickMargin = 8.dp, interval = 0, tickFormatter = { it.take(3) })
                    YAxis(orientation = ChartAxisOrientation.Right, tickMargin = 6.dp, tickCount = 4)
                    ChartTooltip { ChartTooltipContent() }
                    Area(
                        "desktop",
                        value = { it.desktop },
                        curve = ChartCurve.Monotone,
                        strokeWidth = 2.dp,
                        fill = ChartFill.VerticalGradient(topAlpha = 0.38f, bottomAlpha = 0.02f),
                        dot = ChartDot(3.dp),
                    )
                }
            }
        }
    }
}
