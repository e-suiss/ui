package com.esuiss.catalog.stories.ai

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
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
import com.adamglin.phosphoricons.regular.ArrowUp
import com.adamglin.phosphoricons.regular.CheckCircle
import com.adamglin.phosphoricons.regular.Plus
import com.adamglin.phosphoricons.regular.Terminal
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Bubble
import com.esuiss.ui.components.BubbleContent
import com.esuiss.ui.components.BubbleVariant
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.CodeBlock
import com.esuiss.ui.components.CodeBlockContent
import com.esuiss.ui.components.CodeBlockSize
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.InputGroup
import com.esuiss.ui.components.InputGroupAddon
import com.esuiss.ui.components.InputGroupAddonAlign
import com.esuiss.ui.components.InputGroupButton
import com.esuiss.ui.components.InputGroupButtonSize
import com.esuiss.ui.components.InputGroupTextarea
import com.esuiss.ui.components.Message
import com.esuiss.ui.components.MessageAlign
import com.esuiss.ui.components.MessageContent
import com.esuiss.ui.components.Text
import com.esuiss.ui.components.Trace
import com.esuiss.ui.components.TraceIcon
import com.esuiss.ui.components.TraceLine
import com.esuiss.ui.components.TraceTitle

val chatAIStories = StoryGroup(
    section = Section.AI,
    title = "Chat",
    stories = listOf(
        Story("Default") { ChatAIDefault() },
    ),
)

@Composable
private fun ChatAIDefault() {
    var message by rememberSaveable { mutableStateOf("") }
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(20.dp)) {
        Message(Modifier.fillMaxWidth(), align = MessageAlign.End) {
            MessageContent {
                Bubble(variant = BubbleVariant.Muted) { BubbleContent("Default the theme to the system setting.") }
            }
        }
        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Trace {
                TraceLine {
                    TraceIcon { Icon(PhosphorIcons.Regular.Terminal, contentDescription = null) }
                    TraceTitle("Ran rg -n defaultTheme app/layout.tsx")
                }
            }
            Text("It was set to light. I updated the ThemeProvider:")
            CodeBlock(size = CodeBlockSize.Sm) {
                CodeBlockContent("<ThemeProvider defaultTheme=\"system\" enableSystem>", language = "tsx")
            }
        }
        Message(Modifier.fillMaxWidth(), align = MessageAlign.End) {
            MessageContent {
                Bubble(variant = BubbleVariant.Muted) { BubbleContent("Run the build before I ship it.") }
            }
        }
        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Trace {
                TraceLine {
                    TraceIcon { Icon(PhosphorIcons.Regular.CheckCircle, contentDescription = null) }
                    TraceTitle("Ran pnpm build")
                }
            }
            Text("The build passes, so it is ready to ship.")
        }
        InputGroup {
            InputGroupTextarea(message, { message = it }, placeholder = "Ask the agent...", minLines = 2)
            InputGroupAddon(Modifier.fillMaxWidth(), align = InputGroupAddonAlign.BlockEnd) {
                InputGroupButton(onClick = {}, size = InputGroupButtonSize.IconXs) {
                    Icon(PhosphorIcons.Regular.Plus, contentDescription = "Attach a file")
                }
                Spacer(Modifier.weight(1f))
                InputGroupButton(onClick = {}, size = InputGroupButtonSize.IconXs, variant = ButtonVariant.Default) {
                    Icon(PhosphorIcons.Regular.ArrowUp, contentDescription = "Send")
                }
            }
        }
    }
}
