package com.esuiss.catalog.stories.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Card
import com.esuiss.ui.components.CardContent
import com.esuiss.ui.components.CardSize
import com.esuiss.ui.components.Carousel
import com.esuiss.ui.components.CarouselContent
import com.esuiss.ui.components.CarouselControls
import com.esuiss.ui.components.CarouselDots
import com.esuiss.ui.components.CarouselDotsVariant
import com.esuiss.ui.components.CarouselItem
import com.esuiss.ui.components.CarouselNext
import com.esuiss.ui.components.CarouselOrientation
import com.esuiss.ui.components.CarouselPlayButton
import com.esuiss.ui.components.CarouselPrevious
import com.esuiss.ui.components.PageIndicator
import com.esuiss.ui.components.Text
import com.esuiss.ui.components.rememberCarouselState
import com.esuiss.ui.theme.Colors
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Palette
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography

val carouselStories = StoryGroup(
    section = Section.Components,
    title = "Carousel",
    stories = listOf(
        Story("Default") { CarouselNumbers(basis = null, loop = false) },
        Story("MultipleItems") { CarouselNumbers(basis = 0.5f, loop = false) },
        Story("Loop") { CarouselNumbers(basis = null, loop = true) },
        Story("Vertical") { CarouselVertical() },
        Story("WithPageIndicator") { CarouselWithPageIndicator() },
        Story("Featured") { CarouselFeatured() },
        Story("Spotlight") { CarouselSpotlight() },
        Story("Autoplay") { CarouselAutoplay() },
        Story("Shelf") { CarouselShelf() },
    ),
)

private val carouselSlides = listOf(1, 2, 3, 4, 5)

private class CarouselPick(val eyebrow: String, val title: String, val tint: (Colors) -> Color)

private val carouselPicks = listOf(
    CarouselPick("Today's pick", "Weekend breakfast") { Palette.orange500 },
    CarouselPick("New", "Grilled meatballs") { Palette.red500 },
    CarouselPick("Chef's special", "Lentil soup") { Palette.teal500 },
    CarouselPick("Dessert", "Künefe") { Palette.purple500 },
)

private val carouselFeatures = listOf(
    "Take orders at the table.",
    "Every ticket, right on time.",
    "A full room, every night.",
)

private val carouselSpacing = 16.dp

private fun carouselPeek(width: Dp, basis: Float?, spacing: Dp = carouselSpacing): PaddingValues {
    if (basis == null) return PaddingValues(0.dp)
    val page = (width + spacing) * basis - spacing
    return PaddingValues(end = width - page)
}

@Composable
private fun CarouselNumbers(basis: Float?, loop: Boolean) {
    val state = rememberCarouselState(pageCount = carouselSlides.size, loop = loop)
    BoxWithConstraints(Modifier.fillMaxWidth()) {
        val width = maxWidth
        Carousel(state = state, modifier = Modifier.fillMaxWidth()) {
            CarouselContent(contentPadding = carouselPeek(width, basis)) { page ->
                CarouselItem {
                    Card(size = if (basis != null) CardSize.Sm else CardSize.Default) {
                        CardContent {
                            Box(Modifier.fillMaxWidth().aspectRatio(1f), contentAlignment = Alignment.Center) {
                                Text(
                                    carouselSlides[page].toString(),
                                    style = Typography.xl3.copy(fontWeight = FontWeight.SemiBold),
                                )
                            }
                        }
                    }
                }
            }
            Row(
                Modifier.fillMaxWidth().padding(top = 12.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                CarouselPrevious()
                CarouselNext()
            }
        }
    }
}

@Composable
private fun CarouselVertical() {
    val state = rememberCarouselState(pageCount = carouselSlides.size)
    val height = 256.dp
    val spacing = carouselSpacing
    Carousel(state = state, modifier = Modifier.fillMaxWidth(), orientation = CarouselOrientation.Vertical) {
        CarouselContent(
            modifier = Modifier.fillMaxWidth().height(height),
            contentPadding = PaddingValues(bottom = height - ((height + spacing) * 0.5f - spacing)),
        ) { page ->
            CarouselItem(Modifier.fillMaxWidth().fillMaxHeight()) {
                Card(modifier = Modifier.fillMaxHeight(), size = CardSize.Sm) {
                    Box(Modifier.fillMaxWidth().weight(1f), contentAlignment = Alignment.Center) {
                        Text(
                            carouselSlides[page].toString(),
                            style = Typography.xl3.copy(fontWeight = FontWeight.SemiBold),
                        )
                    }
                }
            }
        }
        Row(
            Modifier.fillMaxWidth().padding(top = 12.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            CarouselPrevious()
            CarouselNext()
        }
    }
}

@Composable
private fun CarouselPickCard(pick: CarouselPick) {
    val colors = EsuissTheme.colors
    Column(
        Modifier
            .fillMaxWidth()
            .aspectRatio(4f / 5f)
            .clip(RoundedCornerShape(Radius.xl3))
            .background(pick.tint(colors))
            .padding(20.dp),
        verticalArrangement = Arrangement.spacedBy(4.dp, Alignment.Bottom),
    ) {
        Text(
            pick.eyebrow.uppercase(),
            style = Typography.xs.copy(color = colors.primaryForeground, fontWeight = FontWeight.SemiBold),
        )
        Text(
            pick.title,
            style = Typography.xl2.copy(color = colors.primaryForeground, fontWeight = FontWeight.Bold),
        )
    }
}

@Composable
private fun CarouselWithPageIndicator() {
    val state = rememberCarouselState(pageCount = carouselPicks.size)
    Carousel(state = state, modifier = Modifier.fillMaxWidth()) {
        CarouselContent { page ->
            CarouselItem { CarouselPickCard(carouselPicks[page]) }
        }
        PageIndicator(
            count = state.pageCount,
            index = state.selectedIndex,
            modifier = Modifier.padding(top = 16.dp).align(Alignment.CenterHorizontally),
            onIndexChange = { state.scrollTo(it) },
        )
    }
}

@Composable
private fun CarouselFeatured() {
    val state = rememberCarouselState(pageCount = carouselPicks.size)
    BoxWithConstraints(Modifier.fillMaxWidth()) {
        val width = maxWidth
        Carousel(state = state, modifier = Modifier.fillMaxWidth()) {
            CarouselContent(contentPadding = carouselPeek(width, 0.88f)) { page ->
                CarouselItem { CarouselPickCard(carouselPicks[page]) }
            }
            CarouselControls(Modifier.align(Alignment.CenterHorizontally)) {
                CarouselDots(variant = CarouselDotsVariant.Plain)
                CarouselPlayButton(variant = ButtonVariant.Ghost)
            }
        }
    }
}

@Composable
private fun CarouselFeatureCard(title: String) {
    val colors = EsuissTheme.colors
    Column(
        Modifier
            .fillMaxWidth()
            .aspectRatio(10f / 7f)
            .clip(RoundedCornerShape(Radius.xl3))
            .background(colors.muted)
            .padding(32.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp, Alignment.CenterVertically),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Text("Hestia POS", style = Typography.xl3.copy(fontWeight = FontWeight.Bold))
        Text(title, style = Typography.base.copy(color = colors.mutedForeground), textAlign = TextAlign.Center)
    }
}

@Composable
private fun CarouselSpotlight() {
    val state = rememberCarouselState(pageCount = carouselFeatures.size, loop = true)
    Carousel(state = state, modifier = Modifier.fillMaxWidth()) {
        CarouselContent { page ->
            CarouselItem { CarouselFeatureCard(carouselFeatures[page]) }
        }
        CarouselControls(Modifier.align(Alignment.CenterHorizontally)) {
            CarouselDots()
            CarouselNext(size = ButtonSize.IconSm)
        }
    }
}

@Composable
private fun CarouselAutoplay() {
    val state = rememberCarouselState(pageCount = carouselFeatures.size, loop = true)
    Carousel(state = state, modifier = Modifier.fillMaxWidth(), autoplay = true, autoplayDelayMillis = 4000L) {
        CarouselContent { page ->
            CarouselItem { CarouselFeatureCard(carouselFeatures[page]) }
        }
        CarouselControls(Modifier.align(Alignment.CenterHorizontally)) {
            CarouselDots()
            CarouselPlayButton()
        }
    }
}

@Composable
private fun CarouselShelf() {
    val state = rememberCarouselState(pageCount = carouselPicks.size)
    val colors = EsuissTheme.colors
    val spacing = 12.dp
    BoxWithConstraints(Modifier.fillMaxWidth()) {
        val width = maxWidth
        Carousel(state = state, modifier = Modifier.fillMaxWidth()) {
            Text(
                "Popular",
                modifier = Modifier.padding(bottom = 12.dp),
                style = Typography.xl.copy(fontWeight = FontWeight.Bold),
            )
            CarouselContent(contentPadding = carouselPeek(width, 0.4f, spacing), pageSpacing = spacing) { page ->
                val pick = carouselPicks[page]
                CarouselItem {
                    Column(Modifier.fillMaxWidth()) {
                        Box(
                            Modifier
                                .fillMaxWidth()
                                .aspectRatio(1f)
                                .clip(RoundedCornerShape(Radius.xl2))
                                .background(pick.tint(colors)),
                        )
                        Text(
                            pick.title,
                            modifier = Modifier.padding(top = 8.dp),
                            style = Typography.sm.copy(fontWeight = FontWeight.SemiBold),
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis,
                        )
                    }
                }
            }
        }
    }
}
