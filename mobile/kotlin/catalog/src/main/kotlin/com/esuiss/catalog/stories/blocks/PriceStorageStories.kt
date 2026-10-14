package com.esuiss.catalog.stories.blocks

import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.blocks.PriceStorage

val priceStorageStories = StoryGroup(
    section = Section.Blocks,
    title = "Price Storage",
    stories = listOf(
        Story("Default", fullScreen = true) { PriceStorage() },
    ),
)
