package com.esuiss.catalog.stories.ai

import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.ArrowUp
import com.adamglin.phosphoricons.regular.FileText
import com.adamglin.phosphoricons.regular.Plus
import com.adamglin.phosphoricons.regular.X
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Attachment
import com.esuiss.ui.components.AttachmentAction
import com.esuiss.ui.components.AttachmentActions
import com.esuiss.ui.components.AttachmentContent
import com.esuiss.ui.components.AttachmentMedia
import com.esuiss.ui.components.AttachmentSize
import com.esuiss.ui.components.AttachmentTitle
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.InputGroup
import com.esuiss.ui.components.InputGroupAddon
import com.esuiss.ui.components.InputGroupAddonAlign
import com.esuiss.ui.components.InputGroupButton
import com.esuiss.ui.components.InputGroupButtonSize
import com.esuiss.ui.components.InputGroupTextarea
import com.esuiss.ui.components.Text

val promptInputAIStories = StoryGroup(
    section = Section.AI,
    title = "Prompt Input",
    stories = listOf(
        Story("Default") { PromptInputAIDefault() },
    ),
)

@Composable
private fun PromptInputAIDefault() {
    var message by rememberSaveable { mutableStateOf("") }
    InputGroup {
        InputGroupAddon(Modifier.fillMaxWidth(), align = InputGroupAddonAlign.BlockStart) {
            Attachment(size = AttachmentSize.Xs) {
                AttachmentMedia { Icon(PhosphorIcons.Regular.FileText, contentDescription = null) }
                AttachmentContent { AttachmentTitle("settings-page.tsx") }
                AttachmentActions {
                    AttachmentAction(onClick = {}, contentDescription = "Remove") {
                        Icon(PhosphorIcons.Regular.X, contentDescription = null)
                    }
                }
            }
        }
        InputGroupTextarea(message, { message = it }, placeholder = "Ask the agent to change your code...", minLines = 3)
        InputGroupAddon(Modifier.fillMaxWidth(), align = InputGroupAddonAlign.BlockEnd) {
            InputGroupButton(onClick = {}, size = InputGroupButtonSize.IconXs) {
                Icon(PhosphorIcons.Regular.Plus, contentDescription = "Attach a file")
            }
            Spacer(Modifier.weight(1f))
            InputGroupButton(onClick = {}, size = InputGroupButtonSize.Xs) { Text("Claude Opus 5.5") }
            InputGroupButton(onClick = {}, size = InputGroupButtonSize.IconXs, variant = ButtonVariant.Default) {
                Icon(PhosphorIcons.Regular.ArrowUp, contentDescription = "Send")
            }
        }
    }
}
