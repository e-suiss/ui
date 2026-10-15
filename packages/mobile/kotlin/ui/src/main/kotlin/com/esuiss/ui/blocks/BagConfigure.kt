package com.esuiss.ui.blocks

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
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
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
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
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Light
import com.adamglin.phosphoricons.light.DeviceMobile
import com.esuiss.ui.components.BottomBar
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

private val ConfigureEasing = CubicBezierEasing(0.32f, 0.72f, 0f, 1f)

private class ConfigureModel(val name: String, val price: Double)

private class ConfigureFinish(val name: String, val color: (Colors) -> Color, val alt: String)

private class ConfigureStorage(val size: String, val extra: Double)

private val ConfigureModels = listOf(
    ConfigureModel("Phone Pro", 1099.0),
    ConfigureModel("Phone Pro Max", 1199.0),
)

private val ConfigureFinishes = listOf(
    ConfigureFinish("Cosmic Orange", { Palette.orange500 }, "An orange phone on a warm gradient"),
    ConfigureFinish("Deep Blue", { Palette.indigo500 }, "A phone floating among blue spheres"),
    ConfigureFinish("Silver", { Palette.zinc500 }, "A silver phone on a light grey background"),
)

private val ConfigureStorageOptions = listOf(
    ConfigureStorage("256 GB", 0.0),
    ConfigureStorage("512 GB", 200.0),
    ConfigureStorage("1 TB", 400.0),
)

private fun configureMoney(value: Double, digits: Int = 2): String =
    NumberFormat.getCurrencyInstance(Locale.US).apply {
        currency = Currency.getInstance("USD")
        minimumFractionDigits = digits
        maximumFractionDigits = digits
    }.format(value)

@Composable
fun BagConfigure(
    modifier: Modifier = Modifier,
    onAddToBag: (model: String, finish: String, storage: String, price: Double) -> Unit = { _, _, _, _ -> },
) {
    val colors = EsuissTheme.colors
    var model by rememberSaveable { mutableStateOf(ConfigureModels.first().name) }
    var finish by rememberSaveable { mutableStateOf(ConfigureFinishes.first().name) }
    var size by rememberSaveable { mutableStateOf(ConfigureStorageOptions.first().size) }
    var added by rememberSaveable { mutableStateOf(false) }
    val price = (ConfigureModels.firstOrNull { it.name == model }?.price ?: 0.0) +
        (ConfigureStorageOptions.firstOrNull { it.size == size }?.extra ?: 0.0)
    val current = ConfigureFinishes.firstOrNull { it.name == finish } ?: ConfigureFinishes.first()

    Screen(modifier) {
        Column(Modifier.fillMaxSize()) {
            Column(
                Modifier
                    .weight(1f)
                    .verticalScroll(rememberScrollState())
                    .padding(horizontal = 20.dp, vertical = 20.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp),
            ) {
                ConfigureHero(current)
                Column {
                    BasicText("New", style = Typography.xs.copy(color = if (colors.isDark) Palette.amber400 else Palette.amber600, fontWeight = FontWeight.SemiBold))
                    BasicText(
                        "Buy Phone Pro",
                        modifier = Modifier.semantics { heading() },
                        style = Typography.xl3.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold),
                    )
                }
                BasicText(
                    buildAnnotatedString {
                        append("Model. ")
                        withStyle(SpanStyle(color = colors.mutedForeground)) { append("Which one is right for you?") }
                    },
                    style = Typography.lg.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold),
                )
                Column(
                    Modifier
                        .selectableGroup()
                        .semantics { contentDescription = "Model" },
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    ConfigureModels.forEach { item ->
                        ConfigureCard(
                            selected = item.name == model,
                            onSelect = {
                                model = item.name
                                added = false
                            },
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 16.dp, vertical = 14.dp),
                                verticalAlignment = Alignment.CenterVertically,
                            ) {
                                BasicText(
                                    item.name,
                                    modifier = Modifier.weight(1f),
                                    style = Typography.base.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold),
                                )
                                BasicText("From ${configureMoney(item.price, 0)}", style = Typography.sm.copy(color = colors.mutedForeground))
                            }
                        }
                    }
                }
                BasicText(
                    buildAnnotatedString {
                        append("Finish. ")
                        withStyle(SpanStyle(color = colors.mutedForeground)) { append(finish) }
                    },
                    style = Typography.lg.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold),
                )
                Row(
                    Modifier
                        .selectableGroup()
                        .semantics { contentDescription = "Finish" },
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                ) {
                    ConfigureFinishes.forEach { item ->
                        ConfigureSwatch(item, selected = item.name == finish) { finish = item.name }
                    }
                }
                BasicText("Storage.", style = Typography.lg.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold))
                Row(
                    Modifier
                        .selectableGroup()
                        .semantics { contentDescription = "Storage" },
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    ConfigureStorageOptions.forEach { item ->
                        ConfigureCard(
                            selected = item.size == size,
                            onSelect = {
                                size = item.size
                                added = false
                            },
                            modifier = Modifier.weight(1f),
                        ) {
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(horizontal = 6.dp, vertical = 12.dp),
                                horizontalAlignment = Alignment.CenterHorizontally,
                                verticalArrangement = Arrangement.spacedBy(2.dp),
                            ) {
                                BasicText(
                                    item.size,
                                    style = Typography.base.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold),
                                    maxLines = 1,
                                )
                                BasicText(
                                    if (item.extra > 0) "+${configureMoney(item.extra, 0)}" else "Included",
                                    style = Typography.xs2.copy(color = colors.mutedForeground),
                                    maxLines = 1,
                                )
                            }
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
                        BasicText(
                            configureMoney(price),
                            style = Typography.xl.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold, fontFeatureSettings = "tnum"),
                        )
                        BasicText(
                            "or ${configureMoney(price / 12)}/mo. for 12 mo.",
                            style = Typography.xs.copy(color = colors.mutedForeground),
                        )
                    }
                    Button(
                        if (added) "Added to Bag" else "Add to Bag",
                        {
                            onAddToBag(model, finish, size, price)
                            added = true
                        },
                        size = ButtonSize.Lg,
                    )
                }
            }
        }
    }
}

@Composable
private fun ConfigureHero(finish: ConfigureFinish) {
    val colors = EsuissTheme.colors
    val tint by animateColorAsState(finish.color(colors), tween(600), label = "finish")
    val settle = remember { Animatable(1f) }
    LaunchedEffect(finish.name) {
        settle.snapTo(1.04f)
        settle.animateTo(1f, tween(900, easing = ConfigureEasing))
    }
    Box(
        Modifier
            .fillMaxWidth()
            .aspectRatio(4f / 3f)
            .background(colors.muted, RoundedCornerShape(22.dp))
            .clearAndSetSemantics { contentDescription = finish.alt },
        contentAlignment = Alignment.Center,
    ) {
        Icon(
            PhosphorIcons.Light.DeviceMobile,
            contentDescription = null,
            modifier = Modifier.graphicsLayer {
                scaleX = settle.value
                scaleY = settle.value
            },
            size = 140.dp,
            tint = tint,
        )
    }
}

@Composable
private fun ConfigureCard(
    selected: Boolean,
    onSelect: () -> Unit,
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit,
) {
    val colors = EsuissTheme.colors
    val haptics = rememberHaptics()
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    val shape = RoundedCornerShape(14.dp)
    val border by animateColorAsState(if (selected) colors.primary else colors.input, tween(200), label = "border")
    Box(
        modifier = modifier
            .fillMaxWidth()
            .alpha(if (pressed) 0.8f else 1f)
            .border(if (selected) 2.dp else 1.dp, border, shape)
            .selectable(
                selected = selected,
                interactionSource = interaction,
                indication = null,
                role = Role.RadioButton,
                onClick = {
                    if (!selected) haptics.selection()
                    onSelect()
                },
            ),
    ) {
        content()
    }
}

@Composable
private fun ConfigureSwatch(finish: ConfigureFinish, selected: Boolean, onSelect: () -> Unit) {
    val colors = EsuissTheme.colors
    val haptics = rememberHaptics()
    val ring by animateColorAsState(if (selected) colors.primary else Color.Transparent, tween(200), label = "ring")
    Box(
        Modifier
            .size(44.dp)
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
            .semantics { contentDescription = finish.name },
        contentAlignment = Alignment.Center,
    ) {
        Box(
            Modifier
                .size(38.dp)
                .border(2.dp, ring, CircleShape)
                .padding(4.dp)
                .background(finish.color(colors), CircleShape)
                .border(1.dp, colors.foreground.copy(alpha = 0.15f), CircleShape),
        )
    }
}
