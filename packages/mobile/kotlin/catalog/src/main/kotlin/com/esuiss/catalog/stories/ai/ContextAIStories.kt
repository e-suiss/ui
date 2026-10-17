package com.esuiss.catalog.stories.ai

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Popover
import com.esuiss.ui.components.PopoverDescription
import com.esuiss.ui.components.PopoverHeader
import com.esuiss.ui.components.PopoverTitle
import com.esuiss.ui.components.PopupAlign
import com.esuiss.ui.components.Progress
import com.esuiss.ui.components.Text
import com.esuiss.ui.theme.EsuissTheme

val contextAIStories = StoryGroup(
    section = Section.AI,
    title = "Context",
    stories = listOf(
        Story("Default") { ContextAIDefault() },
    ),
)

@Composable
private fun ContextAIDefault() {
    var open by rememberSaveable { mutableStateOf(false) }
    Column {
        Popover(
            open = open,
            onOpenChange = { open = it },
            trigger = { Button("8% context", onClick = { open = true }, variant = ButtonVariant.Outline, size = ButtonSize.Sm) },
            modifier = Modifier.width(288.dp),
            align = PopupAlign.Start,
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                PopoverHeader {
                    PopoverTitle("16,400 of 200,000 tokens")
                    PopoverDescription("Claude Opus 5.5")
                }
                Progress(8f, Modifier.fillMaxWidth())
                Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    UsageRow("Input", "11,200")
                    UsageRow("Output", "3,900")
                    UsageRow("Reasoning", "1,300")
                }
            }
        }
    }
}

@Composable
private fun UsageRow(label: String, value: String) {
    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
        Text(label, color = EsuissTheme.colors.mutedForeground)
        Text(value)
    }
}
