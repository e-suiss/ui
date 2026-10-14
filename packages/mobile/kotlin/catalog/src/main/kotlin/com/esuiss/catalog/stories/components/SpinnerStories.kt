package com.esuiss.catalog.stories.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.unit.dp
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Spinner
import com.esuiss.ui.components.Text
import com.esuiss.ui.theme.EsuissTheme

val spinnerStories = StoryGroup(
    section = Section.Components,
    title = "Spinner",
    stories = listOf(
        Story("Default") { Spinner() },
        Story("Sizes") { SpinnerSizes() },
        Story("Colors") { SpinnerColors() },
        Story("InButton") { SpinnerInButton() },
    ),
)

@Composable
private fun SpinnerRow(content: @Composable () -> Unit) {
    Row(horizontalArrangement = Arrangement.spacedBy(24.dp), verticalAlignment = Alignment.CenterVertically) {
        content()
    }
}

@Composable
private fun SpinnerSizes() {
    SpinnerRow {
        Spinner(size = 12.dp)
        Spinner()
        Spinner(size = 24.dp)
        Spinner(size = 32.dp)
    }
}

@Composable
private fun SpinnerColors() {
    val colors = EsuissTheme.colors
    SpinnerRow {
        Spinner(size = 24.dp, color = colors.label)
        Spinner(size = 24.dp, color = colors.accent)
        Spinner(size = 24.dp, color = colors.danger)
    }
}

@Composable
private fun SpinnerInButton() {
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Button(onClick = {}, enabled = false) {
            Spinner(color = EsuissTheme.colors.onAccent)
            Text("Saving")
        }
        Button(onClick = {}, variant = ButtonVariant.Secondary, enabled = false) {
            Spinner()
            Text("Loading")
        }
    }
}
