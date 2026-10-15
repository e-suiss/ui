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
import com.esuiss.ui.components.ChartLabelList
import com.esuiss.ui.components.ChartMargin
import com.esuiss.ui.components.ChartRadius
import com.esuiss.ui.components.ChartTooltipContent
import com.esuiss.ui.theme.EsuissTheme

private class BarLabeledRow(val month: String, val desktop: Double, val mobile: Double)

private val chartData = listOf(
    BarLabeledRow("January", 186.0, 80.0),
    BarLabeledRow("February", 305.0, 200.0),
    BarLabeledRow("March", 237.0, 120.0),
    BarLabeledRow("April", 173.0, 190.0),
    BarLabeledRow("May", 209.0, 130.0),
    BarLabeledRow("June", 264.0, 140.0),
)

private val chartConfig = ChartConfig(
    "desktop" to ChartConfigItem("Desktop") { chart1 },
)

@Composable
fun BarChartLabeled(modifier: Modifier = Modifier) {
    val colors = EsuissTheme.colors
    Card(modifier, variant = CardVariant.Filled, size = CardSize.Sm) {
        CardHeader("Labeled", description = "The value sits above each bar")
        CardContent {
            ChartContainer(
                chartConfig,
                Modifier
                    .fillMaxWidth()
                    .height(192.dp),
            ) {
                BarChart(
                    chartData,
                    margin = ChartMargin(top = 22.dp, right = 4.dp, bottom = 0.dp, left = 4.dp),
                    accessibilityLabel = "Labeled",
                ) {
                    XAxis(label = { it.month }, tickMargin = 8.dp, interval = 0, tickFormatter = { it.take(3) })
                    ChartTooltip(cursor = null) { ChartTooltipContent(hideLabel = true) }
                    Bar(
                        "desktop",
                        value = { it.desktop },
                        radius = ChartRadius(6.dp),
                        maxBarSize = 36.dp,
                        labelList = ChartLabelList(offset = 8.dp, color = colors.foreground),
                    )
                }
            }
        }
    }
}
