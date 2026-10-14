package com.esuiss.catalog.stories.blocks

import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.blocks.ChatThread

val chatThreadStories = StoryGroup(
    section = Section.Blocks,
    title = "Chat Thread",
    stories = listOf(
        Story("Default", fullScreen = true) { ChatThread() },
    ),
)
