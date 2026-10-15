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
import com.esuiss.ui.theme.Palette

private class RadarLegendRow(val skill: String, val thisMonth: Double, val lastMonth: Double)

private val chartData = listOf(
    RadarLegendRow("Cardio", 86.0, 72.0),
    RadarLegendRow("Strength", 62.0, 58.0),
    RadarLegendRow("Flexibility", 48.0, 55.0),
    RadarLegendRow("Balance", 70.0, 60.0),
    RadarLegendRow("Endurance", 80.0, 66.0),
    RadarLegendRow("Speed", 74.0, 70.0),
)

private val chartConfig = ChartConfig(
    "thisMonth" to ChartConfigItem("This month") { Palette.green500 },
    "lastMonth" to ChartConfigItem("Last month") { chart5 },
)

@Composable
fun RadarChartLegend(modifier: Modifier = Modifier) {
    val colors = EsuissTheme.colors
    Card(modifier, variant = CardVariant.Filled, size = CardSize.Sm) {
        CardHeader("With a legend", description = "Series listed below")
        CardContent {
            ChartContainer(
                chartConfig,
                Modifier
                    .fillMaxWidth()
                    .height(240.dp),
            ) {
                RadarChart(chartData, cy = 0.45f, outerRadius = 0.62f, accessibilityLabel = "With a legend") {
                    ChartTooltip { ChartTooltipContent(indicator = ChartTooltipIndicator.Line) }
                    ChartLegend()
                    PolarGrid(stroke = colors.border)
                    PolarAngleAxis(label = { it.skill })
                    Radar(
                        "lastMonth",
                        value = { it.lastMonth },
                        fillOpacity = 0.2f,
                        strokeWidth = 2.dp,
                    )
                    Radar(
                        "thisMonth",
                        value = { it.thisMonth },
                        fillOpacity = 0.2f,
                        strokeWidth = 2.dp,
                    )
                }
            }
        }
    }
}
