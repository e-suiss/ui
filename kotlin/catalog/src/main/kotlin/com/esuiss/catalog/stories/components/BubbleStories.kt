package com.esuiss.catalog.stories.components

import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Bubble
import com.esuiss.ui.components.BubbleAlign
import com.esuiss.ui.components.BubbleContent
import com.esuiss.ui.components.BubbleGroup
import com.esuiss.ui.components.BubbleReactions
import com.esuiss.ui.components.BubbleReactionsSide
import com.esuiss.ui.components.BubbleVariant
import com.esuiss.ui.components.MenuItemVariant
import com.esuiss.ui.patterns.ContextActions
import com.esuiss.ui.patterns.ContextActionsContent
import com.esuiss.ui.patterns.ContextActionsItem
import com.esuiss.ui.patterns.ContextActionsTrigger

val bubbleStories = StoryGroup(
    section = Section.Components,
    title = "Bubble",
    stories = listOf(
        Story("Default") { BubbleDefault() },
        Story("Variants") { BubbleVariants() },
        Story("Conversation") { BubbleConversation() },
        Story("WithReactions") { BubbleWithReactions() },
        Story("Interactive") { BubbleInteractive() },
        Story("LongPressActions") { BubbleLongPressActions() },
    ),
)

@Composable
private fun BubbleDefault() {
    Bubble {
        BubbleContent("Are we still on for lunch tomorrow?")
    }
}

@Composable
private fun BubbleVariants() {
    BubbleGroup {
        BubbleVariant.entries.forEach { variant ->
            Bubble(variant = variant) {
                BubbleContent("This is a ${variant.name.lowercase()} bubble.")
            }
        }
    }
}

@Composable
private fun BubbleConversation() {
    BubbleGroup {
        Bubble(variant = BubbleVariant.Muted) {
            BubbleContent("Hey, did you get a chance to review the draft?")
        }
        Bubble(align = BubbleAlign.End) {
            BubbleContent("Yes, I left a few comments on the intro.")
        }
        Bubble(align = BubbleAlign.End) {
            BubbleContent("Everything else looks great.")
        }
        Bubble(variant = BubbleVariant.Muted) {
            BubbleContent("Thanks! I will update it this afternoon.")
        }
    }
}

@Composable
private fun BubbleWithReactions() {
    BubbleGroup {
        Bubble(variant = BubbleVariant.Muted) {
            BubbleContent("We just hit 10,000 users!")
            BubbleReactions("🎉 3")
        }
        Bubble(align = BubbleAlign.End) {
            BubbleContent("That is amazing news.")
            BubbleReactions("❤️", align = BubbleAlign.Start)
        }
        Bubble(variant = BubbleVariant.Secondary) {
            BubbleContent("Reactions can sit on top as well.")
            BubbleReactions("👍 2", side = BubbleReactionsSide.Top)
        }
    }
}

@Composable
private fun BubbleInteractive() {
    Bubble(variant = BubbleVariant.Outline) {
        BubbleContent("Show me the latest release notes", onClick = {})
    }
}

@Composable
private fun BubbleLongPressActions() {
    Column {
        ContextActions {
            ContextActionsTrigger(Modifier.semantics { contentDescription = "Message from Maya" }) {
                Bubble(variant = BubbleVariant.Muted) {
                    BubbleContent("Hold this message to see its actions.")
                }
            }
            ContextActionsContent {
                ContextActionsItem("Reply", onClick = {})
                ContextActionsItem("Copy", onClick = {})
                ContextActionsItem("Delete", onClick = {}, variant = MenuItemVariant.Destructive)
            }
        }
    }
}
