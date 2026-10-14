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
import com.esuiss.ui.theme.Typography

private class RadarRadiusAxisRow(val skill: String, val thisMonth: Double, val lastMonth: Double)

private val chartData = listOf(
    RadarRadiusAxisRow("Cardio", 86.0, 72.0),
    RadarRadiusAxisRow("Strength", 62.0, 58.0),
    RadarRadiusAxisRow("Flexibility", 48.0, 55.0),
    RadarRadiusAxisRow("Balance", 70.0, 60.0),
    RadarRadiusAxisRow("Endurance", 80.0, 66.0),
    RadarRadiusAxisRow("Speed", 74.0, 70.0),
)

private val chartConfig = ChartConfig(
    "thisMonth" to ChartConfigItem("This month") { green },
    "lastMonth" to ChartConfigItem("Last month") { gray },
)

@Composable
fun RadarChartRadiusAxis(modifier: Modifier = Modifier) {
    val colors = EsuissTheme.colors
    Card(modifier, variant = CardVariant.Filled, size = CardSize.Sm) {
        CardHeader("Value axis", description = "The 0 to 100 scale is visible")
        CardContent {
            ChartContainer(
                chartConfig,
                Modifier
                    .fillMaxWidth()
                    .height(224.dp),
            ) {
                RadarChart(chartData, outerRadius = 0.7f, accessibilityLabel = "Value axis") {
                    ChartTooltip { ChartTooltipContent(indicator = ChartTooltipIndicator.Line) }
                    PolarRadiusAxis(angle = 90f, domain = 0.0..100.0, tickStyle = Typography.xs2.copy(color = colors.labelTertiary))
                    PolarGrid(stroke = colors.separator)
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
