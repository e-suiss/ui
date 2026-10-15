package com.esuiss.ui.charts

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.esuiss.ui.components.BarChart
import com.esuiss.ui.components.Card
import com.esuiss.ui.components.CardContent
import com.esuiss.ui.components.CardHeader
import com.esuiss.ui.components.CardSize
import com.esuiss.ui.components.CardVariant
import com.esuiss.ui.components.ChartConfig
import com.esuiss.ui.components.ChartConfigItem
import com.esuiss.ui.components.ChartContainer
import com.esuiss.ui.components.ChartLayout
import com.esuiss.ui.components.ChartMargin
import com.esuiss.ui.components.ChartRadius
import com.esuiss.ui.components.ChartTooltipContent

private class DeviceUsers(val device: String, val users: Double)

private val chartData = listOf(
    DeviceUsers("phone", 275.0),
    DeviceUsers("laptop", 200.0),
    DeviceUsers("tablet", 187.0),
    DeviceUsers("watch", 173.0),
    DeviceUsers("other", 90.0),
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
fun BarChartHorizontal(modifier: Modifier = Modifier) {
    Card(modifier, variant = CardVariant.Filled, size = CardSize.Sm) {
        CardHeader("Horizontal", description = "Room for long category names")
        CardContent {
            ChartContainer(
                chartConfig,
                Modifier
                    .fillMaxWidth()
                    .height(192.dp),
            ) {
                BarChart(
                    chartData,
                    layout = ChartLayout.Vertical,
                    margin = ChartMargin(top = 0.dp, right = 8.dp, bottom = 0.dp, left = 0.dp),
                    accessibilityLabel = "Horizontal",
                ) {
                    YAxis(label = { it.device }, tickFormatter = { chartConfig[it]?.label ?: it })
                    ChartTooltip(cursor = null) { ChartTooltipContent(hideLabel = true) }
                    Bar("users", value = { it.users }, nameKey = { it.device }, radius = ChartRadius(5.dp), barSize = 18.dp)
                }
            }
        }
    }
}
