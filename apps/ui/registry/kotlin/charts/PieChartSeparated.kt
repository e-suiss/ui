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

private class PieSeparatedDeviceUsers(val device: String, val users: Double)

private val chartData = listOf(
    PieSeparatedDeviceUsers("phone", 275.0),
    PieSeparatedDeviceUsers("laptop", 200.0),
    PieSeparatedDeviceUsers("tablet", 187.0),
    PieSeparatedDeviceUsers("watch", 173.0),
    PieSeparatedDeviceUsers("other", 90.0),
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
fun PieChartSeparated(modifier: Modifier = Modifier) {
    Card(modifier, variant = CardVariant.Filled, size = CardSize.Sm) {
        CardHeader("Separated slices", description = "Gaps and rounded corners")
        CardContent {
            ChartContainer(
                chartConfig,
                Modifier
                    .fillMaxWidth()
                    .height(208.dp),
            ) {
                PieChart(accessibilityLabel = "Separated slices") {
                    ChartTooltip { ChartTooltipContent(hideLabel = true) }
                    Pie(
                        chartData,
                        value = { it.users },
                        nameKey = { it.device },
                        innerRadius = 0.55f,
                        outerRadius = 0.85f,
                        paddingAngle = 5f,
                        cornerRadius = 8.dp,
                        strokeWidth = 0.dp,
                    )
                }
            }
        }
    }
}
