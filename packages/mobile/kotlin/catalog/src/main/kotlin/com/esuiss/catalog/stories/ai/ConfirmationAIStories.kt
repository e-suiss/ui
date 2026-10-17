package com.esuiss.catalog.stories.ai

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.ShieldWarning
import com.adamglin.phosphoricons.regular.Terminal
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Bubble
import com.esuiss.ui.components.BubbleContent
import com.esuiss.ui.components.BubbleVariant
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.CodeBlock
import com.esuiss.ui.components.CodeBlockContent
import com.esuiss.ui.components.CodeBlockSize
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.Message
import com.esuiss.ui.components.MessageAlign
import com.esuiss.ui.components.MessageContent
import com.esuiss.ui.components.Text
import com.esuiss.ui.components.Trace
import com.esuiss.ui.components.TraceIcon
import com.esuiss.ui.components.TraceLine
import com.esuiss.ui.components.TraceStatus
import com.esuiss.ui.components.TraceTitle

val confirmationAIStories = StoryGroup(
    section = Section.AI,
    title = "Confirmation",
    stories = listOf(
        Story("Default") { ConfirmationAIDefault() },
    ),
)

@Composable
private fun ConfirmationAIDefault() {
    var decision by rememberSaveable { mutableStateOf("pending") }
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Message(Modifier.fillMaxWidth(), align = MessageAlign.End) {
            MessageContent {
                Bubble(variant = BubbleVariant.Muted) { BubbleContent("Clean up the build folder.") }
            }
        }
        if (decision == "pending") {
            Trace {
                TraceLine {
                    TraceIcon { Icon(PhosphorIcons.Regular.ShieldWarning, contentDescription = null) }
                    TraceTitle("Wants to run a command")
                }
            }
            CodeBlock(size = CodeBlockSize.Sm) { CodeBlockContent("rm -rf .next", language = "bash") }
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Button("Approve", onClick = { decision = "approved" }, size = ButtonSize.Sm)
                Button("Deny", onClick = { decision = "denied" }, variant = ButtonVariant.Outline, size = ButtonSize.Sm)
            }
        } else {
            Trace {
                TraceLine(status = if (decision == "denied") TraceStatus.Error else null) {
                    TraceIcon { Icon(PhosphorIcons.Regular.Terminal, contentDescription = null) }
                    TraceTitle(if (decision == "approved") "Ran rm -rf .next" else "Denied rm -rf .next")
                }
            }
            Text(if (decision == "approved") "Removed the build folder." else "Left the build folder as it is.")
            Button("Reset", onClick = { decision = "pending" }, variant = ButtonVariant.Ghost, size = ButtonSize.Sm)
        }
    }
}
