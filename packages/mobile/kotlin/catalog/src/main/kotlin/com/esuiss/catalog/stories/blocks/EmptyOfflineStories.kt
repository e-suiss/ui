package com.esuiss.catalog.stories.blocks

import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.blocks.EmptyOffline

val emptyOfflineStories = StoryGroup(
    section = Section.Blocks,
    title = "Empty Offline",
    stories = listOf(
        Story("Default", fullScreen = true) { EmptyOffline() },
    ),
)
