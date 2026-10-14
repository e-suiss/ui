package com.esuiss.catalog.stories.blocks

import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.blocks.EmptyBag

val emptyBagStories = StoryGroup(
    section = Section.Blocks,
    title = "Empty Bag",
    stories = listOf(
        Story("Default", fullScreen = true) { EmptyBag() },
    ),
)
