package com.esuiss.catalog.stories.blocks

import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.blocks.InboxMail

val inboxMailStories = StoryGroup(
    section = Section.Blocks,
    title = "Inbox Mail",
    stories = listOf(
        Story("Default", fullScreen = true) { InboxMail() },
    ),
)
