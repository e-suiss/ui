package com.esuiss.catalog.stories.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.CalendarBlank
import com.adamglin.phosphoricons.regular.Info
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.Marker
import com.esuiss.ui.components.MarkerContent
import com.esuiss.ui.components.MarkerIcon
import com.esuiss.ui.components.MarkerVariant

val markerStories = StoryGroup(
    section = Section.Components,
    title = "Marker",
    stories = listOf(
        Story("Variants") { MarkerVariants() },
    ),
)

@Composable
private fun MarkerVariants() {
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(32.dp)) {
        Marker {
            MarkerIcon { Icon(PhosphorIcons.Regular.Info, contentDescription = null) }
            MarkerContent("Messages are end-to-end encrypted.")
        }
        Marker(variant = MarkerVariant.Separator) {
            MarkerContent("Today")
        }
        Marker(variant = MarkerVariant.Border) {
            MarkerIcon { Icon(PhosphorIcons.Regular.CalendarBlank, contentDescription = null) }
            MarkerContent("Upcoming")
        }
    }
}
