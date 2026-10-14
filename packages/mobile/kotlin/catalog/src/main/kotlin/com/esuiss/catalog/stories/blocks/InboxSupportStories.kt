package com.esuiss.catalog.stories.blocks

import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.blocks.InboxSupport

val inboxSupportStories = StoryGroup(
    section = Section.Blocks,
    title = "Inbox Support",
    stories = listOf(
        Story("Default", fullScreen = true) { InboxSupport() },
    ),
)
