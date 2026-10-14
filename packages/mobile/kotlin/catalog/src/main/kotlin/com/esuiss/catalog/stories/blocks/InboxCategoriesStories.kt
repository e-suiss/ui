package com.esuiss.catalog.stories.blocks

import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.blocks.InboxCategories

val inboxCategoriesStories = StoryGroup(
    section = Section.Blocks,
    title = "Inbox Categories",
    stories = listOf(
        Story("Default", fullScreen = true) { InboxCategories() },
    ),
)
