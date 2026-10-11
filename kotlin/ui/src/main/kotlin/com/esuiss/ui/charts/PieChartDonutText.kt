package com.esuiss.ui.charts

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.text.font.FontWeight
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
import com.esuiss.ui.theme.Typography
import java.text.NumberFormat
import java.util.Locale

private class PieDonutTextDeviceUsers(val device: String, val users: Double)

private val chartData = listOf(
    PieDonutTextDeviceUsers("phone", 275.0),
    PieDonutTextDeviceUsers("laptop", 200.0),
    PieDonutTextDeviceUsers("tablet", 187.0),
    PieDonutTextDeviceUsers("watch", 173.0),
    PieDonutTextDeviceUsers("other", 90.0),
)

private val chartConfig = ChartConfig(
    "users" to ChartConfigItem("Users"),
    "phone" to ChartConfigItem("Phone") { blue },
    "laptop" to ChartConfigItem("Laptop") { teal },
    "tablet" to ChartConfigItem("Tablet") { indigo },
    "watch" to ChartConfigItem("Watch") { orange },
    "other" to ChartConfigItem("Other") { gray },
)

private val total = chartData.sumOf { it.users }

@Composable
fun PieChartDonutText(modifier: Modifier = Modifier) {
    val colors = EsuissTheme.colors
    Card(modifier, variant = CardVariant.Filled, size = CardSize.Sm) {
        CardHeader("Total in the middle", description = "A summary inside the ring")
        CardContent {
            Box(
                Modifier
                    .fillMaxWidth()
                    .height(208.dp),
            ) {
                ChartContainer(chartConfig, Modifier.matchParentSize()) {
                    PieChart(accessibilityLabel = "Total in the middle, ${NumberFormat.getNumberInstance(Locale.US).format(total)} users") {
                        ChartTooltip { ChartTooltipContent(hideLabel = true) }
                        Pie(
                            chartData,
                            value = { it.users },
                            nameKey = { it.device },
                            innerRadius = 0.62f,
                            outerRadius = 0.88f,
                            strokeWidth = 0.dp,
                            paddingAngle = 1f,
                            cornerRadius = 3.dp,
                        )
                    }
                }
                Column(
                    Modifier
                        .align(Alignment.Center)
                        .clearAndSetSemantics {},
                    horizontalAlignment = Alignment.CenterHorizontally,
                ) {
                    BasicText(
                        NumberFormat.getNumberInstance(Locale.US).format(total),
                        style = Typography.xl2.copy(color = colors.label, fontWeight = FontWeight.SemiBold, fontFeatureSettings = "tnum"),
                    )
                    BasicText("users", style = Typography.xs.copy(color = colors.labelSecondary))
                }
            }
        }
    }
}
