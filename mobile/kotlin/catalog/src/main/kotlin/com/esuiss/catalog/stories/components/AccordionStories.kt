package com.esuiss.catalog.stories.components

import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Accordion
import com.esuiss.ui.components.AccordionItem
import com.esuiss.ui.components.AccordionVariant
import com.esuiss.ui.components.Text

val accordionStories = StoryGroup(
    section = Section.Components,
    title = "Accordion",
    stories = listOf(
        Story("Default") { AccordionSingle(AccordionVariant.Default, "") },
        Story("Filled") { AccordionSingle(AccordionVariant.Filled, "") },
        Story("OpenByDefault") { AccordionSingle(AccordionVariant.Default, "item-2") },
        Story("Multiple") { AccordionMultiple() },
    ),
)

private class AccordionEntry(val value: String, val title: String, val content: String)

private val accordionEntries = listOf(
    AccordionEntry("item-1", "Is it accessible?", "Yes. It works with VoiceOver and TalkBack."),
    AccordionEntry("item-2", "Is it styled?", "Yes. It comes with default styles that match the other components."),
    AccordionEntry("item-3", "Is it animated?", "Yes. It animates open and closed by default."),
)

@Composable
private fun AccordionItems(open: List<String>, onToggle: (String, Boolean) -> Unit) {
    accordionEntries.forEach { entry ->
        AccordionItem(
            expanded = entry.value in open,
            onExpandedChange = { onToggle(entry.value, it) },
            title = entry.title,
        ) {
            Text(entry.content)
        }
    }
}

@Composable
private fun AccordionSingle(variant: AccordionVariant, defaultValue: String) {
    var open by rememberSaveable { mutableStateOf(defaultValue) }
    Accordion(variant = variant) {
        AccordionItems(listOf(open)) { value, expanded -> open = if (expanded) value else "" }
    }
}

@Composable
private fun AccordionMultiple() {
    var open by rememberSaveable { mutableStateOf("item-1,item-3") }
    Accordion {
        AccordionItems(open.split(",")) { value, expanded ->
            val current = open.split(",").filter { it.isNotEmpty() }
            open = (if (expanded) current + value else current - value).joinToString(",")
        }
    }
}
