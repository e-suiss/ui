package com.esuiss.catalog.stories.components

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Field
import com.esuiss.ui.components.FieldDescription
import com.esuiss.ui.components.FieldError
import com.esuiss.ui.components.FieldLabel
import com.esuiss.ui.components.Textarea

val textareaStories = StoryGroup(
    section = Section.Components,
    title = "Textarea",
    stories = listOf(
        Story("Default") { TextareaDemo() },
        Story("WithValue") {
            TextareaDemo(
                initial = "The quick brown fox jumps over the lazy dog. This text spans a few lines to show how the textarea handles longer content.",
            )
        },
        Story("WithLabel") { TextareaWithLabel() },
        Story("Disabled") { TextareaDemo(placeholder = "Disabled", enabled = false) },
        Story("Invalid") { TextareaInvalid() },
    ),
)

@Composable
private fun TextareaDemo(
    initial: String = "",
    placeholder: String = "Type your message here.",
    enabled: Boolean = true,
) {
    var value by rememberSaveable { mutableStateOf(initial) }
    Textarea(value, { value = it }, Modifier.fillMaxWidth(), enabled = enabled, placeholder = placeholder)
}

@Composable
private fun TextareaWithLabel() {
    Field(Modifier.fillMaxWidth()) {
        FieldLabel("Your message")
        TextareaDemo()
        FieldDescription("Your message will be copied to the team.")
    }
}

@Composable
private fun TextareaInvalid() {
    Field(Modifier.fillMaxWidth(), invalid = true) {
        FieldLabel("Message")
        TextareaDemo(initial = "Too short")
        FieldError("Message must be at least 20 characters.")
    }
}
