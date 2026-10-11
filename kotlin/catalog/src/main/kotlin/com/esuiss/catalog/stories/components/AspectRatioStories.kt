package com.esuiss.catalog.stories.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.painter.BrushPainter
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.Image
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.AspectRatio
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.Text
import com.esuiss.ui.components.TextVariant
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius

val aspectRatioStories = StoryGroup(
    section = Section.Components,
    title = "Aspect Ratio",
    stories = listOf(
        Story("Default") { AspectRatioPhoto(null, 16f / 9f) },
        Story("Square") { AspectRatioPhoto(192.dp, 1f) },
        Story("Portrait") { AspectRatioPhoto(160.dp, 9f / 16f) },
        Story("Placeholder") { AspectRatioPlaceholder() },
    ),
)

@Composable
private fun AspectRatioPhoto(width: Dp?, ratio: Float) {
    val colors = EsuissTheme.colors
    val photo = remember(colors) { BrushPainter(Brush.linearGradient(listOf(colors.teal, colors.blue, colors.indigo))) }
    Box(
        (if (width != null) Modifier.width(width) else Modifier.fillMaxWidth())
            .clip(RoundedCornerShape(Radius.lg)),
    ) {
        AspectRatio(ratio) {
            Image(photo, contentDescription = null, modifier = Modifier.fillMaxSize(), contentScale = ContentScale.Crop)
        }
    }
}

@Composable
private fun AspectRatioPlaceholder() {
    val colors = EsuissTheme.colors
    AspectRatio(16f / 9f) {
        Column(
            Modifier.fillMaxSize().background(colors.surfaceSecondary, RoundedCornerShape(Radius.lg)),
            verticalArrangement = Arrangement.spacedBy(8.dp, Alignment.CenterVertically),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Icon(PhosphorIcons.Regular.Image, contentDescription = null, size = 32.dp, tint = colors.labelSecondary)
            Text("16 / 9", variant = TextVariant.Muted)
        }
    }
}
