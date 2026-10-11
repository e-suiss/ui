package com.esuiss.catalog.stories.patterns

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Input
import com.esuiss.ui.patterns.Flyout
import com.esuiss.ui.patterns.FlyoutBody
import com.esuiss.ui.patterns.FlyoutClose
import com.esuiss.ui.patterns.FlyoutContent
import com.esuiss.ui.patterns.FlyoutDescription
import com.esuiss.ui.patterns.FlyoutHeader
import com.esuiss.ui.patterns.FlyoutTitle

val flyoutStories = StoryGroup(
    section = Section.Patterns,
    title = "Flyout",
    stories = listOf(
        Story("Default") { FlyoutDemo(defaultOpen = false) },
        Story("OpenByDefault") { FlyoutDemo(defaultOpen = true) },
    ),
)

@Composable
private fun FlyoutDemo(defaultOpen: Boolean) {
    var open by rememberSaveable { mutableStateOf(defaultOpen) }
    var width by rememberSaveable { mutableStateOf("100%") }
    var height by rememberSaveable { mutableStateOf("25px") }
    Column {
        Button("Dimensions", onClick = { open = true }, variant = ButtonVariant.Outline)
        Flyout(open = open, onOpenChange = { open = it }) {
            FlyoutContent {
                FlyoutHeader {
                    FlyoutTitle("Dimensions")
                    FlyoutDescription("Set the dimensions for the layer.")
                }
                FlyoutBody {
                    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                        Input(width, { width = it }, Modifier.semantics { contentDescription = "Width" })
                        Input(height, { height = it }, Modifier.semantics { contentDescription = "Height" })
                        FlyoutClose("Done", modifier = Modifier.fillMaxWidth())
                    }
                }
            }
        }
    }
}
