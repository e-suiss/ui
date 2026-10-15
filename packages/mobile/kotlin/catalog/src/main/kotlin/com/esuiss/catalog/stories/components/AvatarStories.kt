package com.esuiss.catalog.stories.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.painter.BrushPainter
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Bold
import com.adamglin.phosphoricons.bold.Check
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Avatar
import com.esuiss.ui.components.AvatarBadge
import com.esuiss.ui.components.AvatarFallback
import com.esuiss.ui.components.AvatarGroup
import com.esuiss.ui.components.AvatarGroupCount
import com.esuiss.ui.components.AvatarSize
import com.esuiss.ui.components.Icon
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Palette

val avatarStories = StoryGroup(
    section = Section.Components,
    title = "Avatar",
    stories = listOf(
        Story("Default") { AvatarDefault() },
        Story("Fallback") { AvatarFallbackOnly() },
        Story("Sizes") { AvatarSizes() },
        Story("Group") { AvatarGroupStory() },
        Story("WithBadge") { AvatarWithBadge() },
    ),
)

private class AvatarPerson(val name: String, val initials: String, val tones: @Composable () -> List<Color>)

private val avatarPeople = listOf(
    AvatarPerson("Ada Lovelace", "AL") { listOf(Palette.pink500, Palette.purple500) },
    AvatarPerson("Alan Turing", "AT") { listOf(Palette.teal500, Palette.blue500) },
    AvatarPerson("Grace Hopper", "GH") { listOf(Palette.orange500, Palette.red500) },
)

@Composable
private fun AvatarPhoto(person: AvatarPerson, size: AvatarSize = AvatarSize.Default, badge: (@Composable () -> Unit)? = null) {
    val tones = person.tones()
    val photo = remember(tones) { BrushPainter(Brush.linearGradient(tones)) }
    Avatar(
        size = size,
        image = photo,
        contentDescription = person.name,
        badge = badge,
        fallback = { AvatarFallback(person.initials) },
    )
}

@Composable
private fun AvatarDefault() {
    Row {
        AvatarPhoto(avatarPeople[0])
    }
}

@Composable
private fun AvatarFallbackOnly() {
    Row {
        Avatar(
            modifier = Modifier.semantics { contentDescription = "Alan Turing" },
            fallback = { AvatarFallback("AT") },
        )
    }
}

@Composable
private fun AvatarSizes() {
    Row(horizontalArrangement = Arrangement.spacedBy(16.dp), verticalAlignment = Alignment.CenterVertically) {
        AvatarSize.entries.forEach { size -> AvatarPhoto(avatarPeople[0], size) }
    }
}

@Composable
private fun AvatarGroupStory() {
    Row {
        AvatarGroup {
            avatarPeople.forEach { person -> AvatarPhoto(person) }
            AvatarGroupCount("+4", Modifier.semantics { contentDescription = "4 more" })
        }
    }
}

@Composable
private fun AvatarWithBadge() {
    Row(horizontalArrangement = Arrangement.spacedBy(16.dp), verticalAlignment = Alignment.CenterVertically) {
        AvatarSize.entries.forEach { size ->
            AvatarPhoto(avatarPeople[1], size) {
                AvatarBadge {
                    Icon(PhosphorIcons.Bold.Check, contentDescription = null)
                }
            }
        }
    }
}
