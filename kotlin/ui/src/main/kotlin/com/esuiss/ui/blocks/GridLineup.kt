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
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
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
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Fill
import com.adamglin.phosphoricons.Light
import com.adamglin.phosphoricons.fill.DeviceMobile as FillDeviceMobile
import com.adamglin.phosphoricons.fill.DeviceMobileCamera as FillDeviceMobileCamera
import com.adamglin.phosphoricons.fill.DeviceMobileSpeaker as FillDeviceMobileSpeaker
import com.adamglin.phosphoricons.light.DeviceMobile
import com.adamglin.phosphoricons.light.DeviceMobileCamera
import com.adamglin.phosphoricons.light.DeviceMobileSpeaker
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.Screen
import com.esuiss.ui.components.rememberHaptics
import com.esuiss.ui.theme.Colors
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography

private class LineupFinish(val label: String, val color: (Colors) -> Color)

private class LineupModel(
    val name: String,
    val tagline: String,
    val price: String,
    val icon: ImageVector,
    val fill: ImageVector,
    val alt: String,
    val finishes: List<LineupFinish>,
    val kicker: String? = null,
)

private val LineupModels = listOf(
    LineupModel(
        "Phone Pro",
        "Pro at its very core.",
        "$1,099",
        PhosphorIcons.Light.DeviceMobileCamera,
        PhosphorIcons.Fill.FillDeviceMobileCamera,
        "An orange phone on a warm gradient",
        listOf(LineupFinish("Cosmic Orange") { it.orange }, LineupFinish("Deep Blue") { it.indigo }, LineupFinish("Silver") { it.gray }),
        "New",
    ),
    LineupModel(
        "Phone Air",
        "The thinnest phone ever.",
        "$999",
        PhosphorIcons.Light.DeviceMobileSpeaker,
        PhosphorIcons.Fill.FillDeviceMobileSpeaker,
        "A silver phone on a light grey background",
        listOf(LineupFinish("Sky Blue") { it.cyan }, LineupFinish("Light Gold") { it.yellow }, LineupFinish("Space Black") { it.media }),
        "New",
    ),
    LineupModel(
        "Phone",
        "Better in every way.",
        "$799",
        PhosphorIcons.Light.DeviceMobile,
        PhosphorIcons.Fill.FillDeviceMobile,
        "A phone floating among blue spheres",
        listOf(
            LineupFinish("Lavender") { it.purple },
            LineupFinish("Sage") { it.mint },
            LineupFinish("Mist Blue") { it.teal },
            LineupFinish("Black") { it.media },
        ),
    ),
    LineupModel(
        "Phone e",
        "Speed. Battery. Value.",
        "$599",
        PhosphorIcons.Light.DeviceMobile,
        PhosphorIcons.Fill.FillDeviceMobile,
        "A phone on a pink and purple backdrop",
        listOf(LineupFinish("Black") { it.media }, LineupFinish("White") { it.onMedia }),
    ),
)

@Composable
fun GridLineup(
    modifier: Modifier = Modifier,
    onBuy: (model: String, finish: String) -> Unit = { _, _ -> },
    onLearnMore: (model: String) -> Unit = {},
) {
    val colors = EsuissTheme.colors
    Screen(modifier) {
        Column(
            Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 20.dp, vertical = 40.dp),
        ) {
            BasicText(
                "Which phone is right for you?",
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 36.dp)
                    .semantics { heading() },
                style = Typography.xl3.copy(color = colors.label, fontWeight = FontWeight.SemiBold, textAlign = TextAlign.Center),
            )
            Column(verticalArrangement = Arrangement.spacedBy(40.dp)) {
                LineupModels.chunked(2).forEach { pair ->
                    Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                        pair.forEach { model ->
                            LineupTile(model, Modifier.weight(1f), onBuy, onLearnMore)
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun LineupTile(
    model: LineupModel,
    modifier: Modifier,
    onBuy: (String, String) -> Unit,
    onLearnMore: (String) -> Unit,
) {
    val colors = EsuissTheme.colors
    var finish by rememberSaveable(model.name) { mutableStateOf(model.finishes.first().label) }
    val current = model.finishes.firstOrNull { it.label == finish } ?: model.finishes.first()
    val tint by animateColorAsState(current.color(colors), tween(400), label = "finish")
    Column(modifier, horizontalAlignment = Alignment.CenterHorizontally) {
        Box(
            Modifier
                .fillMaxWidth()
                .aspectRatio(0.85f)
                .background(colors.surfaceSecondary, RoundedCornerShape(16.dp))
                .clearAndSetSemantics { contentDescription = model.alt },
            contentAlignment = Alignment.Center,
        ) {
            Icon(model.fill, contentDescription = null, size = 88.dp, tint = tint)
            Icon(model.icon, contentDescription = null, size = 88.dp, tint = colors.labelTertiary)
        }
        Row(
            Modifier
                .padding(top = 12.dp)
                .selectableGroup()
                .semantics { contentDescription = "${model.name} finish" },
        ) {
            model.finishes.forEach { item ->
                LineupSwatch(item, selected = item.label == finish) { finish = item.label }
            }
        }
        BasicText(
            model.kicker.orEmpty(),
            modifier = Modifier
                .padding(top = 6.dp)
                .heightIn(min = 18.dp),
            style = Typography.xs.copy(color = colors.warning, fontWeight = FontWeight.SemiBold),
        )
        BasicText(
            model.name,
            modifier = Modifier
                .padding(top = 4.dp)
                .semantics { heading() },
            style = Typography.xl.copy(color = colors.label, fontWeight = FontWeight.SemiBold, textAlign = TextAlign.Center),
        )
        BasicText(
            model.tagline,
            modifier = Modifier.padding(top = 8.dp),
            style = Typography.base.copy(color = colors.label, textAlign = TextAlign.Center),
            minLines = 2,
        )
        BasicText(
            "From ${model.price}",
            modifier = Modifier.padding(top = 8.dp),
            style = Typography.sm.copy(color = colors.labelSecondary),
        )
        FlowRow(
            modifier = Modifier.padding(top = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(16.dp, Alignment.CenterHorizontally),
            verticalArrangement = Arrangement.spacedBy(8.dp),
            itemVerticalAlignment = Alignment.CenterVertically,
        ) {
            Button("Buy", { onBuy(model.name, finish) }, size = ButtonSize.Sm)
            LineupLink("Learn more ›") { onLearnMore(model.name) }
        }
    }
}

@Composable
private fun LineupSwatch(finish: LineupFinish, selected: Boolean, onSelect: () -> Unit) {
    val colors = EsuissTheme.colors
    val haptics = rememberHaptics()
    val ring by animateColorAsState(if (selected) colors.labelSecondary else Color.Transparent, tween(200), label = "ring")
    Box(
        Modifier
            .size(28.dp)
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
            .semantics { contentDescription = finish.label },
        contentAlignment = Alignment.Center,
    ) {
        Box(
            Modifier
                .size(18.dp)
                .border(1.5.dp, ring, CircleShape)
                .padding(3.dp)
                .background(finish.color(colors), CircleShape)
                .border(1.dp, colors.label.copy(alpha = 0.15f), CircleShape),
        )
    }
}

@Composable
private fun LineupLink(text: String, onClick: () -> Unit) {
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    BasicText(
        text,
        modifier = Modifier
            .graphicsLayer { alpha = if (pressed) 0.5f else 1f }
            .clickable(interactionSource = interaction, indication = null, role = Role.Button, onClick = onClick)
            .padding(vertical = 6.dp),
        style = Typography.sm.copy(color = EsuissTheme.colors.link),
    )
}
