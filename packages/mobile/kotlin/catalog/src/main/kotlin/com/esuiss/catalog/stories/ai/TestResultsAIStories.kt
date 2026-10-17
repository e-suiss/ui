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
import com.adamglin.phosphoricons.regular.Flask
import com.adamglin.phosphoricons.regular.XCircle
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
import com.esuiss.ui.components.TraceStatus
import com.esuiss.ui.components.TraceTitle

val testResultsAIStories = StoryGroup(
    section = Section.AI,
    title = "Test Results",
    stories = listOf(
        Story("Default") { TestResultsAIDefault() },
    ),
)

@Composable
private fun TestResultsAIDefault() {
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Message(Modifier.fillMaxWidth(), align = MessageAlign.End) {
            MessageContent {
                Bubble(variant = BubbleVariant.Muted) { BubbleContent("Run the checkout tests.") }
            }
        }
        TraceCollapsible(initiallyExpanded = true) {
            TraceCollapsibleTrigger {
                TraceLine(status = TraceStatus.Error) {
                    TraceIcon { Icon(PhosphorIcons.Regular.Flask, contentDescription = null) }
                    TraceTitle("Ran 5 tests, 1 failed")
                }
            }
            TraceCollapsibleContent {
                Trace {
                    TraceLine {
                        TraceIcon { Icon(PhosphorIcons.Regular.CheckCircle, contentDescription = null) }
                        TraceTitle("cart.test.ts")
                        TraceDescription("3 passed")
                    }
                    TraceLine(status = TraceStatus.Error) {
                        TraceIcon { Icon(PhosphorIcons.Regular.XCircle, contentDescription = null) }
                        TraceTitle("payment.test.ts › retries a declined card")
                    }
                    TraceLine {
                        TraceIcon { Icon(PhosphorIcons.Regular.CheckCircle, contentDescription = null) }
                        TraceTitle("payment.test.ts › charges the saved card")
                    }
                }
            }
        }
        Text("The retry test expects two attempts and the client makes one.")
    }
}
