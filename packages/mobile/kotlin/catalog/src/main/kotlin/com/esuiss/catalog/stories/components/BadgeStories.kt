package com.esuiss.catalog.stories.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.SealCheck
import com.adamglin.phosphoricons.regular.Star
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Badge
import com.esuiss.ui.components.BadgeVariant
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.Text

val badgeStories = StoryGroup(
    section = Section.Components,
    title = "Badge",
    stories = listOf(
        Story("Default") { BadgeDefault() },
        Story("Variants") { BadgeVariants() },
        Story("WithIcon") { BadgeWithIcon() },
    ),
)

@Composable
private fun BadgeDefault() {
    Row {
        Badge("Badge")
    }
}

@Composable
private fun BadgeVariants() {
    FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Badge("Default")
        Badge("Secondary", variant = BadgeVariant.Secondary)
        Badge("Destructive", variant = BadgeVariant.Destructive)
        Badge("Outline", variant = BadgeVariant.Outline)
        Badge("Ghost", variant = BadgeVariant.Ghost)
        Badge("Link", variant = BadgeVariant.Link)
    }
}

@Composable
private fun BadgeWithIcon() {
    FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Badge(variant = BadgeVariant.Secondary) {
            Icon(PhosphorIcons.Regular.SealCheck, contentDescription = null)
            Text("Verified")
        }
        Badge(variant = BadgeVariant.Outline) {
            Icon(PhosphorIcons.Regular.Star, contentDescription = null)
            Text("Featured")
        }
        Badge(Modifier.widthIn(min = 20.dp), variant = BadgeVariant.Outline) {
            Text("8")
        }
    }
}
