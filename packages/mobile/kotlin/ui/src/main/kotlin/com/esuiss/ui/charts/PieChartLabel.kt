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

private class PieLabelDeviceUsers(val device: String, val users: Double)

private val chartData = listOf(
    PieLabelDeviceUsers("phone", 275.0),
    PieLabelDeviceUsers("laptop", 200.0),
    PieLabelDeviceUsers("tablet", 187.0),
    PieLabelDeviceUsers("watch", 173.0),
    PieLabelDeviceUsers("other", 90.0),
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
fun PieChartLabel(modifier: Modifier = Modifier) {
    val colors = EsuissTheme.colors
    Card(modifier, variant = CardVariant.Filled, size = CardSize.Sm) {
        CardHeader("Labeled", description = "Each name sits outside its slice")
        CardContent {
            ChartContainer(
                chartConfig,
                Modifier
                    .fillMaxWidth()
                    .height(208.dp),
            ) {
                PieChart(accessibilityLabel = "Labeled") {
                    ChartTooltip { ChartTooltipContent(hideLabel = true) }
                    Pie(
                        chartData,
                        value = { it.users },
                        nameKey = { it.device },
                        outerRadius = 0.68f,
                        stroke = colors.muted,
                        strokeWidth = 2.dp,
                        label = { index -> chartConfig[chartData[index].device]?.label ?: "" },
                        labelLine = colors.input,
                    )
                }
            }
        }
    }
}
