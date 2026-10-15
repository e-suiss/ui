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
import com.esuiss.ui.components.ChartFill
import com.esuiss.ui.components.ChartMargin
import com.esuiss.ui.components.ChartStackOffset
import com.esuiss.ui.components.ChartTooltipContent
import com.esuiss.ui.components.ChartTooltipIndicator
import kotlin.math.roundToInt

private class AreaExpandRow(val month: String, val desktop: Double, val mobile: Double)

private val chartData = listOf(
    AreaExpandRow("January", 186.0, 80.0),
    AreaExpandRow("February", 305.0, 200.0),
    AreaExpandRow("March", 237.0, 120.0),
    AreaExpandRow("April", 173.0, 190.0),
    AreaExpandRow("May", 209.0, 130.0),
    AreaExpandRow("June", 264.0, 140.0),
)

private val chartConfig = ChartConfig(
    "desktop" to ChartConfigItem("Desktop") { chart1 },
    "mobile" to ChartConfigItem("Mobile") { chart2 },
)

@Composable
fun AreaChartStackedExpand(modifier: Modifier = Modifier) {
    Card(modifier, variant = CardVariant.Filled, size = CardSize.Sm) {
        CardHeader("Stacked to 100%", description = "Each month adds up to 100%")
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
                    stackOffset = ChartStackOffset.Expand,
                    accessibilityLabel = "Stacked to 100%",
                ) {
                    CartesianGrid(strokeDasharray = listOf(2f, 4f))
                    XAxis(label = { it.month }, tickMargin = 8.dp, interval = 0, tickFormatter = { it.take(3) })
                    YAxis(
                        orientation = ChartAxisOrientation.Right,
                        tickMargin = 6.dp,
                        ticks = listOf(0.0, 0.5, 1.0),
                        tickFormatter = { "${(it * 100).roundToInt()}%" },
                    )
                    ChartTooltip { ChartTooltipContent(indicator = ChartTooltipIndicator.Line) }
                    Area("mobile", value = { it.mobile }, curve = ChartCurve.Natural, fill = ChartFill.Solid(alpha = 0.35f), stackId = "a")
                    Area("desktop", value = { it.desktop }, curve = ChartCurve.Natural, fill = ChartFill.Solid(alpha = 0.35f), stackId = "a")
                }
            }
        }
    }
}
