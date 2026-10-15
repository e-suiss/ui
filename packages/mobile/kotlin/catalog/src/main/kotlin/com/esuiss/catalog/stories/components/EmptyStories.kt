package com.esuiss.catalog.stories.components

import androidx.compose.foundation.background
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.FolderOpen
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Empty
import com.esuiss.ui.components.EmptyContent
import com.esuiss.ui.components.EmptyDescription
import com.esuiss.ui.components.EmptyHeader
import com.esuiss.ui.components.EmptyMedia
import com.esuiss.ui.components.EmptyMediaVariant
import com.esuiss.ui.components.EmptyTitle
import com.esuiss.ui.components.Icon
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius

val emptyStories = StoryGroup(
    section = Section.Components,
    title = "Empty",
    stories = listOf(
        Story("Default") { EmptyDefault() },
        Story("Muted") { EmptyMuted() },
    ),
)

@Composable
private fun EmptyDefault() {
    Empty {
        EmptyHeader {
            EmptyMedia(variant = EmptyMediaVariant.Icon) {
                Icon(PhosphorIcons.Regular.FolderOpen, contentDescription = null)
            }
            EmptyTitle("No projects yet")
            EmptyDescription("You haven't created any projects yet. Get started by creating your first project.")
        }
        EmptyContent {
            Button("Create project", onClick = {})
            Button("Import project", onClick = {}, variant = ButtonVariant.Link)
        }
    }
}

@Composable
private fun EmptyMuted() {
    Empty(Modifier.background(EsuissTheme.colors.muted, RoundedCornerShape(Radius.xl2))) {
        EmptyHeader {
            EmptyTitle("No results")
            EmptyDescription("Try a different search.")
        }
    }
}
