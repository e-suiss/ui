package com.esuiss.catalog.stories.interactions

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Fill
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.fill.Trash
import com.adamglin.phosphoricons.regular.Trash
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.Text
import com.esuiss.ui.interactions.SwipeAction
import com.esuiss.ui.interactions.SwipeActionVariant
import com.esuiss.ui.interactions.SwipeActions
import com.esuiss.ui.interactions.UndoBarProvider
import com.esuiss.ui.interactions.UndoBarState
import com.esuiss.ui.interactions.rememberUndoBarState
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography

val undoBarStories = StoryGroup(
    section = Section.Interactions,
    title = "Undo Bar",
    stories = listOf(
        Story("Default") { UndoBarDemo(timeout = 5000L) { state -> UndoBarNotesList(state) } },
        Story("Showing") { UndoBarDemo(timeout = 60000L) { state -> UndoBarNotesList(state, deleteFirst = true) } },
        Story("LongerTimeout") { UndoBarDemo(timeout = 10000L) { state -> UndoBarNotesList(state) } },
        Story("WithSwipeActions") { UndoBarDemo(timeout = 5000L) { state -> UndoBarSwipeNotesList(state) } },
    ),
)

private class UndoBarNote(val id: Int, val title: String, val preview: String)

private val undoBarInitialNotes = listOf(
    UndoBarNote(1, "Groceries", "Milk, eggs, bread, coffee"),
    UndoBarNote(2, "Trip ideas", "Lisbon, Porto, the coast road"),
    UndoBarNote(3, "Book list", "Three novels for the summer"),
    UndoBarNote(4, "Meeting notes", "Ship the beta on Friday"),
)

private class UndoBarNotes(
    val notes: List<UndoBarNote>,
    val log: String,
    val remove: (UndoBarNote) -> Unit,
)

@Composable
private fun UndoBarDemo(timeout: Long, content: @Composable (UndoBarState) -> Unit) {
    val state = rememberUndoBarState()
    UndoBarProvider(state, timeoutMillis = timeout) {
        content(state)
    }
}

@Composable
private fun rememberUndoBarNotes(state: UndoBarState): UndoBarNotes {
    var ids by rememberSaveable { mutableStateOf(undoBarInitialNotes.map { it.id }) }
    var log by rememberSaveable { mutableStateOf("Delete a note.") }
    val notes = ids.mapNotNull { id -> undoBarInitialNotes.firstOrNull { it.id == id } }
    return UndoBarNotes(notes, log) { note ->
        val index = ids.indexOf(note.id)
        ids = ids - note.id
        log = "Removed “${note.title}”"
        state.show(
            title = "“${note.title}” deleted",
            onUndo = {
                ids = ids.toMutableList().apply { add(minOf(index, size), note.id) }
                log = "Restored “${note.title}”"
            },
            onCommit = { log = "Deleted “${note.title}” permanently" },
        )
    }
}

@Composable
private fun UndoBarNoteText(note: UndoBarNote, modifier: Modifier = Modifier) {
    Column(modifier.padding(vertical = 8.dp)) {
        Text(
            note.title,
            style = Typography.base.copy(fontWeight = FontWeight.SemiBold),
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
        )
        Text(
            note.preview,
            style = Typography.sm.copy(color = EsuissTheme.colors.mutedForeground),
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
        )
    }
}

@Composable
private fun UndoBarFrame(notes: UndoBarNotes, row: @Composable (UndoBarNote) -> Unit) {
    val colors = EsuissTheme.colors
    val shape = RoundedCornerShape(Radius.xl2)
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Column(
            Modifier
                .fillMaxWidth()
                .clip(shape)
                .border(1.dp, colors.border, shape),
        ) {
            notes.notes.forEachIndexed { index, note ->
                key(note.id) {
                    if (index > 0) Box(Modifier.fillMaxWidth().height(1.dp).background(colors.border))
                    row(note)
                }
            }
        }
        Text(
            notes.log,
            modifier = Modifier.semantics { liveRegion = LiveRegionMode.Polite },
            style = Typography.sm.copy(color = colors.mutedForeground),
        )
    }
}

@Composable
private fun UndoBarNotesList(state: UndoBarState, deleteFirst: Boolean = false) {
    val notes = rememberUndoBarNotes(state)
    var deleted by rememberSaveable { mutableStateOf(false) }
    LaunchedEffect(Unit) {
        if (!deleteFirst || deleted) return@LaunchedEffect
        deleted = true
        notes.remove(undoBarInitialNotes.first())
    }
    UndoBarFrame(notes) { note ->
        Row(
            modifier = Modifier.fillMaxWidth().padding(start = 16.dp, end = 4.dp, top = 4.dp, bottom = 4.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            UndoBarNoteText(note, Modifier.weight(1f))
            Button(onClick = { notes.remove(note) }, variant = ButtonVariant.Ghost, size = ButtonSize.IconLg) {
                Icon(PhosphorIcons.Regular.Trash, contentDescription = "Delete ${note.title}", size = 20.dp)
            }
        }
    }
}

@Composable
private fun UndoBarSwipeNotesList(state: UndoBarState) {
    val notes = rememberUndoBarNotes(state)
    UndoBarFrame(notes) { note ->
        SwipeActions(
            trailing = listOf(
                SwipeAction(
                    "Delete",
                    { notes.remove(note) },
                    icon = PhosphorIcons.Fill.Trash,
                    variant = SwipeActionVariant.Destructive,
                    fullSwipe = true,
                ),
            ),
            background = EsuissTheme.colors.background,
        ) {
            UndoBarNoteText(note, Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 4.dp))
        }
    }
}
