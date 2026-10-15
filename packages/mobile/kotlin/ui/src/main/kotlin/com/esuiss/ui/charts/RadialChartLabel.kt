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
import com.esuiss.ui.components.ChartLabelList
import com.esuiss.ui.components.ChartLabelPosition
import com.esuiss.ui.components.ChartTooltipContent
import com.esuiss.ui.components.RadialBarChart
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography

private class RadialLabelDeviceUsers(val device: String, val users: Double)

private val chartData = listOf(
    RadialLabelDeviceUsers("phone", 275.0),
    RadialLabelDeviceUsers("laptop", 200.0),
    RadialLabelDeviceUsers("tablet", 187.0),
    RadialLabelDeviceUsers("watch", 173.0),
)

private val chartConfig = ChartConfig(
    "users" to ChartConfigItem("Users"),
    "phone" to ChartConfigItem("Phone") { chart1 },
    "laptop" to ChartConfigItem("Laptop") { chart2 },
    "tablet" to ChartConfigItem("Tablet") { chart3 },
    "watch" to ChartConfigItem("Watch") { chart4 },
)

@Composable
fun RadialChartLabel(modifier: Modifier = Modifier) {
    val colors = EsuissTheme.colors
    Card(modifier, variant = CardVariant.Filled, size = CardSize.Sm) {
        CardHeader("Labeled", description = "Each name sits at the start of its bar")
        CardContent {
            ChartContainer(
                chartConfig,
                Modifier
                    .fillMaxWidth()
                    .height(208.dp),
            ) {
                RadialBarChart(
                    chartData,
                    innerRadius = 0.28f,
                    outerRadius = 1f,
                    barSize = 16.dp,
                    startAngle = 90f,
                    endAngle = -200f,
                    accessibilityLabel = "Labeled",
                ) {
                    ChartTooltip { ChartTooltipContent(hideLabel = true) }
                    RadialBar(
                        "users",
                        value = { it.users },
                        nameKey = { it.device },
                        cornerRadius = 10.dp,
                        background = colors.secondary,
                        labelList = ChartLabelList(
                            ChartLabelPosition.InsideStart,
                            color = colors.primaryForeground,
                            fontSize = Typography.xs2.fontSize,
                            formatter = { index, _ -> chartConfig[chartData[index].device]?.label ?: "" },
                        ),
                    )
                }
            }
        }
    }
}
