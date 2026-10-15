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

private class RadarLinesOnlyRow(val skill: String, val thisMonth: Double, val lastMonth: Double)

private val chartData = listOf(
    RadarLinesOnlyRow("Cardio", 86.0, 72.0),
    RadarLinesOnlyRow("Strength", 62.0, 58.0),
    RadarLinesOnlyRow("Flexibility", 48.0, 55.0),
    RadarLinesOnlyRow("Balance", 70.0, 60.0),
    RadarLinesOnlyRow("Endurance", 80.0, 66.0),
    RadarLinesOnlyRow("Speed", 74.0, 70.0),
)

private val chartConfig = ChartConfig(
    "thisMonth" to ChartConfigItem("This month") { Palette.green500 },
    "lastMonth" to ChartConfigItem("Last month") { chart5 },
)

@Composable
fun RadarChartLinesOnly(modifier: Modifier = Modifier) {
    val colors = EsuissTheme.colors
    Card(modifier, variant = CardVariant.Filled, size = CardSize.Sm) {
        CardHeader("Lines only", description = "No fill")
        CardContent {
            ChartContainer(
                chartConfig,
                Modifier
                    .fillMaxWidth()
                    .height(224.dp),
            ) {
                RadarChart(chartData, outerRadius = 0.7f, accessibilityLabel = "Lines only") {
                    ChartTooltip { ChartTooltipContent(indicator = ChartTooltipIndicator.Line) }
                    PolarGrid(stroke = colors.border)
                    PolarAngleAxis(label = { it.skill })
                    Radar(
                        "lastMonth",
                        value = { it.lastMonth },
                        fillOpacity = 0f,
                        strokeWidth = 2.5.dp,
                    )
                    Radar(
                        "thisMonth",
                        value = { it.thisMonth },
                        fillOpacity = 0f,
                        strokeWidth = 2.5.dp,
                    )
                }
            }
        }
    }
}
