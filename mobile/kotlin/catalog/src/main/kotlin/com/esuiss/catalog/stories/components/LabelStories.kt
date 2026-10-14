package com.esuiss.catalog.stories.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Checkbox
import com.esuiss.ui.components.Input
import com.esuiss.ui.components.Label

val labelStories = StoryGroup(
    section = Section.Components,
    title = "Label",
    stories = listOf(
        Story("Default") { Label("Your email address") },
        Story("WithInput") { LabelWithInput() },
        Story("WithCheckbox") { LabelWithCheckbox() },
        Story("Disabled") { Label("Disabled label", enabled = false) },
    ),
)

@Composable
private fun LabelWithInput() {
    var email by rememberSaveable { mutableStateOf("") }
    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Label("Email")
        Input(email, { email = it }, Modifier.semantics { contentDescription = "Email" }, placeholder = "m@example.com")
    }
}

@Composable
private fun LabelWithCheckbox() {
    var checked by rememberSaveable { mutableStateOf(false) }
    Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically) {
        Checkbox(checked, { checked = it }, Modifier.semantics { contentDescription = "Accept terms and conditions" })
        Label(
            "Accept terms and conditions",
            Modifier.clickable(interactionSource = remember { MutableInteractionSource() }, indication = null) { checked = !checked },
        )
    }
}
