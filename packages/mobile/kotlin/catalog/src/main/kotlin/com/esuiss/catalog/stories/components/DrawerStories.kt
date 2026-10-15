package com.esuiss.catalog.stories.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.em
import androidx.compose.ui.unit.sp
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Drawer
import com.esuiss.ui.components.DrawerDescription
import com.esuiss.ui.components.DrawerFooter
import com.esuiss.ui.components.DrawerHeader
import com.esuiss.ui.components.DrawerTitle
import com.esuiss.ui.components.Text
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography

val drawerStories = StoryGroup(
    section = Section.Components,
    title = "Drawer",
    stories = listOf(
        Story("Default") { DrawerGoal(defaultOpen = false, floating = false) },
        Story("OpenByDefault") { DrawerGoal(defaultOpen = true, floating = false) },
        Story("SnapPoints") { DrawerSnapPoints() },
        Story("Floating") { DrawerGoal(defaultOpen = false, floating = true, label = "Open floating drawer") },
    ),
)

private val DrawerItems = List(20) { "Item ${it + 1}" }

@Composable
private fun ColumnScope.DrawerGoalContent(onClose: () -> Unit) {
    DrawerHeader {
        DrawerTitle("Move goal")
        DrawerDescription("Set your daily activity goal.")
    }
    Column(
        modifier = Modifier.fillMaxWidth().padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(4.dp),
    ) {
        Text(
            "350",
            style = Typography.xl3.copy(fontSize = 48.sp, lineHeight = 48.sp, letterSpacing = (-0.025).em, fontWeight = FontWeight.SemiBold),
        )
        Text("CALORIES/DAY", style = Typography.xs.copy(color = EsuissTheme.colors.mutedForeground))
    }
    DrawerFooter {
        Button("Submit", onClick = {}, modifier = Modifier.fillMaxWidth())
        Button("Cancel", onClick = onClose, modifier = Modifier.fillMaxWidth(), variant = ButtonVariant.Secondary)
    }
}

@Composable
private fun DrawerGoal(defaultOpen: Boolean, floating: Boolean, label: String = "Open drawer") {
    var open by rememberSaveable { mutableStateOf(defaultOpen) }
    Column {
        Button(label, onClick = { open = true }, variant = ButtonVariant.Outline)
        Drawer(open = open, onOpenChange = { open = it }, floating = floating, showSwipeHandle = true) {
            DrawerGoalContent(onClose = { open = false })
        }
    }
}

@Composable
private fun DrawerSnapPoints() {
    var open by rememberSaveable { mutableStateOf(false) }
    Column {
        Button("Open with snap points", onClick = { open = true }, variant = ButtonVariant.Outline)
        Drawer(
            open = open,
            onOpenChange = { open = it },
            snapPoints = listOf(0.4f, 1f),
            showSwipeHandle = true,
            showCloseButton = true,
        ) {
            DrawerHeader {
                DrawerTitle("Snap points")
                DrawerDescription("Drag up to expand, drag down to collapse or dismiss.")
            }
            Column(
                modifier = Modifier
                    .weight(1f, fill = false)
                    .verticalScroll(rememberScrollState())
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                DrawerItems.forEach { item ->
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(48.dp)
                            .clip(RoundedCornerShape(Radius.xl))
                            .background(EsuissTheme.colors.muted)
                            .padding(horizontal = 16.dp),
                        contentAlignment = Alignment.CenterStart,
                    ) {
                        Text(item)
                    }
                }
            }
        }
    }
}
