package com.esuiss.catalog.stories.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.Checks
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Avatar
import com.esuiss.ui.components.AvatarFallback
import com.esuiss.ui.components.Bubble
import com.esuiss.ui.components.BubbleContent
import com.esuiss.ui.components.BubbleVariant
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.Message
import com.esuiss.ui.components.MessageAlign
import com.esuiss.ui.components.MessageAvatar
import com.esuiss.ui.components.MessageContent
import com.esuiss.ui.components.MessageFooter
import com.esuiss.ui.components.MessageGroup
import com.esuiss.ui.components.MessageHeader
import com.esuiss.ui.components.Text
import com.esuiss.ui.theme.EsuissTheme

val messageStories = StoryGroup(
    section = Section.Components,
    title = "Message",
    stories = listOf(
        Story("Default") { MessageDefault() },
        Story("AlignEnd") { MessageAlignEnd() },
        Story("WithHeaderAndFooter") { MessageWithHeaderAndFooter() },
        Story("Conversation") { MessageConversation() },
    ),
)

@Composable
private fun MessageInitials(text: String) {
    MessageAvatar {
        Avatar(fallback = { AvatarFallback(text) })
    }
}

@Composable
private fun MessageDefault() {
    Message(Modifier.fillMaxWidth()) {
        MessageInitials("MK")
        MessageContent {
            Bubble(variant = BubbleVariant.Muted) {
                BubbleContent("Are we still on for lunch tomorrow?")
            }
        }
    }
}

@Composable
private fun MessageAlignEnd() {
    Message(Modifier.fillMaxWidth(), align = MessageAlign.End) {
        MessageContent {
            Bubble {
                BubbleContent("Yes, see you at noon.")
            }
        }
    }
}

@Composable
private fun MessageWithHeaderAndFooter() {
    Message(Modifier.fillMaxWidth()) {
        MessageInitials("JL")
        MessageContent {
            MessageHeader("Jordan Lee")
            Bubble(variant = BubbleVariant.Muted) {
                BubbleContent("I pushed the updated designs to the shared folder.")
            }
            MessageFooter("9:41 AM")
        }
    }
}

@Composable
private fun MessageConversation() {
    MessageGroup(Modifier.fillMaxWidth()) {
        Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
            Message(Modifier.fillMaxWidth()) {
                MessageInitials("MK")
                MessageContent {
                    Bubble(variant = BubbleVariant.Muted) {
                        BubbleContent("Did the build pass?")
                    }
                    Bubble(variant = BubbleVariant.Muted) {
                        BubbleContent("I want to ship before the weekend.")
                    }
                }
            }
            Message(Modifier.fillMaxWidth(), align = MessageAlign.End) {
                MessageContent {
                    Bubble {
                        BubbleContent("All green. Merging it now.")
                    }
                    MessageFooter {
                        Icon(PhosphorIcons.Regular.Checks, contentDescription = null, tint = EsuissTheme.colors.accent)
                        Text("Read 10:02 AM")
                    }
                }
            }
        }
    }
}
