package com.esuiss.ui.blocks

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.selection.selectableGroup
import androidx.compose.foundation.shape.CircleShape
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Bold
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.bold.Check
import com.adamglin.phosphoricons.regular.Cloud
import com.esuiss.ui.components.BottomBar
import com.esuiss.ui.components.BottomBarContent
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.Screen
import com.esuiss.ui.components.ToggleGroup
import com.esuiss.ui.components.ToggleGroupItem
import com.esuiss.ui.components.ToggleSize
import com.esuiss.ui.components.rememberHaptics
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Palette
import com.esuiss.ui.theme.Typography
import java.text.NumberFormat
import java.util.Currency
import java.util.Locale

private val StorageLiftEasing = CubicBezierEasing(0.3f, 1.25f, 0.5f, 1f)

private class StoragePlan(val size: String, val price: Double, val features: List<String>, val popular: Boolean = false)

private val StoragePlans = listOf(
    StoragePlan("50 GB", 0.99, listOf("Space for photos and files", "Private Relay", "Hide My Email")),
    StoragePlan("200 GB", 2.99, listOf("Share with your family", "Custom email domain", "Secure Video for 1 camera"), popular = true),
    StoragePlan("2 TB", 9.99, listOf("Everything in 200 GB", "Unlimited Secure Video cameras")),
    StoragePlan("6 TB", 29.99, listOf("Everything in 2 TB", "Room for large archives")),
)

private fun storageMoney(value: Double): String =
    NumberFormat.getCurrencyInstance(Locale.US).apply { currency = Currency.getInstance("USD") }.format(value)

@Composable
fun PriceStorage(
    modifier: Modifier = Modifier,
    onSelectPlan: (plan: String, period: String) -> Unit = { _, _ -> },
    onPeriodChange: (period: String) -> Unit = {},
) {
    val colors = EsuissTheme.colors
    var period by rememberSaveable { mutableStateOf("Monthly") }
    var selected by rememberSaveable { mutableStateOf("200 GB") }
    var updated by rememberSaveable { mutableStateOf(false) }
    val yearly = period == "Yearly"

    Screen(modifier) {
        Column(Modifier.fillMaxSize()) {
            Column(
                Modifier
                    .weight(1f)
                    .verticalScroll(rememberScrollState())
                    .padding(horizontal = 20.dp, vertical = 36.dp),
                verticalArrangement = Arrangement.spacedBy(24.dp),
            ) {
                Column(
                    Modifier.fillMaxWidth(),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    Icon(PhosphorIcons.Regular.Cloud, contentDescription = null, size = 40.dp, tint = Palette.blue500)
                    BasicText(
                        "More space with suiss Cloud+.",
                        modifier = Modifier.semantics { heading() },
                        style = Typography.xl3.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold, textAlign = TextAlign.Center),
                    )
                    ToggleGroup(
                        value = period,
                        onValueChange = { value ->
                            if (value != null && value != period) {
                                period = value
                                onPeriodChange(value)
                            }
                        },
                        modifier = Modifier
                            .padding(top = 8.dp)
                            .semantics { contentDescription = "Billing period" },
                        size = ToggleSize.Sm,
                        spacing = 0,
                    ) {
                        ToggleGroupItem("Monthly", "Monthly")
                        ToggleGroupItem("Yearly · 2 months free", "Yearly")
                    }
                }
                Column(
                    Modifier
                        .selectableGroup()
                        .semantics { contentDescription = "Storage plan" },
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                ) {
                    StoragePlans.forEach { plan ->
                        StorageCard(plan, yearly, selected = plan.size == selected) {
                            selected = plan.size
                            updated = false
                        }
                    }
                }
            }
            BottomBar(separator = true) {
                BottomBarContent {
                    Button(
                        if (updated) "Your plan is updated" else "Switch to $selected",
                        {
                            onSelectPlan(selected, period)
                            updated = true
                        },
                        modifier = Modifier.semantics { liveRegion = LiveRegionMode.Polite },
                        size = ButtonSize.Lg,
                        block = true,
                    )
                }
            }
        }
    }
}

@Composable
private fun StorageCard(plan: StoragePlan, yearly: Boolean, selected: Boolean, onSelect: () -> Unit) {
    val colors = EsuissTheme.colors
    val haptics = rememberHaptics()
    val shape = RoundedCornerShape(18.dp)
    val lift by animateDpAsState(if (selected) (-3).dp else 0.dp, tween(350, easing = StorageLiftEasing), label = "lift")
    val border by animateColorAsState(if (selected) colors.primary else Color.Transparent, tween(200), label = "border")
    Box(
        Modifier
            .fillMaxWidth()
            .padding(top = if (plan.popular) 9.dp else 0.dp)
            .offset(y = lift),
    ) {
        Column(
            Modifier
                .fillMaxWidth()
                .background(colors.muted, shape)
                .border(2.dp, border, shape)
                .selectable(
                    selected = selected,
                    interactionSource = remember { MutableInteractionSource() },
                    indication = null,
                    role = Role.RadioButton,
                    onClick = {
                        if (!selected) haptics.selection()
                        onSelect()
                    },
                )
                .padding(18.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
                BasicText(
                    plan.size,
                    modifier = Modifier.weight(1f),
                    style = Typography.xl2.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold),
                )
                StorageDot(selected)
            }
            BasicText(
                buildAnnotatedString {
                    withStyle(SpanStyle(fontWeight = FontWeight.SemiBold, fontFeatureSettings = "tnum")) {
                        append(storageMoney(if (yearly) plan.price * 10 else plan.price))
                    }
                    withStyle(Typography.sm.toSpanStyle().copy(color = colors.mutedForeground)) { append(if (yearly) " /yr" else " /mo") }
                },
                style = Typography.xl2.copy(color = colors.foreground),
            )
            Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                plan.features.forEach { feature ->
                    Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        Icon(
                            PhosphorIcons.Bold.Check,
                            contentDescription = null,
                            modifier = Modifier.padding(top = 3.dp),
                            size = 13.dp,
                            tint = if (colors.isDark) Palette.green400 else Palette.green600,
                        )
                        BasicText(feature, style = Typography.sm.copy(color = colors.foreground))
                    }
                }
            }
        }
        if (plan.popular) {
            BasicText(
                "Most popular",
                modifier = Modifier
                    .offset(x = 18.dp, y = (-9).dp)
                    .background(colors.primary, CircleShape)
                    .padding(horizontal = 9.dp, vertical = 2.dp),
                style = Typography.xs.copy(color = colors.primaryForeground, fontWeight = FontWeight.SemiBold),
            )
        }
    }
}

@Composable
private fun StorageDot(selected: Boolean) {
    val colors = EsuissTheme.colors
    Box(
        Modifier
            .size(20.dp)
            .background(if (selected) colors.primary else colors.background, CircleShape)
            .border(1.dp, if (selected) colors.primary else colors.input, CircleShape)
            .clearAndSetSemantics {},
        contentAlignment = Alignment.Center,
    ) {
        if (selected) {
            Box(
                Modifier
                    .size(8.dp)
                    .background(colors.primaryForeground, CircleShape),
            )
        }
    }
}
