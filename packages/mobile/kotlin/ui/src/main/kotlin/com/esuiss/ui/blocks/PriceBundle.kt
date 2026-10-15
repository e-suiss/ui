package com.esuiss.ui.blocks

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.selection.selectableGroup
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
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Fill
import com.adamglin.phosphoricons.fill.Cloud
import com.adamglin.phosphoricons.fill.Flame
import com.adamglin.phosphoricons.fill.GameController
import com.adamglin.phosphoricons.fill.MusicNote
import com.adamglin.phosphoricons.fill.Newspaper
import com.adamglin.phosphoricons.fill.Television
import com.esuiss.ui.components.BottomBar
import com.esuiss.ui.components.BottomBarContent
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.Screen
import com.esuiss.ui.components.rememberHaptics
import com.esuiss.ui.theme.Colors
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Palette
import com.esuiss.ui.theme.Typography
import java.text.NumberFormat
import java.util.Currency
import java.util.Locale

private class BundleService(
    val name: String,
    val icon: ImageVector,
    val background: (Colors) -> Color,
    val foreground: (Colors) -> Color,
)

private class BundlePlan(
    val name: String,
    val price: Double,
    val people: String,
    val storage: String,
    val included: Int,
    val saving: Int,
)

private val BundleServices = listOf(
    BundleService("suiss Music", PhosphorIcons.Fill.MusicNote, { Palette.red500 }, { Palette.white }),
    BundleService("suiss TV", PhosphorIcons.Fill.Television, { it.foreground }, { it.background }),
    BundleService("suiss Arcade", PhosphorIcons.Fill.GameController, { Palette.red500 }, { Palette.white }),
    BundleService("suiss Cloud+", PhosphorIcons.Fill.Cloud, { Palette.blue500 }, { Palette.white }),
    BundleService("Fitness+", PhosphorIcons.Fill.Flame, { Palette.green500 }, { Palette.white }),
    BundleService("News+", PhosphorIcons.Fill.Newspaper, { Palette.pink500 }, { Palette.white }),
)

private val BundlePlans = listOf(
    BundlePlan("Individual", 19.95, "1 person", "50 GB", 4, 6),
    BundlePlan("Family", 25.95, "Up to 6 people", "200 GB", 4, 8),
    BundlePlan("Premier", 37.95, "Up to 6 people", "2 TB", 6, 29),
)

private fun bundleMoney(value: Double): String =
    NumberFormat.getCurrencyInstance(Locale.US).apply { currency = Currency.getInstance("USD") }.format(value)

@Composable
fun PriceBundle(
    modifier: Modifier = Modifier,
    onSelectPlan: (plan: String) -> Unit = {},
    onCompare: (plan: String) -> Unit = {},
) {
    var selected by rememberSaveable { mutableStateOf("Family") }
    val plan = BundlePlans.firstOrNull { it.name == selected } ?: BundlePlans[1]

    val colors = EsuissTheme.colors
    Screen(modifier) {
        Column(Modifier.fillMaxSize()) {
            Column(
                Modifier
                    .weight(1f)
                    .verticalScroll(rememberScrollState())
                    .padding(horizontal = 20.dp, vertical = 34.dp),
                verticalArrangement = Arrangement.spacedBy(22.dp),
            ) {
                Column(
                    Modifier.fillMaxWidth(),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    BasicText(
                        buildAnnotatedString {
                            withStyle(SpanStyle(fontWeight = FontWeight.Bold)) { append("suiss") }
                            append(" One")
                        },
                        modifier = Modifier.semantics { heading() },
                        style = Typography.xl3.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold),
                    )
                    BasicText(
                        "Bundle it all in one subscription.",
                        style = Typography.xl.copy(color = colors.mutedForeground, textAlign = TextAlign.Center),
                    )
                }
                Column(
                    Modifier
                        .selectableGroup()
                        .semantics { contentDescription = "Plan" },
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                ) {
                    BundlePlans.forEach { item ->
                        BundleCard(item, selected = item.name == selected) { selected = item.name }
                    }
                }
            }
            BottomBar(separator = true) {
                BottomBarContent {
                    Button("Try it free", { onSelectPlan(plan.name) }, size = ButtonSize.Lg, block = true)
                    BundleLink("Save \$${plan.saving} compared to buying separately ›") { onCompare(plan.name) }
                }
            }
        }
    }
}

@Composable
private fun BundleCard(plan: BundlePlan, selected: Boolean, onSelect: () -> Unit) {
    val colors = EsuissTheme.colors
    val haptics = rememberHaptics()
    val shape = RoundedCornerShape(20.dp)
    val fill by animateColorAsState(
        if (selected) colors.muted else colors.muted.copy(alpha = 0.6f),
        tween(300),
        label = "fill",
    )
    val border by animateColorAsState(if (selected) colors.primary else colors.input, tween(300), label = "border")
    Column(
        Modifier
            .fillMaxWidth()
            .background(fill, shape)
            .border(if (selected) 2.dp else 1.dp, border, shape)
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
            .padding(20.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp),
    ) {
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
            BasicText(
                plan.name,
                modifier = Modifier.weight(1f),
                style = Typography.xl2.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold),
            )
            BasicText(plan.people, style = Typography.xs.copy(color = colors.mutedForeground))
        }
        BasicText(
            buildAnnotatedString {
                withStyle(SpanStyle(fontWeight = FontWeight.SemiBold, fontFeatureSettings = "tnum")) { append(bundleMoney(plan.price)) }
                withStyle(Typography.sm.toSpanStyle().copy(color = colors.mutedForeground)) { append(" /mo") }
            },
            style = Typography.xl2.copy(color = colors.foreground),
        )
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            BundleServices.forEachIndexed { index, service ->
                val included = index < plan.included
                val text = if (index == 3) "${service.name} ${plan.storage}" else service.name
                Row(
                    modifier = Modifier.semantics(mergeDescendants = true) {
                        if (!included) contentDescription = "$text (not included)"
                    },
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Box(
                        Modifier
                            .size(22.dp)
                            .background(if (included) service.background(colors) else colors.secondary, RoundedCornerShape(6.dp))
                            .clearAndSetSemantics {},
                        contentAlignment = Alignment.Center,
                    ) {
                        Icon(
                            service.icon,
                            contentDescription = null,
                            size = 13.dp,
                            tint = if (included) service.foreground(colors) else colors.mutedForeground,
                        )
                    }
                    BasicText(
                        text,
                        style = Typography.sm.copy(
                            color = if (included) colors.foreground else colors.mutedForeground,
                            textDecoration = if (included) null else TextDecoration.LineThrough,
                        ),
                    )
                }
            }
        }
    }
}

@Composable
private fun BundleLink(text: String, onClick: () -> Unit) {
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    BasicText(
        text,
        modifier = Modifier
            .graphicsLayer { alpha = if (pressed) 0.8f else 1f }
            .clickable(interactionSource = interaction, indication = null, role = Role.Button, onClick = onClick)
            .padding(vertical = 6.dp),
        style = Typography.base.copy(color = EsuissTheme.colors.primary, textAlign = TextAlign.Center),
    )
}
