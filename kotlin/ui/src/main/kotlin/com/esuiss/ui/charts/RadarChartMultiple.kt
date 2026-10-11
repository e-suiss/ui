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
import com.esuiss.ui.components.ChartTooltipContent
import com.esuiss.ui.components.ChartTooltipIndicator
import com.esuiss.ui.components.RadarChart
import com.esuiss.ui.theme.EsuissTheme

private class RadarMultipleRow(val skill: String, val thisMonth: Double, val lastMonth: Double)

private val chartData = listOf(
    RadarMultipleRow("Cardio", 86.0, 72.0),
    RadarMultipleRow("Strength", 62.0, 58.0),
    RadarMultipleRow("Flexibility", 48.0, 55.0),
    RadarMultipleRow("Balance", 70.0, 60.0),
    RadarMultipleRow("Endurance", 80.0, 66.0),
    RadarMultipleRow("Speed", 74.0, 70.0),
)

private val chartConfig = ChartConfig(
    "thisMonth" to ChartConfigItem("This month") { green },
    "lastMonth" to ChartConfigItem("Last month") { gray },
)

@Composable
fun RadarChartMultiple(modifier: Modifier = Modifier) {
    val colors = EsuissTheme.colors
    Card(modifier, variant = CardVariant.Filled, size = CardSize.Sm) {
        CardHeader("Comparison", description = "This month and last month")
        CardContent {
            ChartContainer(
                chartConfig,
                Modifier
                    .fillMaxWidth()
                    .height(224.dp),
            ) {
                RadarChart(chartData, outerRadius = 0.7f, accessibilityLabel = "Comparison") {
                    ChartTooltip { ChartTooltipContent(indicator = ChartTooltipIndicator.Line) }
                    PolarGrid(stroke = colors.separator)
                    PolarAngleAxis(label = { it.skill })
                    Radar(
                        "lastMonth",
                        value = { it.lastMonth },
                        fillOpacity = 0.18f,
                        strokeWidth = 2.dp,
                    )
                    Radar(
                        "thisMonth",
                        value = { it.thisMonth },
                        fillOpacity = 0.18f,
                        strokeWidth = 2.dp,
                    )
                }
            }
        }
    }
}
