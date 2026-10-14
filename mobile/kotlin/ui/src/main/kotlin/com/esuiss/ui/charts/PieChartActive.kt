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
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.esuiss.ui.components.ChartRing
import com.esuiss.ui.components.ChartSector

private class PieActiveDeviceUsers(val device: String, val users: Double)

private val chartData = listOf(
    PieActiveDeviceUsers("phone", 275.0),
    PieActiveDeviceUsers("laptop", 200.0),
    PieActiveDeviceUsers("tablet", 187.0),
    PieActiveDeviceUsers("watch", 173.0),
    PieActiveDeviceUsers("other", 90.0),
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
fun PieChartActive(modifier: Modifier = Modifier) {
    var selected by remember { mutableIntStateOf(0) }
    Card(modifier, variant = CardVariant.Filled, size = CardSize.Sm) {
        CardHeader("Highlighted slice", description = "The selected slice pops out")
        CardContent {
            ChartContainer(
                chartConfig,
                Modifier
                    .fillMaxWidth()
                    .height(208.dp),
            ) {
                PieChart(
                    accessibilityLabel = "Highlighted slice",
                    selectedIndex = selected,
                    onSelectedIndexChange = { index -> if (index != null) selected = index },
                ) {
                    ChartTooltip { ChartTooltipContent(hideLabel = true) }
                    Pie(
                        chartData,
                        value = { it.users },
                        nameKey = { it.device },
                        innerRadius = 0.5f,
                        outerRadius = 0.78f,
                        strokeWidth = 0.dp,
                        sectors = { index -> if (index == selected) ChartSector(10.dp, ChartRing(3.dp, 3.dp)) else ChartSector() },
                    )
                }
            }
        }
    }
}
