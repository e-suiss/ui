package com.esuiss.ui.charts

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
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

private class RadialBatteriesDevice(val name: String, val level: Double)

private val devices = listOf(
    RadialBatteriesDevice("Phone", 82.0),
    RadialBatteriesDevice("Earbuds", 46.0),
    RadialBatteriesDevice("Watch", 18.0),
    RadialBatteriesDevice("Case", 100.0),
)

private const val LOW = 20.0

@Composable
private fun Battery(device: RadialBatteriesDevice, modifier: Modifier = Modifier) {
    val colors = EsuissTheme.colors
    val low = device.level <= LOW
    val chartConfig = ChartConfig("level" to ChartConfigItem(device.name) { if (low) red else green })
    Column(
        modifier.clearAndSetSemantics { contentDescription = "${device.name}, ${device.level.toInt()}%" },
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        Box(Modifier.size(64.dp), contentAlignment = Alignment.Center) {
            ChartContainer(chartConfig, Modifier.matchParentSize()) {
                val color = chartColor("level")
                RadialBarChart(
                    listOf(device),
                    innerRadius = 0.78f,
                    outerRadius = 1f,
                    startAngle = 90f,
                    endAngle = -270f,
                    barSize = 6.dp,
                ) {
                    PolarAngleAxis(0.0..100.0)
                    RadialBar("level", value = { it.level }, cornerRadius = 6.dp, background = color.copy(alpha = color.alpha * 0.22f), isAnimationActive = false)
                }
            }
            BasicText(
                device.name.take(1),
                style = Typography.xs.copy(color = colors.labelSecondary, fontWeight = FontWeight.SemiBold),
            )
        }
        BasicText(
            "${device.level.toInt()}%",
            style = Typography.base.copy(color = colors.label, fontWeight = FontWeight.SemiBold, fontFeatureSettings = "tnum"),
        )
        BasicText(device.name, style = Typography.xs.copy(color = colors.labelSecondary))
    }
}

@Composable
fun RadialChartBatteries(modifier: Modifier = Modifier) {
    Card(modifier, variant = CardVariant.Filled, size = CardSize.Sm) {
        CardHeader("Batteries", description = "Charge left on each device")
        CardContent {
            Row(
                Modifier.padding(vertical = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                for (device in devices) Battery(device, Modifier.weight(1f))
            }
        }
    }
}
