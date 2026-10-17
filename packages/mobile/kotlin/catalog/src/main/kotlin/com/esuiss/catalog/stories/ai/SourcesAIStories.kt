package com.esuiss.catalog.stories.ai

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalUriHandler
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.ArrowUpRight
import com.adamglin.phosphoricons.regular.Globe
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Bubble
import com.esuiss.ui.components.BubbleContent
import com.esuiss.ui.components.BubbleVariant
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.Message
import com.esuiss.ui.components.MessageAlign
import com.esuiss.ui.components.MessageContent
import com.esuiss.ui.components.Text
import com.esuiss.ui.components.Trace
import com.esuiss.ui.components.TraceCollapsible
import com.esuiss.ui.components.TraceCollapsibleContent
import com.esuiss.ui.components.TraceCollapsibleTrigger
import com.esuiss.ui.components.TraceIcon
import com.esuiss.ui.components.TraceLine
import com.esuiss.ui.components.TraceTitle

val sourcesAIStories = StoryGroup(
    section = Section.AI,
    title = "Sources",
    stories = listOf(
        Story("Default") { SourcesAIDefault() },
    ),
)

@Composable
private fun SourcesAIDefault() {
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Message(Modifier.fillMaxWidth(), align = MessageAlign.End) {
            MessageContent {
                Bubble(variant = BubbleVariant.Muted) { BubbleContent("How do I start a new Astro project?") }
            }
        }
        TraceCollapsible {
            TraceCollapsibleTrigger {
                TraceLine {
                    TraceIcon { Icon(PhosphorIcons.Regular.Globe, contentDescription = null) }
                    TraceTitle("Used 3 sources")
                }
            }
            TraceCollapsibleContent {
                Trace {
                    SourceRow("Install Astro | docs.astro.build", "https://docs.astro.build/en/install-and-setup/")
                    SourceRow("create-astro | npmjs.com", "https://www.npmjs.com/package/create-astro")
                    SourceRow("pnpm create | pnpm.io", "https://pnpm.io/cli/create")
                }
            }
        }
        Text("Run pnpm create astro and follow the prompts.")
    }
}

@Composable
private fun SourceRow(title: String, url: String) {
    val uriHandler = LocalUriHandler.current
    TraceLine(Modifier.clickable(role = Role.Button) { uriHandler.openUri(url) }) {
        TraceIcon { Icon(PhosphorIcons.Regular.Globe, contentDescription = null) }
        TraceTitle(title)
        TraceIcon { Icon(PhosphorIcons.Regular.ArrowUpRight, contentDescription = null) }
    }
}
