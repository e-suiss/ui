package com.esuiss.catalog.stories.ai

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
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
import com.esuiss.ui.components.Text

val inlineCitationAIStories = StoryGroup(
    section = Section.AI,
    title = "Inline Citation",
    stories = listOf(
        Story("Default") { InlineCitationAIDefault() },
    ),
)

@Composable
private fun InlineCitationAIDefault() {
    var open by rememberSaveable { mutableStateOf(false) }
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Text("Suspense shows a fallback until its children finish loading, so the page can stream the rest of the content first.")
        Popover(
            open = open,
            onOpenChange = { open = it },
            trigger = { Button("react.dev", onClick = { open = true }, variant = ButtonVariant.Secondary, size = ButtonSize.Xs) },
            modifier = Modifier.width(288.dp),
            align = PopupAlign.Start,
        ) {
            PopoverHeader {
                PopoverTitle("<Suspense> – React")
                PopoverDescription("Lets you display a fallback until its children have finished loading.")
            }
        }
    }
}
