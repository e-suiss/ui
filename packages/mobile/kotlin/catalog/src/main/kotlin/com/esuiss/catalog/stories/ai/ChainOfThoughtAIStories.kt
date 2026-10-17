package com.esuiss.catalog.stories.ai

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.FileText
import com.adamglin.phosphoricons.regular.Globe
import com.adamglin.phosphoricons.regular.MagnifyingGlass
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
import com.esuiss.ui.components.TraceDescription
import com.esuiss.ui.components.TraceIcon
import com.esuiss.ui.components.TraceLine
import com.esuiss.ui.components.TraceTitle

val chainOfThoughtAIStories = StoryGroup(
    section = Section.AI,
    title = "Chain Of Thought",
    stories = listOf(
        Story("Default") { ChainOfThoughtAIDefault() },
    ),
)

@Composable
private fun ChainOfThoughtAIDefault() {
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Message(Modifier.fillMaxWidth(), align = MessageAlign.End) {
            MessageContent {
                Bubble(variant = BubbleVariant.Muted) { BubbleContent("Why is the checkout deploy so slow?") }
            }
        }
        TraceCollapsible(initiallyExpanded = true) {
            TraceCollapsibleTrigger {
                TraceLine {
                    TraceTitle("Researched in 3 steps")
                }
            }
            TraceCollapsibleContent {
                Trace {
                    TraceLine {
                        TraceIcon { Icon(PhosphorIcons.Regular.FileText, contentDescription = null) }
                        TraceTitle("Read the build log for dpl_8Kx2")
                    }
                    TraceLine {
                        TraceIcon { Icon(PhosphorIcons.Regular.Globe, contentDescription = null) }
                        TraceTitle("Searched the web for next.js image cache key")
                        TraceDescription("2 sources")
                    }
                    TraceLine {
                        TraceIcon { Icon(PhosphorIcons.Regular.MagnifyingGlass, contentDescription = null) }
                        TraceTitle("Searched the code for cacheKey")
                        TraceDescription("3 results")
                    }
                }
            }
        }
        Text("Image optimization reruns on every deploy because its cache key includes the commit hash. Key it on the lockfile instead.")
    }
}
