package com.esuiss.catalog.stories.interactions

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.TransformOrigin
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.ArrowCounterClockwise
import com.adamglin.phosphoricons.regular.Heart
import com.adamglin.phosphoricons.regular.X
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Card
import com.esuiss.ui.components.CardContent
import com.esuiss.ui.components.CardHeader
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.Text
import com.esuiss.ui.interactions.CardStack
import com.esuiss.ui.interactions.CardStackDirection
import com.esuiss.ui.interactions.CardStackState
import com.esuiss.ui.interactions.rememberCardStackState
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography

val cardStackStories = StoryGroup(
    section = Section.Interactions,
    title = "Card Stack",
    stories = listOf(
        Story("Default") { CardStackDemo(enabled = true) },
        Story("MidSwipe") { CardStackMidSwipe() },
        Story("Empty") { CardStackEmptyDemo() },
        Story("Disabled") { CardStackDemo(enabled = false) },
    ),
)

private class CardStackPlace(val id: String, val name: String, val city: String, val detail: String)

private val cardStackPlaces = listOf(
    CardStackPlace("harbor", "Harbor Café", "Lisbon", "Slow mornings, strong coffee and a view of the river."),
    CardStackPlace("garden", "Garden Library", "Kyoto", "Quiet reading rooms around a moss garden."),
    CardStackPlace("market", "Night Market", "Taipei", "Street food stalls open until two in the morning."),
)

private val cardStackDeckHeight = 384.dp

@Composable
private fun CardStackPlaceCard(place: CardStackPlace, modifier: Modifier = Modifier) {
    val colors = EsuissTheme.colors
    Card(modifier.fillMaxWidth().height(cardStackDeckHeight)) {
        CardHeader(place.name, description = place.city)
        CardContent(Modifier.weight(1f)) {
            Box(
                Modifier
                    .fillMaxSize()
                    .background(colors.surfaceSecondary, RoundedCornerShape(Radius.xl)),
            )
        }
        CardContent {
            Text(place.detail, style = Typography.sm.copy(color = colors.labelSecondary))
        }
    }
}

@Composable
private fun CardStackEmptyBox() {
    val colors = EsuissTheme.colors
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(cardStackDeckHeight)
            .drawBehind {
                val stroke = 1.dp.toPx()
                val radius = Radius.xl2.toPx()
                drawRoundRect(
                    color = colors.separator,
                    topLeft = Offset(stroke / 2, stroke / 2),
                    size = Size(size.width - stroke, size.height - stroke),
                    cornerRadius = CornerRadius(radius, radius),
                    style = Stroke(width = stroke, pathEffect = PathEffect.dashPathEffect(floatArrayOf(3.dp.toPx(), 3.dp.toPx()))),
                )
            }
            .padding(24.dp),
        contentAlignment = Alignment.Center,
    ) {
        Text(
            "You have seen every place.",
            style = Typography.sm.copy(color = colors.labelSecondary),
            textAlign = TextAlign.Center,
        )
    }
}

@Composable
private fun CardStackActions(state: CardStackState, enabled: Boolean) {
    val colors = EsuissTheme.colors
    val canSwipe = enabled && !state.isEmpty
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(16.dp, Alignment.CenterHorizontally),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Button(
            onClick = { state.swipe(CardStackDirection.Left) },
            modifier = Modifier.size(56.dp),
            variant = ButtonVariant.Outline,
            size = ButtonSize.IconLg,
            enabled = canSwipe,
        ) {
            Icon(PhosphorIcons.Regular.X, contentDescription = "Swipe left", size = 24.dp, tint = colors.danger)
        }
        Button(
            onClick = { state.undo() },
            variant = ButtonVariant.Ghost,
            size = ButtonSize.IconLg,
            enabled = state.canUndo,
        ) {
            Icon(PhosphorIcons.Regular.ArrowCounterClockwise, contentDescription = "Undo")
        }
        Button(
            onClick = { state.swipe(CardStackDirection.Right) },
            modifier = Modifier.size(56.dp),
            variant = ButtonVariant.Outline,
            size = ButtonSize.IconLg,
            enabled = canSwipe,
        ) {
            Icon(PhosphorIcons.Regular.Heart, contentDescription = "Swipe right", size = 24.dp, tint = colors.accent)
        }
    }
}

@Composable
private fun CardStackDemo(enabled: Boolean) {
    var log by rememberSaveable { mutableStateOf("") }
    val state = rememberCardStackState()
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Column(verticalArrangement = Arrangement.spacedBy(24.dp)) {
            CardStack(
                items = cardStackPlaces,
                onSwipe = { direction, place ->
                    log = "${if (direction == CardStackDirection.Left) "Skipped" else "Liked"} ${place.name}"
                },
                state = state,
                key = { it.id },
                enabled = enabled,
                onUndo = { _, place -> log = "Restored ${place.name}" },
                empty = { CardStackEmptyBox() },
            ) { place ->
                CardStackPlaceCard(place, Modifier.semantics(mergeDescendants = true) { contentDescription = "${place.name}, ${place.city}" })
            }
            CardStackActions(state, enabled)
        }
        Text(
            log,
            modifier = Modifier.fillMaxWidth().semantics { liveRegion = LiveRegionMode.Polite },
            style = Typography.sm.copy(color = EsuissTheme.colors.labelSecondary),
            textAlign = TextAlign.Center,
        )
    }
}

@Composable
private fun CardStackEmptyDemo() {
    val state = rememberCardStackState()
    Column(verticalArrangement = Arrangement.spacedBy(24.dp)) {
        CardStack(
            items = emptyList<CardStackPlace>(),
            onSwipe = { _, _ -> },
            state = state,
            empty = { CardStackEmptyBox() },
        ) { }
        CardStackActions(state, enabled = true)
    }
}

@Composable
private fun CardStackMidSwipe() {
    Box(Modifier.fillMaxWidth().height(cardStackDeckHeight)) {
        CardStackPlaceCard(
            cardStackPlaces[2],
            Modifier.graphicsLayer {
                translationY = 14.4.dp.toPx()
                scaleX = 0.94f
                scaleY = 0.94f
            },
        )
        CardStackPlaceCard(
            cardStackPlaces[1],
            Modifier.graphicsLayer {
                translationY = 2.4.dp.toPx()
                scaleX = 0.99f
                scaleY = 0.99f
            },
        )
        CardStackPlaceCard(
            cardStackPlaces[0],
            Modifier.graphicsLayer {
                translationX = 96.dp.toPx()
                translationY = 12.dp.toPx()
                rotationZ = 3f
                transformOrigin = TransformOrigin.Center
            },
        )
    }
}
