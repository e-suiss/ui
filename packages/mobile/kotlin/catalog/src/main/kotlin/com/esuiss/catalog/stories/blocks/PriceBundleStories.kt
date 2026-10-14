package com.esuiss.catalog.stories.blocks

import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.blocks.PriceBundle

val priceBundleStories = StoryGroup(
    section = Section.Blocks,
    title = "Price Bundle",
    stories = listOf(
        Story("Default", fullScreen = true) { PriceBundle() },
    ),
)
