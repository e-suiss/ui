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
import com.esuiss.ui.components.RadialBarChart
import com.esuiss.ui.theme.EsuissTheme

private class RadialDefaultDeviceUsers(val device: String, val users: Double)

private val chartData = listOf(
    RadialDefaultDeviceUsers("phone", 275.0),
    RadialDefaultDeviceUsers("laptop", 200.0),
    RadialDefaultDeviceUsers("tablet", 187.0),
    RadialDefaultDeviceUsers("watch", 173.0),
)

private val chartConfig = ChartConfig(
    "users" to ChartConfigItem("Users"),
    "phone" to ChartConfigItem("Phone") { blue },
    "laptop" to ChartConfigItem("Laptop") { teal },
    "tablet" to ChartConfigItem("Tablet") { indigo },
    "watch" to ChartConfigItem("Watch") { orange },
)

@Composable
fun RadialChartDefault(modifier: Modifier = Modifier) {
    val colors = EsuissTheme.colors
    Card(modifier, variant = CardVariant.Filled, size = CardSize.Sm) {
        CardHeader("Radial chart", description = "Users by device")
        CardContent {
            ChartContainer(
                chartConfig,
                Modifier
                    .fillMaxWidth()
                    .height(208.dp),
            ) {
                RadialBarChart(
                    chartData,
                    innerRadius = 0.25f,
                    outerRadius = 1f,
                    barSize = 12.dp,
                    accessibilityLabel = "Radial chart",
                ) {
                    ChartTooltip { ChartTooltipContent(hideLabel = true) }
                    RadialBar("users", value = { it.users }, nameKey = { it.device }, background = colors.control, cornerRadius = 10.dp)
                }
            }
        }
    }
}
