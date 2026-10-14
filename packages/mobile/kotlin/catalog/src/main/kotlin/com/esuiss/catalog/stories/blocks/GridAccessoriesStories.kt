package com.esuiss.catalog.stories.blocks

import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.blocks.GridAccessories

val gridAccessoriesStories = StoryGroup(
    section = Section.Blocks,
    title = "Grid Accessories",
    stories = listOf(
        Story("Default", fullScreen = true) { GridAccessories() },
    ),
)
