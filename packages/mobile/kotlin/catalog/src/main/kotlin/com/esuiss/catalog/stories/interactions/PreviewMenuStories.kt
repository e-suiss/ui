package com.esuiss.catalog.stories.interactions

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
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
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.Copy
import com.adamglin.phosphoricons.regular.Heart
import com.adamglin.phosphoricons.regular.ShareNetwork
import com.adamglin.phosphoricons.regular.Trash
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.MenuItemVariant
import com.esuiss.ui.components.Text
import com.esuiss.ui.components.TextVariant
import com.esuiss.ui.interactions.PreviewMenu
import com.esuiss.ui.interactions.PreviewMenuItem
import com.esuiss.ui.interactions.PreviewMenuSeparator
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Palette
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography

val previewMenuStories = StoryGroup(
    section = Section.Interactions,
    title = "Preview Menu",
    stories = listOf(
        Story("Default") { PreviewMenuPhotoGrid() },
        Story("OpenByDefault") { PreviewMenuPhotoGrid(openIndex = 1) },
        Story("DisabledItem") { PreviewMenuPhotoGrid(withDisabled = true, openIndex = 0) },
        Story("CustomPreview") { PreviewMenuAlbum(defaultOpen = false) },
        Story("CustomPreviewOpen") { PreviewMenuAlbum(defaultOpen = true) },
    ),
)

@Composable
private fun previewMenuTones(): List<Color> {
    val colors = EsuissTheme.colors
    return listOf(
        Palette.blue500,
        Palette.orange500,
        Palette.green500,
        Palette.indigo500,
        Palette.yellow500,
        Palette.pink500,
        Palette.teal500,
        Palette.purple500,
        Palette.teal400,
    )
}

@Composable
private fun PreviewMenuPhotoGrid(withDisabled: Boolean = false, openIndex: Int? = null) {
    var log by rememberSaveable { mutableStateOf("Touch and hold a photo.") }
    val shape = RoundedCornerShape(Radius.xl2)
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        FlowRow(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            previewMenuTones().forEachIndexed { index, tone ->
                val label = "Photo ${index + 1}"
                var open by rememberSaveable(index) { mutableStateOf(index == openIndex) }
                PreviewMenu(
                    open = open,
                    onOpenChange = { open = it },
                    trigger = {
                        Box(
                            Modifier
                                .fillMaxSize()
                                .clip(shape)
                                .background(tone, shape)
                                .semantics { contentDescription = label },
                        )
                    },
                    modifier = Modifier.fillMaxWidth(0.31f).aspectRatio(1f),
                ) {
                    PreviewMenuItem("Copy", onClick = { log = "Copied $label" }, icon = PhosphorIcons.Regular.Copy)
                    PreviewMenuItem("Share", onClick = { log = "Shared $label" }, icon = PhosphorIcons.Regular.ShareNetwork)
                    PreviewMenuItem(
                        "Favorite",
                        onClick = { log = "Favorited $label" },
                        icon = PhosphorIcons.Regular.Heart,
                        enabled = !withDisabled,
                    )
                    PreviewMenuSeparator()
                    PreviewMenuItem(
                        "Delete",
                        onClick = { log = "Deleted $label" },
                        icon = PhosphorIcons.Regular.Trash,
                        variant = MenuItemVariant.Destructive,
                    )
                }
            }
        }
        Text(log, variant = TextVariant.Muted)
    }
}

@Composable
private fun PreviewMenuAlbum(defaultOpen: Boolean) {
    val colors = EsuissTheme.colors
    var open by rememberSaveable { mutableStateOf(defaultOpen) }
    PreviewMenu(
        open = open,
        onOpenChange = { open = it },
        aspectRatio = 4f / 3f,
        trigger = {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(colors.muted, RoundedCornerShape(Radius.xl))
                    .padding(12.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Box(Modifier.size(48.dp).background(Palette.blue500, RoundedCornerShape(Radius.lg)))
                Column {
                    Text("Trip to the coast", style = Typography.base.copy(fontWeight = FontWeight.SemiBold))
                    Text("48 photos", variant = TextVariant.Muted)
                }
            }
        },
        preview = {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Palette.blue500)
                    .padding(16.dp),
                verticalArrangement = Arrangement.Bottom,
            ) {
                Text("Trip to the coast", style = Typography.lg.copy(color = colors.primaryForeground, fontWeight = FontWeight.SemiBold))
                Text("48 photos · Updated today", style = Typography.sm.copy(color = colors.primaryForeground))
            }
        },
    ) {
        PreviewMenuItem("Share album", onClick = {}, icon = PhosphorIcons.Regular.ShareNetwork)
        PreviewMenuItem("Delete album", onClick = {}, icon = PhosphorIcons.Regular.Trash, variant = MenuItemVariant.Destructive)
    }
}
