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
import com.esuiss.ui.theme.Palette

private class RadarGridNoneRow(val skill: String, val thisMonth: Double, val lastMonth: Double)

private val chartData = listOf(
    RadarGridNoneRow("Cardio", 86.0, 72.0),
    RadarGridNoneRow("Strength", 62.0, 58.0),
    RadarGridNoneRow("Flexibility", 48.0, 55.0),
    RadarGridNoneRow("Balance", 70.0, 60.0),
    RadarGridNoneRow("Endurance", 80.0, 66.0),
    RadarGridNoneRow("Speed", 74.0, 70.0),
)

private val chartConfig = ChartConfig(
    "thisMonth" to ChartConfigItem("This month") { Palette.green500 },
    "lastMonth" to ChartConfigItem("Last month") { chart5 },
)

@Composable
fun RadarChartGridNone(modifier: Modifier = Modifier) {
    Card(modifier, variant = CardVariant.Filled, size = CardSize.Sm) {
        CardHeader("No grid", description = "Just the shape")
        CardContent {
            ChartContainer(
                chartConfig,
                Modifier
                    .fillMaxWidth()
                    .height(224.dp),
            ) {
                RadarChart(chartData, outerRadius = 0.7f, accessibilityLabel = "No grid") {
                    ChartTooltip { ChartTooltipContent(indicator = ChartTooltipIndicator.Line) }
                    PolarAngleAxis(label = { it.skill })
                    Radar(
                        "thisMonth",
                        value = { it.thisMonth },
                        fillOpacity = 0.55f,
                        strokeWidth = 0.dp,
                    )
                }
            }
        }
    }
}
