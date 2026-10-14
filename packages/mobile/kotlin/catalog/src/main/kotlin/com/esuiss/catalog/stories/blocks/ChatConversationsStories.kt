package com.esuiss.catalog.stories.blocks

import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.blocks.ChatConversations

val chatConversationsStories = StoryGroup(
    section = Section.Blocks,
    title = "Chat Conversations",
    stories = listOf(
        Story("Default", fullScreen = true) { ChatConversations() },
    ),
)
