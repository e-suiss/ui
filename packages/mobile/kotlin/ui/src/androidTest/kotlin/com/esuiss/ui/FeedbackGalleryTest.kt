package com.esuiss.ui

import android.graphics.Bitmap
import android.os.SystemClock
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.Orientation
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawingPadding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.test.junit4.v2.createComposeRule
import androidx.compose.ui.test.onNodeWithContentDescription
import androidx.compose.ui.test.onNodeWithTag
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import androidx.compose.ui.test.performTouchInput
import androidx.compose.ui.test.swipeDown
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Duotone
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.duotone.NotePencil as NotePencilDuotone
import com.adamglin.phosphoricons.duotone.PushPin as PushPinDuotone
import com.adamglin.phosphoricons.regular.Archive
import com.adamglin.phosphoricons.regular.ArrowLeft
import com.adamglin.phosphoricons.regular.ArrowRight
import com.adamglin.phosphoricons.regular.CaretDown
import com.adamglin.phosphoricons.regular.CaretRight
import com.adamglin.phosphoricons.regular.ChatCircle
import com.adamglin.phosphoricons.regular.ClipboardText
import com.adamglin.phosphoricons.regular.Copy
import com.adamglin.phosphoricons.regular.DotsThree
import com.adamglin.phosphoricons.regular.FolderSimple
import com.adamglin.phosphoricons.regular.Link
import com.adamglin.phosphoricons.regular.MagnifyingGlass
import com.adamglin.phosphoricons.regular.Minus
import com.adamglin.phosphoricons.regular.NotePencil
import com.adamglin.phosphoricons.regular.Plus
import com.adamglin.phosphoricons.regular.Scissors
import com.adamglin.phosphoricons.regular.Share
import com.adamglin.phosphoricons.regular.ShareNetwork
import com.adamglin.phosphoricons.regular.Trash
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonGroup
import com.esuiss.ui.components.ButtonGroupOrientation
import com.esuiss.ui.components.ButtonGroupSeparator
import com.esuiss.ui.components.ButtonGroupText
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.Input
import com.esuiss.ui.components.Item
import com.esuiss.ui.components.ItemContent
import com.esuiss.ui.components.ItemDescription
import com.esuiss.ui.components.ItemMedia
import com.esuiss.ui.components.ItemMediaVariant
import com.esuiss.ui.components.ItemTitle
import com.esuiss.ui.components.LocalContentColor
import com.esuiss.ui.components.LocalContentStyle
import com.esuiss.ui.components.MenuItemVariant
import com.esuiss.ui.components.PopupAlign
import com.esuiss.ui.components.PopupSide
import com.esuiss.ui.components.Separator
import com.esuiss.ui.interactions.MemoryTipStorage
import com.esuiss.ui.interactions.SearchReveal
import com.esuiss.ui.interactions.SearchRevealContent
import com.esuiss.ui.interactions.SearchRevealField
import com.esuiss.ui.interactions.SelectionList
import com.esuiss.ui.interactions.SelectionListBar
import com.esuiss.ui.interactions.SelectionListCount
import com.esuiss.ui.interactions.SelectionListItem
import com.esuiss.ui.interactions.SelectionListScope
import com.esuiss.ui.interactions.SelectionListTrigger
import com.esuiss.ui.interactions.Tip
import com.esuiss.ui.interactions.TipAnchor
import com.esuiss.ui.interactions.TipCard
import com.esuiss.ui.interactions.TipClose
import com.esuiss.ui.interactions.TipContent
import com.esuiss.ui.interactions.TipDescription
import com.esuiss.ui.interactions.TipGroup
import com.esuiss.ui.interactions.TipIcon
import com.esuiss.ui.interactions.TipPopover
import com.esuiss.ui.interactions.TipTitle
import com.esuiss.ui.interactions.UndoBarProvider
import com.esuiss.ui.interactions.rememberUndoBarState
import com.esuiss.ui.patterns.ActionBar
import com.esuiss.ui.patterns.ActionBarItem
import com.esuiss.ui.patterns.ActionBarLabel
import com.esuiss.ui.patterns.ActionBarScope
import com.esuiss.ui.patterns.ActionBarSeparator
import com.esuiss.ui.patterns.PagedList
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography
import java.io.File
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

private enum class FeedbackScene {
    ButtonGroup,
    ButtonGroupMore,
    SelectionList,
    SelectionListEditing,
    SelectionListIcons,
    ActionBar,
    ActionBarOpen,
    ActionBarMenu,
    ActionBarLabel,
    UndoBar,
    Tip,
    TipCard,
    SearchReveal,
    SearchRevealOpen,
    SearchRevealQuery,
    PagedList,
}

private class Note(val id: String, val title: String, val preview: String)

private val Notes = listOf(
    Note("groceries", "Groceries", "Milk, eggs, bread, coffee"),
    Note("trip", "Trip ideas", "Lisbon, Porto, the coast road"),
    Note("books", "Book list", "Three novels for the summer"),
    Note("meeting", "Meeting notes", "Ship the beta on Friday"),
    Note("gifts", "Gift ideas", "Headphones, a plant, a scarf"),
    Note("recipes", "Recipes", "Lemon pasta and a quick curry"),
    Note("workout", "Workout plan", "Run on Monday, swim on Thursday"),
    Note("movies", "Movies to watch", "Two documentaries and a classic"),
    Note("garden", "Garden", "Plant tomatoes after the frost"),
    Note("packing", "Packing list", "Charger, passport, rain jacket"),
    Note("podcast", "Podcast notes", "Episode about city design"),
    Note("budget", "Budget", "Rent, groceries, savings"),
)

private class Topic(val id: Int, val title: String, val replies: Int)

private val Subjects = listOf(
    "Getting started",
    "Dark mode tokens",
    "Form validation",
    "Release notes",
    "Accessibility",
    "Theming",
    "Server components",
    "Animations",
)

private val Topics = List(57) { index ->
    Topic(index + 1, "${Subjects[index % Subjects.size]} · thread ${index + 1}", (index * 7) % 23)
}

@Composable
private fun Heading(text: String) {
    BasicText(text, style = Typography.xl3.copy(color = EsuissTheme.colors.foreground, fontWeight = FontWeight.Bold))
}

@Composable
private fun Caption(text: String) {
    BasicText(text, style = Typography.sm.copy(color = EsuissTheme.colors.mutedForeground))
}

@Composable
private fun NoteText(note: Note, modifier: Modifier = Modifier) {
    val colors = EsuissTheme.colors
    Column(modifier = modifier) {
        BasicText(
            note.title,
            style = Typography.base.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold),
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
        )
        BasicText(
            note.preview,
            style = Typography.sm.copy(color = colors.mutedForeground),
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
        )
    }
}

@Composable
private fun Bordered(content: @Composable () -> Unit) {
    val shape = RoundedCornerShape(Radius.xl2)
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(shape)
            .border(1.dp, EsuissTheme.colors.border, shape),
    ) {
        content()
    }
}

@Composable
private fun SelectionListScope.NoteRows(notes: List<Note>, onOpen: (Note) -> Unit) {
    val caretAlpha = if (editing) 0f else 1f
    Bordered {
        notes.forEachIndexed { index, note ->
            if (index > 0) Separator()
            SelectionListItem(note.id, contentDescription = note.title) {
                Row(
                    modifier = Modifier
                        .weight(1f)
                        .clickable { onOpen(note) }
                        .padding(horizontal = 16.dp, vertical = 12.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    NoteText(note, Modifier.weight(1f))
                    Icon(
                        PhosphorIcons.Regular.CaretRight,
                        contentDescription = null,
                        modifier = Modifier.graphicsLayer { alpha = caretAlpha },
                        size = 16.dp,
                        tint = EsuissTheme.colors.mutedForeground,
                    )
                }
            }
        }
    }
}

@Composable
private fun NotesSelection(initialEditing: Boolean, initialSelected: List<String>, icons: Boolean) {
    var editing by remember { mutableStateOf(initialEditing) }
    var selected by remember { mutableStateOf(initialSelected) }
    var log by remember { mutableStateOf("Tap Select to choose notes.") }
    SelectionList(
        editing = editing,
        onEditingChange = { editing = it },
        value = selected,
        onValueChange = { selected = it },
        modifier = Modifier.fillMaxWidth(),
    ) {
        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Heading(if (icons) "Inbox" else "Notes")
                SelectionListTrigger()
            }
            NoteRows(Notes.take(6)) { log = "Opened ${it.title}" }
            Caption(log)
        }
        SelectionListBar {
            val empty = this@SelectionList.selected.isEmpty()
            if (icons) {
                BarIcon(PhosphorIcons.Regular.Archive, "Archive", empty) { log = "Archived" }
                BarIcon(PhosphorIcons.Regular.FolderSimple, "Move", empty) { log = "Moved" }
                SelectionListCount()
                BarIcon(PhosphorIcons.Regular.Trash, "Delete", empty, destructive = true) { clear() }
            } else {
                Button(
                    text = if (empty) "Select All" else "Deselect All",
                    onClick = { if (empty) selectAll() else clear() },
                    variant = ButtonVariant.Plain,
                    size = ButtonSize.Lg,
                )
                SelectionListCount()
                Button(
                    onClick = { setEditing(false) },
                    variant = ButtonVariant.Plain,
                    size = ButtonSize.Lg,
                    enabled = !empty,
                ) {
                    BasicText(
                        "Delete",
                        style = LocalContentStyle.current.copy(color = EsuissTheme.colors.destructive),
                    )
                }
            }
        }
    }
}

@Composable
private fun BarIcon(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    label: String,
    empty: Boolean,
    destructive: Boolean = false,
    onClick: () -> Unit,
) {
    val colors = EsuissTheme.colors
    Button(
        onClick = onClick,
        modifier = Modifier.semantics { contentDescription = label },
        variant = ButtonVariant.Plain,
        size = ButtonSize.IconLg,
        enabled = !empty,
    ) {
        Icon(
            icon,
            contentDescription = null,
            size = 22.dp,
            tint = if (destructive) colors.destructive else LocalContentColor.current,
        )
    }
}

private fun ActionBarScope.browserMenus(withIcons: Boolean, fileOpen: Boolean = false, viewOpen: Boolean = false) {
    ActionBarMenu(defaultOpen = fileOpen) {
        ActionBarTrigger("File")
        ActionBarContent {
            ActionBarItem("New tab", {})
            ActionBarItem("New window", {})
            ActionBarItem("New incognito window", {}, enabled = false)
            ActionBarSeparator()
            ActionBarItem("Print", {})
        }
    }
    ActionBarMenu {
        ActionBarTrigger("Edit")
        ActionBarContent {
            ActionBarItem("Cut", {}, icon = if (withIcons) PhosphorIcons.Regular.Scissors else null)
            ActionBarItem("Copy", {}, icon = if (withIcons) PhosphorIcons.Regular.Copy else null)
            ActionBarItem("Paste", {}, icon = if (withIcons) PhosphorIcons.Regular.ClipboardText else null)
            ActionBarSeparator()
            ActionBarItem(
                "Delete",
                {},
                variant = MenuItemVariant.Destructive,
                icon = if (withIcons) PhosphorIcons.Regular.Trash else null,
            )
        }
    }
    ActionBarMenu(defaultOpen = viewOpen) {
        ActionBarTrigger("View")
        ActionBarContent {
            ActionBarLabel("Appearance")
            ActionBarItem("Zoom in", {})
            ActionBarItem("Zoom out", {})
            ActionBarItem("Actual size", {})
        }
    }
    ActionBarMenu {
        ActionBarTrigger("History", enabled = false)
    }
}

@Composable
private fun ActionBarPage(withIcons: Boolean = false, floating: Boolean = false, fileOpen: Boolean = false, viewOpen: Boolean = false) {
    var open by remember { mutableStateOf(false) }
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Heading("Browser")
            ActionBar(open = open, onOpenChange = { open = it }, floating = floating) {
                browserMenus(withIcons, fileOpen, viewOpen)
            }
        }
        Caption("Tap the more button to see every menu.")
    }
}

@Composable
private fun UndoNotes() {
    val state = rememberUndoBarState()
    var notes by remember { mutableStateOf(Notes.take(4)) }
    var log by remember { mutableStateOf("Delete a note.") }
    UndoBarProvider(state) {
        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Bordered {
                notes.forEachIndexed { index, note ->
                    if (index > 0) Separator()
                    Row(
                        modifier = Modifier.padding(start = 16.dp, end = 4.dp, top = 4.dp, bottom = 4.dp),
                        horizontalArrangement = Arrangement.spacedBy(12.dp),
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        NoteText(note, Modifier.weight(1f).padding(vertical = 8.dp))
                        Button(
                            onClick = {
                                val position = notes.indexOf(note)
                                notes = notes - note
                                log = "Removed “${note.title}”"
                                state.show(
                                    title = "“${note.title}” deleted",
                                    onUndo = {
                                        notes = notes.toMutableList().apply { add(minOf(position, size), note) }
                                        log = "Restored “${note.title}”"
                                    },
                                    onCommit = { log = "Deleted “${note.title}” permanently" },
                                )
                            },
                            modifier = Modifier.semantics { contentDescription = "Delete ${note.title}" },
                            variant = ButtonVariant.Ghost,
                            size = ButtonSize.IconLg,
                        ) {
                            Icon(PhosphorIcons.Regular.Trash, contentDescription = null, size = 20.dp)
                        }
                    }
                }
            }
            Caption(log)
        }
    }
}

@Composable
private fun TipsPage() {
    var log by remember { mutableStateOf("") }
    val storage = remember { MemoryTipStorage() }
    TipGroup(storage = storage) {
        Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Heading("Notes")
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Button(
                        onClick = { log = "Shared the folder" },
                        modifier = Modifier.semantics { contentDescription = "Share folder" },
                        variant = ButtonVariant.Plain,
                        size = ButtonSize.IconLg,
                    ) {
                        Icon(PhosphorIcons.Regular.ShareNetwork, contentDescription = null, size = 22.dp)
                    }
                    Tip(id = "notes-compose") {
                        TipAnchor {
                            Button(
                                onClick = { log = "Started a new note" },
                                modifier = Modifier.semantics { contentDescription = "New note" },
                                variant = ButtonVariant.Plain,
                                size = ButtonSize.IconLg,
                            ) {
                                Icon(PhosphorIcons.Regular.NotePencil, contentDescription = null, size = 22.dp)
                            }
                        }
                        TipPopover(side = PopupSide.Bottom, align = PopupAlign.End) {
                            TipIcon { Icon(PhosphorIcons.Duotone.NotePencilDuotone, contentDescription = null) }
                            TipContent {
                                TipTitle("Start a note fast")
                                TipDescription("Tap here any time to begin a new note.")
                            }
                            TipClose()
                        }
                    }
                }
            }
            Tip(id = "notes-pin") {
                TipCard {
                    TipIcon { Icon(PhosphorIcons.Duotone.PushPinDuotone, contentDescription = null) }
                    TipContent {
                        TipTitle("Pin your favorites")
                        TipDescription("Swipe right on a note to keep it at the top of the list.")
                    }
                    TipClose()
                }
            }
            Bordered {
                Notes.take(4).forEachIndexed { index, note ->
                    if (index > 0) Separator()
                    NoteText(note, Modifier.fillMaxWidth().clickable { log = "Opened ${note.title}" }.padding(horizontal = 16.dp, vertical = 12.dp))
                }
            }
            Caption(log)
        }
    }
}

@Composable
private fun SearchNotes(initialQuery: String) {
    var query by remember { mutableStateOf(initialQuery) }
    val colors = EsuissTheme.colors
    val notes = Notes.filter { "${it.title} ${it.preview}".contains(query.trim(), ignoreCase = true) }
    val shape = RoundedCornerShape(Radius.xl2)
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(shape)
            .border(1.dp, colors.border, shape),
    ) {
        Box(modifier = Modifier.padding(start = 16.dp, end = 16.dp, top = 16.dp, bottom = 8.dp)) { Heading("Notes") }
        SearchReveal(modifier = Modifier.testTag("reveal").weight(1f)) {
            SearchRevealField(value = query, onValueChange = { query = it })
            SearchRevealContent {
                if (notes.isEmpty()) {
                    BasicText(
                        "No results for “$query”",
                        modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 64.dp),
                        style = Typography.sm.copy(color = colors.mutedForeground, textAlign = androidx.compose.ui.text.style.TextAlign.Center),
                    )
                } else {
                    Column(
                        modifier = Modifier
                            .padding(horizontal = 16.dp)
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(Radius.xl))
                            .background(colors.muted),
                    ) {
                        notes.forEachIndexed { index, note ->
                            if (index > 0) Separator()
                            NoteText(note, Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 12.dp))
                        }
                    }
                }
                BasicText(
                    "${notes.size} ${if (notes.size == 1) "note" else "notes"}",
                    modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 12.dp),
                    style = Typography.xs.copy(color = colors.mutedForeground, textAlign = androidx.compose.ui.text.style.TextAlign.Center),
                )
            }
        }
    }
}

@Composable
private fun TopicRow(topic: Topic) {
    Item(onClick = {}) {
        ItemMedia(variant = ItemMediaVariant.Icon) { Icon(PhosphorIcons.Regular.ChatCircle, contentDescription = null) }
        ItemContent {
            ItemTitle(topic.title)
            ItemDescription("${topic.replies} replies")
        }
    }
}

@Composable
private fun ButtonGroups() {
    Column(
        modifier = Modifier.verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(20.dp),
    ) {
        ButtonGroup {
            ButtonGroup {
                Button(onClick = {}, variant = ButtonVariant.Secondary, size = ButtonSize.Icon) {
                    Icon(PhosphorIcons.Regular.ArrowLeft, contentDescription = "Go back")
                }
            }
            ButtonGroup {
                Button("Archive", {}, variant = ButtonVariant.Secondary)
                ButtonGroupSeparator()
                Button("Report", {}, variant = ButtonVariant.Secondary)
            }
            ButtonGroup {
                Button("Snooze", {}, variant = ButtonVariant.Secondary)
                ButtonGroupSeparator()
                Button(onClick = {}, variant = ButtonVariant.Secondary, size = ButtonSize.Icon) {
                    Icon(PhosphorIcons.Regular.DotsThree, contentDescription = "More options")
                }
            }
        }
        ButtonGroup {
            ButtonGroup {
                Button(onClick = {}, variant = ButtonVariant.Outline, size = ButtonSize.Icon) {
                    Icon(PhosphorIcons.Regular.ArrowLeft, contentDescription = "Go back")
                }
            }
            ButtonGroup {
                Button("Archive", {}, variant = ButtonVariant.Outline)
                Button("Report", {}, variant = ButtonVariant.Outline)
            }
            ButtonGroup {
                Button("Snooze", {}, variant = ButtonVariant.Outline)
                Button(onClick = {}, variant = ButtonVariant.Outline, size = ButtonSize.Icon) {
                    Icon(PhosphorIcons.Regular.DotsThree, contentDescription = "More options")
                }
            }
        }
        Row(horizontalArrangement = Arrangement.spacedBy(20.dp), verticalAlignment = Alignment.Top) {
            ButtonGroup(orientation = ButtonGroupOrientation.Vertical) {
                Button(onClick = {}, variant = ButtonVariant.Secondary, size = ButtonSize.Icon) {
                    Icon(PhosphorIcons.Regular.Plus, contentDescription = "Zoom in")
                }
                ButtonGroupSeparator(orientation = Orientation.Horizontal)
                Button(onClick = {}, variant = ButtonVariant.Secondary, size = ButtonSize.Icon) {
                    Icon(PhosphorIcons.Regular.Minus, contentDescription = "Zoom out")
                }
            }
            ButtonGroup(orientation = ButtonGroupOrientation.Vertical) {
                Button("Top", {}, variant = ButtonVariant.Outline)
                Button("Middle", {}, variant = ButtonVariant.Outline)
                Button("Bottom", {}, variant = ButtonVariant.Outline)
            }
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                ButtonGroup {
                    Button(onClick = {}, variant = ButtonVariant.Secondary) {
                        Icon(PhosphorIcons.Regular.Copy, contentDescription = null)
                        BasicText("Copy", style = LocalContentStyle.current)
                    }
                    ButtonGroupSeparator()
                    Button(onClick = {}, variant = ButtonVariant.Secondary) {
                        Icon(PhosphorIcons.Regular.Share, contentDescription = null)
                        BasicText("Share", style = LocalContentStyle.current)
                    }
                }
                ButtonGroup {
                    Button("Publish", {})
                    ButtonGroupSeparator(color = EsuissTheme.colors.primaryForeground.copy(alpha = 0.3f))
                    Button(onClick = {}, size = ButtonSize.Icon) {
                        Icon(PhosphorIcons.Regular.CaretDown, contentDescription = "More options")
                    }
                }
            }
        }
        ButtonGroup {
            Button(onClick = {}, variant = ButtonVariant.Plain) {
                Icon(PhosphorIcons.Regular.ArrowLeft, contentDescription = null)
                BasicText("Back", style = LocalContentStyle.current)
            }
            Button(onClick = {}, variant = ButtonVariant.Plain) {
                BasicText("Forward", style = LocalContentStyle.current)
                Icon(PhosphorIcons.Regular.ArrowRight, contentDescription = null)
            }
            Button(onClick = {}, variant = ButtonVariant.Plain) {
                Icon(PhosphorIcons.Regular.Share, contentDescription = null)
                BasicText("Share", style = LocalContentStyle.current)
            }
        }
    }
}

@Composable
private fun MoreButtonGroups() {
    Column(
        modifier = Modifier.verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(20.dp),
    ) {
        listOf(ButtonSize.Sm to ButtonSize.IconSm, ButtonSize.Default to ButtonSize.Icon, ButtonSize.Lg to ButtonSize.IconLg)
            .forEach { (size, icon) ->
                ButtonGroup {
                    Button(if (size == ButtonSize.Sm) "Small" else if (size == ButtonSize.Lg) "Large" else "Default", {}, variant = ButtonVariant.Outline, size = size)
                    Button("Button", {}, variant = ButtonVariant.Outline, size = size)
                    Button("Group", {}, variant = ButtonVariant.Outline, size = size)
                    Button(onClick = {}, variant = ButtonVariant.Outline, size = icon) {
                        Icon(PhosphorIcons.Regular.Plus, contentDescription = "Add")
                    }
                }
            }
        ButtonGroup {
            ButtonGroup {
                (1..5).forEach { Button("$it", {}, variant = ButtonVariant.Outline, size = ButtonSize.Sm) }
            }
            ButtonGroup {
                Button(onClick = {}, variant = ButtonVariant.Outline, size = ButtonSize.IconSm) {
                    Icon(PhosphorIcons.Regular.ArrowLeft, contentDescription = "Previous")
                }
                Button(onClick = {}, variant = ButtonVariant.Outline, size = ButtonSize.IconSm) {
                    Icon(PhosphorIcons.Regular.ArrowRight, contentDescription = "Next")
                }
            }
        }
        var search by remember { mutableStateOf("") }
        ButtonGroup(modifier = Modifier.fillMaxWidth()) {
            Input(value = search, onValueChange = { search = it }, placeholder = "Search...")
            Button(onClick = {}, variant = ButtonVariant.Secondary, size = ButtonSize.IconLg) {
                Icon(PhosphorIcons.Regular.MagnifyingGlass, contentDescription = "Search")
            }
        }
        var website by remember { mutableStateOf("") }
        ButtonGroup(modifier = Modifier.fillMaxWidth()) {
            ButtonGroupText {
                Icon(PhosphorIcons.Regular.Link, contentDescription = null)
                BasicText("https://", style = LocalContentStyle.current)
            }
            Input(value = website, onValueChange = { website = it }, placeholder = "example.com")
            Button("Save", {}, variant = ButtonVariant.Secondary, size = ButtonSize.Lg)
        }
        ButtonGroup {
            Button("Previous", {}, variant = ButtonVariant.Outline, size = ButtonSize.Sm)
            Button("1", {}, variant = ButtonVariant.Outline, size = ButtonSize.Sm)
            Button("2", {}, variant = ButtonVariant.Secondary, size = ButtonSize.Sm)
            Button("3", {}, variant = ButtonVariant.Outline, size = ButtonSize.Sm)
            Button("Next", {}, variant = ButtonVariant.Outline, size = ButtonSize.Sm)
        }
    }
}

@Composable
private fun Scene(scene: FeedbackScene) {
    when (scene) {
        FeedbackScene.ButtonGroup -> ButtonGroups()
        FeedbackScene.ButtonGroupMore -> MoreButtonGroups()
        FeedbackScene.SelectionList -> NotesSelection(initialEditing = false, initialSelected = emptyList(), icons = false)
        FeedbackScene.SelectionListEditing -> NotesSelection(initialEditing = false, initialSelected = emptyList(), icons = false)
        FeedbackScene.SelectionListIcons -> NotesSelection(initialEditing = true, initialSelected = listOf("books"), icons = true)
        FeedbackScene.ActionBar -> ActionBarPage()
        FeedbackScene.ActionBarOpen -> ActionBarPage()
        FeedbackScene.ActionBarMenu -> ActionBarPage(withIcons = true, floating = true)
        FeedbackScene.ActionBarLabel -> ActionBarPage(viewOpen = true)
        FeedbackScene.UndoBar -> UndoNotes()
        FeedbackScene.Tip -> TipsPage()
        FeedbackScene.TipCard -> TipsPage()
        FeedbackScene.SearchReveal -> SearchNotes("")
        FeedbackScene.SearchRevealOpen -> SearchNotes("")
        FeedbackScene.SearchRevealQuery -> SearchNotes("ideas")
        FeedbackScene.PagedList -> PagedList(Topics, modifier = Modifier.fillMaxSize(), getKey = { topic, _ -> topic.id }) { topic, _ ->
            TopicRow(topic)
        }
    }
}

@RunWith(AndroidJUnit4::class)
class FeedbackGalleryTest {
    @get:Rule
    val compose = createComposeRule()

    @Test
    fun rendersFeedbackInBothSchemes() {
        var dark by mutableStateOf(false)
        var scene by mutableStateOf(FeedbackScene.ButtonGroup)
        compose.mainClock.autoAdvance = false
        compose.setContent {
            EsuissTheme(darkTheme = dark) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(EsuissTheme.colors.background)
                        .safeDrawingPadding()
                        .padding(16.dp),
                ) {
                    key(scene, dark) { Scene(scene) }
                }
            }
        }
        val instrumentation = InstrumentationRegistry.getInstrumentation()
        val context = instrumentation.targetContext
        for (current in FeedbackScene.entries) {
            for (scheme in listOf(false, true)) {
                scene = current
                dark = scheme
                settle()
                when (current) {
                    FeedbackScene.SelectionListEditing -> {
                        compose.onNodeWithText("Select").performClick()
                        settle()
                        compose.onNodeWithContentDescription("Groceries").performClick()
                        compose.onNodeWithContentDescription("Meeting notes").performClick()
                    }
                    FeedbackScene.ActionBarOpen -> compose.onNodeWithContentDescription("More actions").performClick()
                    FeedbackScene.ActionBarMenu -> {
                        compose.onNodeWithContentDescription("More actions").performClick()
                        settle()
                        compose.onNodeWithText("Edit").performClick()
                    }
                    FeedbackScene.UndoBar -> compose.onNodeWithContentDescription("Delete Groceries").performClick()
                    FeedbackScene.TipCard -> {
                        settle()
                        compose.onNodeWithContentDescription("Dismiss tip").performClick()
                    }
                    FeedbackScene.SearchRevealOpen -> compose.onNodeWithTag("reveal").performTouchInput {
                        swipeDown(startY = top + 40f, endY = top + 400f, durationMillis = 400)
                    }
                    else -> Unit
                }
                settle()
                when (current) {
                    FeedbackScene.SelectionListEditing -> compose.onNodeWithText("2 selected").assertExists()
                    FeedbackScene.SelectionListIcons -> compose.onNodeWithText("1 selected").assertExists()
                    FeedbackScene.ActionBarOpen -> compose.onNodeWithText("View").assertExists()
                    FeedbackScene.ActionBarMenu -> compose.onNodeWithText("Paste").assertExists()
                    FeedbackScene.ActionBarLabel -> compose.onNodeWithText("Appearance").assertExists()
                    FeedbackScene.UndoBar -> compose.onNodeWithText("“Groceries” deleted").assertExists()
                    FeedbackScene.Tip -> compose.onNodeWithText("Start a note fast").assertExists()
                    FeedbackScene.TipCard -> compose.onNodeWithText("Pin your favorites").assertExists()
                    FeedbackScene.PagedList -> compose.onNodeWithText("Form validation · thread 11").assertExists()
                    else -> Unit
                }
                SystemClock.sleep(600)
                val bitmap = checkNotNull(instrumentation.uiAutomation.takeScreenshot())
                val name = "feedback-${current.name.lowercase()}-${if (scheme) "dark" else "light"}.png"
                File(context.getExternalFilesDir(null), name).outputStream().use {
                    bitmap.compress(Bitmap.CompressFormat.PNG, 100, it)
                }
            }
        }
    }

    private fun settle() {
        repeat(4) {
            compose.mainClock.advanceTimeBy(300)
            compose.waitForIdle()
        }
    }
}
