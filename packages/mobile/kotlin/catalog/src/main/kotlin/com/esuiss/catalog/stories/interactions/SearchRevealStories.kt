package com.esuiss.catalog.stories.interactions

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
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
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Text
import com.esuiss.ui.components.TextVariant
import com.esuiss.ui.interactions.SearchReveal
import com.esuiss.ui.interactions.SearchRevealContent
import com.esuiss.ui.interactions.SearchRevealField
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography

val searchRevealStories = StoryGroup(
    section = Section.Interactions,
    title = "Search Reveal",
    stories = listOf(
        Story("Default") { SearchRevealNotes(count = 12) },
        Story("ShortList") { SearchRevealNotes(count = 3) },
        Story("WithQuery") { SearchRevealNotes(count = 12, defaultQuery = "porto") },
    ),
)

private class SearchRevealNote(val id: Int, val title: String, val preview: String)

private val searchRevealAllNotes = listOf(
    SearchRevealNote(1, "Groceries", "Milk, eggs, bread, coffee"),
    SearchRevealNote(2, "Trip ideas", "Lisbon, Porto, the coast road"),
    SearchRevealNote(3, "Book list", "Three novels for the summer"),
    SearchRevealNote(4, "Meeting notes", "Ship the beta on Friday"),
    SearchRevealNote(5, "Gift ideas", "Headphones, a plant, a scarf"),
    SearchRevealNote(6, "Recipes", "Lemon pasta and a quick curry"),
    SearchRevealNote(7, "Workout plan", "Run on Monday, swim on Thursday"),
    SearchRevealNote(8, "Movies to watch", "Two documentaries and a classic"),
    SearchRevealNote(9, "Garden", "Plant tomatoes after the frost"),
    SearchRevealNote(10, "Packing list", "Charger, passport, rain jacket"),
    SearchRevealNote(11, "Podcast notes", "Episode about city design"),
    SearchRevealNote(12, "Budget", "Rent, groceries, savings"),
)

@Composable
private fun SearchRevealNotes(count: Int, defaultQuery: String = "") {
    val colors = EsuissTheme.colors
    var query by rememberSaveable { mutableStateOf(defaultQuery) }
    val needle = query.trim().lowercase()
    val notes = searchRevealAllNotes.take(count).filter { "${it.title} ${it.preview}".lowercase().contains(needle) }
    val shape = RoundedCornerShape(Radius.xl2)
    Column(
        Modifier
            .fillMaxWidth()
            .height(600.dp)
            .clip(shape)
            .border(1.dp, colors.separator, shape),
    ) {
        Text("Notes", modifier = Modifier.padding(start = 16.dp, end = 16.dp, top = 16.dp, bottom = 8.dp), variant = TextVariant.H1)
        SearchReveal(Modifier.weight(1f)) {
            SearchRevealField(value = query, onValueChange = { query = it })
            SearchRevealContent {
                if (notes.isEmpty()) {
                    Text(
                        "No results for “$query”",
                        modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 64.dp),
                        style = Typography.sm.copy(color = colors.labelSecondary),
                        textAlign = TextAlign.Center,
                    )
                } else {
                    Column(
                        Modifier
                            .padding(horizontal = 16.dp)
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(Radius.xl))
                            .background(colors.surfaceSecondary),
                    ) {
                        notes.forEachIndexed { index, note ->
                            if (index > 0) Box(Modifier.fillMaxWidth().height(1.dp).background(colors.separator))
                            SearchRevealRow(note)
                        }
                    }
                }
                Text(
                    "${notes.size} ${if (notes.size == 1) "note" else "notes"}",
                    modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 12.dp),
                    style = Typography.xs.copy(color = colors.labelSecondary),
                    textAlign = TextAlign.Center,
                )
            }
        }
    }
}

@Composable
private fun SearchRevealRow(note: SearchRevealNote) {
    val colors = EsuissTheme.colors
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    Column(
        Modifier
            .fillMaxWidth()
            .background(if (pressed) colors.itemPressed else Color.Transparent)
            .clickable(interactionSource = interaction, indication = null, role = Role.Button) {}
            .padding(horizontal = 16.dp, vertical = 12.dp),
    ) {
        Text(
            note.title,
            style = Typography.base.copy(fontWeight = FontWeight.SemiBold),
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
        )
        Text(
            note.preview,
            style = Typography.sm.copy(color = colors.labelSecondary),
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
        )
    }
}
