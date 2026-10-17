package com.esuiss.catalog.stories.ai

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.CheckCircle
import com.adamglin.phosphoricons.regular.Circle
import com.adamglin.phosphoricons.regular.ListChecks
import com.adamglin.phosphoricons.regular.ListDashes
import com.adamglin.phosphoricons.regular.Record
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
import com.esuiss.ui.components.Trace
import com.esuiss.ui.components.TraceCollapsible
import com.esuiss.ui.components.TraceCollapsibleContent
import com.esuiss.ui.components.TraceCollapsibleTrigger
import com.esuiss.ui.components.TraceIcon
import com.esuiss.ui.components.TraceLine
import com.esuiss.ui.components.TraceStatus
import com.esuiss.ui.components.TraceTitle

val queueAIStories = StoryGroup(
    section = Section.AI,
    title = "Queue",
    stories = listOf(
        Story("Default") { QueueAIDefault() },
    ),
)

@Composable
private fun QueueAIDefault() {
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Message(Modifier.fillMaxWidth(), align = MessageAlign.End) {
            MessageContent {
                Bubble(variant = BubbleVariant.Muted) { BubbleContent("Add dark mode to the settings page.") }
            }
        }
        Trace {
            TraceCollapsible(initiallyExpanded = true) {
                TraceCollapsibleTrigger {
                    TraceLine {
                        TraceIcon { Icon(PhosphorIcons.Regular.ListDashes, contentDescription = null) }
                        TraceTitle("2 to do")
                    }
                }
                TraceCollapsibleContent {
                Trace {
                    TraceLine(status = TraceStatus.Running) {
                        TraceIcon { Icon(PhosphorIcons.Regular.Record, contentDescription = null) }
                        TraceTitle("Add a toggle to the settings page")
                    }
                    TraceLine(status = TraceStatus.Pending) {
                        TraceIcon { Icon(PhosphorIcons.Regular.Circle, contentDescription = null) }
                        TraceTitle("Check contrast on the charts")
                    }
                }
                }
            }
            TraceCollapsible(initiallyExpanded = true) {
                TraceCollapsibleTrigger {
                    TraceLine {
                        TraceIcon { Icon(PhosphorIcons.Regular.ListChecks, contentDescription = null) }
                        TraceTitle("2 completed")
                    }
                }
                TraceCollapsibleContent {
                Trace {
                    TraceLine {
                        TraceIcon { Icon(PhosphorIcons.Regular.CheckCircle, contentDescription = null) }
                        TraceTitle("Add a dark variant to the theme tokens")
                    }
                    TraceLine {
                        TraceIcon { Icon(PhosphorIcons.Regular.CheckCircle, contentDescription = null) }
                        TraceTitle("Read the theme from a cookie")
                    }
                }
                }
            }
        }
    }
}
