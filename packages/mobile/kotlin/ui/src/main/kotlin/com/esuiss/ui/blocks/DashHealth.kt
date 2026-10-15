package com.esuiss.ui.blocks

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.scaleIn
import androidx.compose.animation.scaleOut
import androidx.compose.animation.slideInHorizontally
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.lerp
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.input.nestedscroll.nestedScroll
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Bold
import com.adamglin.phosphoricons.Fill
import com.adamglin.phosphoricons.bold.CaretRight
import com.adamglin.phosphoricons.bold.Minus
import com.adamglin.phosphoricons.bold.Plus
import com.adamglin.phosphoricons.fill.ChartBar
import com.adamglin.phosphoricons.fill.Flame
import com.adamglin.phosphoricons.fill.Heart
import com.adamglin.phosphoricons.fill.Moon
import com.adamglin.phosphoricons.fill.Users
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Header
import com.esuiss.ui.components.HeaderActions
import com.esuiss.ui.components.HeaderBack
import com.esuiss.ui.components.HeaderLargeTitle
import com.esuiss.ui.components.HeaderTitle
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.Item
import com.esuiss.ui.components.ItemActions
import com.esuiss.ui.components.ItemContent
import com.esuiss.ui.components.ItemGroup
import com.esuiss.ui.components.ItemGroupVariant
import com.esuiss.ui.components.ItemMedia
import com.esuiss.ui.components.ItemSeparator
import com.esuiss.ui.components.ItemTitle
import com.esuiss.ui.components.Screen
import com.esuiss.ui.components.ScreenVariant
import com.esuiss.ui.components.rememberHeaderState
import com.esuiss.ui.theme.Colors
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Palette
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography

private val HealthEasing = CubicBezierEasing(0.32f, 0.72f, 0f, 1f)

private class HealthCategory(
    val value: String,
    val icon: ImageVector,
    val tint: (Colors) -> Color,
    val mix: Float,
)

private val HealthCategories = listOf(
    HealthCategory("Activity", PhosphorIcons.Fill.Flame, { Palette.orange500 }, 0.45f),
    HealthCategory("Heart", PhosphorIcons.Fill.Heart, { Palette.red500 }, 0.25f),
    HealthCategory("Sleep", PhosphorIcons.Fill.Moon, { Palette.cyan500 }, 0.5f),
    HealthCategory("Mobility", PhosphorIcons.Fill.ChartBar, { Palette.green500 }, 0.45f),
)

private class HealthMetric(
    val category: String,
    val label: String,
    val value: String,
    val unit: String?,
    val color: (Colors) -> Color,
    val data: List<Int>,
    val bars: Boolean,
)

private val HealthMetrics = listOf(
    HealthMetric("Activity", "Move", "486", "kcal", { Palette.red500 }, listOf(40, 62, 38, 70, 55, 81, 65), true),
    HealthMetric("Activity", "Steps", "8,412", "steps", { Palette.orange500 }, listOf(60, 80, 45, 90, 70, 95, 52), true),
    HealthMetric("Heart", "Resting Heart Rate", "58", "bpm", { Palette.red500 }, listOf(61, 60, 59, 58, 60, 57, 58), false),
    HealthMetric("Sleep", "Sleep", "7 hr 12 min", null, { Palette.cyan500 }, listOf(68, 74, 59, 79, 64, 86, 72), true),
    HealthMetric("Heart", "Cardio Fitness", "42.1", "VO₂ max", { Palette.red500 }, listOf(40, 40, 41, 41, 42, 42, 42), false),
    HealthMetric("Mobility", "Walking Speed", "5.1", "km/h", { Palette.green500 }, listOf(48, 50, 49, 51, 50, 52, 51), false),
)

private fun categoryText(colors: Colors, category: HealthCategory): Color =
    if (colors.isDark) category.tint(colors) else lerp(category.tint(colors), colors.foreground, category.mix)

@Composable
fun DashHealth(
    modifier: Modifier = Modifier,
    onPinnedChange: (pinned: List<String>) -> Unit = {},
    onMetricPress: (label: String) -> Unit = {},
) {
    val colors = EsuissTheme.colors
    var section by rememberSaveable { mutableStateOf("Summary") }
    var editing by rememberSaveable { mutableStateOf(false) }
    val pinned = remember { mutableStateListOf("Move", "Steps", "Resting Heart Rate", "Sleep") }

    fun open(value: String) {
        section = value
        editing = false
    }

    fun togglePin(label: String) {
        onPinnedChange(if (label in pinned) pinned - label else pinned + label)
        if (label in pinned) pinned.remove(label) else pinned.add(label)
    }

    Screen(modifier, variant = if (colors.isDark) ScreenVariant.Default else ScreenVariant.Secondary) {
        AnimatedContent(
            targetState = section,
            transitionSpec = {
                val forward = targetState != "Summary"
                (fadeIn(tween(300)) + slideInHorizontally(tween(450, easing = HealthEasing)) { if (forward) it / 4 else -it / 4 }) togetherWith
                    fadeOut(tween(150))
            },
            label = "section",
        ) { current ->
            val header = rememberHeaderState()
            val summary = current == "Summary"
            val cards = HealthMetrics.filter { if (summary) editing || it.label in pinned else it.category == current }
            Column(
                Modifier
                    .fillMaxSize()
                    .nestedScroll(header.nestedScrollConnection),
            ) {
                Header(state = header) {
                    if (!summary) HeaderBack(onClick = { open("Summary") }, text = "Summary")
                    HeaderTitle(current)
                    HeaderLargeTitle(current)
                    HeaderActions {
                        Box(
                            Modifier
                                .size(34.dp)
                                .background(Palette.indigo500, CircleShape)
                                .semantics { contentDescription = "Jamie Rivera" },
                            contentAlignment = Alignment.Center,
                        ) {
                            BasicText("JR", style = Typography.xs.copy(color = Palette.white, fontWeight = FontWeight.SemiBold))
                        }
                    }
                }
                Column(
                    Modifier
                        .weight(1f)
                        .fillMaxWidth()
                        .verticalScroll(rememberScrollState())
                        .padding(start = 20.dp, end = 20.dp, top = 8.dp, bottom = 32.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp),
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        BasicText(
                            if (summary) "Pinned" else "Last 7 days",
                            modifier = Modifier
                                .weight(1f)
                                .semantics { heading() },
                            style = Typography.xl.copy(color = colors.foreground, fontWeight = FontWeight.Bold),
                        )
                        if (summary) {
                            Button(onClick = { editing = !editing }, variant = ButtonVariant.Plain, size = ButtonSize.Sm) {
                                BasicText(
                                    if (editing) "Done" else "Edit",
                                    style = Typography.base.copy(color = colors.primary, fontWeight = if (editing) FontWeight.SemiBold else FontWeight.Normal),
                                )
                            }
                        }
                    }
                    if (cards.isEmpty()) {
                        BasicText(
                            "No pinned items. Use Edit to add some.",
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 30.dp),
                            style = Typography.base.copy(color = colors.mutedForeground, textAlign = TextAlign.Center),
                        )
                    }
                    cards.forEachIndexed { index, metric ->
                        key(metric.label) {
                            MetricRow(
                                metric = metric,
                                index = index,
                                editing = editing && summary,
                                pinned = metric.label in pinned,
                                onTogglePin = { togglePin(metric.label) },
                                onClick = { onMetricPress(metric.label) },
                            )
                        }
                    }
                    if (summary) {
                        HealthNav(onOpen = ::open, modifier = Modifier.padding(top = 20.dp))
                    }
                }
            }
        }
    }
}

@Composable
private fun HealthTile(icon: ImageVector, tint: Color) {
    Box(
        Modifier
            .size(28.dp)
            .background(tint, RoundedCornerShape(Radius.md)),
        contentAlignment = Alignment.Center,
    ) {
        Icon(icon, contentDescription = null, size = 16.dp, tint = Palette.white)
    }
}

@Composable
private fun HealthNav(onOpen: (String) -> Unit, modifier: Modifier = Modifier) {
    val colors = EsuissTheme.colors
    val card = if (colors.isDark) colors.muted else colors.background
    Column(modifier, verticalArrangement = Arrangement.spacedBy(20.dp)) {
        HealthNavGroup(card) {
            HealthNavRow("Sharing", PhosphorIcons.Fill.Users, Palette.blue500) { onOpen("Sharing") }
        }
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            BasicText(
                "Categories",
                modifier = Modifier
                    .padding(horizontal = 4.dp)
                    .semantics { heading() },
                style = Typography.xl.copy(color = colors.foreground, fontWeight = FontWeight.Bold),
            )
            HealthNavGroup(card) {
                HealthCategories.forEachIndexed { index, category ->
                    if (index > 0) ItemSeparator(Modifier.padding(start = 40.dp))
                    HealthNavRow(category.value, category.icon, category.tint(colors)) { onOpen(category.value) }
                }
            }
        }
    }
}

@Composable
private fun HealthNavGroup(background: Color, content: @Composable () -> Unit) {
    ItemGroup(
        modifier = Modifier
            .clip(RoundedCornerShape(Radius.xl2))
            .background(background),
        variant = ItemGroupVariant.Inset,
    ) {
        Column(Modifier.background(background)) { content() }
    }
}

@Composable
private fun HealthNavRow(label: String, icon: ImageVector, tint: Color, onClick: () -> Unit) {
    val colors = EsuissTheme.colors
    Item(onClick = onClick) {
        ItemMedia { HealthTile(icon, tint) }
        ItemContent {
            ItemTitle {
                BasicText(label, style = Typography.base.copy(color = colors.foreground))
            }
        }
        ItemActions {
            Icon(PhosphorIcons.Bold.CaretRight, contentDescription = null, size = 12.dp, tint = colors.mutedForeground)
        }
    }
}

@Composable
private fun MetricRow(
    metric: HealthMetric,
    index: Int,
    editing: Boolean,
    pinned: Boolean,
    onTogglePin: () -> Unit,
    onClick: () -> Unit,
) {
    val colors = EsuissTheme.colors
    val category = HealthCategories.first { it.value == metric.category }
    val appear = remember { Animatable(0f) }
    LaunchedEffect(Unit) { appear.animateTo(1f, tween(800, delayMillis = index * 40, easing = HealthEasing)) }
    val dim by animateFloatAsState(if (editing && !pinned) 0.55f else 1f, tween(200), label = "dim")
    val pinFill by animateColorAsState(
        if (pinned) colors.destructive else if (colors.isDark) Palette.green500 else lerp(Palette.green500, colors.foreground, 0.35f),
        tween(200),
        label = "pin",
    )
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    val card = if (colors.isDark) colors.muted else colors.background
    Row(
        modifier = Modifier.graphicsLayer {
            alpha = appear.value
            translationY = (1f - appear.value) * 8.dp.toPx()
        },
        horizontalArrangement = Arrangement.spacedBy(12.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        AnimatedVisibility(visible = editing, enter = fadeIn() + scaleIn(), exit = fadeOut() + scaleOut()) {
            Box(
                Modifier
                    .size(44.dp)
                    .clickable(
                        interactionSource = remember { MutableInteractionSource() },
                        indication = null,
                        role = Role.Button,
                        onClick = onTogglePin,
                    )
                    .semantics { contentDescription = "${if (pinned) "Unpin" else "Pin"} ${metric.label}" },
                contentAlignment = Alignment.Center,
            ) {
                Box(
                    Modifier
                        .size(24.dp)
                        .background(pinFill, CircleShape),
                    contentAlignment = Alignment.Center,
                ) {
                    Icon(if (pinned) PhosphorIcons.Bold.Minus else PhosphorIcons.Bold.Plus, contentDescription = null, size = 12.dp, tint = Palette.white)
                }
            }
        }
        Column(
            modifier = Modifier
                .weight(1f)
                .graphicsLayer { alpha = dim }
                .clip(RoundedCornerShape(Radius.xl))
                .alpha(if (pressed) 0.8f else 1f)
                .background(card)
                .clickable(interactionSource = interaction, indication = null, role = Role.Button, onClick = onClick)
                .padding(horizontal = 16.dp, vertical = 12.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp),
        ) {
            val text = categoryText(colors, category)
            Row(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalAlignment = Alignment.CenterVertically) {
                Icon(category.icon, contentDescription = null, size = 16.dp, tint = text)
                BasicText(
                    metric.label,
                    modifier = Modifier.weight(1f),
                    style = Typography.base.copy(color = text, fontWeight = FontWeight.SemiBold),
                    maxLines = 1,
                )
                BasicText("9:41", style = Typography.sm.copy(color = colors.mutedForeground))
                Icon(PhosphorIcons.Bold.CaretRight, contentDescription = null, size = 12.dp, tint = colors.mutedForeground)
            }
            Row(horizontalArrangement = Arrangement.spacedBy(16.dp), verticalAlignment = Alignment.Bottom) {
                BasicText(
                    buildAnnotatedString {
                        withStyle(SpanStyle(fontSize = Typography.xl2.fontSize, fontWeight = FontWeight.Bold, color = colors.foreground)) {
                            append(metric.value)
                        }
                        if (metric.unit != null) {
                            withStyle(SpanStyle(fontSize = Typography.base.fontSize, fontWeight = FontWeight.SemiBold, color = colors.mutedForeground)) {
                                append(" ${metric.unit}")
                            }
                        }
                    },
                    modifier = Modifier.weight(1f),
                    style = Typography.xl2.copy(fontFeatureSettings = "tnum"),
                )
                Spark(metric.data, metric.color(colors), metric.bars)
            }
        }
    }
}

@Composable
private fun Spark(data: List<Int>, color: Color, bars: Boolean) {
    val max = data.max()
    val min = data.min()
    if (bars) {
        Row(
            modifier = Modifier
                .height(36.dp)
                .clearAndSetSemantics {},
            horizontalArrangement = Arrangement.spacedBy(4.dp),
            verticalAlignment = Alignment.Bottom,
        ) {
            data.forEachIndexed { index, value ->
                Box(
                    Modifier
                        .width(8.dp)
                        .height(36.dp * (value.toFloat() / max))
                        .graphicsLayer { alpha = if (index == data.lastIndex) 1f else 0.45f }
                        .background(color, RoundedCornerShape(3.dp)),
                )
            }
        }
        return
    }
    Canvas(
        Modifier
            .size(width = 120.dp, height = 36.dp)
            .clearAndSetSemantics {},
    ) {
        val range = (max - min).coerceAtLeast(1).toFloat()
        val path = Path()
        data.forEachIndexed { index, value ->
            val point = Offset(
                size.width * index / (data.size - 1),
                size.height - ((value - min) / range) * (size.height * 30f / 36f) - size.height * 3f / 36f,
            )
            if (index == 0) path.moveTo(point.x, point.y) else path.lineTo(point.x, point.y)
        }
        drawPath(path, color, style = Stroke(width = 2.2.dp.toPx(), cap = StrokeCap.Round, join = StrokeJoin.Round))
    }
}
