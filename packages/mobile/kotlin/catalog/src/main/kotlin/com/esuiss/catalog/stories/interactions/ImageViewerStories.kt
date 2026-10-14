package com.esuiss.catalog.stories.interactions

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.painter.Painter
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Text
import com.esuiss.ui.components.TextVariant
import com.esuiss.ui.interactions.ImageViewer
import com.esuiss.ui.interactions.ImageViewerImage
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius

val imageViewerStories = StoryGroup(
    section = Section.Interactions,
    title = "Image Viewer",
    stories = listOf(
        Story("Default") { ImageViewerGallery(defaultOpen = false, defaultIndex = 0) },
        Story("OpenByDefault") { ImageViewerGallery(defaultOpen = true, defaultIndex = 1) },
    ),
)

private class ImageViewerGradient(private val from: Color, private val to: Color, private val size: Size) : Painter() {
    override val intrinsicSize: Size
        get() = size

    override fun DrawScope.onDraw() {
        drawRect(Brush.linearGradient(listOf(from, to), start = Offset.Zero, end = Offset(this.size.width, this.size.height)))
    }
}

private val imageViewerLabels = listOf(
    "Mountain lake at sunrise",
    "Valley with a river",
    "Lake between mountains",
    "Foggy hills",
    "Forest path",
)

@Composable
private fun ImageViewerGallery(defaultOpen: Boolean, defaultIndex: Int) {
    val colors = EsuissTheme.colors
    var open by rememberSaveable { mutableStateOf(defaultOpen) }
    var index by rememberSaveable { mutableIntStateOf(defaultIndex) }
    val tones = listOf(
        colors.orange to colors.pink,
        colors.teal to colors.blue,
        colors.indigo to colors.cyan,
        colors.gray to colors.mint,
        colors.green to colors.brown,
    )
    val images = remember(tones) {
        imageViewerLabels.mapIndexed { position, label ->
            val (from, to) = tones[position]
            ImageViewerImage(ImageViewerGradient(from, to, Size(1200f, 800f)), contentDescription = label)
        }
    }
    val shape = RoundedCornerShape(Radius.xl)
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        FlowRow(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            images.forEachIndexed { position, image ->
                Image(
                    painter = image.painter,
                    contentDescription = null,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier
                        .fillMaxWidth(0.31f)
                        .aspectRatio(1f)
                        .clip(shape)
                        .background(colors.surfaceSecondary, shape)
                        .semantics { contentDescription = imageViewerLabels[position] }
                        .clickable(role = Role.Button) {
                            index = position
                            open = true
                        },
                )
            }
        }
        Text("Tap a photo. Pinch or double-tap to zoom, swipe down to close.", variant = TextVariant.Muted)
    }
    ImageViewer(
        open = open,
        onOpenChange = { open = it },
        images = images,
        index = index,
        onIndexChange = { index = it },
    )
}
