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
import com.esuiss.ui.components.RadialBarChart
import com.esuiss.ui.components.chartColor
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography

private class RadialGaugeReading(val value: Double)

private val chartData = listOf(RadialGaugeReading(38.0))

private val chartConfig = ChartConfig(
    "value" to ChartConfigItem("Air quality") { green },
)

@Composable
fun RadialChartGauge(modifier: Modifier = Modifier) {
    val colors = EsuissTheme.colors
    Card(modifier, variant = CardVariant.Filled, size = CardSize.Sm) {
        CardHeader("Gauge", description = "Air quality index")
        CardContent {
            Box(
                Modifier
                    .fillMaxWidth()
                    .height(208.dp),
            ) {
                ChartContainer(chartConfig, Modifier.matchParentSize()) {
                    val color = chartColor("value")
                    RadialBarChart(
                        chartData,
                        innerRadius = 0.72f,
                        outerRadius = 1f,
                        startAngle = 210f,
                        endAngle = -30f,
                        barSize = 14.dp,
                        accessibilityLabel = "Gauge, 38 Good",
                    ) {
                        PolarAngleAxis(0.0..100.0)
                        RadialBar("value", value = { it.value }, cornerRadius = 20.dp, background = color.copy(alpha = color.alpha * 0.22f))
                    }
                }
                Column(
                    Modifier
                        .align(Alignment.TopCenter)
                        .padding(top = 91.5.dp)
                        .clearAndSetSemantics {},
                    horizontalAlignment = Alignment.CenterHorizontally,
                ) {
                    BasicText(
                        "38",
                        style = Typography.xl3.copy(color = colors.label, fontWeight = FontWeight.SemiBold, fontFeatureSettings = "tnum"),
                    )
                    BasicText("Good", style = Typography.xs.copy(color = colors.labelSecondary))
                }
            }
        }
    }
}
