package com.esuiss.catalog.stories.blocks

import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.blocks.EmptySearch

val emptySearchStories = StoryGroup(
    section = Section.Blocks,
    title = "Empty Search",
    stories = listOf(
        Story("Default", fullScreen = true) { EmptySearch() },
    ),
)
