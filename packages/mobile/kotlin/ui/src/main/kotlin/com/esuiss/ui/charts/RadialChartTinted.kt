package com.esuiss.ui.charts

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.unit.dp
import com.esuiss.ui.components.Card
import com.esuiss.ui.components.CardContent
import com.esuiss.ui.components.CardHeader
import com.esuiss.ui.components.CardSize
import com.esuiss.ui.components.CardVariant
import com.esuiss.ui.components.ChartCell
import com.esuiss.ui.components.ChartConfig
import com.esuiss.ui.components.ChartConfigItem
import com.esuiss.ui.components.ChartContainer
import com.esuiss.ui.components.ChartTooltipContent
import com.esuiss.ui.components.RadialBarChart
import com.esuiss.ui.components.chartColor

private const val MAX = 320.0

private class RadialTintedDeviceUsers(val device: String, val users: Double)

private val chartData = listOf(
    RadialTintedDeviceUsers("phone", 275.0),
    RadialTintedDeviceUsers("laptop", 200.0),
    RadialTintedDeviceUsers("tablet", 187.0),
    RadialTintedDeviceUsers("watch", 173.0),
)

private val chartConfig = ChartConfig(
    "users" to ChartConfigItem("Users"),
    "phone" to ChartConfigItem("Phone") { chart1 },
    "laptop" to ChartConfigItem("Laptop") { chart2 },
    "tablet" to ChartConfigItem("Tablet") { chart3 },
    "watch" to ChartConfigItem("Watch") { chart4 },
)

@Composable
fun RadialChartTinted(modifier: Modifier = Modifier) {
    Card(modifier, variant = CardVariant.Filled, size = CardSize.Sm) {
        CardHeader("Tinted track", description = "The unfilled part keeps a soft tint of its color")
        CardContent {
            Box(
                Modifier
                    .fillMaxWidth()
                    .height(208.dp),
            ) {
                ChartContainer(
                    chartConfig,
                    Modifier
                        .matchParentSize()
                        .clearAndSetSemantics {},
                ) {
                    val tints = chartData.map { chartColor(it.device).let { color -> color.copy(alpha = color.alpha * 0.22f) } }
                    RadialBarChart(chartData, innerRadius = 0.25f, outerRadius = 1f, barSize = 12.dp) {
                        PolarAngleAxis(0.0..MAX)
                        RadialBar("users", value = { MAX }, nameKey = { it.device }, cornerRadius = 10.dp, cells = { index -> ChartCell(tints[index]) }, isAnimationActive = false)
                    }
                }
                ChartContainer(chartConfig, Modifier.matchParentSize()) {
                    RadialBarChart(
                        chartData,
                        innerRadius = 0.25f,
                        outerRadius = 1f,
                        barSize = 12.dp,
                        accessibilityLabel = "Tinted track",
                    ) {
                        PolarAngleAxis(0.0..MAX)
                        ChartTooltip { ChartTooltipContent(hideLabel = true) }
                        RadialBar("users", value = { it.users }, nameKey = { it.device }, cornerRadius = 10.dp)
                    }
                }
            }
        }
    }
}
