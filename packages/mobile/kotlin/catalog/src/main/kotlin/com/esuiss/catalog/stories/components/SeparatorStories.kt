package com.esuiss.catalog.stories.components

import androidx.compose.foundation.gestures.Orientation
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Separator
import com.esuiss.ui.components.Text
import com.esuiss.ui.components.TextVariant
import com.esuiss.ui.theme.Typography

val separatorStories = StoryGroup(
    section = Section.Components,
    title = "Separator",
    stories = listOf(
        Story("Default") { SeparatorDefault() },
        Story("Horizontal") { SeparatorHorizontal() },
        Story("Vertical") { SeparatorVerticalRow(listOf("Left", "Right"), 24) },
    ),
)

@Composable
private fun SeparatorVerticalRow(labels: List<String>, height: Int) {
    Row(
        modifier = Modifier.height(height.dp),
        horizontalArrangement = Arrangement.spacedBy(16.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        labels.forEachIndexed { index, label ->
            if (index > 0) Separator(orientation = Orientation.Vertical)
            Text(label, style = Typography.sm)
        }
    }
}

@Composable
private fun SeparatorDefault() {
    Column(Modifier.fillMaxWidth()) {
        Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
            Text("esuiss", style = Typography.sm.copy(fontWeight = FontWeight.Medium))
            Text("An open-source UI component library.", variant = TextVariant.Muted)
        }
        Separator(Modifier.padding(vertical = 16.dp))
        SeparatorVerticalRow(listOf("Blog", "Docs", "Source"), 20)
    }
}

@Composable
private fun SeparatorHorizontal() {
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Text("Above", style = Typography.sm)
        Separator()
        Text("Below", style = Typography.sm)
    }
}
