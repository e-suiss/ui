package com.esuiss.catalog.stories.interactions

import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.Archive
import com.adamglin.phosphoricons.regular.BellSlash
import com.adamglin.phosphoricons.regular.EnvelopeOpen
import com.adamglin.phosphoricons.regular.Trash
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Item
import com.esuiss.ui.components.ItemContent
import com.esuiss.ui.components.ItemDescription
import com.esuiss.ui.components.ItemGroup
import com.esuiss.ui.components.ItemGroupVariant
import com.esuiss.ui.components.ItemSeparator
import com.esuiss.ui.components.ItemTitle
import com.esuiss.ui.interactions.SwipeAction
import com.esuiss.ui.interactions.SwipeActionVariant
import com.esuiss.ui.interactions.SwipeActions
import com.esuiss.ui.theme.EsuissTheme

val swipeActionsStories = StoryGroup(
    section = Section.Interactions,
    title = "Swipe Actions",
    stories = listOf(
        Story("Default") { SwipeActionsInbox() },
    ),
)

private class SwipeActionsMessage(val id: String, val from: String, val subject: String)

private val swipeActionsMessages = listOf(
    SwipeActionsMessage("1", "Olivia Martin", "Quarterly report is ready"),
    SwipeActionsMessage("2", "Jackson Lee", "Lunch on Friday?"),
    SwipeActionsMessage("3", "Isabella Nguyen", "Design review notes"),
)

@Composable
private fun SwipeActionsInbox() {
    var messages by remember { mutableStateOf(swipeActionsMessages) }
    ItemGroup(variant = ItemGroupVariant.Inset) {
        messages.forEachIndexed { index, message ->
            key(message.id) {
                if (index > 0) ItemSeparator()
                SwipeActions(
                    leading = listOf(SwipeAction("Read", {}, icon = PhosphorIcons.Regular.EnvelopeOpen)),
                    trailing = listOf(
                        SwipeAction("Mute", {}, icon = PhosphorIcons.Regular.BellSlash, variant = SwipeActionVariant.Neutral),
                        SwipeAction("Archive", {}, icon = PhosphorIcons.Regular.Archive, variant = SwipeActionVariant.Archive),
                        SwipeAction(
                            "Delete",
                            { messages = messages.filterNot { it.id == message.id } },
                            icon = PhosphorIcons.Regular.Trash,
                            variant = SwipeActionVariant.Destructive,
                            fullSwipe = true,
                        ),
                    ),
                    background = EsuissTheme.colors.muted,
                ) {
                    Item(onClick = {}) {
                        ItemContent {
                            ItemTitle(message.from)
                            ItemDescription(message.subject)
                        }
                    }
                }
            }
        }
    }
}
