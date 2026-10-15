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
import com.esuiss.ui.components.PolarGridType
import com.esuiss.ui.components.RadarChart
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Palette

private class RadarGridCircleRow(val skill: String, val thisMonth: Double, val lastMonth: Double)

private val chartData = listOf(
    RadarGridCircleRow("Cardio", 86.0, 72.0),
    RadarGridCircleRow("Strength", 62.0, 58.0),
    RadarGridCircleRow("Flexibility", 48.0, 55.0),
    RadarGridCircleRow("Balance", 70.0, 60.0),
    RadarGridCircleRow("Endurance", 80.0, 66.0),
    RadarGridCircleRow("Speed", 74.0, 70.0),
)

private val chartConfig = ChartConfig(
    "thisMonth" to ChartConfigItem("This month") { Palette.green500 },
    "lastMonth" to ChartConfigItem("Last month") { chart5 },
)

@Composable
fun RadarChartGridCircle(modifier: Modifier = Modifier) {
    val colors = EsuissTheme.colors
    Card(modifier, variant = CardVariant.Filled, size = CardSize.Sm) {
        CardHeader("Circle grid", description = "Rings instead of polygons")
        CardContent {
            ChartContainer(
                chartConfig,
                Modifier
                    .fillMaxWidth()
                    .height(224.dp),
            ) {
                RadarChart(chartData, outerRadius = 0.7f, accessibilityLabel = "Circle grid") {
                    ChartTooltip { ChartTooltipContent(indicator = ChartTooltipIndicator.Line) }
                    PolarGrid(gridType = PolarGridType.Circle, stroke = colors.border)
                    PolarAngleAxis(label = { it.skill })
                    Radar(
                        "thisMonth",
                        value = { it.thisMonth },
                        fillOpacity = 0.3f,
                        strokeWidth = 2.dp,
                    )
                }
            }
        }
    }
}
