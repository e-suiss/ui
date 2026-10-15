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

private class PieDonutDeviceUsers(val device: String, val users: Double)

private val chartData = listOf(
    PieDonutDeviceUsers("phone", 275.0),
    PieDonutDeviceUsers("laptop", 200.0),
    PieDonutDeviceUsers("tablet", 187.0),
    PieDonutDeviceUsers("watch", 173.0),
    PieDonutDeviceUsers("other", 90.0),
)

private val chartConfig = ChartConfig(
    "users" to ChartConfigItem("Users"),
    "phone" to ChartConfigItem("Phone") { chart1 },
    "laptop" to ChartConfigItem("Laptop") { chart2 },
    "tablet" to ChartConfigItem("Tablet") { chart3 },
    "watch" to ChartConfigItem("Watch") { chart4 },
    "other" to ChartConfigItem("Other") { chart5 },
)

@Composable
fun PieChartDonut(modifier: Modifier = Modifier) {
    Card(modifier, variant = CardVariant.Filled, size = CardSize.Sm) {
        CardHeader("Donut", description = "A hole in the middle")
        CardContent {
            ChartContainer(
                chartConfig,
                Modifier
                    .fillMaxWidth()
                    .height(208.dp),
            ) {
                PieChart(accessibilityLabel = "Donut") {
                    ChartTooltip { ChartTooltipContent(hideLabel = true) }
                    Pie(
                        chartData,
                        value = { it.users },
                        nameKey = { it.device },
                        innerRadius = 0.58f,
                        outerRadius = 0.85f,
                        strokeWidth = 0.dp,
                        paddingAngle = 1f,
                    )
                }
            }
        }
    }
}
