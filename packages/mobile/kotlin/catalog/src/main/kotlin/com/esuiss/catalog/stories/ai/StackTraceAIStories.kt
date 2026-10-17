package com.esuiss.catalog.stories.ai

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.WarningCircle
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Bubble
import com.esuiss.ui.components.BubbleContent
import com.esuiss.ui.components.BubbleVariant
import com.esuiss.ui.components.CodeBlock
import com.esuiss.ui.components.CodeBlockContent
import com.esuiss.ui.components.CodeBlockSize
import com.esuiss.ui.components.CodeBlockVariant
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
import com.esuiss.ui.components.TraceStatus
import com.esuiss.ui.components.TraceTitle

val stackTraceAIStories = StoryGroup(
    section = Section.AI,
    title = "Stack Trace",
    stories = listOf(
        Story("Default") { StackTraceAIDefault() },
    ),
)

@Composable
private fun StackTraceAIDefault() {
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Message(Modifier.fillMaxWidth(), align = MessageAlign.End) {
            MessageContent {
                Bubble(variant = BubbleVariant.Muted) { BubbleContent("Reset the database and seed it.") }
            }
        }
        TraceCollapsible(initiallyExpanded = true) {
            TraceCollapsibleTrigger {
                TraceLine(status = TraceStatus.Error) {
                    TraceIcon { Icon(PhosphorIcons.Regular.WarningCircle, contentDescription = null) }
                    TraceTitle("Failed to run pnpm db:seed")
                }
            }
            TraceCollapsibleContent {
                CodeBlock(variant = CodeBlockVariant.Destructive, size = CodeBlockSize.Sm) { CodeBlockContent("TypeError: Cannot read properties of undefined (reading 'id')\n  at seedOrders (scripts/seed.ts:42:18)\n  at main (scripts/seed.ts:12:3)", wrap = true) }
            }
        }
        Text("The seed reads a customer before it is created. Seeding customers first fixes the order step.")
    }
}
