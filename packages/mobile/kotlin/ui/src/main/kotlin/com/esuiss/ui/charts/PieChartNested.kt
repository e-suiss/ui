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
import com.esuiss.ui.theme.EsuissTheme

private class PieNestedDeviceUsers(val device: String, val users: Double)

private val chartData = listOf(
    PieNestedDeviceUsers("phone", 275.0),
    PieNestedDeviceUsers("laptop", 200.0),
    PieNestedDeviceUsers("tablet", 187.0),
    PieNestedDeviceUsers("watch", 173.0),
    PieNestedDeviceUsers("other", 90.0),
)

private val groups = listOf(
    PieNestedDeviceUsers("phone", 475.0),
    PieNestedDeviceUsers("watch", 450.0),
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
fun PieChartNested(modifier: Modifier = Modifier) {
    val colors = EsuissTheme.colors
    Card(modifier, variant = CardVariant.Filled, size = CardSize.Sm) {
        CardHeader("Nested", description = "Groups inside, details outside")
        CardContent {
            ChartContainer(
                chartConfig,
                Modifier
                    .fillMaxWidth()
                    .height(208.dp),
            ) {
                PieChart(accessibilityLabel = "Nested") {
                    ChartTooltip { ChartTooltipContent(hideLabel = true) }
                    Pie(
                        groups,
                        value = { it.users },
                        nameKey = { it.device },
                        outerRadius = 0.52f,
                        stroke = colors.muted,
                        strokeWidth = 2.dp,
                        fillOpacity = 0.55f,
                    )
                    Pie(
                        chartData,
                        value = { it.users },
                        nameKey = { it.device },
                        innerRadius = 0.6f,
                        outerRadius = 0.86f,
                        stroke = colors.muted,
                        strokeWidth = 2.dp,
                    )
                }
            }
        }
    }
}
