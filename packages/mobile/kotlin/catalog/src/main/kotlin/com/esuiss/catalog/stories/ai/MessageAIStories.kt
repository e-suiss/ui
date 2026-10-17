package com.esuiss.catalog.stories.ai

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.ArrowClockwise
import com.adamglin.phosphoricons.regular.ThumbsDown
import com.adamglin.phosphoricons.regular.ThumbsUp
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
import com.esuiss.ui.components.CodeBlockActions
import com.esuiss.ui.components.CodeBlockContent
import com.esuiss.ui.components.CodeBlockCopyButton
import com.esuiss.ui.components.CodeBlockHeader
import com.esuiss.ui.components.CodeBlockSize
import com.esuiss.ui.components.CodeBlockTitle
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.Message
import com.esuiss.ui.components.MessageAlign
import com.esuiss.ui.components.MessageContent
import com.esuiss.ui.components.Text

val messageAIStories = StoryGroup(
    section = Section.AI,
    title = "Message",
    stories = listOf(
        Story("Default") { MessageAIDefault() },
    ),
)

@Composable
private fun MessageAIDefault() {
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Message(Modifier.fillMaxWidth(), align = MessageAlign.End) {
            MessageContent {
                Bubble(variant = BubbleVariant.Muted) { BubbleContent("How do I add a dialog?") }
            }
        }
        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Text("Add it with the CLI, then import it where you need it.")
            CodeBlock(size = CodeBlockSize.Sm) {
                CodeBlockHeader {
                    CodeBlockTitle("Terminal")
                    CodeBlockActions { CodeBlockCopyButton("npx @esuiss/ui@latest add dialog") }
                }
                CodeBlockContent("npx @esuiss/ui@latest add dialog", language = "bash")
            }
            Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                Button(onClick = {}, variant = ButtonVariant.Ghost, size = ButtonSize.IconSm) {
                    Icon(PhosphorIcons.Regular.ThumbsUp, contentDescription = "Good reply")
                }
                Button(onClick = {}, variant = ButtonVariant.Ghost, size = ButtonSize.IconSm) {
                    Icon(PhosphorIcons.Regular.ThumbsDown, contentDescription = "Bad reply")
                }
                Button(onClick = {}, variant = ButtonVariant.Ghost, size = ButtonSize.IconSm) {
                    Icon(PhosphorIcons.Regular.ArrowClockwise, contentDescription = "Retry")
                }
            }
        }
    }
}
