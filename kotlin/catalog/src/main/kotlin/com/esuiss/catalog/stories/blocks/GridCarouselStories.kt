package com.esuiss.catalog.stories.blocks

import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.blocks.GridCarousel

val gridCarouselStories = StoryGroup(
    section = Section.Blocks,
    title = "Grid Carousel",
    stories = listOf(
        Story("Default", fullScreen = true) { GridCarousel() },
    ),
)
