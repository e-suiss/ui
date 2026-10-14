package com.esuiss.catalog.stories.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Progress
import kotlinx.coroutines.delay

val progressStories = StoryGroup(
    section = Section.Components,
    title = "Progress",
    stories = listOf(
        Story("Default") { ProgressDefault() },
        Story("WithLabel") { ProgressWithLabel() },
        Story("Complete") { Progress(100f, Modifier.fillMaxWidth()) },
        Story("Values") { ProgressValues() },
    ),
)

@Composable
private fun ProgressDefault() {
    var value by rememberSaveable { mutableFloatStateOf(13f) }
    LaunchedEffect(Unit) {
        delay(500)
        value = 66f
    }
    Progress(value, Modifier.fillMaxWidth())
}

@Composable
private fun ProgressWithLabel() {
    var value by rememberSaveable { mutableFloatStateOf(0f) }
    LaunchedEffect(Unit) {
        while (true) {
            delay(600)
            value = if (value >= 100f) 0f else value + 10f
        }
    }
    Progress(value, Modifier.fillMaxWidth(), label = "Uploading", showValue = true)
}

@Composable
private fun ProgressValues() {
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(16.dp)) {
        listOf(0f, 25f, 50f, 75f, 100f).forEach { Progress(it, Modifier.fillMaxWidth()) }
    }
}
