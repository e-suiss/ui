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
import com.esuiss.ui.components.ChartDot
import com.esuiss.ui.components.ChartLabelList
import com.esuiss.ui.components.ChartMargin
import com.esuiss.ui.components.ChartTooltipContent
import com.esuiss.ui.components.LineChart
import com.esuiss.ui.theme.EsuissTheme

private class LineLabeledRow(val month: String, val desktop: Double, val mobile: Double)

private val chartData = listOf(
    LineLabeledRow("January", 186.0, 80.0),
    LineLabeledRow("February", 305.0, 200.0),
    LineLabeledRow("March", 237.0, 120.0),
    LineLabeledRow("April", 173.0, 190.0),
    LineLabeledRow("May", 209.0, 130.0),
    LineLabeledRow("June", 264.0, 140.0),
)

private val chartConfig = ChartConfig(
    "desktop" to ChartConfigItem("Desktop") { blue },
)

@Composable
fun LineChartLabeled(modifier: Modifier = Modifier) {
    val colors = EsuissTheme.colors
    Card(modifier, variant = CardVariant.Filled, size = CardSize.Sm) {
        CardHeader("Labeled", description = "Every point shows its value")
        CardContent {
            ChartContainer(
                chartConfig,
                Modifier
                    .fillMaxWidth()
                    .height(192.dp),
            ) {
                LineChart(
                    chartData,
                    margin = ChartMargin(top = 24.dp, right = 16.dp, bottom = 0.dp, left = 16.dp),
                    accessibilityLabel = "Labeled",
                ) {
                    XAxis(label = { it.month }, tickMargin = 8.dp, interval = 0, tickFormatter = { it.take(3) })
                    ChartTooltip { ChartTooltipContent(hideLabel = true) }
                    Line(
                        "desktop",
                        value = { it.desktop },
                        curve = ChartCurve.Natural,
                        strokeWidth = 2.5.dp,
                        dot = ChartDot(4.dp),
                        labelList = ChartLabelList(offset = 10.dp, color = colors.label),
                    )
                }
            }
        }
    }
}
