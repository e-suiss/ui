package com.esuiss.catalog.stories.ai

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.Brain
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
import com.esuiss.ui.components.TraceCollapsible
import com.esuiss.ui.components.TraceCollapsibleContent
import com.esuiss.ui.components.TraceCollapsibleTrigger
import com.esuiss.ui.components.TraceIcon
import com.esuiss.ui.components.TraceLine
import com.esuiss.ui.components.TraceTitle

val reasoningAIStories = StoryGroup(
    section = Section.AI,
    title = "Reasoning",
    stories = listOf(
        Story("Default") { ReasoningAIDefault() },
    ),
)

@Composable
private fun ReasoningAIDefault() {
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Message(Modifier.fillMaxWidth(), align = MessageAlign.End) {
            MessageContent {
                Bubble(variant = BubbleVariant.Muted) { BubbleContent("Why is the checkout deploy so slow?") }
            }
        }
        TraceCollapsible(initiallyExpanded = true) {
            TraceCollapsibleTrigger {
                TraceLine {
                    TraceIcon { Icon(PhosphorIcons.Regular.Brain, contentDescription = null) }
                    TraceTitle("Thought for 5s")
                }
            }
            TraceCollapsibleContent {
                Text("The build log shows install and compile finish in under a minute. Image optimization takes almost four, and it reruns on every deploy because the cache key includes the commit hash.")
            }
        }
        Text("Image optimization is the bottleneck. Key its cache on the lockfile and the image directory instead of the commit hash.")
    }
}
