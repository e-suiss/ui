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
import com.adamglin.phosphoricons.regular.FileText
import com.adamglin.phosphoricons.regular.MagnifyingGlass
import com.adamglin.phosphoricons.regular.NotePencil
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

val taskAIStories = StoryGroup(
    section = Section.AI,
    title = "Task",
    stories = listOf(
        Story("Default") { TaskAIDefault() },
    ),
)

@Composable
private fun TaskAIDefault() {
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Message(Modifier.fillMaxWidth(), align = MessageAlign.End) {
            MessageContent {
                Bubble(variant = BubbleVariant.Muted) { BubbleContent("Update the page titles for the docs.") }
            }
        }
        Trace {
            TraceCollapsible {
                TraceCollapsibleTrigger {
                    TraceLine {
                        TraceIcon { Icon(PhosphorIcons.Regular.CheckCircle, contentDescription = null) }
                        TraceTitle("Found the project files")
                    }
                }
                TraceCollapsibleContent {
                Trace {
                    TraceLine {
                        TraceIcon { Icon(PhosphorIcons.Regular.MagnifyingGlass, contentDescription = null) }
                        TraceTitle("Searched for generateMetadata")
                        TraceDescription("6 results")
                    }
                    TraceLine {
                        TraceIcon { Icon(PhosphorIcons.Regular.FileText, contentDescription = null) }
                        TraceTitle("Read app/docs/layout.tsx")
                    }
                }
                }
            }
            TraceCollapsible(initiallyExpanded = true) {
                TraceCollapsibleTrigger {
                    TraceLine {
                        TraceIcon { Icon(PhosphorIcons.Regular.CheckCircle, contentDescription = null) }
                        TraceTitle("Updated the page metadata")
                    }
                }
                TraceCollapsibleContent {
                Trace {
                    TraceLine {
                        TraceIcon { Icon(PhosphorIcons.Regular.NotePencil, contentDescription = null) }
                        TraceTitle("Edited app/docs/[slug]/page.tsx")
                        TraceDescription("+8 −3")
                    }
                    TraceLine {
                        TraceIcon { Icon(PhosphorIcons.Regular.NotePencil, contentDescription = null) }
                        TraceTitle("Edited app/docs/layout.tsx")
                        TraceDescription("+2 −1")
                    }
                }
                }
            }
        }
        Text("Each docs page now builds its title from the page name.")
    }
}
