package com.esuiss.ui.blocks

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
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
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Light
import com.adamglin.phosphoricons.light.WifiSlash
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Empty
import com.esuiss.ui.components.EmptyContent
import com.esuiss.ui.components.EmptyHeader
import com.esuiss.ui.components.EmptyMedia
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.LocalContentStyle
import com.esuiss.ui.components.Screen
import com.esuiss.ui.components.Spinner
import com.esuiss.ui.theme.Colors
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Palette
import com.esuiss.ui.theme.Typography
import kotlinx.coroutines.delay

private val RevealEasing = CubicBezierEasing(0.32f, 0.72f, 0f, 1f)

private enum class Connection { Offline, Loading, Online }

private class Album(val title: String, val color: (Colors) -> Color)

private val Albums = listOf(
    Album("Orange Hour") { Palette.orange500 },
    Album("Soft Shapes") { Palette.teal400 },
    Album("Low Light") { Palette.indigo500 },
    Album("Waves") { Palette.cyan500 },
)

@Composable
fun EmptyOffline(
    modifier: Modifier = Modifier,
) {
    val colors = EsuissTheme.colors
    var state by rememberSaveable { mutableStateOf(Connection.Offline) }

    LaunchedEffect(state) {
        if (state != Connection.Loading) return@LaunchedEffect
        delay(1400)
        state = Connection.Online
    }

    Screen(modifier) {
        if (state == Connection.Online) {
            Library { state = Connection.Offline }
            return@Screen
        }
        Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Empty {
                EmptyHeader {
                    EmptyMedia {
                        Icon(PhosphorIcons.Light.WifiSlash, contentDescription = null, size = 52.dp, tint = colors.mutedForeground)
                    }
                    BasicText(
                        "You're not connected to the internet.",
                        modifier = Modifier.semantics { heading() },
                        style = Typography.xl3.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold, textAlign = TextAlign.Center),
                    )
                    BasicText(
                        "Turn on Wi-Fi or cellular data. Songs you downloaded still play offline.",
                        modifier = Modifier.padding(top = 6.dp),
                        style = Typography.lg.copy(color = colors.mutedForeground, textAlign = TextAlign.Center),
                    )
                }
                EmptyContent {
                    FlowRow(
                        horizontalArrangement = Arrangement.spacedBy(14.dp, Alignment.CenterHorizontally),
                        verticalArrangement = Arrangement.spacedBy(14.dp),
                    ) {
                        val loading = state == Connection.Loading
                        Button(
                            onClick = {
                                state = Connection.Loading
                            },
                            modifier = Modifier.semantics { liveRegion = LiveRegionMode.Polite },
                            size = ButtonSize.Lg,
                            enabled = !loading,
                        ) {
                            if (loading) Spinner(color = colors.primaryForeground)
                            BasicText(if (loading) "Connecting" else "Try Again", style = LocalContentStyle.current)
                        }
                        Button("Downloads", {}, variant = ButtonVariant.Outline, size = ButtonSize.Lg)
                    }
                }
            }
        }
    }
}

@Composable
private fun Library(onDisconnect: () -> Unit) {
    val colors = EsuissTheme.colors
    val appear = remember { Animatable(0f) }
    LaunchedEffect(Unit) { appear.animateTo(1f, tween(800, easing = RevealEasing)) }
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    Column(
        Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 20.dp, vertical = 30.dp)
            .graphicsLayer {
                alpha = appear.value
                translationY = (1f - appear.value) * 8.dp.toPx()
            },
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            BasicText(
                "suiss Music",
                modifier = Modifier
                    .weight(1f)
                    .semantics { heading() },
                style = Typography.xl3.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold),
            )
            BasicText(
                "Disconnect ›",
                modifier = Modifier
                    .graphicsLayer { alpha = if (pressed) 0.8f else 1f }
                    .clickable(interactionSource = interaction, indication = null, role = Role.Button, onClick = onDisconnect)
                    .padding(vertical = 8.dp),
                style = Typography.sm.copy(color = colors.primary),
            )
        }
        Albums.chunked(2).forEach { row ->
            Row(horizontalArrangement = Arrangement.spacedBy(14.dp)) {
                row.forEach { album ->
                    Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        Box(
                            Modifier
                                .fillMaxWidth()
                                .aspectRatio(1f)
                                .background(album.color(colors), RoundedCornerShape(12.dp))
                                .clearAndSetSemantics {},
                        )
                        BasicText(album.title, style = Typography.sm.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold))
                    }
                }
            }
        }
    }
}
