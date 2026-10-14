package com.esuiss.catalog.stories.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.Composable
import androidx.compose.ui.unit.dp
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Text
import com.esuiss.ui.components.TextVariant

val textStories = StoryGroup(
    section = Section.Components,
    title = "Text",
    stories = listOf(
        Story("Default") { Text("The quick brown fox jumps over the lazy dog.") },
        Story("Typography") { TextTypography() },
        Story("Headings") { TextHeadings() },
    ),
)

@Composable
private fun TextTypography() {
    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Text("Taxing Laughter", variant = TextVariant.H1)
        Text("The People of the Kingdom", variant = TextVariant.H2)
        Text("The Joke Tax", variant = TextVariant.H3)
        Text("People stopped telling jokes", variant = TextVariant.H4)
        Text(
            "The king, seeing how much happier his subjects were, realized the error of his ways and repealed the joke tax.",
            variant = TextVariant.P,
        )
        Text(
            "\"After all,\" he said, \"everyone enjoys a good joke, so it's only fair that they should pay for the privilege.\"",
            variant = TextVariant.Blockquote,
        )
        Row {
            Text("npx @esuiss/ui add text", variant = TextVariant.Code)
        }
        Text("A modal dialog that interrupts the user with important content.", variant = TextVariant.Lead)
        Text("Are you absolutely sure?", variant = TextVariant.Large)
        Text("Email address", variant = TextVariant.Small)
        Text("Enter your email address.", variant = TextVariant.Muted)
    }
}

@Composable
private fun TextHeadings() {
    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Text("Heading 1", variant = TextVariant.H1)
        Text("Heading 2", variant = TextVariant.H2)
        Text("Heading 3", variant = TextVariant.H3)
        Text("Heading 4", variant = TextVariant.H4)
    }
}
