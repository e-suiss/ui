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
import com.esuiss.ui.components.PieChart

private class PieLegendDeviceUsers(val device: String, val users: Double)

private val chartData = listOf(
    PieLegendDeviceUsers("phone", 275.0),
    PieLegendDeviceUsers("laptop", 200.0),
    PieLegendDeviceUsers("tablet", 187.0),
    PieLegendDeviceUsers("watch", 173.0),
    PieLegendDeviceUsers("other", 90.0),
)

private val chartConfig = ChartConfig(
    "users" to ChartConfigItem("Users"),
    "phone" to ChartConfigItem("Phone") { blue },
    "laptop" to ChartConfigItem("Laptop") { teal },
    "tablet" to ChartConfigItem("Tablet") { indigo },
    "watch" to ChartConfigItem("Watch") { orange },
    "other" to ChartConfigItem("Other") { gray },
)

@Composable
fun PieChartLegend(modifier: Modifier = Modifier) {
    Card(modifier, variant = CardVariant.Filled, size = CardSize.Sm) {
        CardHeader("With a legend", description = "What each color means")
        CardContent {
            ChartContainer(
                chartConfig,
                Modifier
                    .fillMaxWidth()
                    .height(240.dp),
            ) {
                PieChart(accessibilityLabel = "With a legend") {
                    ChartTooltip { ChartTooltipContent(hideLabel = true) }
                    ChartLegend()
                    Pie(
                        chartData,
                        value = { it.users },
                        nameKey = { it.device },
                        innerRadius = 0.5f,
                        outerRadius = 0.78f,
                        strokeWidth = 0.dp,
                        paddingAngle = 1f,
                    )
                }
            }
        }
    }
}
