package com.esuiss.catalog.stories.ai

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.Robot
import com.adamglin.phosphoricons.regular.Terminal
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
import com.esuiss.ui.theme.EsuissTheme

val subagentAIStories = StoryGroup(
    section = Section.AI,
    title = "Subagent",
    stories = listOf(
        Story("Default") { SubagentAIDefault() },
    ),
)

@Composable
private fun SubagentAIDefault() {
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Message(Modifier.fillMaxWidth(), align = MessageAlign.End) {
            MessageContent {
                Bubble(variant = BubbleVariant.Muted) { BubbleContent("Find out why the images rebuild on every deploy.") }
            }
        }
        TraceCollapsible(initiallyExpanded = true) {
            TraceCollapsibleTrigger {
                TraceLine {
                    TraceIcon { Icon(PhosphorIcons.Regular.Robot, contentDescription = null) }
                    TraceTitle("Ran the research subagent")
                    TraceDescription("3 commands")
                }
            }
            TraceCollapsibleContent {
                Trace {
                    TraceLine {
                        TraceIcon { Icon(PhosphorIcons.Regular.Terminal, contentDescription = null) }
                        TraceTitle("Ran grep -rn cacheKey scripts")
                    }
                    TraceLine {
                        TraceIcon { Icon(PhosphorIcons.Regular.Terminal, contentDescription = null) }
                        TraceTitle("Ran sed -n 13,15p scripts/optimize-images.ts")
                    }
                    TraceLine {
                        TraceIcon { Icon(PhosphorIcons.Regular.Terminal, contentDescription = null) }
                        TraceTitle("Ran ls public/images | wc -l")
                    }
                }
                Text("The cache key in scripts/optimize-images.ts includes the commit hash, so all 1,284 images rebuild.", color = EsuissTheme.colors.foreground)
            }
        }
    }
}
