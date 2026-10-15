package com.esuiss.catalog.stories.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawing
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.Camera
import com.adamglin.phosphoricons.regular.FileText
import com.adamglin.phosphoricons.regular.Image
import com.adamglin.phosphoricons.regular.NotePencil
import com.adamglin.phosphoricons.regular.PencilSimple
import com.adamglin.phosphoricons.regular.Plus
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Fab
import com.esuiss.ui.components.FabAction
import com.esuiss.ui.components.FabSize
import com.esuiss.ui.components.Text
import com.esuiss.ui.components.TextVariant
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography

val fabStories = StoryGroup(
    section = Section.Components,
    title = "Fab",
    stories = listOf(
        Story("Default", fullScreen = true) {
            FabPage {
                Fab(PhosphorIcons.Regular.Plus, contentDescription = "New note", onClick = {})
            }
        },
        Story("Large", fullScreen = true) {
            FabPage {
                Fab(PhosphorIcons.Regular.PencilSimple, contentDescription = "Compose", onClick = {}, size = FabSize.Lg)
            }
        },
        Story("Extended", fullScreen = true) {
            FabPage {
                Fab(PhosphorIcons.Regular.PencilSimple, contentDescription = "Compose", onClick = {}, label = "Compose")
            }
        },
        Story("LargeExtended", fullScreen = true) {
            FabPage {
                Fab(PhosphorIcons.Regular.Plus, contentDescription = "New note", onClick = {}, size = FabSize.Lg, label = "New note")
            }
        },
        Story("SpeedDialOpen", fullScreen = true) { FabSpeedDial(defaultOpen = true) },
        Story("SpeedDialClosed", fullScreen = true) { FabSpeedDial(defaultOpen = false) },
        Story("Controlled", fullScreen = true) { FabControlled() },
    ),
)

@Composable
private fun FabPage(log: String? = null, fab: @Composable () -> Unit) {
    Box(Modifier.fillMaxSize()) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .windowInsetsPadding(WindowInsets.safeDrawing)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            Text("Notes", variant = TextVariant.H3)
            Text("The button floats at the bottom end of the screen.", variant = TextVariant.Muted)
            if (!log.isNullOrEmpty()) {
                Text(
                    log,
                    modifier = Modifier.semantics { liveRegion = LiveRegionMode.Polite },
                    style = Typography.sm.copy(color = EsuissTheme.colors.mutedForeground),
                )
            }
        }
        fab()
    }
}

@Composable
private fun FabSpeedDial(defaultOpen: Boolean) {
    var open by rememberSaveable { mutableStateOf(defaultOpen) }
    var log by rememberSaveable { mutableStateOf("") }
    FabPage(log) {
        Fab(PhosphorIcons.Regular.Plus, contentDescription = "Create", open = open, onOpenChange = { open = it }) {
            FabAction(PhosphorIcons.Regular.NotePencil, "New note", { log = "New note" })
            FabAction(PhosphorIcons.Regular.Camera, "Take photo", { log = "Take photo" })
            FabAction(PhosphorIcons.Regular.Image, "Add image", { log = "Add image" })
            FabAction(PhosphorIcons.Regular.FileText, "Scan document", { log = "Scan document" })
        }
    }
}

@Composable
private fun FabControlled() {
    var open by rememberSaveable { mutableStateOf(true) }
    FabPage(if (open) "Open" else "Closed") {
        Fab(
            PhosphorIcons.Regular.PencilSimple,
            contentDescription = "Create",
            open = open,
            onOpenChange = { open = it },
            label = "Create",
        ) {
            FabAction(PhosphorIcons.Regular.NotePencil, "New note", {})
            FabAction(PhosphorIcons.Regular.Camera, "Take photo", {})
        }
    }
}
