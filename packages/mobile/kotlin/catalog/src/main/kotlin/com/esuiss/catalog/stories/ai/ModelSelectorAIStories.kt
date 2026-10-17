package com.esuiss.catalog.stories.ai

import androidx.compose.foundation.layout.Column
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
import com.esuiss.ui.components.DropdownMenu
import com.esuiss.ui.components.DropdownMenuLabel
import com.esuiss.ui.components.DropdownMenuRadioGroup
import com.esuiss.ui.components.DropdownMenuRadioItem
import com.esuiss.ui.components.DropdownMenuSeparator
import com.esuiss.ui.components.PopupAlign

val modelSelectorAIStories = StoryGroup(
    section = Section.AI,
    title = "Model Selector",
    stories = listOf(
        Story("Default") { ModelSelectorAIDefault() },
    ),
)

@Composable
private fun ModelSelectorAIDefault() {
    var open by rememberSaveable { mutableStateOf(false) }
    var model by rememberSaveable { mutableStateOf("Claude Opus 5.5") }
    Column {
        DropdownMenu(
            expanded = open,
            onExpandedChange = { open = it },
            trigger = { Button(model, onClick = { open = !open }, variant = ButtonVariant.Outline, size = ButtonSize.Sm) },
            modifier = Modifier.width(224.dp),
            align = PopupAlign.Start,
        ) {
            DropdownMenuLabel("Anthropic")
            DropdownMenuRadioGroup(value = model, onValueChange = { model = it }) {
                DropdownMenuRadioItem("Claude Opus 5.5", "Claude Opus 5.5")
                DropdownMenuRadioItem("Claude Sonnet 5.5", "Claude Sonnet 5.5")
            }
            DropdownMenuSeparator()
            DropdownMenuLabel("OpenAI")
            DropdownMenuRadioGroup(value = model, onValueChange = { model = it }) {
                DropdownMenuRadioItem("GPT-5", "GPT-5")
                DropdownMenuRadioItem("GPT-5 mini", "GPT-5 mini")
            }
        }
    }
}
