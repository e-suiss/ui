package com.esuiss.catalog.stories.ai

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.Terminal
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Bubble
import com.esuiss.ui.components.BubbleContent
import com.esuiss.ui.components.BubbleVariant
import com.esuiss.ui.components.CodeBlock
import com.esuiss.ui.components.CodeBlockContent
import com.esuiss.ui.components.CodeBlockSize
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

val terminalAIStories = StoryGroup(
    section = Section.AI,
    title = "Terminal",
    stories = listOf(
        Story("Default") { TerminalAIDefault() },
    ),
)

@Composable
private fun TerminalAIDefault() {
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Message(Modifier.fillMaxWidth(), align = MessageAlign.End) {
            MessageContent {
                Bubble(variant = BubbleVariant.Muted) { BubbleContent("Run the checks, then build the app.") }
            }
        }
        Trace {
            TraceLine {
                TraceIcon { Icon(PhosphorIcons.Regular.Terminal, contentDescription = null) }
                TraceTitle("Ran pnpm lint")
                TraceDescription("2s")
            }
            TraceLine {
                TraceIcon { Icon(PhosphorIcons.Regular.Terminal, contentDescription = null) }
                TraceTitle("Ran pnpm test")
                TraceDescription("14s")
            }
            TraceCollapsible(initiallyExpanded = true) {
                TraceCollapsibleTrigger {
                    TraceLine {
                        TraceIcon { Icon(PhosphorIcons.Regular.Terminal, contentDescription = null) }
                        TraceTitle("Ran pnpm build")
                        TraceDescription("38s")
                    }
                }
                TraceCollapsibleContent {
                    CodeBlock(size = CodeBlockSize.Sm) { CodeBlockContent("${'$'} pnpm build\nCompiled successfully in 31s\nRoute (app)  Size\n/            4.2 kB\n/checkout    8.9 kB", language = "bash") }
                }
            }
        }
        Text("Lint and tests pass, and the build compiled both routes.")
    }
}
