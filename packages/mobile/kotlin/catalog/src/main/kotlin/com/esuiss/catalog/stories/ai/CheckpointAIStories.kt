package com.esuiss.catalog.stories.ai

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
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
import com.esuiss.ui.components.Bubble
import com.esuiss.ui.components.BubbleContent
import com.esuiss.ui.components.BubbleVariant
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Marker
import com.esuiss.ui.components.MarkerContent
import com.esuiss.ui.components.MarkerVariant
import com.esuiss.ui.components.Message
import com.esuiss.ui.components.MessageAlign
import com.esuiss.ui.components.MessageContent
import com.esuiss.ui.components.Text

val checkpointAIStories = StoryGroup(
    section = Section.AI,
    title = "Checkpoint",
    stories = listOf(
        Story("Default") { CheckpointAIDefault() },
    ),
)

@Composable
private fun CheckpointAIDefault() {
    var restored by rememberSaveable { mutableStateOf(false) }
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Turn("Rename the button component to action.", "Renamed Button to Action in components/ui/button.tsx.")
        Marker(variant = MarkerVariant.Separator) { MarkerContent("Checkpoint") }
        if (!restored) Turn("Update the docs to match.", "Updated the Button page to say Action.")
        Button(if (restored) "Reset" else "Restore checkpoint", onClick = { restored = !restored }, variant = ButtonVariant.Outline, size = ButtonSize.Sm)
    }
}

@Composable
private fun Turn(ask: String, reply: String) {
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Message(Modifier.fillMaxWidth(), align = MessageAlign.End) {
            MessageContent {
                Bubble(variant = BubbleVariant.Muted) { BubbleContent(ask) }
            }
        }
        Text(reply)
    }
}
