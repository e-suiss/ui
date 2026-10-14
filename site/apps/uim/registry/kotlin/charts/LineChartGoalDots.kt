package com.esuiss.ui.charts

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.lerp
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.esuiss.ui.components.Card
import com.esuiss.ui.components.CardContent
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
import com.esuiss.ui.theme.Typography
import kotlin.math.roundToInt

private const val GOAL = 7.0

private class LineGoalDotsRow(val day: String, val hours: Double)

private val chartData = listOf(
    LineGoalDotsRow("Mon", 6.8),
    LineGoalDotsRow("Tue", 7.4),
    LineGoalDotsRow("Wed", 5.9),
    LineGoalDotsRow("Thu", 7.9),
    LineGoalDotsRow("Fri", 6.4),
    LineGoalDotsRow("Sat", 8.6),
    LineGoalDotsRow("Sun", 7.2),
)

private val chartConfig = ChartConfig(
    "hours" to ChartConfigItem("Sleep") { indigo },
)

private fun formatHours(hours: Double): String {
    val minutes = (hours * 60).roundToInt()
    return "${minutes / 60}h ${minutes % 60}m"
}

@Composable
fun LineChartGoalDots(modifier: Modifier = Modifier) {
    val colors = EsuissTheme.colors
    Card(modifier, variant = CardVariant.Filled, size = CardSize.Sm) {
        CardContent {
            Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                BasicText(
                    "Sleep",
                    style = Typography.sm.copy(
                        color = lerp(colors.indigo, colors.label, if (colors.isDark) 0.35f else 0.1f),
                        fontWeight = FontWeight.SemiBold,
                    ),
                )
                BasicText(
                    "7h 9m",
                    style = Typography.xl3.copy(color = colors.label, fontWeight = FontWeight.SemiBold, fontFeatureSettings = "tnum"),
                )
                BasicText("Goal 7 hours · green nights met it", style = Typography.sm.copy(color = colors.labelSecondary))
            }
        }
        CardContent {
            ChartContainer(
                chartConfig,
                Modifier
                    .fillMaxWidth()
                    .height(160.dp),
            ) {
                LineChart(
                    chartData,
                    margin = ChartMargin(top = 10.dp, right = 4.dp, bottom = 0.dp, left = 16.dp),
                    accessibilityLabel = "Sleep",
                ) {
                    CartesianGrid(strokeDasharray = listOf(2f, 4f))
                    XAxis(label = { it.day }, tickMargin = 8.dp, interval = 0)
                    YAxis(
                        orientation = ChartAxisOrientation.Right,
                        tickMargin = 6.dp,
                        domain = 5.0..9.0,
                        ticks = listOf(5.0, 7.0, 9.0),
                        tickFormatter = { "${it.toInt()}h" },
                    )
                    ReferenceLine(GOAL, stroke = colors.green, strokeDasharray = listOf(3f, 3f))
                    ChartTooltip {
                        ChartTooltipContent(
                            hideIndicator = true,
                            formatter = { item ->
                                BasicText(
                                    formatHours(item.value),
                                    style = Typography.xs.copy(color = colors.label, fontWeight = FontWeight.SemiBold, fontFeatureSettings = "tnum"),
                                )
                            },
                        )
                    }
                    Line(
                        "hours",
                        value = { it.hours },
                        curve = ChartCurve.Monotone,
                        strokeWidth = 2.dp,
                        dot = ChartDot(4.5.dp, strokeColor = colors.surfaceSecondary, strokeWidth = 2.dp),
                        dotColor = { if (it.hours >= GOAL) colors.green else colors.orange },
                    )
                }
            }
        }
    }
}
