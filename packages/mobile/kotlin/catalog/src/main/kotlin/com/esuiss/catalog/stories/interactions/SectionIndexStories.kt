package com.esuiss.catalog.stories.interactions

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Text
import com.esuiss.ui.components.TextVariant
import com.esuiss.ui.interactions.SectionIndex
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius

val sectionIndexStories = StoryGroup(
    section = Section.Interactions,
    title = "Section Index",
    stories = listOf(
        Story("Default") { SectionIndexContacts(height = 520.dp) },
        Story("Compact") { SectionIndexContacts(height = 256.dp) },
    ),
)

private val sectionIndexNames = listOf(
    "Aaron Price",
    "Abby Chen",
    "Alex Morgan",
    "Amira Haddad",
    "Ben Carter",
    "Bianca Rossi",
    "Carla Diaz",
    "Chris Evans",
    "Cody Brooks",
    "Dana Scott",
    "Derek Hale",
    "Elena Petrova",
    "Ethan Wright",
    "Fatima Khan",
    "Felix Wagner",
    "Grace Kim",
    "Hana Sato",
    "Henry Ford",
    "Ivy Turner",
    "Jack Miller",
    "Jade Wilson",
    "Jonas Berg",
    "Kai Nakamura",
    "Laura Bell",
    "Leo Martin",
    "Lina Costa",
    "Maya Patel",
    "Mia Novak",
    "Noah Fischer",
    "Nora Lind",
    "Omar Aziz",
    "Paula Silva",
    "Quinn Avery",
    "Rosa Lopez",
    "Ryan Cole",
    "Sara Ahmed",
    "Sofia Greco",
    "Tom Baker",
    "Uma Rao",
    "Victor Hugo",
    "Will Jensen",
    "Yara Nasser",
    "Zoe Adams",
    "8 Ball Club",
)

private val sectionIndexGroups: List<Pair<String, List<String>>> =
    sectionIndexNames
        .groupBy { name ->
            val first = name.first().uppercaseChar()
            if (first in 'A'..'Z') first.toString() else "#"
        }
        .toList()
        .sortedWith(compareBy({ it.first == "#" }, { it.first }))

@Composable
private fun SectionIndexContacts(height: Dp) {
    val colors = EsuissTheme.colors
    var log by rememberSaveable { mutableStateOf("Tap or drag the letters.") }
    val shape = RoundedCornerShape(Radius.xl2)
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        SectionIndex(
            modifier = Modifier
                .fillMaxWidth()
                .height(height)
                .clip(shape)
                .border(1.dp, colors.border, shape),
            onValueChange = { letter -> log = "Jumped to $letter" },
        ) {
            sectionIndexGroups.forEach { (letter, group) ->
                SectionIndexSection(letter) {
                    items(group.size, key = { group[it] }) { index ->
                        SectionIndexRow(group[index], divided = index > 0) { log = "Opened ${group[index]}" }
                    }
                }
            }
        }
        Text(log, variant = TextVariant.Muted)
    }
}

@Composable
private fun SectionIndexRow(name: String, divided: Boolean, onClick: () -> Unit) {
    val colors = EsuissTheme.colors
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    Column(
        Modifier
            .fillMaxWidth()
            .padding(start = 16.dp, end = 40.dp)
            .clickable(interactionSource = interaction, indication = null, role = Role.Button, onClick = onClick),
    ) {
        if (divided) Box(Modifier.fillMaxWidth().height(1.dp).background(colors.border))
        Text(name, modifier = Modifier.alpha(if (pressed) 0.6f else 1f).padding(vertical = 12.dp))
    }
}
