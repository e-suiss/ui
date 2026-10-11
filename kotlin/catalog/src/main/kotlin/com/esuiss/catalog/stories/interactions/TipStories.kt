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
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Duotone
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.duotone.NotePencil
import com.adamglin.phosphoricons.duotone.PushPin
import com.adamglin.phosphoricons.regular.NotePencil
import com.adamglin.phosphoricons.regular.ShareNetwork
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.PopupAlign
import com.esuiss.ui.components.PopupSide
import com.esuiss.ui.components.Text
import com.esuiss.ui.components.TextVariant
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
import com.esuiss.ui.interactions.resetTips
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography
import kotlinx.coroutines.launch

val tipStories = StoryGroup(
    section = Section.Interactions,
    title = "Tip",
    stories = listOf(
        Story("Default") { TipExample() },
        Story("Card") { TipCardExample() },
    ),
)

private class TipNote(val id: Int, val title: String, val preview: String)

private val tipNotes = listOf(
    TipNote(1, "Groceries", "Milk, eggs, bread, coffee"),
    TipNote(2, "Trip ideas", "Lisbon, Porto, the coast road"),
    TipNote(3, "Book list", "Three novels for the summer"),
    TipNote(4, "Meeting notes", "Ship the beta on Friday"),
)

private val tipIds = listOf("notes-pin", "notes-compose")

@Composable
private fun TipPinCard() {
    TipCard {
        TipIcon {
            Icon(PhosphorIcons.Duotone.PushPin, contentDescription = null)
        }
        TipContent {
            TipTitle("Pin your favorites")
            TipDescription("Swipe right on a note to keep it at the top of the list.")
        }
        TipClose()
    }
}

@Composable
private fun TipNotesPage() {
    val colors = EsuissTheme.colors
    var log by rememberSaveable { mutableStateOf("") }
    val shape = RoundedCornerShape(Radius.xl2)
    TipGroup {
        Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Text("Notes", variant = TextVariant.H1)
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Button(onClick = { log = "Shared the folder" }, variant = ButtonVariant.Plain, size = ButtonSize.IconLg) {
                        Icon(PhosphorIcons.Regular.ShareNetwork, contentDescription = "Share folder", size = 22.dp)
                    }
                    Tip(id = "notes-compose", delayMillis = 600) {
                        TipAnchor {
                            Button(onClick = { log = "Started a new note" }, variant = ButtonVariant.Plain, size = ButtonSize.IconLg) {
                                Icon(PhosphorIcons.Regular.NotePencil, contentDescription = "New note", size = 22.dp)
                            }
                        }
                        TipPopover(side = PopupSide.Bottom, align = PopupAlign.End) {
                            TipIcon {
                                Icon(PhosphorIcons.Duotone.NotePencil, contentDescription = null)
                            }
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
                TipPinCard()
            }
            Column(
                Modifier
                    .fillMaxWidth()
                    .clip(shape)
                    .border(1.dp, colors.separator, shape),
            ) {
                tipNotes.forEachIndexed { index, note ->
                    if (index > 0) Box(Modifier.fillMaxWidth().height(1.dp).background(colors.separator))
                    TipNoteRow(note) { log = "Opened ${note.title}" }
                }
            }
            Text(
                log,
                modifier = Modifier.heightIn(min = 20.dp).semantics { liveRegion = LiveRegionMode.Polite },
                style = Typography.sm.copy(color = colors.labelSecondary),
            )
        }
    }
}

@Composable
private fun TipNoteRow(note: TipNote, onClick: () -> Unit) {
    val colors = EsuissTheme.colors
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    Column(
        Modifier
            .fillMaxWidth()
            .background(if (pressed) colors.itemPressed else Color.Transparent)
            .clickable(interactionSource = interaction, indication = null, role = Role.Button, onClick = onClick)
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

@Composable
private fun TipExample() {
    val scope = rememberCoroutineScope()
    var ready by remember { mutableStateOf(false) }
    var page by remember { mutableIntStateOf(0) }
    LaunchedEffect(Unit) {
        resetTips(tipIds)
        ready = true
    }
    Column(verticalArrangement = Arrangement.spacedBy(24.dp), horizontalAlignment = Alignment.CenterHorizontally) {
        if (ready) {
            key(page) { TipNotesPage() }
        }
        Button(
            "Show tips again",
            onClick = {
                scope.launch {
                    resetTips(tipIds)
                    page += 1
                }
            },
            variant = ButtonVariant.Secondary,
            size = ButtonSize.Sm,
        )
    }
}

@Composable
private fun TipCardExample() {
    var ready by remember { mutableStateOf(false) }
    LaunchedEffect(Unit) {
        resetTips(listOf("story-card"))
        ready = true
    }
    if (!ready) return
    Tip(id = "story-card") {
        TipPinCard()
    }
}
