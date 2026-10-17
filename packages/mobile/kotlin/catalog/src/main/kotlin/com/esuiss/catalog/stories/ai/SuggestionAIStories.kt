package com.esuiss.catalog.stories.ai

import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.rememberScrollState
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Text
import com.esuiss.ui.theme.EsuissTheme

val suggestionAIStories = StoryGroup(
    section = Section.AI,
    title = "Suggestion",
    stories = listOf(
        Story("Default") { SuggestionAIDefault() },
    ),
)

@Composable
private fun SuggestionAIDefault() {
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text("Try asking", color = EsuissTheme.colors.mutedForeground)
        Row(Modifier.horizontalScroll(rememberScrollState()), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            listOf("Why does the build fail?", "Add dark mode", "Write tests for the cart", "Explain this error").forEach {
                Button(it, onClick = {}, variant = ButtonVariant.Outline, size = ButtonSize.Sm)
            }
        }
    }
}
