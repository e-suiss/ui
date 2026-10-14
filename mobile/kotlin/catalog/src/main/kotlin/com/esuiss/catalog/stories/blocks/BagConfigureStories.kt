package com.esuiss.catalog.stories.blocks

import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.blocks.BagConfigure

val bagConfigureStories = StoryGroup(
    section = Section.Blocks,
    title = "Bag Configure",
    stories = listOf(
        Story("Default", fullScreen = true) { BagConfigure() },
    ),
)
