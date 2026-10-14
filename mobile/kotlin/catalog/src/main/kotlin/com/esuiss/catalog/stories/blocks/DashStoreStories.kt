package com.esuiss.catalog.stories.blocks

import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.blocks.DashStore

val dashStoreStories = StoryGroup(
    section = Section.Blocks,
    title = "Dash Store",
    stories = listOf(
        Story("Default", fullScreen = true) { DashStore() },
    ),
)
