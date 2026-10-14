package com.esuiss.catalog.stories.blocks

import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.blocks.PriceCare

val priceCareStories = StoryGroup(
    section = Section.Blocks,
    title = "Price Care",
    stories = listOf(
        Story("Default", fullScreen = true) { PriceCare() },
    ),
)
