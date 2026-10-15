package com.esuiss.ui.blocks

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.selection.toggleable
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.disabled
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Bold
import com.adamglin.phosphoricons.Fill
import com.adamglin.phosphoricons.bold.Check
import com.adamglin.phosphoricons.fill.ChatCircle
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.Item
import com.esuiss.ui.components.ItemActions
import com.esuiss.ui.components.ItemContent
import com.esuiss.ui.components.ItemGroup
import com.esuiss.ui.components.ItemGroupVariant
import com.esuiss.ui.components.ItemSeparator
import com.esuiss.ui.components.ItemSize
import com.esuiss.ui.components.ItemTitle
import com.esuiss.ui.components.Screen
import com.esuiss.ui.components.SelectSize
import com.esuiss.ui.components.Switch
import com.esuiss.ui.components.ToggleGroup
import com.esuiss.ui.components.ToggleGroupItem
import com.esuiss.ui.components.ToggleSize
import com.esuiss.ui.patterns.Picker
import com.esuiss.ui.patterns.PickerItemData
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Palette
import com.esuiss.ui.theme.Shadow
import com.esuiss.ui.theme.Typography
import com.esuiss.ui.theme.shadow
import kotlinx.coroutines.delay

private val PopEasing = CubicBezierEasing(0.3f, 1.25f, 0.5f, 1f)

private val RevealEasing = CubicBezierEasing(0.32f, 0.72f, 0f, 1f)

private enum class AlertKind(val label: String, val bars: List<Int>) {
    Lock("Lock Screen", listOf(58, 74)),
    Center("Notification Center", listOf(12, 29, 46, 63)),
    Banner("Banners", listOf(8)),
}

private val PreviewOptions = listOf("Always", "When Unlocked", "Never").map { PickerItemData(it, it) }

private val GroupingOptions = listOf("Automatic", "By App", "Off").map { PickerItemData(it, it) }

private fun bannerFootnote(allow: Boolean, banner: Boolean, style: String): String = when {
    !allow -> "Notifications are off"
    !banner -> "No banners"
    style == "persistent" -> "Banner stays until dismissed"
    else -> "Banner shows briefly"
}

@Composable
fun SettingsNotifications(modifier: Modifier = Modifier) {
    val colors = EsuissTheme.colors
    var allow by rememberSaveable { mutableStateOf(true) }
    val enabled = remember { mutableStateMapOf(AlertKind.Lock to true, AlertKind.Center to true, AlertKind.Banner to true) }
    var bannerStyle by rememberSaveable { mutableStateOf("temporary") }
    var sounds by rememberSaveable { mutableStateOf(true) }
    var badges by rememberSaveable { mutableStateOf(true) }
    var previews by rememberSaveable { mutableStateOf("Always") }
    var grouping by rememberSaveable { mutableStateOf("Automatic") }
    var bannerKey by remember { mutableIntStateOf(0) }
    var bannerVisible by remember { mutableStateOf(true) }

    LaunchedEffect(bannerStyle, bannerVisible, bannerKey) {
        if (bannerStyle != "temporary" || !bannerVisible) return@LaunchedEffect
        delay(2600)
        bannerVisible = false
    }

    fun replay() {
        bannerKey += 1
        bannerVisible = true
    }

    val body = if (previews == "Never") "Notification" else "Is the weekend trip to the coast still on?"
    val footnote = bannerFootnote(allow, enabled.getValue(AlertKind.Banner), bannerStyle)
    val dim by animateFloatAsState(if (allow) 1f else 0.35f, tween(300), label = "dim")

    Screen(modifier) {
        Column(
            Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 20.dp, vertical = 24.dp),
            verticalArrangement = Arrangement.spacedBy(20.dp),
        ) {
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically) {
                Box(
                    Modifier
                        .size(40.dp)
                        .background(Palette.green500, RoundedCornerShape(10.dp)),
                    contentAlignment = Alignment.Center,
                ) {
                    Icon(PhosphorIcons.Fill.ChatCircle, contentDescription = null, size = 24.dp, tint = colors.primaryForeground)
                }
                Column {
                    BasicText(
                        "Messages",
                        modifier = Modifier.semantics { heading() },
                        style = Typography.xl2.copy(color = colors.foreground, fontWeight = FontWeight.Bold),
                    )
                    BasicText("Notifications", style = Typography.sm.copy(color = colors.mutedForeground))
                }
            }
            ItemGroup(variant = ItemGroupVariant.Inset) {
                SettingRow("Allow Notifications") {
                    Switch(
                        checked = allow,
                        onCheckedChange = {
                            allow = it
                            replay()
                        },
                    )
                }
            }
            Column(
                modifier = Modifier
                    .graphicsLayer { alpha = dim }
                    .then(if (allow) Modifier else Modifier.clearAndSetSemantics { disabled() }),
                verticalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                SectionTitle("Alerts")
                ItemGroup(variant = ItemGroupVariant.Inset) {
                    Row(Modifier.padding(horizontal = 8.dp)) {
                        AlertKind.entries.forEach { kind ->
                            AlertTile(
                                kind = kind,
                                selected = enabled.getValue(kind),
                                enabled = allow,
                                modifier = Modifier.weight(1f),
                            ) {
                                enabled[kind] = it
                                replay()
                            }
                        }
                    }
                    if (enabled.getValue(AlertKind.Banner)) {
                        ItemSeparator()
                        SettingRow("Banner Style") {
                            ToggleGroup(
                                value = bannerStyle,
                                onValueChange = { value ->
                                    if (value != null) {
                                        bannerStyle = value
                                        replay()
                                    }
                                },
                                size = ToggleSize.Sm,
                                spacing = 0,
                                enabled = allow,
                            ) {
                                ToggleGroupItem("Temporary", "temporary")
                                ToggleGroupItem("Persistent", "persistent")
                            }
                        }
                    }
                    ItemSeparator()
                    SettingRow("Sounds") { Switch(checked = sounds, onCheckedChange = { sounds = it }, enabled = allow) }
                    ItemSeparator()
                    SettingRow("Badges") { Switch(checked = badges, onCheckedChange = { badges = it }, enabled = allow) }
                }
                SectionTitle("Appearance", Modifier.padding(top = 12.dp))
                ItemGroup(variant = ItemGroupVariant.Inset) {
                    SettingRow("Show Previews") {
                        Picker(
                            value = previews,
                            onValueChange = {
                                previews = it
                                replay()
                            },
                            items = PreviewOptions,
                            size = SelectSize.Sm,
                            enabled = allow,
                        )
                    }
                    ItemSeparator()
                    SettingRow("Notification Grouping") {
                        Picker(
                            value = grouping,
                            onValueChange = { grouping = it },
                            items = GroupingOptions,
                            size = SelectSize.Sm,
                            enabled = allow,
                        )
                    }
                }
            }
            LockScreenPreview(
                showBanner = allow && enabled.getValue(AlertKind.Banner) && bannerVisible,
                showLock = allow && enabled.getValue(AlertKind.Lock),
                stacked = grouping != "Off",
                bannerKey = bannerKey,
                body = body,
                footnote = footnote,
                modifier = Modifier
                    .align(Alignment.CenterHorizontally)
                    .padding(top = 8.dp),
            )
        }
    }
}

@Composable
private fun SectionTitle(text: String, modifier: Modifier = Modifier) {
    BasicText(
        text,
        modifier = modifier
            .padding(horizontal = 4.dp)
            .semantics { heading() },
        style = Typography.sm.copy(color = EsuissTheme.colors.foreground, fontWeight = FontWeight.SemiBold),
    )
}

@Composable
private fun SettingRow(title: String, action: @Composable () -> Unit) {
    Item(size = ItemSize.Sm) {
        ItemContent {
            ItemTitle {
                BasicText(
                    title,
                    style = Typography.base.copy(color = EsuissTheme.colors.foreground),
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                )
            }
        }
        ItemActions { action() }
    }
}

@Composable
private fun AlertTile(
    kind: AlertKind,
    selected: Boolean,
    enabled: Boolean,
    modifier: Modifier = Modifier,
    onSelectedChange: (Boolean) -> Unit,
) {
    val colors = EsuissTheme.colors
    val fill by animateColorAsState(if (selected) colors.primary else Color.Transparent, tween(250), label = "fill")
    val edge by animateColorAsState(if (selected) Color.Transparent else colors.input, tween(250), label = "edge")
    val check by animateFloatAsState(if (selected) 1f else 0f, tween(250, easing = PopEasing), label = "check")
    Column(
        modifier = modifier
            .clip(RoundedCornerShape(12.dp))
            .toggleable(
                value = selected,
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
                enabled = enabled,
                role = Role.Checkbox,
                onValueChange = onSelectedChange,
            )
            .padding(top = 14.dp, bottom = 12.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        MiniScreen(kind)
        BasicText(
            kind.label,
            modifier = Modifier.padding(horizontal = 2.dp),
            style = Typography.xs.copy(color = colors.foreground, textAlign = TextAlign.Center),
            minLines = 2,
            maxLines = 2,
            overflow = TextOverflow.Ellipsis,
        )
        Box(
            Modifier
                .size(22.dp)
                .background(fill, CircleShape)
                .border(1.5.dp, edge, CircleShape),
            contentAlignment = Alignment.Center,
        ) {
            Icon(
                PhosphorIcons.Bold.Check,
                contentDescription = null,
                modifier = Modifier.graphicsLayer {
                    scaleX = check
                    scaleY = check
                },
                size = 12.dp,
                tint = colors.primaryForeground,
            )
        }
    }
}

@Composable
private fun MiniScreen(kind: AlertKind) {
    val colors = EsuissTheme.colors
    val shape = RoundedCornerShape(12.dp)
    Box(
        Modifier
            .size(width = 64.dp, height = 92.dp)
            .clip(shape)
            .background(Palette.indigo500, shape)
            .border(2.dp, colors.foreground, shape)
            .clearAndSetSemantics {},
    ) {
        if (kind == AlertKind.Lock) {
            BasicText(
                "9:41",
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 14.dp),
                style = Typography.sm.copy(color = Palette.white, fontWeight = FontWeight.SemiBold, textAlign = TextAlign.Center),
            )
        }
        kind.bars.forEachIndexed { index, top ->
            Box(
                Modifier
                    .offset(y = top.dp)
                    .padding(horizontal = 8.dp)
                    .fillMaxWidth()
                    .height(13.dp)
                    .graphicsLayer { alpha = 1f - index * 0.15f }
                    .background(Palette.white, RoundedCornerShape(4.dp)),
            )
        }
    }
}

@Composable
private fun LockScreenPreview(
    showBanner: Boolean,
    showLock: Boolean,
    stacked: Boolean,
    bannerKey: Int,
    body: String,
    footnote: String,
    modifier: Modifier = Modifier,
) {
    val colors = EsuissTheme.colors
    val outer = RoundedCornerShape(42.dp)
    val inner = RoundedCornerShape(34.dp)
    Box(
        modifier = modifier
            .size(width = 230.dp, height = 470.dp)
            .shadow(Shadow(0.dp, 20.dp, 50.dp, Palette.black.copy(alpha = 0.4f)), outer)
            .background(Palette.black, outer)
            .border(1.5.dp, colors.mutedForeground, outer)
            .padding(8.dp)
            .clip(inner)
            .background(Palette.indigo500)
            .semantics { contentDescription = "Lock screen preview. $footnote." },
    ) {
        Box(
            Modifier
                .align(Alignment.TopCenter)
                .padding(top = 8.dp)
                .size(width = 74.dp, height = 22.dp)
                .background(Palette.black, CircleShape),
        )
        Column(
            Modifier
                .fillMaxWidth()
                .padding(top = 50.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            BasicText(
                "Tuesday, October 6",
                style = Typography.xs.copy(color = Palette.white.copy(alpha = 0.9f), fontWeight = FontWeight.SemiBold),
            )
            BasicText(
                "9:41",
                style = Typography.xl3.copy(
                    color = Palette.white,
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 60.sp,
                    lineHeight = 60.sp,
                    letterSpacing = (-0.05).sp,
                ),
            )
        }
        key(bannerKey) {
            AnimatedVisibility(
                visible = showBanner,
                modifier = Modifier
                    .padding(top = 38.dp, start = 8.dp, end = 8.dp)
                    .fillMaxWidth(),
                enter = fadeIn(tween(800)) + slideInVertically(tween(800, easing = RevealEasing)) { -it },
                exit = fadeOut(tween(300)),
            ) {
                Notification(body, stacked = false)
            }
        }
        if (showLock) {
            Box(
                Modifier
                    .padding(top = 300.dp, start = 8.dp, end = 8.dp)
                    .fillMaxWidth(),
            ) {
                Notification(body, stacked = stacked)
            }
        }
        BasicText(
            footnote,
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(bottom = 14.dp),
            style = Typography.xs3.copy(color = Palette.white.copy(alpha = 0.85f), textAlign = TextAlign.Center),
        )
    }
}

@Composable
private fun Notification(body: String, stacked: Boolean) {
    val colors = EsuissTheme.colors
    val ink = Palette.black
    val shape = RoundedCornerShape(18.dp)
    Box {
        if (stacked) {
            Box(
                Modifier
                    .matchParentSize()
                    .padding(horizontal = 10.dp)
                    .offset(y = 6.dp)
                    .background(Palette.white.copy(alpha = 0.55f), RoundedCornerShape(16.dp)),
            )
        }
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Palette.white, shape)
                .padding(horizontal = 12.dp, vertical = 10.dp),
            horizontalArrangement = Arrangement.spacedBy(10.dp),
        ) {
            Box(
                Modifier
                    .size(30.dp)
                    .background(Palette.green500, RoundedCornerShape(7.dp)),
                contentAlignment = Alignment.Center,
            ) {
                Icon(PhosphorIcons.Fill.ChatCircle, contentDescription = null, size = 18.dp, tint = Palette.white)
            }
            Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(1.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    BasicText(
                        "Riley Morgan",
                        modifier = Modifier.weight(1f),
                        style = Typography.xs.copy(color = ink.copy(alpha = 0.88f), fontWeight = FontWeight.SemiBold),
                    )
                    BasicText("now", style = Typography.xs2.copy(color = ink.copy(alpha = 0.55f)))
                }
                BasicText(body, style = Typography.xs.copy(color = ink.copy(alpha = 0.88f)))
            }
        }
    }
}
