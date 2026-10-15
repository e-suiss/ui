package com.esuiss.ui.charts

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
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
import com.esuiss.ui.components.ChartMargin
import com.esuiss.ui.components.ChartTooltipContent
import com.esuiss.ui.components.LineChart
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Palette
import com.esuiss.ui.theme.Typography
import java.text.NumberFormat
import java.util.Locale

private const val GOAL = 10000.0

private class LineGoalRow(val day: String, val steps: Double)

private val chartData = listOf(
    LineGoalRow("Mon", 8412.0),
    LineGoalRow("Tue", 10230.0),
    LineGoalRow("Wed", 6120.0),
    LineGoalRow("Thu", 12480.0),
    LineGoalRow("Fri", 9050.0),
    LineGoalRow("Sat", 14320.0),
    LineGoalRow("Sun", 4870.0),
)

private val chartConfig = ChartConfig(
    "steps" to ChartConfigItem("Steps") { chart4 },
)

private fun thousands(value: Double): String {
    val k = value / 1000
    return if (k % 1.0 == 0.0) "${k.toLong()}k" else "${k}k"
}

@Composable
fun LineChartGoal(modifier: Modifier = Modifier) {
    val colors = EsuissTheme.colors
    val stepsFormat = NumberFormat.getNumberInstance(Locale.US)
    Card(modifier, variant = CardVariant.Filled, size = CardSize.Sm) {
        CardHeader("Goal line", description = "A daily goal of 10,000 steps")
        CardContent {
            ChartContainer(
                chartConfig,
                Modifier
                    .fillMaxWidth()
                    .height(192.dp),
            ) {
                LineChart(
                    chartData,
                    margin = ChartMargin(top = 10.dp, right = 4.dp, bottom = 0.dp, left = 12.dp),
                    accessibilityLabel = "Goal line",
                ) {
                    CartesianGrid(strokeDasharray = listOf(2f, 4f))
                    XAxis(label = { it.day }, tickMargin = 8.dp, interval = 0)
                    YAxis(orientation = ChartAxisOrientation.Right, tickMargin = 6.dp, tickFormatter = ::thousands)
                    ReferenceLine(GOAL, stroke = Palette.green500, strokeDasharray = listOf(4f, 4f), label = "Goal")
                    ChartTooltip {
                        ChartTooltipContent(
                            hideIndicator = true,
                            formatter = { item ->
                                BasicText(
                                    "${stepsFormat.format(item.value)} steps",
                                    style = Typography.xs.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold, fontFeatureSettings = "tnum"),
                                )
                            },
                        )
                    }
                    Line(
                        "steps",
                        value = { it.steps },
                        curve = ChartCurve.Monotone,
                        strokeWidth = 2.5.dp,
                        dot = ChartDot(3.5.dp),
                    )
                }
            }
        }
    }
}
