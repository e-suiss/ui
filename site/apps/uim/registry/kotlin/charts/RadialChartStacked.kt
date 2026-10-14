package com.esuiss.ui.charts

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
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
import com.esuiss.ui.components.RadialBarChart
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography
import java.text.NumberFormat
import java.util.Locale

private class RadialStackedVisitors(val desktop: Double, val mobile: Double)

private val visitors = RadialStackedVisitors(1260.0, 570.0)

private val chartData = listOf(visitors)

private val chartConfig = ChartConfig(
    "desktop" to ChartConfigItem("Desktop") { blue },
    "mobile" to ChartConfigItem("Mobile") { teal },
)

private val total = visitors.desktop + visitors.mobile

@Composable
fun RadialChartStacked(modifier: Modifier = Modifier) {
    val colors = EsuissTheme.colors
    val number = NumberFormat.getNumberInstance(Locale.US)
    Card(modifier, variant = CardVariant.Filled, size = CardSize.Sm) {
        CardHeader("Half, stacked", description = "Two series on one arc")
        CardContent {
            Box(
                Modifier
                    .fillMaxWidth()
                    .height(176.dp),
            ) {
                ChartContainer(chartConfig, Modifier.matchParentSize()) {
                    RadialBarChart(
                        chartData,
                        startAngle = 180f,
                        endAngle = 0f,
                        innerRadius = 1.2f,
                        outerRadius = 1.7f,
                        cy = 0.86f,
                        accessibilityLabel = "Half, stacked, ${number.format(total)} visitors",
                    ) {
                        PolarAngleAxis(0.0..total)
                        ChartTooltip { ChartTooltipContent(hideLabel = true) }
                        RadialBar("desktop", value = { it.desktop }, stackId = "a", cornerRadius = 6.dp, stroke = colors.surfaceSecondary, strokeWidth = 3.dp)
                        RadialBar("mobile", value = { it.mobile }, stackId = "a", cornerRadius = 6.dp, stroke = colors.surfaceSecondary, strokeWidth = 3.dp)
                    }
                }
                Column(
                    Modifier
                        .align(Alignment.BottomCenter)
                        .padding(bottom = 24.6.dp)
                        .clearAndSetSemantics {},
                    horizontalAlignment = Alignment.CenterHorizontally,
                ) {
                    BasicText(
                        number.format(total),
                        style = Typography.xl2.copy(color = colors.label, fontWeight = FontWeight.SemiBold, fontFeatureSettings = "tnum"),
                    )
                    BasicText("visitors", style = Typography.xs.copy(color = colors.labelSecondary))
                }
            }
        }
    }
}
