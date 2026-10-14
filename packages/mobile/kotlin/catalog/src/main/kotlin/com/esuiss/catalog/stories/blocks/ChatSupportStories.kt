package com.esuiss.catalog.stories.blocks

import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.blocks.ChatSupport

val chatSupportStories = StoryGroup(
    section = Section.Blocks,
    title = "Chat Support",
    stories = listOf(
        Story("Default", fullScreen = true) { ChatSupport() },
    ),
)
