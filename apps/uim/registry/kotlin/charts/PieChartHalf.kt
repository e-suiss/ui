package com.esuiss.ui.charts

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
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

private class PieHalfDeviceShare(val device: String, val share: Double)

private val chartData = listOf(
    PieHalfDeviceShare("phone", 40.0),
    PieHalfDeviceShare("laptop", 25.0),
    PieHalfDeviceShare("tablet", 20.0),
    PieHalfDeviceShare("watch", 15.0),
)

private val chartConfig = ChartConfig(
    "share" to ChartConfigItem("Share"),
    "phone" to ChartConfigItem("Phone") { blue },
    "laptop" to ChartConfigItem("Laptop") { teal },
    "tablet" to ChartConfigItem("Tablet") { indigo },
    "watch" to ChartConfigItem("Watch") { orange },
)

@Composable
fun PieChartHalf(modifier: Modifier = Modifier) {
    val colors = EsuissTheme.colors
    val number = NumberFormat.getNumberInstance(Locale.US)
    Card(modifier, variant = CardVariant.Filled, size = CardSize.Sm) {
        CardHeader("Half circle", description = "Battery use by device · last 24 hours")
        CardContent {
            Box(
                Modifier
                    .fillMaxWidth()
                    .height(176.dp),
            ) {
                ChartContainer(chartConfig, Modifier.matchParentSize()) {
                    PieChart(accessibilityLabel = "Half circle") {
                        ChartTooltip {
                            ChartTooltipContent(
                                hideLabel = true,
                                formatter = { item ->
                                    Row {
                                        BasicText(
                                            "${chartConfig[item.key]?.label ?: item.key} · ",
                                            style = Typography.xs.copy(color = colors.label),
                                        )
                                        BasicText(
                                            "${number.format(item.value)}%",
                                            style = Typography.xs.copy(color = colors.label, fontWeight = FontWeight.SemiBold, fontFeatureSettings = "tnum"),
                                        )
                                    }
                                },
                            )
                        }
                        Pie(
                            chartData,
                            value = { it.share },
                            nameKey = { it.device },
                            cy = 0.88f,
                            startAngle = 180f,
                            endAngle = 0f,
                            innerRadius = 1.05f,
                            outerRadius = 1.5f,
                            paddingAngle = 1.5f,
                            cornerRadius = 4.dp,
                        )
                    }
                }
                Column(
                    Modifier
                        .align(Alignment.BottomCenter)
                        .padding(bottom = 21.dp)
                        .clearAndSetSemantics {},
                    horizontalAlignment = Alignment.CenterHorizontally,
                ) {
                    BasicText(
                        "100%",
                        style = Typography.xl2.copy(color = colors.label, fontWeight = FontWeight.SemiBold, fontFeatureSettings = "tnum"),
                    )
                    BasicText("last 24 hours", style = Typography.xs.copy(color = colors.labelSecondary))
                }
            }
        }
    }
}
