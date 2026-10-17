package com.esuiss.catalog.stories.ai

import androidx.compose.runtime.Composable
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.CheckCircle
import com.adamglin.phosphoricons.regular.Circle
import com.adamglin.phosphoricons.regular.Path
import com.adamglin.phosphoricons.regular.Record
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.Trace
import com.esuiss.ui.components.TraceCollapsible
import com.esuiss.ui.components.TraceCollapsibleContent
import com.esuiss.ui.components.TraceCollapsibleTrigger
import com.esuiss.ui.components.TraceDescription
import com.esuiss.ui.components.TraceIcon
import com.esuiss.ui.components.TraceLine
import com.esuiss.ui.components.TraceStatus
import com.esuiss.ui.components.TraceTitle

val planAIStories = StoryGroup(
    section = Section.AI,
    title = "Plan",
    stories = listOf(
        Story("Default") { PlanAIDefault() },
    ),
)

@Composable
private fun PlanAIDefault() {
    TraceCollapsible(initiallyExpanded = true) {
        TraceCollapsibleTrigger {
            TraceLine(status = TraceStatus.Running) {
                TraceIcon { Icon(PhosphorIcons.Regular.Path, contentDescription = null) }
                TraceTitle("Plan: migrate to Base UI")
                TraceDescription("2 of 4 done")
            }
        }
        TraceCollapsibleContent {
        Trace {
            TraceLine {
                TraceIcon { Icon(PhosphorIcons.Regular.CheckCircle, contentDescription = null) }
                TraceTitle("Install @base-ui/react")
            }
            TraceLine {
                TraceIcon { Icon(PhosphorIcons.Regular.CheckCircle, contentDescription = null) }
                TraceTitle("Replace the Radix imports")
            }
            TraceLine(status = TraceStatus.Running) {
                TraceIcon { Icon(PhosphorIcons.Regular.Record, contentDescription = null) }
                TraceTitle("Rename asChild to render")
            }
            TraceLine(status = TraceStatus.Pending) {
                TraceIcon { Icon(PhosphorIcons.Regular.Circle, contentDescription = null) }
                TraceTitle("Run the type checker")
            }
        }
        }
    }
}
