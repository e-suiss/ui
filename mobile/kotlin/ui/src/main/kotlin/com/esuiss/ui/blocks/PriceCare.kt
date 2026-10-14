package com.esuiss.ui.blocks

import androidx.compose.animation.Crossfade
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.selection.toggleable
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Light
import com.adamglin.phosphoricons.light.DeviceMobile
import com.adamglin.phosphoricons.light.Laptop
import com.adamglin.phosphoricons.light.Watch
import com.esuiss.ui.components.BottomBar
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.RadioGroup
import com.esuiss.ui.components.RadioGroupItem
import com.esuiss.ui.components.Screen
import com.esuiss.ui.components.Switch
import com.esuiss.ui.components.ToggleGroup
import com.esuiss.ui.components.ToggleGroupItem
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography
import java.text.NumberFormat
import java.util.Currency
import java.util.Locale

private class CareOption(val label: String, val price: Double, val theft: Double? = null)

private class CareDevice(val name: String, val icon: ImageVector, val alt: String, val options: List<CareOption>)

private val CareDevices = listOf(
    CareDevice(
        "Phone Pro",
        PhosphorIcons.Light.DeviceMobile,
        "An orange phone on a warm gradient",
        listOf(CareOption("Annual", 99.99, 50.0), CareOption("Monthly", 9.99, 5.0)),
    ),
    CareDevice(
        "Book Air",
        PhosphorIcons.Light.Laptop,
        "A laptop on a wooden sideboard",
        listOf(CareOption("3-year", 279.0), CareOption("Annual", 99.99)),
    ),
    CareDevice(
        "Watch",
        PhosphorIcons.Light.Watch,
        "A smartwatch with a white band",
        listOf(CareOption("2-year", 79.0), CareOption("Monthly", 3.99)),
    ),
)

private fun careMoney(value: Double): String =
    NumberFormat.getCurrencyInstance(Locale.US).apply { currency = Currency.getInstance("USD") }.format(value)

@Composable
fun PriceCare(
    modifier: Modifier = Modifier,
    onAddToBag: (device: String, option: String, theft: Boolean, total: Double) -> Unit = { _, _, _, _ -> },
) {
    val colors = EsuissTheme.colors
    var device by rememberSaveable { mutableStateOf(CareDevices.first().name) }
    var option by rememberSaveable { mutableStateOf(CareDevices.first().options.first().label) }
    var theft by rememberSaveable { mutableStateOf(false) }
    val current = CareDevices.firstOrNull { it.name == device } ?: CareDevices.first()
    val plan = current.options.firstOrNull { it.label == option } ?: current.options.first()
    val withTheft = theft && device == "Phone Pro"
    val total = plan.price + if (withTheft) plan.theft ?: 0.0 else 0.0

    Screen(modifier) {
        Column(Modifier.fillMaxSize()) {
            Column(
                Modifier
                    .weight(1f)
                    .verticalScroll(rememberScrollState()),
            ) {
                CareHero(current)
                Column(
                    Modifier.padding(horizontal = 20.dp, vertical = 30.dp),
                    verticalArrangement = Arrangement.spacedBy(18.dp),
                ) {
                    BasicText(
                        "Choose your device.",
                        modifier = Modifier.semantics { heading() },
                        style = Typography.xl2.copy(color = colors.label, fontWeight = FontWeight.SemiBold),
                    )
                    ToggleGroup(
                        value = device,
                        onValueChange = { value ->
                            val next = CareDevices.firstOrNull { it.name == value } ?: return@ToggleGroup
                            device = next.name
                            option = next.options.first().label
                        },
                        modifier = Modifier.semantics { contentDescription = "Device" },
                    ) {
                        CareDevices.forEach { item -> ToggleGroupItem(item.name, item.name) }
                    }
                    RadioGroup(
                        value = plan.label,
                        onValueChange = { option = it },
                        modifier = Modifier.semantics { contentDescription = "Payment" },
                    ) {
                        current.options.forEach { item ->
                            CareChoice(item.label, item.label == plan.label) {
                                Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(1.dp)) {
                                    BasicText(
                                        "${item.label} payment",
                                        style = Typography.base.copy(color = colors.label, fontWeight = FontWeight.SemiBold),
                                    )
                                    BasicText(
                                        "Unlimited accidental damage repairs",
                                        style = Typography.sm.copy(color = colors.labelSecondary),
                                    )
                                }
                                BasicText(
                                    careMoney(item.price),
                                    style = Typography.base.copy(color = colors.label, fontWeight = FontWeight.SemiBold, fontFeatureSettings = "tnum"),
                                )
                            }
                        }
                    }
                    if (device == "Phone Pro") {
                        Row(
                            modifier = Modifier.toggleable(
                                value = theft,
                                interactionSource = remember { MutableInteractionSource() },
                                indication = null,
                                role = Role.Switch,
                            ) { theft = it },
                            horizontalArrangement = Arrangement.spacedBy(10.dp),
                            verticalAlignment = Alignment.CenterVertically,
                        ) {
                            Switch(checked = theft, onCheckedChange = null)
                            BasicText("Add theft and loss protection", style = Typography.sm.copy(color = colors.label))
                        }
                    }
                }
            }
            BottomBar(separator = true) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 12.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Column(
                        Modifier
                            .weight(1f)
                            .semantics(mergeDescendants = true) { liveRegion = LiveRegionMode.Polite },
                    ) {
                        BasicText("Total", style = Typography.sm.copy(color = colors.labelSecondary))
                        BasicText(
                            careMoney(total),
                            style = Typography.xl.copy(color = colors.label, fontWeight = FontWeight.SemiBold, fontFeatureSettings = "tnum"),
                        )
                    }
                    Button("Add to Bag", { onAddToBag(device, plan.label, withTheft, total) }, size = ButtonSize.Lg)
                }
            }
        }
    }
}

@Composable
private fun CareHero(device: CareDevice) {
    val colors = EsuissTheme.colors
    Box(
        Modifier
            .fillMaxWidth()
            .height(320.dp)
            .background(colors.surfaceSecondary),
    ) {
        Crossfade(device, animationSpec = tween(600), label = "device") { shown ->
            Box(
                Modifier
                    .fillMaxSize()
                    .padding(bottom = 80.dp)
                    .clearAndSetSemantics { contentDescription = shown.alt },
                contentAlignment = Alignment.Center,
            ) {
                Icon(shown.icon, contentDescription = null, size = 150.dp, tint = colors.labelTertiary)
            }
        }
        Box(
            Modifier
                .fillMaxSize()
                .background(Brush.verticalGradient(0.45f to Color.Transparent, 1f to colors.media.copy(alpha = 0.7f))),
        )
        Column(
            Modifier
                .align(Alignment.BottomStart)
                .padding(28.dp),
            verticalArrangement = Arrangement.spacedBy(6.dp),
        ) {
            BasicText("suiss Care+", style = Typography.base.copy(color = colors.onMedia, fontWeight = FontWeight.SemiBold))
            BasicText(
                "Protection against accidents.",
                modifier = Modifier.semantics { heading() },
                style = Typography.xl3.copy(color = colors.onMedia, fontWeight = FontWeight.SemiBold),
            )
        }
    }
}

@Composable
private fun CareChoice(value: String, selected: Boolean, content: @Composable RowScope.() -> Unit) {
    val colors = EsuissTheme.colors
    val shape = RoundedCornerShape(12.dp)
    val border by animateColorAsState(if (selected) colors.accent else colors.separatorStrong, tween(200), label = "border")
    RadioGroupItem(
        value = value,
        modifier = Modifier
            .fillMaxWidth()
            .border(if (selected) 2.dp else 1.dp, border, shape)
            .padding(horizontal = 16.dp, vertical = 14.dp),
        label = {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(start = 4.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalAlignment = Alignment.CenterVertically,
                content = content,
            )
        },
    )
}
