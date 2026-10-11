package com.esuiss.catalog.stories.patterns

import androidx.compose.foundation.layout.Column
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
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Text
import com.esuiss.ui.patterns.Panel
import com.esuiss.ui.patterns.PanelBody
import com.esuiss.ui.patterns.PanelClose
import com.esuiss.ui.patterns.PanelContent
import com.esuiss.ui.patterns.PanelDescription
import com.esuiss.ui.patterns.PanelFooter
import com.esuiss.ui.patterns.PanelHeader
import com.esuiss.ui.patterns.PanelTitle
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography

val panelStories = StoryGroup(
    section = Section.Patterns,
    title = "Panel",
    stories = listOf(
        Story("Default") { PanelDemo(defaultOpen = false) },
        Story("OpenByDefault") { PanelDemo(defaultOpen = true) },
    ),
)

@Composable
private fun PanelDemo(defaultOpen: Boolean) {
    var open by rememberSaveable { mutableStateOf(defaultOpen) }
    Column {
        Button("Filters", onClick = { open = true }, variant = ButtonVariant.Outline)
        Panel(open = open, onOpenChange = { open = it }) {
            PanelContent {
                PanelHeader {
                    PanelTitle("Filters")
                    PanelDescription("Narrow down the results.")
                }
                PanelBody {
                    Text(
                        "Status, owner and date filters go here.",
                        style = Typography.sm.copy(color = EsuissTheme.colors.labelSecondary),
                    )
                }
                PanelFooter {
                    Button("Apply", onClick = {}, modifier = Modifier.fillMaxWidth())
                    PanelClose("Reset", modifier = Modifier.fillMaxWidth())
                }
            }
        }
    }
}
