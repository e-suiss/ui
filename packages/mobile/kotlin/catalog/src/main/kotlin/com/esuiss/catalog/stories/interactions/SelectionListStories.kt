package com.esuiss.catalog.stories.interactions

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
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
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.Archive
import com.adamglin.phosphoricons.regular.CaretRight
import com.adamglin.phosphoricons.regular.FolderSimple
import com.adamglin.phosphoricons.regular.Trash
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.Text
import com.esuiss.ui.components.TextVariant
import com.esuiss.ui.interactions.SelectionList
import com.esuiss.ui.interactions.SelectionListBar
import com.esuiss.ui.interactions.SelectionListCount
import com.esuiss.ui.interactions.SelectionListItem
import com.esuiss.ui.interactions.SelectionListTrigger
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography

val selectionListStories = StoryGroup(
    section = Section.Interactions,
    title = "Selection List",
    stories = listOf(
        Story("Default") { SelectionListNotes() },
        Story("Editing") { SelectionListNotes(defaultEditing = true, defaultValue = listOf("trip", "meeting")) },
        Story("IconActions") { SelectionListMail() },
    ),
)

private class SelectionListNote(val id: String, val title: String, val preview: String)

private val selectionListInitialNotes = listOf(
    SelectionListNote("groceries", "Groceries", "Milk, eggs, bread, coffee"),
    SelectionListNote("trip", "Trip ideas", "Lisbon, Porto, the coast road"),
    SelectionListNote("books", "Book list", "Three novels for the summer"),
    SelectionListNote("meeting", "Meeting notes", "Ship the beta on Friday"),
    SelectionListNote("gifts", "Gift ideas", "Headphones, a plant, a scarf"),
    SelectionListNote("recipes", "Recipes", "Lemon pasta and a quick curry"),
)

private const val SelectionListHint = "Tap Select to choose notes."

@Composable
private fun SelectionListRows(notes: List<SelectionListNote>, editing: Boolean, onOpen: (SelectionListNote) -> Unit) {
    val colors = EsuissTheme.colors
    val shape = RoundedCornerShape(Radius.xl2)
    Column(
        Modifier
            .fillMaxWidth()
            .clip(shape)
            .border(1.dp, colors.border, shape),
    ) {
        notes.forEachIndexed { index, note ->
            if (index > 0) Box(Modifier.fillMaxWidth().height(1.dp).background(colors.border))
            SelectionListItem(value = note.id, contentDescription = note.title) {
                SelectionListRowContent(note, editing) { onOpen(note) }
            }
        }
    }
}

@Composable
private fun RowScope.SelectionListRowContent(note: SelectionListNote, editing: Boolean, onClick: () -> Unit) {
    val colors = EsuissTheme.colors
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    Row(
        modifier = Modifier
            .weight(1f)
            .alpha(if (pressed) 0.8f else 1f)
            .clickable(interactionSource = interaction, indication = null, role = Role.Button, onClick = onClick)
            .padding(horizontal = 16.dp, vertical = 12.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Column(Modifier.weight(1f)) {
            Text(
                note.title,
                style = Typography.base.copy(fontWeight = FontWeight.SemiBold),
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
            Text(
                note.preview,
                style = Typography.sm.copy(color = colors.mutedForeground),
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
        }
        Icon(
            PhosphorIcons.Regular.CaretRight,
            contentDescription = null,
            modifier = Modifier.alpha(if (editing) 0f else 1f),
            size = 16.dp,
            tint = colors.mutedForeground,
        )
    }
}

@Composable
private fun SelectionListFooter(log: String, onReset: () -> Unit) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(12.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Text(
            log,
            modifier = Modifier.weight(1f).semantics { liveRegion = LiveRegionMode.Polite },
            style = Typography.sm.copy(color = EsuissTheme.colors.mutedForeground),
        )
        Button("Reset", onClick = onReset, variant = ButtonVariant.Secondary, size = ButtonSize.Sm)
    }
}

@Composable
private fun SelectionListHeader(title: String) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Text(title, variant = TextVariant.H1)
        SelectionListTrigger()
    }
}

private fun selectionListDeleted(count: Int): String = "Deleted $count ${if (count == 1) "note" else "notes"}"

@Composable
private fun SelectionListNotes(defaultEditing: Boolean = false, defaultValue: List<String> = emptyList()) {
    val colors = EsuissTheme.colors
    var notes by remember { mutableStateOf(selectionListInitialNotes) }
    var log by rememberSaveable { mutableStateOf(SelectionListHint) }
    var editing by rememberSaveable { mutableStateOf(defaultEditing) }
    var selected by rememberSaveable { mutableStateOf(defaultValue) }
    SelectionList(
        editing = editing,
        onEditingChange = { editing = it },
        value = selected,
        onValueChange = { selected = it },
        modifier = Modifier.fillMaxWidth(),
    ) {
        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            SelectionListHeader("Notes")
            SelectionListRows(notes, editing) { log = "Opened ${it.title}" }
            SelectionListFooter(log) {
                notes = selectionListInitialNotes
                log = SelectionListHint
            }
        }
        SelectionListBar {
            val any = this@SelectionList.selected.isNotEmpty()
            Button(
                if (any) "Deselect All" else "Select All",
                onClick = { if (any) clear() else selectAll() },
                modifier = Modifier.padding(horizontal = 4.dp),
                variant = ButtonVariant.Plain,
                size = ButtonSize.Lg,
            )
            SelectionListCount()
            Button(
                onClick = {
                    val ids = this@SelectionList.selected
                    notes = notes.filterNot { it.id in ids }
                    log = selectionListDeleted(ids.size)
                    setEditing(false)
                },
                modifier = Modifier.padding(horizontal = 4.dp),
                variant = ButtonVariant.Plain,
                size = ButtonSize.Lg,
                enabled = any,
            ) {
                Text("Delete", style = Typography.base.copy(color = colors.destructive))
            }
        }
    }
}

@Composable
private fun RowScope.SelectionListBarIcon(icon: ImageVector, label: String, enabled: Boolean, tint: Color? = null, onClick: () -> Unit) {
    Button(onClick = onClick, variant = ButtonVariant.Plain, size = ButtonSize.IconLg, enabled = enabled) {
        if (tint != null) {
            Icon(icon, contentDescription = label, size = 22.dp, tint = tint)
        } else {
            Icon(icon, contentDescription = label, size = 22.dp)
        }
    }
}

@Composable
private fun SelectionListMail() {
    val colors = EsuissTheme.colors
    var notes by remember { mutableStateOf(selectionListInitialNotes) }
    var log by rememberSaveable { mutableStateOf(SelectionListHint) }
    var editing by rememberSaveable { mutableStateOf(false) }
    var selected by rememberSaveable { mutableStateOf(emptyList<String>()) }
    val enabled = selected.isNotEmpty()
    SelectionList(
        editing = editing,
        onEditingChange = { editing = it },
        value = selected,
        onValueChange = { selected = it },
        modifier = Modifier.fillMaxWidth(),
    ) {
        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            SelectionListHeader("Inbox")
            SelectionListRows(notes, editing) { log = "Opened ${it.title}" }
            SelectionListFooter(log) {
                notes = selectionListInitialNotes
                log = SelectionListHint
            }
        }
        SelectionListBar {
            SelectionListBarIcon(PhosphorIcons.Regular.Archive, "Archive", enabled) { log = "Archived ${selected.joinToString(", ")}" }
            SelectionListBarIcon(PhosphorIcons.Regular.FolderSimple, "Move", enabled) { log = "Moved ${selected.joinToString(", ")}" }
            SelectionListCount()
            SelectionListBarIcon(
                PhosphorIcons.Regular.Trash,
                "Delete",
                enabled,
                tint = colors.destructive,
            ) {
                val ids = selected
                notes = notes.filterNot { it.id in ids }
                log = selectionListDeleted(ids.size)
                selected = emptyList()
            }
        }
    }
}
